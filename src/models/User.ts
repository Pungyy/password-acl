
import { z } from 'zod';
import { users } from '../fake/data.js';

export const UserSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
  role: z.enum(['admin', 'user', 'guest']),
  email: z.string().email()
});

// Type interne complet avec id
export type User = z.infer<typeof UserSchema> & { id: string };

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string()
});

export function getUser(username: string) {
  return users.get(username);
}

export function userExist(username: string) {
  return users.has(username);
}

export function setUser(user: User) {
  users.set(user.username, user);
}
