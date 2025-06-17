// controllers/api.ts
import { Hono } from 'hono';
import userRoutes from './user.js';
import protectedRoutes from './protected.js'; // <-- on importe les routes protégées

const route = new Hono();

route.route('/auth', userRoutes);       // /auth/*
route.route('/api', protectedRoutes);   // /api/* (protégées par JWT + rôles)

export default route;
