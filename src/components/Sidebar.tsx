import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Calculator, 
  ShoppingCart, 
  BarChart3,
  Building2
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fornecedores', label: 'Fornecedores', icon: Users },
    { id: 'requisicoes', label: 'Requisições', icon: FileText },
    { id: 'negociacoes', label: 'Negociações', icon: MessageSquare },
    { id: 'orcamentos', label: 'Orçamentos', icon: Calculator },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <aside className="w-72 h-screen border-r border-white/10 backdrop-blur-xl bg-white/5 p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12 px-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-white">SupplyFlow</h1>
          <p className="text-xs text-white/60">Gestão de Compras</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/20 text-white shadow-lg shadow-purple-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
            <div className="flex-1">
              <p className="text-sm text-white">Admin User</p>
              <p className="text-xs text-white/60">admin@supplyflow.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
