import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Fornecedores } from './components/Fornecedores';
import { Requisicoes } from './components/Requisicoes';
import { Negociacoes } from './components/Negociacoes';
import { Orcamentos } from './components/Orcamentos';
import { Pedidos } from './components/Pedidos';
import { Relatorios } from './components/Relatorios';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'fornecedores':
        return <Fornecedores />;
      case 'requisicoes':
        return <Requisicoes />;
      case 'negociacoes':
        return <Negociacoes />;
      case 'orcamentos':
        return <Orcamentos />;
      case 'pedidos':
        return <Pedidos />;
      case 'relatorios':
        return <Relatorios />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10" />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="flex h-screen">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
