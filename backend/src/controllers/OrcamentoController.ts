import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Orcamento } from '../entities/Orcamento';
import { Cotacao } from '../entities/Cotacao';
import { authenticateToken, AuthRequest } from '../middleware/auth';

export class OrcamentoController {
  async getAll(req: Request, res: Response) {
    try {
      const orcamentoRepository = AppDataSource.getRepository(Orcamento);
      const orcamentos = await orcamentoRepository.find({ relations: ['cotacoes'] });
      res.json(orcamentos);
    } catch (error) {
      console.error('Error getting orcamentos:', error);
      res.status(500).json({ message: 'Erro ao buscar orçamentos' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orcamentoRepository = AppDataSource.getRepository(Orcamento);
      const orcamento = await orcamentoRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['cotacoes'],
      });

      if (!orcamento) {
        return res.status(404).json({ message: 'Orçamento não encontrado' });
      }

      res.json(orcamento);
    } catch (error) {
      console.error('Error getting orcamento:', error);
      res.status(500).json({ message: 'Erro ao buscar orçamento' });
    }
  }

  async getByCodigo(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const orcamentoRepository = AppDataSource.getRepository(Orcamento);
      const orcamento = await orcamentoRepository.findOne({
        where: { codigo },
        relations: ['cotacoes'],
      });

      if (!orcamento) {
        return res.status(404).json({ message: 'Orçamento não encontrado' });
      }

      res.json(orcamento);
    } catch (error) {
      console.error('Error getting orcamento:', error);
      res.status(500).json({ message: 'Erro ao buscar orçamento' });
    }
  }

  async getByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const orcamentoRepository = AppDataSource.getRepository(Orcamento);
      const orcamentos = await orcamentoRepository.find({
        where: { status },
        relations: ['cotacoes'],
      });
      res.json(orcamentos);
    } catch (error) {
      console.error('Error getting orcamentos by status:', error);
      res.status(500).json({ message: 'Erro ao buscar orçamentos' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { codigo, item, requisicaoCodigo, quantidade, dataLimite, status } = req.body;
      
      if (!codigo || !item) {
        return res.status(400).json({ message: 'Campos obrigatórios: codigo, item' });
      }

      const orcamentoRepository = AppDataSource.getRepository(Orcamento);
      
      // Verificar se já existe orçamento com mesmo código
      const existing = await orcamentoRepository.findOne({ where: { codigo } });
      if (existing) {
        return res.status(400).json({ message: 'Já existe um orçamento com este código' });
      }

      const orcamento = orcamentoRepository.create({
        codigo,
        item,
        requisicaoCodigo: requisicaoCodigo || '',
        quantidade: quantidade || 1,
        dataLimite: dataLimite || new Date().toISOString().split('T')[0],
        status: status || 'pendente',
      });
      
      await orcamentoRepository.save(orcamento);
      res.status(201).json(orcamento);
    } catch (error: any) {
      console.error('Error creating orcamento:', error);
      if (error.code === 'SQLITE_CONSTRAINT' || error.code === '23505') {
        return res.status(400).json({ message: 'Erro de validação: código já existe' });
      }
      res.status(500).json({ message: 'Erro ao criar orçamento' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const orcamentoRepository = AppDataSource.getRepository(Orcamento);
      const orcamento = await orcamentoRepository.findOne({ where: { id: parseInt(id) } });

      if (!orcamento) {
        return res.status(404).json({ message: 'Orçamento não encontrado' });
      }

      orcamentoRepository.merge(orcamento, req.body);
      await orcamentoRepository.save(orcamento);
      res.json(orcamento);
    } catch (error) {
      console.error('Error updating orcamento:', error);
      res.status(500).json({ message: 'Erro ao atualizar orçamento' });
    }
  }

  async addCotacao(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const orcamentoRepository = AppDataSource.getRepository(Orcamento);
      const cotacaoRepository = AppDataSource.getRepository(Cotacao);

      const orcamento = await orcamentoRepository.findOne({ where: { id: parseInt(id) } });
      if (!orcamento) {
        return res.status(404).json({ message: 'Orçamento não encontrado' });
      }

      const cotacao = cotacaoRepository.create({
        ...req.body,
        orcamento,
      });
      await cotacaoRepository.save(cotacao);

      const updatedOrcamento = await orcamentoRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['cotacoes'],
      });

      res.json(updatedOrcamento);
    } catch (error) {
      console.error('Error adding cotacao:', error);
      res.status(500).json({ message: 'Erro ao adicionar cotação' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const orcamentoRepository = AppDataSource.getRepository(Orcamento);
      const result = await orcamentoRepository.delete(parseInt(id));

      if (result.affected === 0) {
        return res.status(404).json({ message: 'Orçamento não encontrado' });
      }

      res.json({ message: 'Orçamento excluído com sucesso' });
    } catch (error) {
      console.error('Error deleting orcamento:', error);
      res.status(500).json({ message: 'Erro ao excluir orçamento' });
    }
  }
}

