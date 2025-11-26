import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Para dispositivo físico, usar IP da máquina ao invés de localhost
// IMPORTANTE: Altere o IP abaixo para o IP da sua máquina na rede local
// Para descobrir seu IP: Linux/Mac: `ifconfig` ou `ip addr`, Windows: `ipconfig`
// Exemplo: const API_BASE_URL = 'http://192.168.15.115:8080/api';
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.15.115:8080/api'  // Altere para o IP da sua máquina
  : 'https://supplyflow.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        // Navigation will be handled by AuthContext
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (username: string, password: string, email: string) =>
    api.post('/auth/register', { username, password, email }),
};

export const dashboardAPI = {
  getAll: () => api.get('/dashboard/all'),
  getStats: () => api.get('/dashboard/stats'),
  getMonthlyExpenses: () => api.get('/dashboard/monthly-expenses'),
  getCategoryExpenses: () => api.get('/dashboard/category-expenses'),
  getRequisitionStatus: () => api.get('/dashboard/requisition-status'),
  getRecentActivities: () => api.get('/dashboard/recent-activities'),
};

export const fornecedoresAPI = {
  getAll: () => api.get('/fornecedores'),
  getById: (id: number) => api.get(`/fornecedores/${id}`),
  getByStatus: (status: string) => api.get(`/fornecedores/status/${status}`),
  getByCategoria: (categoria: string) => api.get(`/fornecedores/categoria/${categoria}`),
  search: (nome: string) => api.get(`/fornecedores/search?nome=${nome}`),
  create: (data: any) => api.post('/fornecedores', data),
  update: (id: number, data: any) => api.put(`/fornecedores/${id}`, data),
  delete: (id: number) => api.delete(`/fornecedores/${id}`),
};

export const requisicoesAPI = {
  getAll: () => api.get('/requisicoes'),
  getById: (id: number) => api.get(`/requisicoes/${id}`),
  getByCodigo: (codigo: string) => api.get(`/requisicoes/codigo/${codigo}`),
  getByStatus: (status: string) => api.get(`/requisicoes/status/${status}`),
  create: (data: any) => api.post('/requisicoes', data),
  update: (id: number, data: any) => api.put(`/requisicoes/${id}`, data),
  aprovar: (id: number) => api.put(`/requisicoes/${id}/aprovar`),
  rejeitar: (id: number) => api.put(`/requisicoes/${id}/rejeitar`),
  delete: (id: number) => api.delete(`/requisicoes/${id}`),
};

export const negociacoesAPI = {
  getAll: () => api.get('/negociacoes'),
  getById: (id: number) => api.get(`/negociacoes/${id}`),
  getByCodigo: (codigo: string) => api.get(`/negociacoes/codigo/${codigo}`),
  getByStatus: (status: string) => api.get(`/negociacoes/status/${status}`),
  create: (data: any) => api.post('/negociacoes', data),
  update: (id: number, data: any) => api.put(`/negociacoes/${id}`, data),
  addHistorico: (id: number, data: any) => api.post(`/negociacoes/${id}/historico`, data),
  delete: (id: number) => api.delete(`/negociacoes/${id}`),
};

export const orcamentosAPI = {
  getAll: () => api.get('/orcamentos'),
  getById: (id: number) => api.get(`/orcamentos/${id}`),
  getByCodigo: (codigo: string) => api.get(`/orcamentos/codigo/${codigo}`),
  getByStatus: (status: string) => api.get(`/orcamentos/status/${status}`),
  create: (data: any) => api.post('/orcamentos', data),
  update: (id: number, data: any) => api.put(`/orcamentos/${id}`, data),
  addCotacao: (id: number, data: any) => api.post(`/orcamentos/${id}/cotacoes`, data),
  delete: (id: number) => api.delete(`/orcamentos/${id}`),
};

export const pedidosAPI = {
  getAll: () => api.get('/pedidos'),
  getById: (id: number) => api.get(`/pedidos/${id}`),
  getByCodigo: (codigo: string) => api.get(`/pedidos/codigo/${codigo}`),
  getByStatus: (status: string) => api.get(`/pedidos/status/${status}`),
  create: (data: any) => api.post('/pedidos', data),
  update: (id: number, data: any) => api.put(`/pedidos/${id}`, data),
  addHistorico: (id: number, data: any) => api.post(`/pedidos/${id}/historico`, data),
  delete: (id: number) => api.delete(`/pedidos/${id}`),
};

export const relatoriosAPI = {
  getAll: () => api.get('/relatorios/all'),
  getGastosMensais: () => api.get('/relatorios/gastos-mensais'),
  getGastosPorCategoria: () => api.get('/relatorios/gastos-categoria'),
  getIndicadores: () => api.get('/relatorios/indicadores'),
  getTopFornecedores: () => api.get('/relatorios/top-fornecedores'),
};

export default api;

