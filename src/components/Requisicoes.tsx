import { useState } from 'react';
import { Plus, Search, Clock, CheckCircle, XCircle, AlertCircle, User } from 'lucide-react';

export function Requisicoes() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const requisicoes = [
    {
      id: 'REQ-1234',
      titulo: 'Notebooks Dell i7',
      solicitante: 'João Silva',
      departamento: 'TI',
      categoria: 'Equipamentos',
      valor: 'R$ 45.000,00',
      data: '2025-10-28',
      status: 'pendente',
      prioridade: 'alta',
      descricao: '10 notebooks Dell i7, 16GB RAM, 512GB SSD',
    },
    {
      id: 'REQ-1235',
      titulo: 'Materiais de Escritório',
      solicitante: 'Maria Santos',
      departamento: 'Administrativo',
      categoria: 'Materiais',
      valor: 'R$ 2.500,00',
      data: '2025-10-27',
      status: 'aprovada',
      prioridade: 'media',
      descricao: 'Papéis, canetas, pastas e organizadores',
    },
    {
      id: 'REQ-1236',
      titulo: 'Licenças Microsoft 365',
      solicitante: 'Carlos Mendes',
      departamento: 'TI',
      categoria: 'Software',
      valor: 'R$ 12.000,00',
      data: '2025-10-26',
      status: 'rejeitada',
      prioridade: 'baixa',
      descricao: '50 licenças anuais Microsoft 365',
    },
    {
      id: 'REQ-1237',
      titulo: 'Serviço de Limpeza',
      solicitante: 'Ana Paula',
      departamento: 'Facilities',
      categoria: 'Serviços',
      valor: 'R$ 8.000,00',
      data: '2025-10-28',
      status: 'em_analise',
      prioridade: 'alta',
      descricao: 'Contrato trimestral de limpeza',
    },
    {
      id: 'REQ-1238',
      titulo: 'Manutenção Ar Condicionado',
      solicitante: 'Roberto Lima',
      departamento: 'Facilities',
      categoria: 'Serviços',
      valor: 'R$ 3.200,00',
      data: '2025-10-25',
      status: 'aprovada',
      prioridade: 'media',
      descricao: 'Manutenção preventiva de 15 unidades',
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      pendente: {
        label: 'Pendente',
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: Clock,
      },
      aprovada: {
        label: 'Aprovada',
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: CheckCircle,
      },
      rejeitada: {
        label: 'Rejeitada',
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: XCircle,
      },
      em_analise: {
        label: 'Em Análise',
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: AlertCircle,
      },
    };
    return configs[status as keyof typeof configs];
  };

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      alta: 'bg-red-500',
      media: 'bg-yellow-500',
      baixa: 'bg-green-500',
    };
    return colors[prioridade as keyof typeof colors];
  };

  const filteredRequisicoes =
    filterStatus === 'all'
      ? requisicoes
      : requisicoes.filter((r) => r.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-white mb-2">Requisições</h1>
          <p className="text-white/60">Aprovações automatizadas e fluxo de trabalho</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Nova Requisição
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: requisicoes.length, color: 'from-blue-500 to-cyan-500' },
          {
            label: 'Pendentes',
            value: requisicoes.filter((r) => r.status === 'pendente').length,
            color: 'from-yellow-500 to-orange-500',
          },
          {
            label: 'Aprovadas',
            value: requisicoes.filter((r) => r.status === 'aprovada').length,
            color: 'from-green-500 to-emerald-500',
          },
          {
            label: 'Em Análise',
            value: requisicoes.filter((r) => r.status === 'em_analise').length,
            color: 'from-purple-500 to-pink-500',
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}
            >
              <span className="text-white text-xl">{stat.value}</span>
            </div>
            <p className="text-white/60 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <Search className="w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder="Buscar requisições..."
          className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
        />
        <div className="flex gap-2">
          {['all', 'pendente', 'em_analise', 'aprovada', 'rejeitada'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === status
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {status === 'all' ? 'Todas' : getStatusConfig(status).label}
            </button>
          ))}
        </div>
      </div>

      {/* Requisitions List */}
      <div className="space-y-4">
        {filteredRequisicoes.map((req) => {
          const statusConfig = getStatusConfig(req.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={req.id}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white/60 text-sm">{req.id}</span>
                    <div
                      className={`w-2 h-2 rounded-full ${getPrioridadeColor(req.prioridade)}`}
                    />
                    <span className="text-white/40 text-sm">
                      Prioridade {req.prioridade}
                    </span>
                  </div>
                  <h3 className="text-white text-xl mb-2">{req.titulo}</h3>
                  <p className="text-white/60 text-sm mb-3">{req.descricao}</p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-white/40" />
                      <span className="text-white/60 text-sm">{req.solicitante}</span>
                    </div>
                    <div className="text-white/60 text-sm">{req.departamento}</div>
                    <div className="text-white/60 text-sm">{req.categoria}</div>
                    <div className="text-white/60 text-sm">{req.data}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-right">
                    <p className="text-white/60 text-sm mb-1">Valor Estimado</p>
                    <p className="text-white text-xl">{req.valor}</p>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${statusConfig.color}`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    <span>{statusConfig.label}</span>
                  </div>
                </div>
              </div>
              {req.status === 'pendente' && (
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button className="flex-1 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
                    Aprovar
                  </button>
                  <button className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                    Rejeitar
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition-colors">
                    Detalhes
                  </button>
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
            <h2 className="text-2xl text-white mb-6">Nova Requisição</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white/60 text-sm mb-2">Título</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="Descreva brevemente o que precisa"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Categoria</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="">Selecione</option>
                    <option value="materiais">Materiais</option>
                    <option value="equipamentos">Equipamentos</option>
                    <option value="servicos">Serviços</option>
                    <option value="software">Software</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Prioridade</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Descrição</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="Descreva os detalhes da requisição"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Valor Estimado</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="R$ 0,00"
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
                Criar Requisição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
