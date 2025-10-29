import { useState } from 'react';
import { Calculator, Users, Clock, CheckCircle, XCircle, Plus, RefreshCw } from 'lucide-react';

export function Orcamentos() {
  const [showModal, setShowModal] = useState(false);

  const orcamentos = [
    {
      id: 'ORC-2001',
      item: 'Notebooks Dell i7',
      requisicao: 'REQ-1234',
      quantidade: 10,
      dataLimite: '2025-11-05',
      status: 'em_analise',
      cotacoes: [
        {
          fornecedor: 'TechSupply Ltda',
          valorUnitario: 4500,
          valorTotal: 45000,
          prazoEntrega: '15 dias',
          condicoes: 'À vista ou 2x sem juros',
          status: 'recebida',
          avaliacao: 4.8,
        },
        {
          fornecedor: 'InfoTech Distribuidora',
          valorUnitario: 4700,
          valorTotal: 47000,
          prazoEntrega: '10 dias',
          condicoes: '3x sem juros',
          status: 'recebida',
          avaliacao: 4.5,
        },
        {
          fornecedor: 'Mega Tecnologia',
          valorUnitario: 4400,
          valorTotal: 44000,
          prazoEntrega: '20 dias',
          condicoes: 'À vista com 5% desconto',
          status: 'pendente',
          avaliacao: 4.2,
        },
      ],
    },
    {
      id: 'ORC-2002',
      item: 'Serviço de Limpeza Trimestral',
      requisicao: 'REQ-1237',
      quantidade: 1,
      dataLimite: '2025-11-01',
      status: 'em_analise',
      cotacoes: [
        {
          fornecedor: 'Serviços Gerais Pro',
          valorUnitario: 8500,
          valorTotal: 8500,
          prazoEntrega: 'Início imediato',
          condicoes: 'Mensalidade fixa',
          status: 'recebida',
          avaliacao: 4.2,
        },
        {
          fornecedor: 'LimpMax Serviços',
          valorUnitario: 9000,
          valorTotal: 9000,
          prazoEntrega: '5 dias',
          condicoes: 'Pagamento mensal',
          status: 'recebida',
          avaliacao: 4.6,
        },
      ],
    },
    {
      id: 'ORC-2003',
      item: 'Licenças Microsoft 365',
      requisicao: 'REQ-1236',
      quantidade: 50,
      dataLimite: '2025-10-31',
      status: 'aprovado',
      cotacoes: [
        {
          fornecedor: 'Microsoft Partner Gold',
          valorUnitario: 240,
          valorTotal: 12000,
          prazoEntrega: 'Imediato',
          condicoes: 'Pagamento anual',
          status: 'aprovada',
          avaliacao: 5.0,
        },
      ],
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      em_analise: {
        label: 'Em Análise',
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: Clock,
      },
      aprovado: {
        label: 'Aprovado',
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: CheckCircle,
      },
      rejeitado: {
        label: 'Rejeitado',
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: XCircle,
      },
    };
    return configs[status as keyof typeof configs];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-white mb-2">Orçamentos & Cotações</h1>
          <p className="text-white/60">Monitoramento em tempo real de orçamentos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Novo Orçamento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Total de Orçamentos',
            value: orcamentos.length,
            icon: Calculator,
            color: 'from-purple-500 to-pink-500',
          },
          {
            label: 'Em Análise',
            value: orcamentos.filter((o) => o.status === 'em_analise').length,
            icon: Clock,
            color: 'from-blue-500 to-cyan-500',
          },
          {
            label: 'Aprovados',
            value: orcamentos.filter((o) => o.status === 'aprovado').length,
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-500',
          },
          {
            label: 'Fornecedores Consultados',
            value: 12,
            icon: Users,
            color: 'from-orange-500 to-red-500',
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-white text-2xl mb-1">{stat.value}</p>
              <p className="text-white/60 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Orçamentos List */}
      <div className="space-y-6">
        {orcamentos.map((orc) => {
          const statusConfig = getStatusConfig(orc.status);
          const StatusIcon = statusConfig.icon;
          const melhorCotacao = orc.cotacoes.reduce((prev, current) =>
            prev.valorTotal < current.valorTotal ? prev : current
          );

          return (
            <div
              key={orc.id}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white/60 text-sm">{orc.id}</span>
                    <span className="text-white/40 text-sm">•</span>
                    <span className="text-white/60 text-sm">Req: {orc.requisicao}</span>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm">{statusConfig.label}</span>
                    </div>
                  </div>
                  <h3 className="text-white text-xl mb-2">{orc.item}</h3>
                  <div className="flex items-center gap-6 text-white/60 text-sm">
                    <span>Quantidade: {orc.quantidade}</span>
                    <span>Prazo: {orc.dataLimite}</span>
                    <span>{orc.cotacoes.length} cotações recebidas</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all">
                  <RefreshCw className="w-4 h-4" />
                  Atualizar
                </button>
              </div>

              {/* Cotações */}
              <div className="space-y-3">
                {orc.cotacoes.map((cotacao, index) => {
                  const isMelhor = cotacao.valorTotal === melhorCotacao.valorTotal;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border transition-all ${
                        isMelhor
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-white">{cotacao.fornecedor}</h4>
                            {isMelhor && (
                              <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
                                Melhor Oferta
                              </span>
                            )}
                            <div className="flex items-center gap-1 text-yellow-400">
                              <span className="text-sm">★</span>
                              <span className="text-sm">{cotacao.avaliacao}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <p className="text-white/60 text-sm mb-1">Valor Unitário</p>
                              <p className="text-white">
                                R$ {cotacao.valorUnitario.toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <div>
                              <p className="text-white/60 text-sm mb-1">Valor Total</p>
                              <p className="text-white text-xl">
                                R$ {cotacao.valorTotal.toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <div>
                              <p className="text-white/60 text-sm mb-1">Prazo</p>
                              <p className="text-white">{cotacao.prazoEntrega}</p>
                            </div>
                            <div>
                              <p className="text-white/60 text-sm mb-1">Condições</p>
                              <p className="text-white">{cotacao.condicoes}</p>
                            </div>
                          </div>
                        </div>
                        {orc.status === 'em_analise' && (
                          <div className="flex gap-2 ml-4">
                            <button className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
                              Aprovar
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                              Rejeitar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comparison */}
              {orc.cotacoes.length > 1 && (
                <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-blue-400 text-sm mb-1">Melhor Preço</p>
                      <p className="text-white text-xl">
                        R${' '}
                        {Math.min(...orc.cotacoes.map((c) => c.valorTotal)).toLocaleString(
                          'pt-BR'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-400 text-sm mb-1">Preço Médio</p>
                      <p className="text-white text-xl">
                        R${' '}
                        {(
                          orc.cotacoes.reduce((acc, c) => acc + c.valorTotal, 0) /
                          orc.cotacoes.length
                        ).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-400 text-sm mb-1">Economia Potencial</p>
                      <p className="text-white text-xl">
                        R${' '}
                        {(
                          Math.max(...orc.cotacoes.map((c) => c.valorTotal)) -
                          Math.min(...orc.cotacoes.map((c) => c.valorTotal))
                        ).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-2xl p-8 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10">
            <h2 className="text-2xl text-white mb-6">Novo Orçamento</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white/60 text-sm mb-2">Requisição</label>
                <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
                  <option value="">Selecione uma requisição</option>
                  <option value="REQ-1234">REQ-1234 - Notebooks Dell i7</option>
                  <option value="REQ-1237">REQ-1237 - Serviço de Limpeza</option>
                </select>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Fornecedores</label>
                <div className="space-y-2">
                  {['TechSupply Ltda', 'InfoTech Distribuidora', 'Mega Tecnologia'].map(
                    (fornecedor) => (
                      <label
                        key={fornecedor}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10"
                      >
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-white">{fornecedor}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Data Limite</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Solicitar Cotações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
