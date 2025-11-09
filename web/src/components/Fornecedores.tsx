import { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Phone, Mail, Star, Edit, Trash2, Building, Loader2, Download } from 'lucide-react';
import { fornecedoresAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FornecedorDetailsModal } from './FornecedorDetailsModal';
import { exportFornecedoresToExcel, exportFornecedoresToPDF } from '../utils/exportUtils';

export function Fornecedores() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentFornecedor, setCurrentFornecedor] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState<any>(null);

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    avaliacao: 0,
    status: 'Ativo',
    totalPedidos: 0,
  });

  useEffect(() => {
    loadFornecedores();
  }, []);

  const loadFornecedores = async () => {
    try {
      setLoading(true);
      const response = await fornecedoresAPI.getAll();
      setFornecedores(response.data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!isAdmin && !isEditing) {
      toast.error('Apenas administradores podem criar novos fornecedores');
      return;
    }

    try {
      if (isEditing && currentFornecedor) {
        await fornecedoresAPI.update(currentFornecedor.id, formData);
        toast.success('Fornecedor atualizado com sucesso!');
      } else {
        await fornecedoresAPI.create(formData);
        toast.success('Fornecedor criado com sucesso!');
      }
      
      setShowModal(false);
      setIsEditing(false);
      setCurrentFornecedor(null);
      setFormData({
        nome: '',
        categoria: '',
        cnpj: '',
        email: '',
        telefone: '',
        endereco: '',
        avaliacao: 0,
        status: 'Ativo',
        totalPedidos: 0,
      });
      loadFornecedores();
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      toast.error('Erro ao salvar fornecedor');
    }
  };

  const handleEdit = (fornecedor: any) => {
    setIsEditing(true);
    setCurrentFornecedor(fornecedor);
    setFormData({
      nome: fornecedor.nome,
      categoria: fornecedor.categoria,
      cnpj: fornecedor.cnpj,
      email: fornecedor.email,
      telefone: fornecedor.telefone,
      endereco: fornecedor.endereco,
      avaliacao: fornecedor.avaliacao,
      status: fornecedor.status,
      totalPedidos: fornecedor.totalPedidos,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      toast.error('Apenas administradores podem excluir fornecedores');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await fornecedoresAPI.delete(id);
        toast.success('Fornecedor excluído com sucesso!');
        loadFornecedores();
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error);
        toast.error('Erro ao excluir fornecedor');
      }
    }
  };

  const filteredFornecedores = fornecedores.filter((f) => {
    const matchesSearch = f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = !filterCategoria || f.categoria === filterCategoria;
    const matchesStatus = !filterStatus || f.status === filterStatus;
    return matchesSearch && matchesCategoria && matchesStatus;
  });

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
          <h1 className="text-3xl text-white mb-2">Fornecedores</h1>
          <p className="text-white/60">Gestão centralizada de fornecedores</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                if (!fornecedores || fornecedores.length === 0) {
                  toast.error('Nenhum fornecedor para exportar');
                  return;
                }
                exportFornecedoresToExcel(fornecedores);
                toast.success('Exportado para Excel com sucesso!');
              } catch (error: any) {
                console.error('Erro ao exportar para Excel:', error);
                toast.error(error?.message || 'Erro ao exportar para Excel');
              }
            }}
            disabled={!fornecedores || fornecedores.length === 0}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Excel
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                if (!fornecedores || fornecedores.length === 0) {
                  toast.error('Nenhum fornecedor para exportar');
                  return;
                }
                exportFornecedoresToPDF(fornecedores);
                toast.success('Exportado para PDF com sucesso!');
              } catch (error: any) {
                console.error('Erro ao exportar para PDF:', error);
                toast.error(error?.message || 'Erro ao exportar para PDF');
              }
            }}
            disabled={!fornecedores || fornecedores.length === 0}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            PDF
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentFornecedor(null);
                setFormData({
                  nome: '',
                  categoria: '',
                  cnpj: '',
                  email: '',
                  telefone: '',
                  endereco: '',
                  avaliacao: 0,
                  status: 'Ativo',
                  totalPedidos: 0,
                });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Novo Fornecedor
            </button>
          )}
        </div>
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
          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
          >
            <option value="">Todas Categorias</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Materiais de Escritório">Materiais</option>
            <option value="Equipamentos">Equipamentos</option>
            <option value="Serviços">Serviços</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
          >
            <option value="">Todos Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
      </div>

      {/* Suppliers Grid */}
      {filteredFornecedores.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
          {filteredFornecedores.map((fornecedor) => (
            <div
              key={fornecedor.id}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setSelectedFornecedor(fornecedor);
                setShowDetailsModal(true);
              }}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(fornecedor);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(fornecedor.id);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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
      ) : (
        <div className="text-center text-white/60 py-12">
          Nenhum fornecedor encontrado
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-2xl p-8 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10">
            <h2 className="text-2xl text-white mb-6">
              {isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-white/60 text-sm mb-2">Nome da Empresa</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="Digite o nome"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">CNPJ</label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="00.000.000/0001-00"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="email@empresa.com"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Telefone</label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Categoria</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="">Selecione</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Materiais de Escritório">Materiais</option>
                  <option value="Equipamentos">Equipamentos</option>
                  <option value="Serviços">Serviços</option>
                </select>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Cidade/Estado</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
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
                onClick={handleCreateOrUpdate}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedFornecedor && (
        <FornecedorDetailsModal
          fornecedor={selectedFornecedor}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedFornecedor(null);
          }}
        />
      )}
    </div>
  );
}
