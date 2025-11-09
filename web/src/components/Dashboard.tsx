import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  FileText,
  Clock,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardAPI } from '../services/api';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [lineChartData, setLineChartData] = useState<any[]>([]);
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const pieColors = ['#10b981', '#f59e0b', '#ef4444'];

  const iconMap: { [key: string]: any } = {
    FileText,
    Users,
    ShoppingCart,
    DollarSign,
  };

  const activityIconMap: { [key: string]: any } = {
    aprovacao: CheckCircle,
    pendente: Clock,
    pedido: ShoppingCart,
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getAll();
      const data = response.data;

      // Stats
      if (data.stats) {
        setStats(data.stats.map((stat: any) => ({
          ...stat,
          icon: iconMap[stat.icon] || FileText,
        })));
      }

      // Monthly expenses
      if (data.monthlyExpenses) {
        setLineChartData(data.monthlyExpenses.map((exp: any) => ({
          name: exp.name,
          valor: exp.valor,
        })));
      }

      // Category expenses
      if (data.categoryExpenses) {
        setBarChartData(data.categoryExpenses.map((exp: any) => ({
          name: exp.name,
          valor: exp.valor,
        })));
      }

      // Requisition status
      if (data.requisitionStatus) {
        setPieChartData(data.requisitionStatus.map((status: any) => ({
          name: status.name,
          value: status.value,
        })));
      }

      // Recent activities
      if (data.recentActivities) {
        setRecentActivities(data.recentActivities.map((activity: any) => ({
          ...activity,
          icon: activityIconMap[activity.type] || CheckCircle,
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-white mb-2">Dashboard</h1>
          <p className="text-white/60">Visão geral da gestão de compras</p>
        </div>
        <div className="px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <p className="text-white/60 text-sm">Última atualização</p>
          <p className="text-white">{new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.length > 0 ? stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm">{stat.change}</span>
                </div>
              </div>
              <h3 className="text-white/60 text-sm mb-1">{stat.title}</h3>
              <p className="text-white text-2xl">{stat.value}</p>
            </div>
          );
        }) : (
          <div className="col-span-4 text-center text-white/60 py-8">
            Nenhum dado disponível
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <h3 className="text-white mb-4">Evolução de Gastos (6 meses)</h3>
          {lineChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #ffffff20',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="url(#colorGradient)"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 6 }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-white/60">
              Nenhum dado disponível
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <h3 className="text-white mb-4">Gastos por Categoria</h3>
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #ffffff20',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="valor" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-white/60">
              Nenhum dado disponível
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <h3 className="text-white mb-4">Status das Requisições</h3>
          {pieChartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
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
              {pieChartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[index] }} />
                  <span className="text-white/60 text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-white/60">
              Nenhum dado disponível
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="col-span-2 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <h3 className="text-white mb-4">Atividades Recentes</h3>
          <div className="space-y-3">
            {recentActivities.length > 0 ? recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <div className={`${activity.color} mt-1`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white">{activity.title}</p>
                    <p className="text-white/60 text-sm">{activity.description}</p>
                  </div>
                  <span className="text-white/40 text-sm">{activity.time}</span>
                </div>
              );
            }) : (
              <div className="text-center text-white/60 py-8">
                Nenhuma atividade recente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
