import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

export function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(username, password, email);
      } else {
        await login(username, password);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao autenticar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10" />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-white mb-2">SupplyFlow</h1>
          <p className="text-white/60">Sistema de Gestão de Compras</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-white/60 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                placeholder="Digite seu email"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-white/60 text-sm mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              'Carregando...'
            ) : isRegister ? (
              <>
                <UserPlus className="w-5 h-5" />
                Registrar
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-white/60 hover:text-white transition-colors"
          >
            {isRegister ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Registrar'}
          </button>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <p className="text-blue-400 text-sm mb-2">Credenciais de Teste:</p>
          <p className="text-white/60 text-sm">Usuário: <span className="text-white">admin</span></p>
          <p className="text-white/60 text-sm">Senha: <span className="text-white">admin123</span></p>
        </div>
      </div>
    </div>
  );
}
