import { AppDataSource } from './database';
import { User } from '../entities/User';
import { Fornecedor } from '../entities/Fornecedor';
import { Requisicao } from '../entities/Requisicao';
import { Negociacao } from '../entities/Negociacao';
import { HistoricoNegociacao } from '../entities/HistoricoNegociacao';
import { Orcamento } from '../entities/Orcamento';
import { Cotacao } from '../entities/Cotacao';
import { Pedido } from '../entities/Pedido';
import { HistoricoPedido } from '../entities/HistoricoPedido';
import { DashboardStats } from '../entities/DashboardStats';
import { MonthlyExpense } from '../entities/MonthlyExpense';
import { CategoryExpense } from '../entities/CategoryExpense';
import { RequisitionStatus } from '../entities/RequisitionStatus';
import { RecentActivity } from '../entities/RecentActivity';
import bcrypt from 'bcryptjs';

export async function loadInitialData() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    
    // Check if data already exists
    const userCount = await userRepository.count();
    if (userCount > 0) {
      console.log('Database already populated. Skipping data loading.');
      return;
    }

    console.log('Loading initial data...');

    await loadUsers();
    await loadFornecedores();
    await loadRequisicoes();
    await loadNegociacoes();
    await loadOrcamentos();
    await loadPedidos();
    await loadDashboardData();

    console.log('Initial data loaded successfully!');
  } catch (error) {
    console.error('Error loading initial data:', error);
    throw error;
  }
}

async function loadUsers() {
  const userRepository = AppDataSource.getRepository(User);
  
  const admin = userRepository.create({
    username: 'admin',
    password: await bcrypt.hash('admin123', 10),
    email: 'admin@supplyflow.com',
    role: 'ADMIN',
    active: 1,
  });

  const user = userRepository.create({
    username: 'user',
    password: await bcrypt.hash('user123', 10),
    email: 'user@supplyflow.com',
    role: 'USER',
    active: 1,
  });

  await userRepository.save([admin, user]);
}

async function loadFornecedores() {
  const fornecedorRepository = AppDataSource.getRepository(Fornecedor);

  const fornecedores = [
    {
      nome: 'TechSupply Ltda',
      categoria: 'Tecnologia',
      cnpj: '12.345.678/0001-90',
      email: 'contato@techsupply.com',
      telefone: '(11) 98765-4321',
      endereco: 'São Paulo, SP',
      avaliacao: 4.8,
      status: 'Ativo',
      totalPedidos: 45,
    },
    {
      nome: 'Materiais Premium',
      categoria: 'Materiais de Escritório',
      cnpj: '98.765.432/0001-10',
      email: 'vendas@materiaisp.com',
      telefone: '(11) 91234-5678',
      endereco: 'Rio de Janeiro, RJ',
      avaliacao: 4.5,
      status: 'Ativo',
      totalPedidos: 78,
    },
    {
      nome: 'Equipamentos Industriais',
      categoria: 'Equipamentos',
      cnpj: '11.222.333/0001-44',
      email: 'comercial@equip.com',
      telefone: '(21) 97654-3210',
      endereco: 'Belo Horizonte, MG',
      avaliacao: 4.9,
      status: 'Ativo',
      totalPedidos: 32,
    },
    {
      nome: 'Serviços Gerais Pro',
      categoria: 'Serviços',
      cnpj: '55.666.777/0001-88',
      email: 'atendimento@servpro.com',
      telefone: '(31) 99888-7766',
      endereco: 'Curitiba, PR',
      avaliacao: 4.2,
      status: 'Inativo',
      totalPedidos: 21,
    },
  ];

  await fornecedorRepository.save(fornecedores.map((f) => fornecedorRepository.create(f)));
}

async function loadRequisicoes() {
  const requisicaoRepository = AppDataSource.getRepository(Requisicao);

  const requisicoes = [
    {
      codigo: 'REQ-1234',
      titulo: 'Notebooks Dell i7',
      solicitante: 'João Silva',
      departamento: 'TI',
      categoria: 'Equipamentos',
      valor: 45000.0,
      data: '2025-10-28',
      status: 'pendente',
      prioridade: 'alta',
      descricao: '10 notebooks Dell i7, 16GB RAM, 512GB SSD',
    },
    {
      codigo: 'REQ-1235',
      titulo: 'Materiais de Escritório',
      solicitante: 'Maria Santos',
      departamento: 'Administrativo',
      categoria: 'Materiais',
      valor: 2500.0,
      data: '2025-10-27',
      status: 'aprovada',
      prioridade: 'media',
      descricao: 'Papéis, canetas, pastas e organizadores',
    },
    {
      codigo: 'REQ-1236',
      titulo: 'Licenças Microsoft 365',
      solicitante: 'Carlos Mendes',
      departamento: 'TI',
      categoria: 'Software',
      valor: 12000.0,
      data: '2025-10-26',
      status: 'rejeitada',
      prioridade: 'baixa',
      descricao: '50 licenças anuais Microsoft 365',
    },
    {
      codigo: 'REQ-1237',
      titulo: 'Serviço de Limpeza',
      solicitante: 'Ana Paula',
      departamento: 'Facilities',
      categoria: 'Serviços',
      valor: 8000.0,
      data: '2025-10-28',
      status: 'em_analise',
      prioridade: 'alta',
      descricao: 'Contrato trimestral de limpeza',
    },
    {
      codigo: 'REQ-1238',
      titulo: 'Manutenção Ar Condicionado',
      solicitante: 'Roberto Lima',
      departamento: 'Facilities',
      categoria: 'Serviços',
      valor: 3200.0,
      data: '2025-10-25',
      status: 'aprovada',
      prioridade: 'media',
      descricao: 'Manutenção preventiva de 15 unidades',
    },
  ];

  await requisicaoRepository.save(requisicoes.map((r) => requisicaoRepository.create(r)));
}

async function loadNegociacoes() {
  const negociacaoRepository = AppDataSource.getRepository(Negociacao);
  const historicoRepository = AppDataSource.getRepository(HistoricoNegociacao);

  const neg1 = negociacaoRepository.create({
    codigo: 'NEG-1001',
    fornecedor: 'TechSupply Ltda',
    item: 'Notebooks Dell i7',
    valorInicial: 50000.0,
    valorNegociado: 45000.0,
    desconto: '10%',
    status: 'concluida',
    responsavel: 'João Silva',
    dataInicio: '2025-10-20',
    dataFim: '2025-10-27',
  });
  const savedNeg1 = await negociacaoRepository.save(neg1);

  await historicoRepository.save([
    historicoRepository.create({
      negociacao: savedNeg1,
      data: '2025-10-20',
      autor: 'João Silva',
      mensagem: 'Solicitação inicial de 10 notebooks',
      valor: 50000.0,
    }),
    historicoRepository.create({
      negociacao: savedNeg1,
      data: '2025-10-22',
      autor: 'TechSupply',
      mensagem: 'Proposta com desconto de 5%',
      valor: 47500.0,
    }),
    historicoRepository.create({
      negociacao: savedNeg1,
      data: '2025-10-25',
      autor: 'João Silva',
      mensagem: 'Contra-proposta solicitando 10% de desconto',
      valor: 45000.0,
    }),
    historicoRepository.create({
      negociacao: savedNeg1,
      data: '2025-10-27',
      autor: 'TechSupply',
      mensagem: 'Acordo aceito com 10% de desconto',
      valor: 45000.0,
    }),
  ]);

  const neg2 = negociacaoRepository.create({
    codigo: 'NEG-1002',
    fornecedor: 'Serviços Gerais Pro',
    item: 'Contrato de Limpeza',
    valorInicial: 10000.0,
    valorNegociado: 8500.0,
    desconto: '15%',
    status: 'em_andamento',
    responsavel: 'Ana Paula',
    dataInicio: '2025-10-25',
  });
  const savedNeg2 = await negociacaoRepository.save(neg2);

  await historicoRepository.save([
    historicoRepository.create({
      negociacao: savedNeg2,
      data: '2025-10-25',
      autor: 'Ana Paula',
      mensagem: 'Solicitação de orçamento trimestral',
      valor: 10000.0,
    }),
    historicoRepository.create({
      negociacao: savedNeg2,
      data: '2025-10-27',
      autor: 'Serviços Gerais',
      mensagem: 'Proposta com valor reduzido para contrato anual',
      valor: 8500.0,
    }),
  ]);

  const neg3 = negociacaoRepository.create({
    codigo: 'NEG-1003',
    fornecedor: 'Materiais Premium',
    item: 'Materiais de Escritório',
    valorInicial: 3000.0,
    valorNegociado: 2500.0,
    desconto: '17%',
    status: 'concluida',
    responsavel: 'Maria Santos',
    dataInicio: '2025-10-15',
    dataFim: '2025-10-18',
  });
  const savedNeg3 = await negociacaoRepository.save(neg3);

  await historicoRepository.save([
    historicoRepository.create({
      negociacao: savedNeg3,
      data: '2025-10-15',
      autor: 'Maria Santos',
      mensagem: 'Pedido de materiais diversos',
      valor: 3000.0,
    }),
    historicoRepository.create({
      negociacao: savedNeg3,
      data: '2025-10-18',
      autor: 'Materiais Premium',
      mensagem: 'Desconto especial por volume',
      valor: 2500.0,
    }),
  ]);
}

async function loadOrcamentos() {
  const orcamentoRepository = AppDataSource.getRepository(Orcamento);
  const cotacaoRepository = AppDataSource.getRepository(Cotacao);

  const orc1 = orcamentoRepository.create({
    codigo: 'ORC-2001',
    item: 'Notebooks Dell i7',
    requisicaoCodigo: 'REQ-1234',
    quantidade: 10,
    dataLimite: '2025-11-05',
    status: 'em_analise',
  });
  const savedOrc1 = await orcamentoRepository.save(orc1);

  await cotacaoRepository.save([
    cotacaoRepository.create({
      orcamento: savedOrc1,
      fornecedor: 'TechSupply Ltda',
      valorUnitario: 4500.0,
      valorTotal: 45000.0,
      prazoEntrega: '15 dias',
      condicoes: 'À vista ou 2x sem juros',
      status: 'recebida',
      avaliacao: 4.8,
    }),
    cotacaoRepository.create({
      orcamento: savedOrc1,
      fornecedor: 'InfoTech Distribuidora',
      valorUnitario: 4700.0,
      valorTotal: 47000.0,
      prazoEntrega: '10 dias',
      condicoes: '3x sem juros',
      status: 'recebida',
      avaliacao: 4.5,
    }),
    cotacaoRepository.create({
      orcamento: savedOrc1,
      fornecedor: 'Mega Tecnologia',
      valorUnitario: 4400.0,
      valorTotal: 44000.0,
      prazoEntrega: '20 dias',
      condicoes: 'À vista com 5% desconto',
      status: 'pendente',
      avaliacao: 4.2,
    }),
  ]);

  const orc2 = orcamentoRepository.create({
    codigo: 'ORC-2002',
    item: 'Serviço de Limpeza Trimestral',
    requisicaoCodigo: 'REQ-1237',
    quantidade: 1,
    dataLimite: '2025-11-01',
    status: 'em_analise',
  });
  const savedOrc2 = await orcamentoRepository.save(orc2);

  await cotacaoRepository.save([
    cotacaoRepository.create({
      orcamento: savedOrc2,
      fornecedor: 'Serviços Gerais Pro',
      valorUnitario: 8500.0,
      valorTotal: 8500.0,
      prazoEntrega: 'Início imediato',
      condicoes: 'Mensalidade fixa',
      status: 'recebida',
      avaliacao: 4.2,
    }),
    cotacaoRepository.create({
      orcamento: savedOrc2,
      fornecedor: 'LimpMax Serviços',
      valorUnitario: 9000.0,
      valorTotal: 9000.0,
      prazoEntrega: '5 dias',
      condicoes: 'Pagamento mensal',
      status: 'recebida',
      avaliacao: 4.6,
    }),
  ]);
}

async function loadPedidos() {
  const pedidoRepository = AppDataSource.getRepository(Pedido);
  const historicoRepository = AppDataSource.getRepository(HistoricoPedido);

  const ped1 = pedidoRepository.create({
    codigo: 'PED-5001',
    requisicaoCodigo: 'REQ-1235',
    fornecedor: 'Materiais Premium',
    item: 'Materiais de Escritório',
    quantidade: 1,
    valor: 2500.0,
    dataPedido: '2025-10-27',
    dataEntrega: '2025-11-10',
    status: 'entregue',
    rastreio: 'BR123456789',
    endereco: 'Rua das Flores, 123 - São Paulo, SP',
  });
  const savedPed1 = await pedidoRepository.save(ped1);

  await historicoRepository.save([
    historicoRepository.create({
      pedido: savedPed1,
      data: '2025-10-27',
      status: 'Pedido Realizado',
      descricao: 'Pedido confirmado',
    }),
    historicoRepository.create({
      pedido: savedPed1,
      data: '2025-10-28',
      status: 'Em Separação',
      descricao: 'Produtos sendo separados',
    }),
    historicoRepository.create({
      pedido: savedPed1,
      data: '2025-10-29',
      status: 'Enviado',
      descricao: 'Pedido enviado para transporte',
    }),
    historicoRepository.create({
      pedido: savedPed1,
      data: '2025-11-10',
      status: 'Entregue',
      descricao: 'Pedido entregue com sucesso',
    }),
  ]);

  const ped2 = pedidoRepository.create({
    codigo: 'PED-5002',
    requisicaoCodigo: 'REQ-1238',
    fornecedor: 'TechMaintenance Pro',
    item: 'Manutenção Ar Condicionado',
    quantidade: 1,
    valor: 3200.0,
    dataPedido: '2025-10-25',
    dataEntrega: '2025-11-15',
    status: 'em_transito',
    rastreio: 'BR987654321',
    endereco: 'Av. Paulista, 1000 - São Paulo, SP',
  });
  const savedPed2 = await pedidoRepository.save(ped2);

  await historicoRepository.save([
    historicoRepository.create({
      pedido: savedPed2,
      data: '2025-10-25',
      status: 'Pedido Realizado',
      descricao: 'Pedido confirmado',
    }),
    historicoRepository.create({
      pedido: savedPed2,
      data: '2025-10-26',
      status: 'Em Separação',
      descricao: 'Peças sendo preparadas',
    }),
    historicoRepository.create({
      pedido: savedPed2,
      data: '2025-10-28',
      status: 'Enviado',
      descricao: 'Em rota de entrega',
    }),
  ]);
}

async function loadDashboardData() {
  const statsRepository = AppDataSource.getRepository(DashboardStats);
  const monthlyExpenseRepository = AppDataSource.getRepository(MonthlyExpense);
  const categoryExpenseRepository = AppDataSource.getRepository(CategoryExpense);
  const requisitionStatusRepository = AppDataSource.getRepository(RequisitionStatus);
  const recentActivityRepository = AppDataSource.getRepository(RecentActivity);

  // Dashboard Stats
  await statsRepository.save([
    statsRepository.create({
      title: 'Requisições Pendentes',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: 'FileText',
      color: 'from-blue-500 to-cyan-500',
    }),
    statsRepository.create({
      title: 'Fornecedores Ativos',
      value: '156',
      change: '+5%',
      trend: 'up',
      icon: 'Users',
      color: 'from-purple-500 to-pink-500',
    }),
    statsRepository.create({
      title: 'Pedidos do Mês',
      value: '89',
      change: '-3%',
      trend: 'down',
      icon: 'ShoppingCart',
      color: 'from-green-500 to-emerald-500',
    }),
    statsRepository.create({
      title: 'Valor Total',
      value: 'R$ 2.4M',
      change: '+18%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'from-orange-500 to-red-500',
    }),
  ]);

  // Monthly Expenses
  await monthlyExpenseRepository.save([
    { name: 'Jan', valor: 120000.0, meta: 150000.0 },
    { name: 'Fev', valor: 150000.0, meta: 150000.0 },
    { name: 'Mar', valor: 180000.0, meta: 150000.0 },
    { name: 'Abr', valor: 220000.0, meta: 200000.0 },
    { name: 'Mai', valor: 200000.0, meta: 200000.0 },
    { name: 'Jun', valor: 240000.0, meta: 200000.0 },
    { name: 'Jul', valor: 210000.0, meta: 200000.0 },
    { name: 'Ago', valor: 190000.0, meta: 200000.0 },
    { name: 'Set', valor: 230000.0, meta: 200000.0 },
    { name: 'Out', valor: 250000.0, meta: 220000.0 },
  ].map((e) => monthlyExpenseRepository.create(e)));

  // Category Expenses
  await categoryExpenseRepository.save([
    { name: 'Materiais', valor: 80000.0 },
    { name: 'Serviços', valor: 65000.0 },
    { name: 'Equipamentos', valor: 45000.0 },
    { name: 'TI', valor: 30000.0 },
    { name: 'Outros', valor: 20000.0 },
  ].map((e) => categoryExpenseRepository.create(e)));

  // Requisition Status
  await requisitionStatusRepository.save([
    { name: 'Aprovadas', value: 65 },
    { name: 'Pendentes', value: 24 },
    { name: 'Rejeitadas', value: 11 },
  ].map((s) => requisitionStatusRepository.create(s)));

  // Recent Activities
  await recentActivityRepository.save([
    {
      title: 'aprovacao',
      description: 'Requisição #1234 aprovada',
      type: 'Materiais de escritório - Fornecedor ABC',
      time: 'há 5 minutos',
      icon: 'CheckCircle',
      color: 'text-green-400',
    },
    {
      title: 'pendente',
      description: 'Nova cotação recebida',
      type: 'Equipamentos de TI - 3 fornecedores',
      time: 'há 15 minutos',
      icon: 'Clock',
      color: 'text-yellow-400',
    },
    {
      title: 'pedido',
      description: 'Pedido #5678 enviado',
      type: 'Serviços de manutenção - Fornecedor XYZ',
      time: 'há 1 hora',
      icon: 'ShoppingCart',
      color: 'text-blue-400',
    },
    {
      title: 'aprovacao',
      description: 'Negociação finalizada',
      type: 'Desconto de 15% obtido',
      time: 'há 2 horas',
      icon: 'CheckCircle',
      color: 'text-green-400',
    },
  ].map((a) => recentActivityRepository.create(a)));
}

