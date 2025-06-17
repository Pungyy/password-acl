import { Hono } from 'hono';
import { authMiddleware, checkPermission } from '../middleware/auth.js';

const protectedRoute = new Hono();

// Toutes les routes nécessitent une authentification
protectedRoute.use('*', authMiddleware);

// GET /api/profile/:id - Consultation d'un profil
protectedRoute.get('/profile/:id', checkPermission('read', 'profile'), (c) => {
  return c.json({ message: `Profil consulté : ${c.req.param('id')}` });
});

// POST /api/data - Création de données
protectedRoute.post('/data', checkPermission('create', 'data'), (c) => {
  return c.json({ message: 'Donnée créée avec succès' });
});

// PUT /api/data/:id - Modification de données
protectedRoute.put('/data/:id', checkPermission('update', 'data'), (c) => {
  return c.json({ message: `Donnée ${c.req.param('id')} modifiée avec succès` });
});

// DELETE /api/data/:id - Suppression de données
protectedRoute.delete('/data/:id', checkPermission('delete', 'data'), (c) => {
  return c.json({ message: `Donnée ${c.req.param('id')} supprimée avec succès` });
});

export default protectedRoute;
