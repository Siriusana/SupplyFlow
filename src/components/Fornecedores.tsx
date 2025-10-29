import { useState } from 'react';
import { Search, Plus, MapPin, Phone, Mail, Star, Edit, Trash2, Building } from 'lucide-react';

export function Fornecedores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fornecedores = [
    {
      id: 1,
      nome: 'TechSupply Ltda',
      categoria: 'Tecnologia',
      cnpj: '12.345.678/0001-90',
      email: 'contato@techsupply.com',
      telefone: '(11) 98765-4321',
      endereco: 'São Paulo, SP',
      avaliacao: 4.8,
      status: 'Ativo',
      totalPedidos: 45,
    },
    {
      id: 2,
      nome: 'Materiais Premium',
      categoria: 'Materiais de Escritório',
      cnpj: '98.765.432/0001-10',
      email: 'vendas@materiaisp.com',
      telefone: '(11) 91234-5678',
      endereco: 'Rio de Janeiro, RJ',
      avaliacao: 4.5,
      status: 'Ativo',
      totalPedidos: 78,
    },
    {
      id: 3,
      nome: 'Equipamentos Industriais',
      categoria: 'Equipamentos',
      cnpj: '11.222.333/0001-44',
      email: 'comercial@equip.com',
      telefone: '(21) 97654-3210',
      endereco: 'Belo Horizonte, MG',
      avaliacao: 4.9,
      status: 'Ativo',
      totalPedidos: 32,
    },
    {
      id: 4,
      nome: 'Serviços Gerais Pro',
      categoria: 'Serviços',
      cnpj: '55.666.777/0001-88',
      email: 'atendimento@servpro.com',
      telefone: '(31) 99888-7766',
      endereco: 'Curitiba, PR',
      avaliacao: 4.2,
      status: 'Inativo',
      totalPedidos: 21,
    },
  ];

  const filteredFornecedores = fornecedores.filter(
    (f) =>
      f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-white mb-2">Fornecedores</h1>
          <p className="text-white/60">Gestão centralizada de fornecedores</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Novo Fornecedor
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Buscar por nome ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <select className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
            <option value="">Todas Categorias</option>
            <option value="tecnologia">Tecnologia</option>
            <option value="materiais">Materiais</option>
            <option value="equipamentos">Equipamentos</option>
            <option value="servicos">Serviços</option>
          </select>
          <select className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
            <option value="">Todos Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredFornecedores.map((fornecedor) => (
          <div
            key={fornecedor.id}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white">{fornecedor.nome}</h3>
                  <p className="text-white/60 text-sm">{fornecedor.categoria}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4" />
                {fornecedor.email}
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4" />
                {fornecedor.telefone}
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4" />
                {fornecedor.endereco}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white">{fornecedor.avaliacao}</span>
              </div>
              <div className="text-white/60 text-sm">{fornecedor.totalPedidos} pedidos</div>
              <div
                className={`px-3 py-1 rounded-full text-xs ${
                  fornecedor.status === 'Ativo'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {fornecedor.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-2xl p-8 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10">
            <h2 className="text-2xl text-white mb-6">Novo Fornecedor</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-white/60 text-sm mb-2">Nome da Empresa</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="Digite o nome"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">CNPJ</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="00.000.000/0001-00"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="email@empresa.com"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Telefone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Categoria</label>
                <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
                  <option value="">Selecione</option>
                  <option value="tecnologia">Tecnologia</option>
                  <option value="materiais">Materiais</option>
                  <option value="equipamentos">Equipamentos</option>
                  <option value="servicos">Serviços</option>
                </select>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Cidade/Estado</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="São Paulo, SP"
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
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
