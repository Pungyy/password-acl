import { verifyAccessToken } from '../services/JWT.js';
import { createMiddleware } from 'hono/factory';
import { ac } from '../services/accessControl.js';

import { users } from '../fake/data.js';

export const authMiddleware = createMiddleware(async (c, next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Token manquant' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Récupérer l'utilisateur depuis la "base de données"
    const user = users.get(decoded.username);

    if (!user) {
      return c.json({ error: 'Utilisateur non trouvé' }, 404);
    }

    // Stocker les informations de l'utilisateur dans le contexte
    c.set('user', {
      ...user,
      id: decoded.userId
    });

    await next();
  } catch (error) {
    return c.json({ error: 'Token invalide ou expiré' }, 401);
  }
});  

export const checkPermission = (action: 'read' | 'create' | 'update' | 'delete', resource: string) =>
  createMiddleware(async (c, next) => {
    const user = c.get('user');

    // Si aucune ressource ID dans l'URL, on suppose une action "Any"
    const targetId = c.req.param('id');
    const possession = targetId && targetId === user.id ? 'Own' : 'Any';

    const permission = ac.can(user.role)[`${action}${possession}`](resource);

    if (!permission.granted) {
      return c.json({ error: 'Accès refusé : permission manquante' }, 403);
    }

    await next();
  });