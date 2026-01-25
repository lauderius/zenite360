'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Spinner } from '@/components/ui';
// Substituído Icons por Lucide React
import { 
  Hospital, 
  Users, 
  Calendar, 
  Pill, 
  BarChart, 
  AlertCircle, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Info,
  Loader2 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirecionar se já autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login({ username, password });
      if (!success) {
        setError('Credenciais inválidas');
        return;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 relative overflow-hidden">
        {/* Padrão de fundo */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Círculos decorativos */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-sky-500/30">
                <Hospital className="w-14 h-14 text-white" />
              </div>
            </div>

            <h1 className="text-5xl font-bold text-white mb-4">
              Zênite<span className="text-sky-400">360</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Sistema de Gestão Hospitalar Integral
            </p>
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <span className="text-2xl">🇦🇴</span>
              <span className="text-sm">Desenvolvido para Angola</span>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-2 gap-6 max-w-md">
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-sky-400" />
              </div>
              <span className="text-sm">Gestão de Pacientes</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-sky-400" />
              </div>
              <span className="text-sm">Agendamentos</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <Pill className="w-5 h-5 text-sky-400" />
              </div>
              <span className="text-sm">Farmácia 360°</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <BarChart className="w-5 h-5 text-sky-400" />
              </div>
              <span className="text-sm">Relatórios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Hospital className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Zênite<span className="text-sky-600">360</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Bem-vindo de volta!</h2>
            <p className="text-slate-500 mt-2">
              Introduza as suas credenciais para aceder ao sistema
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nome de Utilizador"
              type="text"
              placeholder="Introduza o seu username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // Corrigido para componente Lucide direto
              icon={<User size={18} />}
              required
              autoComplete="username"
            />

            <div className="relative">
              <Input
                label="Palavra-passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} />}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-sm text-slate-600">Lembrar-me</span>
              </label>
              <button
                type="button"
                className="text-sm text-sky-600 hover:text-sky-700 font-medium"
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              isLoading={isLoading}
              disabled={isLoading || !username || !password}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A autenticar...</span>
                </div>
              ) : 'Entrar'}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-8 p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 text-center">
              <Info className="inline w-4 h-4 mr-1" />
              Acesso restrito a utilizadores autorizados. Todas as ações são registadas.
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4 p-4 bg-sky-50 border border-sky-100 rounded-lg">
            <p className="text-xs text-sky-700 font-medium mb-2">Credenciais de Demonstração:</p>
            <p className="text-xs text-sky-600">
              <span className="font-mono">admin</span> / <span className="font-mono">Admin@Z360!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}