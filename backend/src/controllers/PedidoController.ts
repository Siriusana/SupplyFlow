import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Pedido } from '../entities/Pedido';
import { HistoricoPedido } from '../entities/HistoricoPedido';
import { authenticateToken, AuthRequest } from '../middleware/auth';

export class PedidoController {
  async getAll(req: Request, res: Response) {
    try {
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const pedidos = await pedidoRepository.find({ relations: ['historico'] });
      res.json(pedidos);
    } catch (error) {
      console.error('Error getting pedidos:', error);
      res.status(500).json({ message: 'Erro ao buscar pedidos' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const pedido = await pedidoRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['historico'],
      });

      if (!pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      res.json(pedido);
    } catch (error) {
      console.error('Error getting pedido:', error);
      res.status(500).json({ message: 'Erro ao buscar pedido' });
    }
  }

  async getByCodigo(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const pedido = await pedidoRepository.findOne({
        where: { codigo },
        relations: ['historico'],
      });

      if (!pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      res.json(pedido);
    } catch (error) {
      console.error('Error getting pedido:', error);
      res.status(500).json({ message: 'Erro ao buscar pedido' });
    }
  }

  async getByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const pedidos = await pedidoRepository.find({
        where: { status },
        relations: ['historico'],
      });
      res.json(pedidos);
    } catch (error) {
      console.error('Error getting pedidos by status:', error);
      res.status(500).json({ message: 'Erro ao buscar pedidos' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const pedido = pedidoRepository.create(req.body);
      await pedidoRepository.save(pedido);
      res.status(201).json(pedido);
    } catch (error) {
      console.error('Error creating pedido:', error);
      res.status(500).json({ message: 'Erro ao criar pedido' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const pedido = await pedidoRepository.findOne({ where: { id: parseInt(id) } });

      if (!pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      pedidoRepository.merge(pedido, req.body);
      await pedidoRepository.save(pedido);
      res.json(pedido);
    } catch (error) {
      console.error('Error updating pedido:', error);
      res.status(500).json({ message: 'Erro ao atualizar pedido' });
    }
  }

  async addHistorico(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const historicoRepository = AppDataSource.getRepository(HistoricoPedido);

      const pedido = await pedidoRepository.findOne({ where: { id: parseInt(id) } });
      if (!pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      const historico = historicoRepository.create({
        ...req.body,
        pedido,
      });
      await historicoRepository.save(historico);

      const updatedPedido = await pedidoRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['historico'],
      });

      res.json(updatedPedido);
    } catch (error) {
      console.error('Error adding historico:', error);
      res.status(500).json({ message: 'Erro ao adicionar histórico' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const result = await pedidoRepository.delete(parseInt(id));

      if (result.affected === 0) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      res.json({ message: 'Pedido excluído com sucesso' });
    } catch (error) {
      console.error('Error deleting pedido:', error);
      res.status(500).json({ message: 'Erro ao excluir pedido' });
    }
  }
}

