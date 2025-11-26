dotenv.config();
// Rota raiz amigável
app.get('/', (req, res) => {
  res.send('SupplyFlow API está rodando!');
});
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { loadInitialData } from './config/DataLoader';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 8080;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://localhost:8081',
    'exp://192.168.15.115:8081',
    'http://192.168.15.115:8081'
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SupplyFlow Backend is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    await loadInitialData();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 SupplyFlow Backend running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`📱 Acessível na rede local: http://192.168.15.115:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

