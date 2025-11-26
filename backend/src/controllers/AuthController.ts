import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

const jwtSecret = process.env.JWT_SECRET || '5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437';
const jwtExpiration = parseInt(process.env.JWT_EXPIRATION || '86400000');

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username e senha são obrigatórios' });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { username } });

      if (!user || user.active === 0) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        jwtSecret,
        { expiresIn: jwtExpiration / 1000 }
      );

      res.json({
        token,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Erro ao fazer login' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { username, password, email, role = 'USER' } = req.body;

      if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, senha e email são obrigatórios' });
      }

      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({ where: { username } });

      if (existingUser) {
        return res.status(400).json({ message: 'Username já existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = userRepository.create({
        username,
        password: hashedPassword,
        email,
        role,
        active: 1,
      });

      await userRepository.save(user);

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        jwtSecret,
        { expiresIn: jwtExpiration / 1000 }
      );

      res.status(201).json({
        token,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
  }
}

