import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Fornecedor } from '../entities/Fornecedor';
import { Requisicao } from '../entities/Requisicao';
import { Negociacao } from '../entities/Negociacao';
import { Orcamento } from '../entities/Orcamento';
import { Pedido } from '../entities/Pedido';
import { Cotacao } from '../entities/Cotacao';
import { HistoricoNegociacao } from '../entities/HistoricoNegociacao';
import { HistoricoPedido } from '../entities/HistoricoPedido';
import { DashboardStats } from '../entities/DashboardStats';
import { MonthlyExpense } from '../entities/MonthlyExpense';
import { CategoryExpense } from '../entities/CategoryExpense';
import { RequisitionStatus } from '../entities/RequisitionStatus';
import { RecentActivity } from '../entities/RecentActivity';
import path from 'path';

const dbPath = process.env.DB_PATH || './supplyflow.db';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: dbPath,
  synchronize: true, // Auto-create tables
  logging: false,
  entities: [
    User,
    Fornecedor,
    Requisicao,
    Negociacao,
    Orcamento,
    Pedido,
    Cotacao,
    HistoricoNegociacao,
    HistoricoPedido,
    DashboardStats,
    MonthlyExpense,
    CategoryExpense,
    RequisitionStatus,
    RecentActivity,
  ],
  migrations: [],
  subscribers: [],
});

// Initialize database with WAL mode for multithread support
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized successfully');
    
    // Enable WAL mode for multithread support
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.query('PRAGMA journal_mode = WAL');
    await queryRunner.query('PRAGMA busy_timeout = 30000');
    await queryRunner.query('PRAGMA synchronous = NORMAL');
    await queryRunner.query('PRAGMA foreign_keys = ON');
    await queryRunner.release();
    
    return AppDataSource;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

