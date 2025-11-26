import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Negociacao } from '../entities/Negociacao';
import { HistoricoNegociacao } from '../entities/HistoricoNegociacao';
import { authenticateToken, AuthRequest } from '../middleware/auth';

export class NegociacaoController {
  async getAll(req: Request, res: Response) {
    try {
      const negociacaoRepository = AppDataSource.getRepository(Negociacao);
      const negociacoes = await negociacaoRepository.find({ relations: ['historico'] });
      res.json(negociacoes);
    } catch (error) {
      console.error('Error getting negociacoes:', error);
      res.status(500).json({ message: 'Erro ao buscar negociações' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const negociacaoRepository = AppDataSource.getRepository(Negociacao);
      const negociacao = await negociacaoRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['historico'],
      });

      if (!negociacao) {
        return res.status(404).json({ message: 'Negociação não encontrada' });
      }

      res.json(negociacao);
    } catch (error) {
      console.error('Error getting negociacao:', error);
      res.status(500).json({ message: 'Erro ao buscar negociação' });
    }
  }

  async getByCodigo(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const negociacaoRepository = AppDataSource.getRepository(Negociacao);
      const negociacao = await negociacaoRepository.findOne({
        where: { codigo },
        relations: ['historico'],
      });

      if (!negociacao) {
        return res.status(404).json({ message: 'Negociação não encontrada' });
      }

      res.json(negociacao);
    } catch (error) {
      console.error('Error getting negociacao:', error);
      res.status(500).json({ message: 'Erro ao buscar negociação' });
    }
  }

  async getByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const negociacaoRepository = AppDataSource.getRepository(Negociacao);
      const negociacoes = await negociacaoRepository.find({
        where: { status },
        relations: ['historico'],
      });
      res.json(negociacoes);
    } catch (error) {
      console.error('Error getting negociacoes by status:', error);
      res.status(500).json({ message: 'Erro ao buscar negociações' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { codigo, item, fornecedor, valorInicial, valorNegociado, responsavel, dataInicio, status } = req.body;
      
      if (!codigo || !item || !fornecedor || !valorInicial || !valorNegociado) {
        return res.status(400).json({ message: 'Campos obrigatórios: codigo, item, fornecedor, valorInicial, valorNegociado' });
      }

      const negociacaoRepository = AppDataSource.getRepository(Negociacao);
      
      // Verificar se já existe negociação com mesmo código
      const existing = await negociacaoRepository.findOne({ where: { codigo } });
      if (existing) {
        return res.status(400).json({ message: 'Já existe uma negociação com este código' });
      }

      const economia = parseFloat(valorInicial) - parseFloat(valorNegociado);
      const percentualDesconto = parseFloat(valorInicial) > 0 
        ? ((economia / parseFloat(valorInicial)) * 100).toFixed(0) 
        : '0';

      const negociacao = negociacaoRepository.create({
        codigo,
        item,
        fornecedor,
        valorInicial: parseFloat(valorInicial),
        valorNegociado: parseFloat(valorNegociado),
        desconto: `${percentualDesconto}%`,
        responsavel: responsavel || req.user?.username || 'Usuário',
        dataInicio: dataInicio || new Date().toISOString().split('T')[0],
        status: status || 'em_andamento',
      });
      
      await negociacaoRepository.save(negociacao);
      res.status(201).json(negociacao);
    } catch (error: any) {
      console.error('Error creating negociacao:', error);
      if (error.code === 'SQLITE_CONSTRAINT' || error.code === '23505') {
        return res.status(400).json({ message: 'Erro de validação: código já existe' });
      }
      res.status(500).json({ message: 'Erro ao criar negociação' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const negociacaoRepository = AppDataSource.getRepository(Negociacao);
      const negociacao = await negociacaoRepository.findOne({ where: { id: parseInt(id) } });

      if (!negociacao) {
        return res.status(404).json({ message: 'Negociação não encontrada' });
      }

      negociacaoRepository.merge(negociacao, req.body);
      await negociacaoRepository.save(negociacao);
      res.json(negociacao);
    } catch (error) {
      console.error('Error updating negociacao:', error);
      res.status(500).json({ message: 'Erro ao atualizar negociação' });
    }
  }

  async addHistorico(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const negociacaoRepository = AppDataSource.getRepository(Negociacao);
      const historicoRepository = AppDataSource.getRepository(HistoricoNegociacao);

      const negociacao = await negociacaoRepository.findOne({ where: { id: parseInt(id) } });
      if (!negociacao) {
        return res.status(404).json({ message: 'Negociação não encontrada' });
      }

      const historico = historicoRepository.create({
        ...req.body,
        negociacao,
      });
      await historicoRepository.save(historico);

      const updatedNegociacao = await negociacaoRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['historico'],
      });

      res.json(updatedNegociacao);
    } catch (error) {
      console.error('Error adding historico:', error);
      res.status(500).json({ message: 'Erro ao adicionar histórico' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const negociacaoRepository = AppDataSource.getRepository(Negociacao);
      const result = await negociacaoRepository.delete(parseInt(id));

      if (result.affected === 0) {
        return res.status(404).json({ message: 'Negociação não encontrada' });
      }

      res.json({ message: 'Negociação excluída com sucesso' });
    } catch (error) {
      console.error('Error deleting negociacao:', error);
      res.status(500).json({ message: 'Erro ao excluir negociação' });
    }
  }
}

