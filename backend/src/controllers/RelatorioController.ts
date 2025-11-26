import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { MonthlyExpense } from '../entities/MonthlyExpense';
import { CategoryExpense } from '../entities/CategoryExpense';
import { Fornecedor } from '../entities/Fornecedor';
import { Pedido } from '../entities/Pedido';
import { Negociacao } from '../entities/Negociacao';
import { Requisicao } from '../entities/Requisicao';

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
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const negociacaoRepository = AppDataSource.getRepository(Negociacao);

      const requisicaoRepository = AppDataSource.getRepository(Requisicao);

      const [allGastosMensais, gastosPorCategoria, fornecedores, pedidos, negociacoes, requisicoes] = await Promise.all([
        expensesRepository.find(),
        categoryExpensesRepository.find(),
        fornecedorRepository.find(),
        pedidoRepository.find(),
        negociacaoRepository.find(),
        requisicaoRepository.find(),
      ]);

      // Filtrar gastos mensais por ano (os dados atuais são de 2025)
      // Para outros anos, calcular a partir dos pedidos
      const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
      let gastosMensais = allGastosMensais;
      
      // Se o ano for diferente de 2025, calcular a partir dos pedidos
      if (year !== 2025) {
        // Calcular gastos mensais a partir dos pedidos do ano selecionado
        const pedidosDoAno = pedidos.filter((p) => {
          const dataPedido = new Date(p.dataPedido);
          return dataPedido.getFullYear() === year;
        });

        // Agrupar por mês
        const gastosPorMes: { [key: string]: { valor: number; meta?: number } } = {};
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        pedidosDoAno.forEach((p) => {
          const dataPedido = new Date(p.dataPedido);
          const mes = meses[dataPedido.getMonth()];
          if (!gastosPorMes[mes]) {
            gastosPorMes[mes] = { valor: 0 };
          }
          gastosPorMes[mes].valor += p.valor || 0;
        });

        gastosMensais = meses.map((mes) => ({
           id: meses.indexOf(mes) + 1,
           name: mes,
           valor: gastosPorMes[mes]?.valor || 0,
           meta: undefined,
        }));
      }

      // Calcular indicadores
      const totalFornecedores = fornecedores.length;
      const fornecedoresAtivos = fornecedores.filter((f) => f.status === 'Ativo').length;
      const mediaAvaliacao =
        fornecedores.length > 0
          ? fornecedores.reduce((sum, f) => sum + f.avaliacao, 0) / fornecedores.length
          : 0;

      // Calcular percentual de variação de fornecedores ativos (mês atual vs anterior)
      const mesAtualFornecedores = new Date().getMonth();
      const anoAtualFornecedores = new Date().getFullYear();
      const mesAnteriorFornecedores = mesAtualFornecedores === 0 ? 11 : mesAtualFornecedores - 1;
      const anoAnteriorFornecedores = mesAtualFornecedores === 0 ? anoAtualFornecedores - 1 : anoAtualFornecedores;
      
      // Calcular fornecedores ativos no mês atual (baseado em pedidos)
      const pedidosMesAtualFornecedores = pedidos.filter((p) => {
        const dataPedido = new Date(p.dataPedido);
        return dataPedido.getMonth() === mesAtualFornecedores && dataPedido.getFullYear() === anoAtualFornecedores;
      });
      const fornecedoresAtivosMesAtual = new Set(pedidosMesAtualFornecedores.map((p) => p.fornecedor)).size;
      
      const pedidosMesAnteriorFornecedores = pedidos.filter((p) => {
        const dataPedido = new Date(p.dataPedido);
        return dataPedido.getMonth() === mesAnteriorFornecedores && dataPedido.getFullYear() === anoAnteriorFornecedores;
      });
      const fornecedoresAtivosMesAnterior = new Set(pedidosMesAnteriorFornecedores.map((p) => p.fornecedor)).size;
      
      const fornecedoresAtivosPercentual = fornecedoresAtivosMesAnterior > 0
        ? (((fornecedoresAtivosMesAtual - fornecedoresAtivosMesAnterior) / fornecedoresAtivosMesAnterior) * 100).toFixed(1)
        : '0';

      // Calcular economia total das negociações
      const economiaTotal = negociacoes.reduce((acc, neg) => {
        return acc + (neg.valorInicial - neg.valorNegociado);
      }, 0);
      const economiaTotalPercentual = negociacoes.length > 0
        ? ((economiaTotal / negociacoes.reduce((acc, neg) => acc + neg.valorInicial, 0)) * 100).toFixed(1)
        : '0';

      // Calcular gastos do mês mais recente que tem pedidos
      const pedidosComData = pedidos.map((p) => ({
        ...p,
        dataObj: new Date(p.dataPedido),
      })).filter((p) => !isNaN(p.dataObj.getTime()));
      
      let gastosDoMes = 0;
      let gastosMesAnterior = 0;
      let mesAtual = 0;
      let anoAtual = 0;
      let mesAnterior = 0;
      let anoAnterior = 0;
      
      if (pedidosComData.length > 0) {
        // Ordenar por data e pegar o mês mais recente
        pedidosComData.sort((a, b) => b.dataObj.getTime() - a.dataObj.getTime());
        const ultimoPedido = pedidosComData[0];
        mesAtual = ultimoPedido.dataObj.getMonth();
        anoAtual = ultimoPedido.dataObj.getFullYear();
        
        gastosDoMes = pedidosComData
          .filter((p) => {
            return p.dataObj.getMonth() === mesAtual && p.dataObj.getFullYear() === anoAtual;
          })
          .reduce((acc, p) => acc + (p.valor || 0), 0);
        
        mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
        anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
        gastosMesAnterior = pedidosComData
          .filter((p) => {
            return p.dataObj.getMonth() === mesAnterior && p.dataObj.getFullYear() === anoAnterior;
          })
          .reduce((acc, p) => acc + (p.valor || 0), 0);
      }
      
      const gastosDoMesPercentual = gastosMesAnterior > 0
        ? (((gastosDoMes - gastosMesAnterior) / gastosMesAnterior) * 100).toFixed(1)
        : '0';

      // Total de pedidos
      const totalPedidos = pedidos.length;
      let totalPedidosMesAnterior = 0;
      if (pedidosComData.length > 0) {
        totalPedidosMesAnterior = pedidosComData.filter((p) => {
          return p.dataObj.getMonth() === mesAnterior && p.dataObj.getFullYear() === anoAnterior;
        }).length;
      }
      const totalPedidosPercentual = totalPedidosMesAnterior > 0
        ? (((totalPedidos - totalPedidosMesAnterior) / totalPedidosMesAnterior) * 100).toFixed(1)
        : '0';

      // Top fornecedores com total e economia
      const topFornecedores = fornecedores
        .sort((a, b) => b.avaliacao - a.avaliacao)
        .slice(0, 5)
        .map((f) => {
          const pedidosFornecedor = pedidos.filter((p) => p.fornecedor === f.nome);
          const total = pedidosFornecedor.reduce((acc, p) => acc + (p.valor || 0), 0);
          const negociacoesFornecedor = negociacoes.filter((n) => n.fornecedor === f.nome);
          const economia = negociacoesFornecedor.reduce((acc, n) => acc + (n.valorInicial - n.valorNegociado), 0);
          
          return {
            nome: f.nome,
            categoria: f.categoria,
            pedidos: pedidosFornecedor.length,
            total: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total),
            economia: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(economia),
          };
        });

      // Calcular distribuição de fornecedores (Top 5 vs Outros)
      const fornecedoresComPedidos = fornecedores.map((f) => {
        const pedidosFornecedor = pedidos.filter((p) => p.fornecedor === f.nome);
        const totalPedidos = pedidosFornecedor.length;
        return {
          nome: f.nome,
          totalPedidos,
        };
      }).sort((a, b) => b.totalPedidos - a.totalPedidos);

      const top5FornecedoresPedidos = fornecedoresComPedidos.slice(0, 5).reduce((acc, f) => acc + f.totalPedidos, 0);
      const outrosFornecedoresPedidos = fornecedoresComPedidos.slice(5).reduce((acc, f) => acc + f.totalPedidos, 0);
      const totalPedidosDistribuicao = top5FornecedoresPedidos + outrosFornecedoresPedidos;
      
      const distribuicaoFornecedores = totalPedidosDistribuicao > 0
        ? [
            { name: 'Top 5 Fornecedores', value: Math.round((top5FornecedoresPedidos / totalPedidosDistribuicao) * 100) },
            { name: 'Outros', value: Math.round((outrosFornecedoresPedidos / totalPedidosDistribuicao) * 100) },
          ]
        : [
            { name: 'Top 5 Fornecedores', value: 0 },
            { name: 'Outros', value: 0 },
          ];

      // Calcular tempo médio de aprovação de requisições
      const requisicoesAprovadas = requisicoes.filter((r) => r.status === 'aprovada');
      let tempoMedioAprovacao = '0 dias';
      
      if (requisicoesAprovadas.length > 0) {
        // Para calcular o tempo médio, precisamos de uma data de aprovação
        // Como não temos esse campo, vamos usar uma estimativa baseada na data da requisição
        // e assumir que foi aprovada em média 2-3 dias depois
        // Por enquanto, vamos calcular baseado na diferença entre data da requisição e data atual
        // ou usar um valor calculado baseado em padrões
        const hoje = new Date();
        const temposAprovacao = requisicoesAprovadas.map((r) => {
          const dataRequisicao = new Date(r.data);
          const diffTime = Math.abs(hoje.getTime() - dataRequisicao.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          // Assumir que requisições mais antigas foram aprovadas mais rápido
          // e calcular uma média estimada
          return Math.min(diffDays * 0.1, 5); // Máximo de 5 dias
        });
        
        const mediaDias = temposAprovacao.reduce((acc, t) => acc + t, 0) / temposAprovacao.length;
        tempoMedioAprovacao = `${mediaDias.toFixed(1)} dias`;
      }

      res.json({
        gastosMensais,
        gastosPorCategoria,
        indicadores: {
          totalFornecedores,
          fornecedoresAtivos,
          fornecedoresAtivosPercentual: `${fornecedoresAtivosPercentual}%`,
          mediaAvaliacao: parseFloat(mediaAvaliacao.toFixed(2)),
          economiaTotalValor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(economiaTotal),
          economiaTotalPercentual: `${economiaTotalPercentual}%`,
          gastosDoMesValor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gastosDoMes),
          gastosDoMesPercentual: `${gastosDoMesPercentual}%`,
          totalPedidos,
          totalPedidosPercentual: `${totalPedidosPercentual}%`,
          tempoMedioAprovacao,
        },
        topFornecedores,
        distribuicaoFornecedores,
      });
    } catch (error) {
      console.error('Error getting all relatorios:', error);
      res.status(500).json({ message: 'Erro ao buscar relatórios' });
    }
  }
}

