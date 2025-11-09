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
      const { codigo, item, fornecedor, quantidade, valor, dataPedido, dataEntrega, endereco, rastreio, requisicaoCodigo, status } = req.body;
      
      if (!codigo || !item || !fornecedor || !valor) {
        return res.status(400).json({ message: 'Campos obrigatórios: codigo, item, fornecedor, valor' });
      }

      const pedidoRepository = AppDataSource.getRepository(Pedido);
      
      // Verificar se já existe pedido com mesmo código
      const existing = await pedidoRepository.findOne({ where: { codigo } });
      if (existing) {
        return res.status(400).json({ message: 'Já existe um pedido com este código' });
      }

      const pedido = pedidoRepository.create({
        codigo,
        item,
        fornecedor,
        quantidade: quantidade || 1,
        valor: parseFloat(valor) || 0,
        dataPedido: dataPedido || new Date().toISOString().split('T')[0],
        dataEntrega: dataEntrega || new Date().toISOString().split('T')[0],
        endereco: endereco || '',
        rastreio: rastreio || '',
        requisicaoCodigo: requisicaoCodigo || '',
        status: status || 'processando',
      });
      
      await pedidoRepository.save(pedido);
      res.status(201).json(pedido);
    } catch (error: any) {
      console.error('Error creating pedido:', error);
      if (error.code === 'SQLITE_CONSTRAINT' || error.code === '23505') {
        return res.status(400).json({ message: 'Erro de validação: código já existe' });
      }
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

