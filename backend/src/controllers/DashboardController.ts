import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { DashboardStats } from '../entities/DashboardStats';
import { MonthlyExpense } from '../entities/MonthlyExpense';
import { CategoryExpense } from '../entities/CategoryExpense';
import { RequisitionStatus } from '../entities/RequisitionStatus';
import { RecentActivity } from '../entities/RecentActivity';

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      const statsRepository = AppDataSource.getRepository(DashboardStats);
      const stats = await statsRepository.find();
      res.json(stats);
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({ message: 'Erro ao buscar estatísticas' });
    }
  }

  async getMonthlyExpenses(req: Request, res: Response) {
    try {
      const expensesRepository = AppDataSource.getRepository(MonthlyExpense);
      const expenses = await expensesRepository.find();
      res.json(expenses);
    } catch (error) {
      console.error('Error getting monthly expenses:', error);
      res.status(500).json({ message: 'Erro ao buscar despesas mensais' });
    }
  }

  async getCategoryExpenses(req: Request, res: Response) {
    try {
      const expensesRepository = AppDataSource.getRepository(CategoryExpense);
      const expenses = await expensesRepository.find();
      res.json(expenses);
    } catch (error) {
      console.error('Error getting category expenses:', error);
      res.status(500).json({ message: 'Erro ao buscar despesas por categoria' });
    }
  }

  async getRequisitionStatus(req: Request, res: Response) {
    try {
      const statusRepository = AppDataSource.getRepository(RequisitionStatus);
      const status = await statusRepository.find();
      res.json(status);
    } catch (error) {
      console.error('Error getting requisition status:', error);
      res.status(500).json({ message: 'Erro ao buscar status de requisições' });
    }
  }

  async getRecentActivities(req: Request, res: Response) {
    try {
      const activitiesRepository = AppDataSource.getRepository(RecentActivity);
      const activities = await activitiesRepository.find({
        order: { id: 'DESC' },
        take: 10,
      });
      res.json(activities);
    } catch (error) {
      console.error('Error getting recent activities:', error);
      res.status(500).json({ message: 'Erro ao buscar atividades recentes' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const statsRepository = AppDataSource.getRepository(DashboardStats);
      const expensesRepository = AppDataSource.getRepository(MonthlyExpense);
      const categoryExpensesRepository = AppDataSource.getRepository(CategoryExpense);
      const statusRepository = AppDataSource.getRepository(RequisitionStatus);
      const activitiesRepository = AppDataSource.getRepository(RecentActivity);

      const [stats, monthlyExpenses, categoryExpenses, requisitionStatus, recentActivities] = await Promise.all([
        statsRepository.find(),
        expensesRepository.find(),
        categoryExpensesRepository.find(),
        statusRepository.find(),
        activitiesRepository.find({ order: { id: 'DESC' }, take: 10 }),
      ]);

      res.json({
        stats,
        monthlyExpenses,
        categoryExpenses,
        requisitionStatus,
        recentActivities,
      });
    } catch (error) {
      console.error('Error getting all dashboard data:', error);
      res.status(500).json({ message: 'Erro ao buscar dados do dashboard' });
    }
  }
}

