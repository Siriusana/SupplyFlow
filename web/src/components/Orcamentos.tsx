import { useState, useEffect } from 'react';
import { Calculator, Users, Clock, CheckCircle, XCircle, Plus, RefreshCw, Loader2 } from 'lucide-react';
import { orcamentosAPI, requisicoesAPI, fornecedoresAPI } from '../services/api';

export function Orcamentos() {
  const [showModal, setShowModal] = useState(false);
  const [orcamentos, setOrcamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requisicoes, setRequisicoes] = useState<any[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    requisicaoCodigo: '',
    fornecedoresSelecionados: [] as string[],
    dataLimite: '',
  });

  useEffect(() => {
    loadOrcamentos();
    loadRequisicoes();
    loadFornecedores();
  }, []);

  const loadOrcamentos = async () => {
    try {
      setLoading(true);
      const response = await orcamentosAPI.getAll();
      setOrcamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRequisicoes = async () => {
    try {
      const response = await requisicoesAPI.getAll();
      setRequisicoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar requisições:', error);
    }
  };

  const loadFornecedores = async () => {
    try {
      const response = await fornecedoresAPI.getAll();
      setFornecedores(response.data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: any = {
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
    return configs[status] || configs.em_analise;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const totalFornecedoresConsultados = orcamentos.reduce((acc, orc) => {
    return acc + (orc.cotacoes?.length || 0);
  }, 0);

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
            value: totalFornecedoresConsultados,
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
      {orcamentos.length > 0 ? (
        <div className="space-y-6">
          {orcamentos.map((orc) => {
            const statusConfig = getStatusConfig(orc.status);
            const StatusIcon = statusConfig.icon;
            const cotacoes = orc.cotacoes || [];
            const melhorCotacao = cotacoes.length > 0
              ? cotacoes.reduce((prev: any, current: any) =>
                  prev.valorTotal < current.valorTotal ? prev : current
                )
              : null;

            return (
              <div
                key={orc.id}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white/60 text-sm">{orc.codigo}</span>
                      <span className="text-white/40 text-sm">•</span>
                      <span className="text-white/60 text-sm">Req: {orc.requisicaoCodigo}</span>
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
                      <span>Prazo: {formatDate(orc.dataLimite)}</span>
                      <span>{cotacoes.length} cotações recebidas</span>
                    </div>
                  </div>
                  <button
                    onClick={loadOrcamentos}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Atualizar
                  </button>
                </div>

                {/* Cotações */}
                {cotacoes.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {cotacoes.map((cotacao: any, index: number) => {
                        const isMelhor = melhorCotacao && cotacao.valorTotal === melhorCotacao.valorTotal;

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
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Comparison */}
                    {cotacoes.length > 1 && (
                      <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-blue-400 text-sm mb-1">Melhor Preço</p>
                            <p className="text-white text-xl">
                              R${' '}
                              {Math.min(...cotacoes.map((c: any) => c.valorTotal)).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-400 text-sm mb-1">Preço Médio</p>
                            <p className="text-white text-xl">
                              R${' '}
                              {(
                                cotacoes.reduce((acc: number, c: any) => acc + c.valorTotal, 0) /
                                cotacoes.length
                              ).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-400 text-sm mb-1">Economia Potencial</p>
                            <p className="text-white text-xl">
                              R${' '}
                              {(
                                Math.max(...cotacoes.map((c: any) => c.valorTotal)) -
                                Math.min(...cotacoes.map((c: any) => c.valorTotal))
                              ).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-white/60 py-8">
                    Nenhuma cotação recebida ainda
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-white/60 py-12">
          Nenhum orçamento encontrado
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-2xl p-8 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10">
            <h2 className="text-2xl text-white mb-6">Novo Orçamento</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white/60 text-sm mb-2">Requisição</label>
                <select
                  value={formData.requisicaoCodigo}
                  onChange={(e) => setFormData({ ...formData, requisicaoCodigo: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="">Selecione uma requisição</option>
                  {requisicoes.map((req) => (
                    <option key={req.id} value={req.codigo}>
                      {req.codigo} - {req.titulo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Fornecedores</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {fornecedores.map((fornecedor) => (
                    <label
                      key={fornecedor.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10"
                    >
                      <input
                        type="checkbox"
                        checked={formData.fornecedoresSelecionados.includes(fornecedor.nome)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              fornecedoresSelecionados: [...formData.fornecedoresSelecionados, fornecedor.nome],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              fornecedoresSelecionados: formData.fornecedoresSelecionados.filter(
                                (f) => f !== fornecedor.nome
                              ),
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-white">{fornecedor.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Data Limite</label>
                <input
                  type="date"
                  value={formData.dataLimite}
                  onChange={(e) => setFormData({ ...formData, dataLimite: e.target.value })}
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
                onClick={() => {
                  // TODO: Implementar criação de orçamento
                  setShowModal(false);
                }}
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
