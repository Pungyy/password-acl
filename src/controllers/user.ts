import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { User } from "../models/User.js";
import { UserSchema, LoginSchema } from "../models/User.js";
import { getUser, setUser, userExist } from "../models/User.js";
import { hashPassword, verifyPassword } from "../services/hashing.js";
import { generateTokens, verifyRefreshToken } from "../services/JWT.js";
import { z } from "zod";
import {
  createRefreshToken,
  deleteRefreshToken,
  existsRefreshToken,
  TokenSchema,
  updateRefreshToken,
} from "../models/Token.js";
import { authMiddleware } from "../middleware/auth.js";

const route = new Hono();

route.post(
  "/register",
  zValidator("json", UserSchema.omit({ salt: true })),
  async (c) => {
    try {
      const validatedUser = c.req.valid("json") as z.infer<typeof UserSchema>;

      if (userExist(validatedUser.username)) {
        return c.json({ error: "Nom d'utilisateur déjà pris" }, 400);
      }

      const { password: hashedPassword, salt } = await hashPassword(
        validatedUser.password
      );

      const user: User = {
        id: crypto.randomUUID(),
        username: validatedUser.username,
        role: validatedUser.role,
        email: validatedUser.email,
        password: hashedPassword,
        salt,
      };

      setUser(user);

      const tokens = generateTokens({
        userId: user.id,
        username: user.username,
        role: user.role,
      });

      createRefreshToken(tokens.refreshToken);

      return c.json(
        {
          message: "Utilisateur créé avec succès",
          ...tokens,
        },
        201
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ error: error.errors }, 400);
      }
      return c.json({ error: "Erreur serveur" }, 500);
    }
  }
);

route.post("/login", zValidator("json", LoginSchema), async (c) => {
  try {
    const validatedCredentials = c.req.valid("json");

    const user = getUser(validatedCredentials.username);
    if (!user) {
      return c.json({ error: "Utilisateur non trouvé" }, 404);
    }

    const isValid = await verifyPassword(
      validatedCredentials.password,
      user.salt,
      user.password
    );

    if (!isValid) {
      return c.json({ error: "Mot de passe incorrect" }, 401);
    }

    const tokens = generateTokens({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    createRefreshToken(tokens.refreshToken);

    return c.json(tokens);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: "Erreur serveur" }, 500);
  }
});

route.post("/refresh-token", zValidator("json", TokenSchema), async (c) => {
  try {
    const { refreshToken } = c.req.valid("json");

    if (!existsRefreshToken(refreshToken)) {
      return c.json({ error: "Refresh token invalide" }, 401);
    }

    const decoded = verifyRefreshToken(refreshToken);

    const tokens = generateTokens({
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    });

    updateRefreshToken(refreshToken, tokens.refreshToken);

    return c.json(tokens);
  } catch {
    return c.json({ error: "Refresh token invalide ou expiré" }, 401);
  }
});

route.post("/logout", authMiddleware, async (c) => {
  try {
    const refreshToken = c.req.header("X-Refresh-Token");

    if (refreshToken) {
      deleteRefreshToken(refreshToken);
    }

    return c.json({ message: "Déconnexion réussie" });
  } catch {
    return c.json({ error: "Erreur lors de la déconnexion" }, 500);
  }
});

export default route;
