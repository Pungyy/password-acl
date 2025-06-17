import * as argon2 from 'argon2';
import crypto from 'crypto';

// Fonction pour hacher le mot de passe avec un salt unique
export const hashPassword = async (password: string): Promise<{ password: string; salt: string }> => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = await argon2.hash(password + salt);
  return { password: hashedPassword, salt };
};

// Fonction pour vérifier un mot de passe fourni avec le hash et le salt en base
export const verifyPassword = async (
  password: string,
  salt: string,
  hashedPassword: string
): Promise<boolean> => {
  return await argon2.verify(hashedPassword, password + salt);
};
