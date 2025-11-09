import { X, Mail, Phone, MapPin, Star, Package, TrendingDown, DollarSign } from 'lucide-react';

interface FornecedorDetailsModalProps {
  fornecedor: any;
  onClose: () => void;
}

export function FornecedorDetailsModal({ fornecedor, onClose }: FornecedorDetailsModalProps) {
  if (!fornecedor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{fornecedor.nome.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-2xl text-white font-bold">{fornecedor.nome}</h2>
              <p className="text-white/60">{fornecedor.categoria}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm ${
            fornecedor.status === 'Ativo'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {fornecedor.status}
          </span>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-purple-400" />
              <span className="text-white/60 text-sm">Email</span>
            </div>
            <p className="text-white">{fornecedor.email}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-5 h-5 text-purple-400" />
              <span className="text-white/60 text-sm">Telefone</span>
            </div>
            <p className="text-white">{fornecedor.telefone}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span className="text-white/60 text-sm">Localização</span>
            </div>
            <p className="text-white">{fornecedor.endereco}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-white/60 text-sm">CNPJ</span>
            </div>
            <p className="text-white">{fornecedor.cnpj}</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-6 h-6 text-purple-400" />
              <span className="text-white/60 text-sm">Total de Pedidos</span>
            </div>
            <p className="text-white text-3xl font-bold">{fornecedor.totalPedidos}</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6 text-green-400" />
              <span className="text-white/60 text-sm">Avaliação</span>
            </div>
            <p className="text-white text-3xl font-bold">{fornecedor.avaliacao}/5.0</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-blue-400" />
              <span className="text-white/60 text-sm">Valor Médio</span>
            </div>
            <p className="text-white text-3xl font-bold">R$ {(Math.random() * 50000 + 10000).toFixed(0)}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 mb-6">
          <h3 className="text-white text-lg mb-4">Avaliação Detalhada</h3>
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= fornecedor.avaliacao
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-white/20'
                }`}
              />
            ))}
            <span className="text-white ml-2">{fornecedor.avaliacao} de 5</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-white/60 text-sm mb-1">Qualidade dos Produtos</p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  style={{ width: `${(fornecedor.avaliacao / 5) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Pontualidade</p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                  style={{ width: `${((fornecedor.avaliacao - 0.2) / 5) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Atendimento</p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                  style={{ width: `${((fornecedor.avaliacao + 0.1) / 5) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Custo-Benefício</p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                  style={{ width: `${((fornecedor.avaliacao - 0.3) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-white text-lg mb-4">Histórico Recente</h3>
          <div className="space-y-3">
            {[
              { date: '15/11/2025', action: 'Pedido entregue', value: 'R$ 12.450,00', status: 'success' },
              { date: '10/11/2025', action: 'Negociação concluída', value: 'R$ 8.320,00', status: 'info' },
              { date: '05/11/2025', action: 'Pedido em andamento', value: 'R$ 15.680,00', status: 'warning' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === 'success' ? 'bg-green-400' :
                    item.status === 'info' ? 'bg-blue-400' : 'bg-yellow-400'
                  }`} />
                  <div>
                    <p className="text-white text-sm">{item.action}</p>
                    <p className="text-white/60 text-xs">{item.date}</p>
                  </div>
                </div>
                <span className="text-white font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

