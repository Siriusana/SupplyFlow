import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Requisicao } from '../entities/Requisicao';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

export class RequisicaoController {
  async getAll(req: Request, res: Response) {
    try {
      const requisicaoRepository = AppDataSource.getRepository(Requisicao);
      const requisicoes = await requisicaoRepository.find();
      res.json(requisicoes);
    } catch (error) {
      console.error('Error getting requisicoes:', error);
      res.status(500).json({ message: 'Erro ao buscar requisições' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const requisicaoRepository = AppDataSource.getRepository(Requisicao);
      const requisicao = await requisicaoRepository.findOne({ where: { id: parseInt(id) } });

      if (!requisicao) {
        return res.status(404).json({ message: 'Requisição não encontrada' });
      }

      res.json(requisicao);
    } catch (error) {
      console.error('Error getting requisicao:', error);
      res.status(500).json({ message: 'Erro ao buscar requisição' });
    }
  }

  async getByCodigo(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const requisicaoRepository = AppDataSource.getRepository(Requisicao);
      const requisicao = await requisicaoRepository.findOne({ where: { codigo } });

      if (!requisicao) {
        return res.status(404).json({ message: 'Requisição não encontrada' });
      }

      res.json(requisicao);
    } catch (error) {
      console.error('Error getting requisicao:', error);
      res.status(500).json({ message: 'Erro ao buscar requisição' });
    }
  }

  async getByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const requisicaoRepository = AppDataSource.getRepository(Requisicao);
      const requisicoes = await requisicaoRepository.find({ where: { status } });
      res.json(requisicoes);
    } catch (error) {
      console.error('Error getting requisicoes by status:', error);
      res.status(500).json({ message: 'Erro ao buscar requisições' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const requisicaoRepository = AppDataSource.getRepository(Requisicao);
      const requisicao = requisicaoRepository.create(req.body);
      await requisicaoRepository.save(requisicao);
      res.status(201).json(requisicao);
    } catch (error) {
      console.error('Error creating requisicao:', error);
      res.status(500).json({ message: 'Erro ao criar requisição' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const requisicaoRepository = AppDataSource.getRepository(Requisicao);
      const requisicao = await requisicaoRepository.findOne({ where: { id: parseInt(id) } });

      if (!requisicao) {
        return res.status(404).json({ message: 'Requisição não encontrada' });
      }

      requisicaoRepository.merge(requisicao, req.body);
      await requisicaoRepository.save(requisicao);
      res.json(requisicao);
    } catch (error) {
      console.error('Error updating requisicao:', error);
      res.status(500).json({ message: 'Erro ao atualizar requisição' });
    }
  }

  async aprovar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const requisicaoRepository = AppDataSource.getRepository(Requisicao);
      const requisicao = await requisicaoRepository.findOne({ where: { id: parseInt(id) } });

      if (!requisicao) {
        return res.status(404).json({ message: 'Requisição não encontrada' });
      }

      requisicao.status = 'aprovada';
      await requisicaoRepository.save(requisicao);
      res.json(requisicao);
    } catch (error) {
      console.error('Error approving requisicao:', error);
      res.status(500).json({ message: 'Erro ao aprovar requisição' });
    }
  }

  async rejeitar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const requisicaoRepository = AppDataSource.getRepository(Requisicao);
      const requisicao = await requisicaoRepository.findOne({ where: { id: parseInt(id) } });

      if (!requisicao) {
        return res.status(404).json({ message: 'Requisição não encontrada' });
      }

      requisicao.status = 'rejeitada';
      await requisicaoRepository.save(requisicao);
      res.json(requisicao);
    } catch (error) {
      console.error('Error rejecting requisicao:', error);
      res.status(500).json({ message: 'Erro ao rejeitar requisição' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const requisicaoRepository = AppDataSource.getRepository(Requisicao);
      const result = await requisicaoRepository.delete(parseInt(id));

      if (result.affected === 0) {
        return res.status(404).json({ message: 'Requisição não encontrada' });
      }

      res.json({ message: 'Requisição excluída com sucesso' });
    } catch (error) {
      console.error('Error deleting requisicao:', error);
      res.status(500).json({ message: 'Erro ao excluir requisição' });
    }
  }
}

