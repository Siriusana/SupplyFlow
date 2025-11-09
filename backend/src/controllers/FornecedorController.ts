import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Fornecedor } from '../entities/Fornecedor';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

export class FornecedorController {
  async getAll(req: Request, res: Response) {
    try {
      const fornecedorRepository = AppDataSource.getRepository(Fornecedor);
      const fornecedores = await fornecedorRepository.find();
      res.json(fornecedores);
    } catch (error) {
      console.error('Error getting fornecedores:', error);
      res.status(500).json({ message: 'Erro ao buscar fornecedores' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fornecedorRepository = AppDataSource.getRepository(Fornecedor);
      const fornecedor = await fornecedorRepository.findOne({ where: { id: parseInt(id) } });

      if (!fornecedor) {
        return res.status(404).json({ message: 'Fornecedor não encontrado' });
      }

      res.json(fornecedor);
    } catch (error) {
      console.error('Error getting fornecedor:', error);
      res.status(500).json({ message: 'Erro ao buscar fornecedor' });
    }
  }

  async getByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const fornecedorRepository = AppDataSource.getRepository(Fornecedor);
      const fornecedores = await fornecedorRepository.find({ where: { status } });
      res.json(fornecedores);
    } catch (error) {
      console.error('Error getting fornecedores by status:', error);
      res.status(500).json({ message: 'Erro ao buscar fornecedores' });
    }
  }

  async getByCategoria(req: Request, res: Response) {
    try {
      const { categoria } = req.params;
      const fornecedorRepository = AppDataSource.getRepository(Fornecedor);
      const fornecedores = await fornecedorRepository.find({ where: { categoria } });
      res.json(fornecedores);
    } catch (error) {
      console.error('Error getting fornecedores by categoria:', error);
      res.status(500).json({ message: 'Erro ao buscar fornecedores' });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { nome } = req.query;
      const fornecedorRepository = AppDataSource.getRepository(Fornecedor);
      const fornecedores = await fornecedorRepository
        .createQueryBuilder('fornecedor')
        .where('fornecedor.nome LIKE :nome', { nome: `%${nome}%` })
        .getMany();
      res.json(fornecedores);
    } catch (error) {
      console.error('Error searching fornecedores:', error);
      res.status(500).json({ message: 'Erro ao buscar fornecedores' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const fornecedorRepository = AppDataSource.getRepository(Fornecedor);
      const fornecedor = fornecedorRepository.create(req.body);
      await fornecedorRepository.save(fornecedor);
      res.status(201).json(fornecedor);
    } catch (error) {
      console.error('Error creating fornecedor:', error);
      res.status(500).json({ message: 'Erro ao criar fornecedor' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const fornecedorRepository = AppDataSource.getRepository(Fornecedor);
      const fornecedor = await fornecedorRepository.findOne({ where: { id: parseInt(id) } });

      if (!fornecedor) {
        return res.status(404).json({ message: 'Fornecedor não encontrado' });
      }

      fornecedorRepository.merge(fornecedor, req.body);
      await fornecedorRepository.save(fornecedor);
      res.json(fornecedor);
    } catch (error) {
      console.error('Error updating fornecedor:', error);
      res.status(500).json({ message: 'Erro ao atualizar fornecedor' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const fornecedorRepository = AppDataSource.getRepository(Fornecedor);
      const result = await fornecedorRepository.delete(parseInt(id));

      if (result.affected === 0) {
        return res.status(404).json({ message: 'Fornecedor não encontrado' });
      }

      res.json({ message: 'Fornecedor excluído com sucesso' });
    } catch (error) {
      console.error('Error deleting fornecedor:', error);
      res.status(500).json({ message: 'Erro ao excluir fornecedor' });
    }
  }
}

