import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { MonthlyExpense } from '../entities/MonthlyExpense';
import { CategoryExpense } from '../entities/CategoryExpense';
import { Fornecedor } from '../entities/Fornecedor';

export class RelatorioController {
  async getGastosMensais(req: Request, res: Response) {
    try {
      const expensesRepository = AppDataSource.getRepository(MonthlyExpense);
      const expenses = await expensesRepository.find();
      res.json(expenses);
    } catch (error) {
      console.error('Error getting gastos mensais:', error);
      res.status(500).json({ message: 'Erro ao buscar gastos mensais' });
    }
  }

  async getGastosPorCategoria(req: Request, res: Response) {
    try {
      const expensesRepository = AppDataSource.getRepository(CategoryExpense);
      const expenses = await expensesRepository.find();
      res.json(expenses);
    } catch (error) {
      console.error('Error getting gastos por categoria:', error);
      res.status(500).json({ message: 'Erro ao buscar gastos por categoria' });
    }
  }

  async getIndicadores(req: Request, res: Response) {
    try {
      const fornecedorRepository = AppDataSource.getRepository(Fornecedor);
      const fornecedores = await fornecedorRepository.find();

      const totalFornecedores = fornecedores.length;
      const fornecedoresAtivos = fornecedores.filter((f) => f.status === 'Ativo').length;
      const mediaAvaliacao =
        fornecedores.length > 0
          ? fornecedores.reduce((sum, f) => sum + f.avaliacao, 0) / fornecedores.length
          : 0;

      res.json({
        totalFornecedores,
        fornecedoresAtivos,
        mediaAvaliacao: parseFloat(mediaAvaliacao.toFixed(2)),
      });
    } catch (error) {
      console.error('Error getting indicadores:', error);
      res.status(500).json({ message: 'Erro ao buscar indicadores' });
    }
  }

  async getTopFornecedores(req: Request, res: Response) {
    try {
      const fornecedorRepository = AppDataSource.getRepository(Fornecedor);
      const fornecedores = await fornecedorRepository.find({
        order: { avaliacao: 'DESC' },
        take: 5,
      });

      const topFornecedores = fornecedores.map((f) => ({
        nome: f.nome,
        avaliacao: f.avaliacao,
        totalPedidos: f.totalPedidos,
        status: f.status,
      }));

      res.json(topFornecedores);
    } catch (error) {
      console.error('Error getting top fornecedores:', error);
      res.status(500).json({ message: 'Erro ao buscar top fornecedores' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const expensesRepository = AppDataSource.getRepository(MonthlyExpense);
      const categoryExpensesRepository = AppDataSource.getRepository(CategoryExpense);
      const fornecedorRepository = AppDataSource.getRepository(Fornecedor);

      const [gastosMensais, gastosPorCategoria, fornecedores] = await Promise.all([
        expensesRepository.find(),
        categoryExpensesRepository.find(),
        fornecedorRepository.find(),
      ]);

      const totalFornecedores = fornecedores.length;
      const fornecedoresAtivos = fornecedores.filter((f) => f.status === 'Ativo').length;
      const mediaAvaliacao =
        fornecedores.length > 0
          ? fornecedores.reduce((sum, f) => sum + f.avaliacao, 0) / fornecedores.length
          : 0;

      const topFornecedores = fornecedores
        .sort((a, b) => b.avaliacao - a.avaliacao)
        .slice(0, 5)
        .map((f) => ({
          nome: f.nome,
          avaliacao: f.avaliacao,
          totalPedidos: f.totalPedidos,
          status: f.status,
        }));

      res.json({
        gastosMensais,
        gastosPorCategoria,
        indicadores: {
          totalFornecedores,
          fornecedoresAtivos,
          mediaAvaliacao: parseFloat(mediaAvaliacao.toFixed(2)),
        },
        topFornecedores,
      });
    } catch (error) {
      console.error('Error getting all relatorios:', error);
      res.status(500).json({ message: 'Erro ao buscar relatórios' });
    }
  }
}

