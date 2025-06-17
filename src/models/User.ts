import { z } from "zod";
import { users } from "../fake/data.js";

export const UserSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
  role: z.enum(["admin", "user", "guest"]),
  email: z.string().email(),
});

// Le type complet User stocké en interne, avec mot de passe haché + salt
export type User = {
  id: string;
  username: string;
  password: string; // hash
  salt: string;
  role: "admin" | "user" | "guest";
  email: string;
};

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function getUser(username: string): User | undefined {
  return users.get(username);
}

export function userExist(username: string): boolean {
  return users.has(username);
}

export function setUser(user: User): void {
  users.set(user.username, user);
}
