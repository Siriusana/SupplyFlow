import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { DashboardController } from '../controllers/DashboardController';
import { FornecedorController } from '../controllers/FornecedorController';
import { RequisicaoController } from '../controllers/RequisicaoController';
import { NegociacaoController } from '../controllers/NegociacaoController';
import { OrcamentoController } from '../controllers/OrcamentoController';
import { PedidoController } from '../controllers/PedidoController';
import { RelatorioController } from '../controllers/RelatorioController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Controllers
const authController = new AuthController();
const dashboardController = new DashboardController();
const fornecedorController = new FornecedorController();
const requisicaoController = new RequisicaoController();
const negociacaoController = new NegociacaoController();
const orcamentoController = new OrcamentoController();
const pedidoController = new PedidoController();
const relatorioController = new RelatorioController();

// Auth routes
router.post('/auth/login', (req, res) => authController.login(req, res));
router.post('/auth/register', (req, res) => authController.register(req, res));

// Dashboard routes
router.get('/dashboard/stats', (req, res) => dashboardController.getStats(req, res));
router.get('/dashboard/monthly-expenses', (req, res) => dashboardController.getMonthlyExpenses(req, res));
router.get('/dashboard/category-expenses', (req, res) => dashboardController.getCategoryExpenses(req, res));
router.get('/dashboard/requisition-status', (req, res) => dashboardController.getRequisitionStatus(req, res));
router.get('/dashboard/recent-activities', (req, res) => dashboardController.getRecentActivities(req, res));
router.get('/dashboard/all', (req, res) => dashboardController.getAll(req, res));

// Fornecedores routes
router.get('/fornecedores', (req, res) => fornecedorController.getAll(req, res));
router.get('/fornecedores/:id', (req, res) => fornecedorController.getById(req, res));
router.get('/fornecedores/status/:status', (req, res) => fornecedorController.getByStatus(req, res));
router.get('/fornecedores/categoria/:categoria', (req, res) => fornecedorController.getByCategoria(req, res));
router.get('/fornecedores/search', (req, res) => fornecedorController.search(req, res));
router.post('/fornecedores', authenticateToken, (req, res) => fornecedorController.create(req, res));
router.put('/fornecedores/:id', authenticateToken, (req, res) => fornecedorController.update(req, res));
router.delete('/fornecedores/:id', authenticateToken, requireAdmin, (req, res) => fornecedorController.delete(req, res));

// Requisições routes
router.get('/requisicoes', (req, res) => requisicaoController.getAll(req, res));
router.get('/requisicoes/:id', (req, res) => requisicaoController.getById(req, res));
router.get('/requisicoes/codigo/:codigo', (req, res) => requisicaoController.getByCodigo(req, res));
router.get('/requisicoes/status/:status', (req, res) => requisicaoController.getByStatus(req, res));
router.post('/requisicoes', authenticateToken, requireAdmin, (req, res) => requisicaoController.create(req, res));
router.put('/requisicoes/:id', authenticateToken, (req, res) => requisicaoController.update(req, res));
router.put('/requisicoes/:id/aprovar', authenticateToken, requireAdmin, (req, res) => requisicaoController.aprovar(req, res));
router.put('/requisicoes/:id/rejeitar', authenticateToken, requireAdmin, (req, res) => requisicaoController.rejeitar(req, res));
router.delete('/requisicoes/:id', authenticateToken, requireAdmin, (req, res) => requisicaoController.delete(req, res));

// Negociações routes
router.get('/negociacoes', (req, res) => negociacaoController.getAll(req, res));
router.get('/negociacoes/:id', (req, res) => negociacaoController.getById(req, res));
router.get('/negociacoes/codigo/:codigo', (req, res) => negociacaoController.getByCodigo(req, res));
router.get('/negociacoes/status/:status', (req, res) => negociacaoController.getByStatus(req, res));
router.post('/negociacoes', authenticateToken, (req, res) => negociacaoController.create(req, res));
router.put('/negociacoes/:id', authenticateToken, (req, res) => negociacaoController.update(req, res));
router.post('/negociacoes/:id/historico', authenticateToken, (req, res) => negociacaoController.addHistorico(req, res));
router.delete('/negociacoes/:id', authenticateToken, (req, res) => negociacaoController.delete(req, res));

// Orçamentos routes
router.get('/orcamentos', (req, res) => orcamentoController.getAll(req, res));
router.get('/orcamentos/:id', (req, res) => orcamentoController.getById(req, res));
router.get('/orcamentos/codigo/:codigo', (req, res) => orcamentoController.getByCodigo(req, res));
router.get('/orcamentos/status/:status', (req, res) => orcamentoController.getByStatus(req, res));
router.post('/orcamentos', authenticateToken, (req, res) => orcamentoController.create(req, res));
router.put('/orcamentos/:id', authenticateToken, (req, res) => orcamentoController.update(req, res));
router.post('/orcamentos/:id/cotacoes', authenticateToken, (req, res) => orcamentoController.addCotacao(req, res));
router.delete('/orcamentos/:id', authenticateToken, (req, res) => orcamentoController.delete(req, res));

// Pedidos routes
router.get('/pedidos', (req, res) => pedidoController.getAll(req, res));
router.get('/pedidos/:id', (req, res) => pedidoController.getById(req, res));
router.get('/pedidos/codigo/:codigo', (req, res) => pedidoController.getByCodigo(req, res));
router.get('/pedidos/status/:status', (req, res) => pedidoController.getByStatus(req, res));
router.post('/pedidos', authenticateToken, (req, res) => pedidoController.create(req, res));
router.put('/pedidos/:id', authenticateToken, (req, res) => pedidoController.update(req, res));
router.post('/pedidos/:id/historico', authenticateToken, (req, res) => pedidoController.addHistorico(req, res));
router.delete('/pedidos/:id', authenticateToken, (req, res) => pedidoController.delete(req, res));

// Relatórios routes
router.get('/relatorios/gastos-mensais', (req, res) => relatorioController.getGastosMensais(req, res));
router.get('/relatorios/gastos-categoria', (req, res) => relatorioController.getGastosPorCategoria(req, res));
router.get('/relatorios/indicadores', (req, res) => relatorioController.getIndicadores(req, res));
router.get('/relatorios/top-fornecedores', (req, res) => relatorioController.getTopFornecedores(req, res));
router.get('/relatorios/all', (req, res) => relatorioController.getAll(req, res));

export default router;

