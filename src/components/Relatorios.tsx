import { BarChart3, Download, TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Relatorios() {
  const gastosMensais = [
    { mes: 'Jan', valor: 120000, meta: 150000 },
    { mes: 'Fev', valor: 150000, meta: 150000 },
    { mes: 'Mar', valor: 180000, meta: 150000 },
    { mes: 'Abr', valor: 220000, meta: 200000 },
    { mes: 'Mai', valor: 200000, meta: 200000 },
    { mes: 'Jun', valor: 240000, meta: 200000 },
    { mes: 'Jul', valor: 210000, meta: 200000 },
    { mes: 'Ago', valor: 190000, meta: 200000 },
    { mes: 'Set', valor: 230000, meta: 200000 },
    { mes: 'Out', valor: 250000, meta: 220000 },
  ];

  const gastosPorCategoria = [
    { categoria: 'Tecnologia', valor: 450000 },
    { categoria: 'Materiais', valor: 280000 },
    { categoria: 'Serviços', valor: 320000 },
    { categoria: 'Equipamentos', valor: 180000 },
    { categoria: 'Software', valor: 150000 },
  ];

  const distribuicaoFornecedores = [
    { name: 'Top 5 Fornecedores', value: 65 },
    { name: 'Outros', value: 35 },
  ];

  const pieColors = ['#8b5cf6', '#3b82f6'];

  const topFornecedores = [
    { nome: 'TechSupply Ltda', total: 'R$ 345.000', pedidos: 45, economia: '12%' },
    { nome: 'Materiais Premium', total: 'R$ 280.000', pedidos: 78, economia: '8%' },
    { nome: 'Equipamentos Industriais', total: 'R$ 195.000', pedidos: 32, economia: '15%' },
    { nome: 'Serviços Gerais Pro', total: 'R$ 156.000', pedidos: 21, economia: '10%' },
    { nome: 'Office Supplies Inc', total: 'R$ 124.000', pedidos: 56, economia: '6%' },
  ];

  const indicadores = [
    {
      titulo: 'Economia Total',
      valor: 'R$ 125.000',
      percentual: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
    },
    {
      titulo: 'Gastos do Mês',
      valor: 'R$ 250.000',
      percentual: '+14%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      titulo: 'Total de Pedidos',
      valor: '234',
      percentual: '+8%',
      trend: 'up',
      icon: Package,
      color: 'from-purple-500 to-pink-500',
    },
    {
      titulo: 'Fornecedores Ativos',
      valor: '156',
      percentual: '-2%',
      trend: 'down',
      icon: Users,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-white mb-2">Relatórios & Indicadores</h1>
          <p className="text-white/60">Suporte à decisão estratégica</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 transition-all">
            <Download className="w-5 h-5" />
            Exportar PDF
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
            <Download className="w-5 h-5" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-6">
        {indicadores.map((ind, index) => {
          const Icon = ind.icon;
          const TrendIcon = ind.trend === 'up' ? TrendingUp : TrendingDown;

          return (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ind.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    ind.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm">{ind.percentual}</span>
                </div>
              </div>
              <p className="text-white/60 text-sm mb-1">{ind.titulo}</p>
              <p className="text-white text-2xl">{ind.valor}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Gastos Mensais */}
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white">Gastos Mensais vs Meta</h3>
            <select className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none">
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gastosMensais}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="mes" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #ffffff20',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#8b5cf6"
                strokeWidth={3}
                name="Gasto Real"
              />
              <Line
                type="monotone"
                dataKey="meta"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Meta"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gastos por Categoria */}
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <h3 className="text-white mb-6">Gastos por Categoria (Anual)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gastosPorCategoria}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="categoria" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #ffffff20',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="valor" fill="url(#barGradient2)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Distribuição Fornecedores */}
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <h3 className="text-white mb-4">Concentração de Fornecedores</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={distribuicaoFornecedores}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {distribuicaoFornecedores.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #ffffff20',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {distribuicaoFornecedores.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: pieColors[index] }}
                />
                <span className="text-white/60 text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Fornecedores */}
        <div className="col-span-2 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <h3 className="text-white mb-4">Top 5 Fornecedores</h3>
          <div className="space-y-3">
            {topFornecedores.map((fornecedor, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white">{fornecedor.nome}</p>
                  <p className="text-white/60 text-sm">{fornecedor.pedidos} pedidos</p>
                </div>
                <div className="text-right">
                  <p className="text-white">{fornecedor.total}</p>
                  <p className="text-green-400 text-sm">
                    {fornecedor.economia} economia
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumo Executivo */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-3">Resumo Executivo - Outubro 2025</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Gasto no Período</p>
                <p className="text-white text-xl">R$ 1.940.000</p>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Economia Obtida</p>
                <p className="text-green-400 text-xl">R$ 125.000 (6.4%)</p>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Tempo Médio de Aprovação</p>
                <p className="text-white text-xl">2.3 dias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
