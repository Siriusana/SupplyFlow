import { MessageSquare, Calendar, TrendingDown, CheckCircle, Clock, User } from 'lucide-react';

export function Negociacoes() {
  const negociacoes = [
    {
      id: 'NEG-1001',
      fornecedor: 'TechSupply Ltda',
      item: 'Notebooks Dell i7',
      valorInicial: 'R$ 50.000,00',
      valorNegociado: 'R$ 45.000,00',
      desconto: '10%',
      status: 'concluida',
      responsavel: 'João Silva',
      dataInicio: '2025-10-20',
      dataFim: '2025-10-27',
      historico: [
        {
          data: '2025-10-20',
          autor: 'João Silva',
          mensagem: 'Solicitação inicial de 10 notebooks',
          valor: 'R$ 50.000,00',
        },
        {
          data: '2025-10-22',
          autor: 'TechSupply',
          mensagem: 'Proposta com desconto de 5%',
          valor: 'R$ 47.500,00',
        },
        {
          data: '2025-10-25',
          autor: 'João Silva',
          mensagem: 'Contra-proposta solicitando 10% de desconto',
          valor: 'R$ 45.000,00',
        },
        {
          data: '2025-10-27',
          autor: 'TechSupply',
          mensagem: 'Acordo aceito com 10% de desconto',
          valor: 'R$ 45.000,00',
        },
      ],
    },
    {
      id: 'NEG-1002',
      fornecedor: 'Serviços Gerais Pro',
      item: 'Contrato de Limpeza',
      valorInicial: 'R$ 10.000,00',
      valorNegociado: 'R$ 8.500,00',
      desconto: '15%',
      status: 'em_andamento',
      responsavel: 'Ana Paula',
      dataInicio: '2025-10-25',
      dataFim: null,
      historico: [
        {
          data: '2025-10-25',
          autor: 'Ana Paula',
          mensagem: 'Solicitação de orçamento trimestral',
          valor: 'R$ 10.000,00',
        },
        {
          data: '2025-10-27',
          autor: 'Serviços Gerais',
          mensagem: 'Proposta com valor reduzido para contrato anual',
          valor: 'R$ 8.500,00',
        },
      ],
    },
    {
      id: 'NEG-1003',
      fornecedor: 'Materiais Premium',
      item: 'Materiais de Escritório',
      valorInicial: 'R$ 3.000,00',
      valorNegociado: 'R$ 2.500,00',
      desconto: '17%',
      status: 'concluida',
      responsavel: 'Maria Santos',
      dataInicio: '2025-10-15',
      dataFim: '2025-10-18',
      historico: [
        {
          data: '2025-10-15',
          autor: 'Maria Santos',
          mensagem: 'Pedido de materiais diversos',
          valor: 'R$ 3.000,00',
        },
        {
          data: '2025-10-18',
          autor: 'Materiais Premium',
          mensagem: 'Desconto especial por volume',
          valor: 'R$ 2.500,00',
        },
      ],
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      em_andamento: {
        label: 'Em Andamento',
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: Clock,
      },
      concluida: {
        label: 'Concluída',
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: CheckCircle,
      },
    };
    return configs[status as keyof typeof configs];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-white mb-2">Negociações</h1>
          <p className="text-white/60">Registro detalhado e histórico de negociações</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Total de Negociações',
            value: negociacoes.length,
            color: 'from-purple-500 to-pink-500',
          },
          {
            label: 'Em Andamento',
            value: negociacoes.filter((n) => n.status === 'em_andamento').length,
            color: 'from-blue-500 to-cyan-500',
          },
          {
            label: 'Concluídas',
            value: negociacoes.filter((n) => n.status === 'concluida').length,
            color: 'from-green-500 to-emerald-500',
          },
          {
            label: 'Economia Total',
            value: 'R$ 9.5K',
            color: 'from-orange-500 to-red-500',
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}
            >
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <p className="text-white text-2xl mb-1">{stat.value}</p>
            <p className="text-white/60 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Negociações List */}
      <div className="space-y-6">
        {negociacoes.map((neg) => {
          const statusConfig = getStatusConfig(neg.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={neg.id}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white/60 text-sm">{neg.id}</span>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm">{statusConfig.label}</span>
                    </div>
                  </div>
                  <h3 className="text-white text-xl mb-2">{neg.item}</h3>
                  <div className="flex items-center gap-6 text-white/60 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {neg.responsavel}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {neg.dataInicio}
                      {neg.dataFim && ` - ${neg.dataFim}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-3">
                    <p className="text-white/60 text-sm mb-1">Fornecedor</p>
                    <p className="text-white">{neg.fornecedor}</p>
                  </div>
                </div>
              </div>

              {/* Values */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-sm mb-1">Valor Inicial</p>
                  <p className="text-white text-xl">{neg.valorInicial}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-sm mb-1">Valor Negociado</p>
                  <p className="text-white text-xl">{neg.valorNegociado}</p>
                </div>
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <p className="text-green-400 text-sm mb-1">Economia</p>
                  <p className="text-green-400 text-xl">{neg.desconto}</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-white/60" />
                  <h4 className="text-white">Histórico de Negociação</h4>
                </div>
                <div className="space-y-3">
                  {neg.historico.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm">
                          {index + 1}
                        </div>
                        {index < neg.historico.length - 1 && (
                          <div className="w-0.5 h-full bg-white/10 mt-2" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-white">{item.autor}</p>
                            <p className="text-white/60 text-sm">{item.data}</p>
                          </div>
                          <div className="text-white text-xl">{item.valor}</div>
                        </div>
                        <p className="text-white/60">{item.mensagem}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action if ongoing */}
              {neg.status === 'em_andamento' && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                    Adicionar Mensagem
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
