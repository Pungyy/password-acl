import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { authMiddleware } from './middleware/auth.js';
import userRoutes from './controllers/user.js'
import apiRoutes from './controllers/api.js'
import protectedRoute from './controllers/protected.js'

const app = new Hono()

app.use('/api/*', authMiddleware);

app.route('/', userRoutes)
app.route('/api/', apiRoutes)
app.route('/api/', protectedRoute)


export default app;
