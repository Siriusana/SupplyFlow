import { useState, useEffect } from 'react';
import { MessageSquare, Calendar, TrendingDown, CheckCircle, Clock, User, Loader2 } from 'lucide-react';
import { negociacoesAPI } from '../services/api';

export function Negociacoes() {
  const [negociacoes, setNegociacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNegociacoes();
  }, []);

  const loadNegociacoes = async () => {
    try {
      setLoading(true);
      const response = await negociacoesAPI.getAll();
      setNegociacoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar negociações:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: any = {
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
    return configs[status] || configs.em_andamento;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calcularEconomia = (valorInicial: number, valorNegociado: number) => {
    const economia = valorInicial - valorNegociado;
    const percentual = ((economia / valorInicial) * 100).toFixed(0);
    return `${percentual}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const economiaTotal = negociacoes.reduce((acc, neg) => {
    return acc + (neg.valorInicial - neg.valorNegociado);
  }, 0);

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
            value: formatCurrency(economiaTotal),
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
      {negociacoes.length > 0 ? (
        <div className="space-y-6">
          {negociacoes.map((neg) => {
            const statusConfig = getStatusConfig(neg.status);
            const StatusIcon = statusConfig.icon;
            const desconto = calcularEconomia(neg.valorInicial, neg.valorNegociado);

            return (
              <div
                key={neg.id}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white/60 text-sm">{neg.codigo}</span>
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
                        {formatDate(neg.dataInicio)}
                        {neg.dataFim && ` - ${formatDate(neg.dataFim)}`}
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
                    <p className="text-white text-xl">{formatCurrency(neg.valorInicial)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white/60 text-sm mb-1">Valor Negociado</p>
                    <p className="text-white text-xl">{formatCurrency(neg.valorNegociado)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                    <p className="text-green-400 text-sm mb-1">Economia</p>
                    <p className="text-green-400 text-xl">{desconto}</p>
                  </div>
                </div>

                {/* Timeline */}
                {neg.historico && neg.historico.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-white/60" />
                      <h4 className="text-white">Histórico de Negociação</h4>
                    </div>
                    <div className="space-y-3">
                      {neg.historico.map((item: any, index: number) => (
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
                                <p className="text-white/60 text-sm">{formatDate(item.data)}</p>
                              </div>
                              <div className="text-white text-xl">{formatCurrency(item.valor)}</div>
                            </div>
                            <p className="text-white/60">{item.mensagem}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-white/60 py-12">
          Nenhuma negociação encontrada
        </div>
      )}
    </div>
  );
}
