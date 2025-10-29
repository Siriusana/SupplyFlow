import { Package, Truck, CheckCircle, Clock, XCircle, MapPin, Calendar } from 'lucide-react';

export function Pedidos() {
  const pedidos = [
    {
      id: 'PED-5001',
      requisicao: 'REQ-1235',
      fornecedor: 'Materiais Premium',
      item: 'Materiais de Escritório',
      quantidade: 1,
      valor: 'R$ 2.500,00',
      dataPedido: '2025-10-27',
      dataEntrega: '2025-11-10',
      status: 'entregue',
      rastreio: 'BR123456789',
      endereco: 'Rua das Flores, 123 - São Paulo, SP',
      historico: [
        { data: '2025-10-27', status: 'Pedido Realizado', descricao: 'Pedido confirmado' },
        { data: '2025-10-28', status: 'Em Separação', descricao: 'Produtos sendo separados' },
        { data: '2025-10-29', status: 'Enviado', descricao: 'Pedido enviado para transporte' },
        { data: '2025-11-10', status: 'Entregue', descricao: 'Pedido entregue com sucesso' },
      ],
    },
    {
      id: 'PED-5002',
      requisicao: 'REQ-1238',
      fornecedor: 'TechMaintenance Pro',
      item: 'Manutenção Ar Condicionado',
      quantidade: 1,
      valor: 'R$ 3.200,00',
      dataPedido: '2025-10-25',
      dataEntrega: '2025-11-15',
      status: 'em_transito',
      rastreio: 'BR987654321',
      endereco: 'Av. Paulista, 1000 - São Paulo, SP',
      historico: [
        { data: '2025-10-25', status: 'Pedido Realizado', descricao: 'Pedido confirmado' },
        { data: '2025-10-26', status: 'Em Separação', descricao: 'Peças sendo preparadas' },
        { data: '2025-10-28', status: 'Enviado', descricao: 'Em rota de entrega' },
      ],
    },
    {
      id: 'PED-5003',
      requisicao: 'REQ-1234',
      fornecedor: 'TechSupply Ltda',
      item: 'Notebooks Dell i7',
      quantidade: 10,
      valor: 'R$ 45.000,00',
      dataPedido: '2025-10-28',
      dataEntrega: '2025-11-12',
      status: 'processando',
      rastreio: '-',
      endereco: 'Rua Tecnologia, 500 - São Paulo, SP',
      historico: [
        {
          data: '2025-10-28',
          status: 'Pedido Realizado',
          descricao: 'Aguardando confirmação do fornecedor',
        },
      ],
    },
    {
      id: 'PED-5004',
      requisicao: 'REQ-1240',
      fornecedor: 'Office Supplies Inc',
      item: 'Cadeiras Ergonômicas',
      quantidade: 15,
      valor: 'R$ 18.000,00',
      dataPedido: '2025-10-20',
      dataEntrega: '2025-10-28',
      status: 'cancelado',
      rastreio: '-',
      endereco: 'Rua do Comércio, 200 - Rio de Janeiro, RJ',
      historico: [
        { data: '2025-10-20', status: 'Pedido Realizado', descricao: 'Pedido confirmado' },
        { data: '2025-10-22', status: 'Cancelado', descricao: 'Produto indisponível' },
      ],
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      processando: {
        label: 'Processando',
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: Clock,
      },
      em_transito: {
        label: 'Em Trânsito',
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        icon: Truck,
      },
      entregue: {
        label: 'Entregue',
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: CheckCircle,
      },
      cancelado: {
        label: 'Cancelado',
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
          <h1 className="text-3xl text-white mb-2">Pedidos</h1>
          <p className="text-white/60">Acompanhamento do histórico de pedidos</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Total de Pedidos',
            value: pedidos.length,
            icon: Package,
            color: 'from-purple-500 to-pink-500',
          },
          {
            label: 'Em Processamento',
            value: pedidos.filter((p) => p.status === 'processando').length,
            icon: Clock,
            color: 'from-blue-500 to-cyan-500',
          },
          {
            label: 'Em Trânsito',
            value: pedidos.filter((p) => p.status === 'em_transito').length,
            icon: Truck,
            color: 'from-purple-500 to-pink-500',
          },
          {
            label: 'Entregues',
            value: pedidos.filter((p) => p.status === 'entregue').length,
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-500',
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

      {/* Pedidos List */}
      <div className="space-y-6">
        {pedidos.map((pedido) => {
          const statusConfig = getStatusConfig(pedido.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={pedido.id}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white/60 text-sm">{pedido.id}</span>
                    <span className="text-white/40 text-sm">•</span>
                    <span className="text-white/60 text-sm">Req: {pedido.requisicao}</span>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm">{statusConfig.label}</span>
                    </div>
                  </div>
                  <h3 className="text-white text-xl mb-2">{pedido.item}</h3>
                  <p className="text-white/60 text-sm mb-3">{pedido.fornecedor}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm mb-1">Valor Total</p>
                  <p className="text-white text-2xl">{pedido.valor}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-white/60" />
                    <p className="text-white/60 text-sm">Datas</p>
                  </div>
                  <p className="text-white">Pedido: {pedido.dataPedido}</p>
                  <p className="text-white">Entrega: {pedido.dataEntrega}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-white/60" />
                    <p className="text-white/60 text-sm">Endereço de Entrega</p>
                  </div>
                  <p className="text-white">{pedido.endereco}</p>
                </div>
              </div>

              {/* Tracking */}
              {pedido.rastreio !== '-' && (
                <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <p className="text-blue-400 text-sm mb-1">Código de Rastreio</p>
                      <p className="text-white">{pedido.rastreio}</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                      Rastrear
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="text-white mb-4">Histórico do Pedido</h4>
                <div className="space-y-3">
                  {pedido.historico.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index === pedido.historico.length - 1
                              ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                              : 'bg-white/10'
                          }`}
                        >
                          <div className="w-3 h-3 rounded-full bg-white" />
                        </div>
                        {index < pedido.historico.length - 1 && (
                          <div className="w-0.5 flex-1 bg-white/10 min-h-[40px]" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white">{item.status}</p>
                          <span className="text-white/60 text-sm">{item.data}</span>
                        </div>
                        <p className="text-white/60 text-sm">{item.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
