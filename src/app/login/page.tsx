'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Spinner } from '@/components/ui';
import {
  Hospital,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Loader2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bi, setBi] = useState('');
  const [especialidade, setEspecialidade] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isRecovering) {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bi, newPassword: password })
        });

        if (response.ok) {
          setIsRecovering(false);
          alert('Senha redefinida com sucesso! Faça login agora.');
        } else {
          const data = await response.json();
          setError(data.error || 'Erro ao redefinir senha.');
        }
      } catch (err) {
        setError('Erro de conexão ao servidor.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (isRegister) {
      if (password !== confirmPassword) {
        setError('As palavras-passe não coincidem.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, username, bi, especialidade })
        });

        if (response.ok) {
          setIsRegister(false);
          alert('Conta criada com sucesso! Faça login agora.');
        } else {
          const data = await response.json();
          setError(data.error || 'Erro ao criar conta.');
        }
      } catch (err) {
        setError('Erro de conexão ao servidor.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const success = await login({ username, password });
      if (!success) {
        setError('Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao aceder ao sistema.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden gradient-mesh">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-cyan/10 rounded-full blur-[120px]" />

      <main className="w-full max-w-[420px] relative z-10 animate-in fade-in zoom-in duration-500">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-2xl shadow-brand-500/20 mb-3 transition-transform hover:scale-105 duration-300">
            <Hospital className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            ZÊNITE<span className="text-brand-400">360</span>
          </h1>
          <p className="text-slate-200 text-[10px] mt-1 uppercase tracking-[0.2em] font-bold opacity-80">Gestão Hospitalar Inteligente</p>
        </div>

        {/* Login/Register Card */}
        <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8">
          <div className="mb-6 overflow-hidden">
            <div className="flex gap-4 mb-5 border-b border-white/5">
              <button
                onClick={() => { setIsRegister(false); setIsRecovering(false); }}
                className={`pb-2 px-1 text-[11px] font-black uppercase tracking-widest transition-all ${!isRegister && !isRecovering ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Entrar
              </button>
              <button
                onClick={() => { setIsRegister(true); setIsRecovering(false); }}
                className={`pb-2 px-1 text-[11px] font-black uppercase tracking-widest transition-all ${isRegister ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Criar Conta
              </button>
              {isRecovering && (
                <button
                  onClick={() => { setIsRecovering(true); setIsRegister(false); }}
                  className={`pb-2 px-1 text-[11px] font-black uppercase tracking-widest transition-all ${isRecovering ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Recuperar
                </button>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              {isRecovering ? 'Recuperação de Senha' : isRegister ? 'Novo Registo' : 'Acesso Seguro'}
            </h2>
            <p className="text-slate-300 text-xs font-medium">
              {isRecovering ? 'Utilize o seu número do BI para redefinir a senha.' : isRegister ? 'Crie o seu perfil profissional no sistema.' : 'Introduza os seus dados para aceder à plataforma.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRecovering ? (
              <>
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="text-[10px] font-black text-slate-200 uppercase tracking-[0.1em] ml-1">Confirmar Identificação (BI)</label>
                  <input
                    type="text"
                    required
                    className="input-premium h-11 text-sm text-white placeholder:text-slate-500 border-brand-500/20"
                    placeholder="Número do seu BI"
                    value={bi}
                    onChange={(e) => setBi(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="text-[10px] font-black text-slate-200 uppercase tracking-[0.1em] ml-1">Nova Palavra-passe</label>
                  <input
                    type="password"
                    required
                    className="input-premium h-11 text-sm text-white placeholder:text-slate-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="text-[10px] font-black text-slate-200 uppercase tracking-[0.1em] ml-1">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    required
                    className="input-premium h-11 text-sm text-white placeholder:text-slate-500"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </>
            ) : isRegister && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-200 uppercase tracking-[0.1em] ml-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    className="input-premium h-11 text-sm text-white placeholder:text-slate-500"
                    placeholder="Ex: Dr. João Pedro"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-200 uppercase tracking-[0.1em] ml-1">Número do BI</label>
                  <input
                    type="text"
                    required
                    className="input-premium h-11 text-sm text-white placeholder:text-slate-500 border-brand-500/20"
                    placeholder="Número de Identificação"
                    value={bi}
                    onChange={(e) => setBi(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-200 uppercase tracking-[0.1em] ml-1">E-mail Profissional</label>
                  <input
                    type="email"
                    required
                    className="input-premium h-11 text-sm text-white placeholder:text-slate-500"
                    placeholder="nome@zenite360.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 mt-2">
                  <label className="text-[10px] font-black text-slate-200 uppercase tracking-[0.1em] ml-1">Especialidade / Área</label>
                  <input
                    type="text"
                    required
                    className="input-premium h-11 text-sm text-white placeholder:text-slate-500"
                    placeholder="Ex: Cardiologia, Enfermagem..."
                    value={especialidade}
                    onChange={(e) => setEspecialidade(e.target.value)}
                  />
                </div>
              </>
            )}

            {!isRecovering && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-200 uppercase tracking-[0.1em] ml-1">
                  {isRegister ? 'Utilizador de Acesso' : 'Nome de Utilizador'}
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Seu utilizador"
                    className="input-premium pl-11 h-11 text-sm text-white placeholder:text-slate-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {!isRecovering && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-200 uppercase tracking-[0.1em]">
                    {isRegister ? 'Definir Senha' : 'Palavra-passe'}
                  </label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => setIsRecovering(true)}
                      className="text-[9px] font-bold text-brand-400 hover:text-brand-300 transition-colors uppercase tracking-widest"
                    >
                      Esqueci-me
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input-premium pl-11 pr-11 h-11 text-sm text-white placeholder:text-slate-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-200 uppercase tracking-[0.1em] ml-1">Confirmar Senha</label>
                <input
                  type="password"
                  required
                  className="input-premium h-11 text-sm text-white placeholder:text-slate-500"
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            {!isRegister && !isRecovering && (
              <div className="flex items-center gap-2.5 py-0.5 ml-1">
                <input type="checkbox" id="remember" className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 text-brand-500 focus:ring-brand-500 transition-all cursor-pointer" />
                <label htmlFor="remember" className="text-[10px] font-bold text-slate-400 cursor-pointer uppercase tracking-tight opacity-80 select-none">Manter sessão activa</label>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 mt-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] gradient-brand border-none hover:shadow-2xl hover:shadow-brand-500/40 transition-all active:scale-[0.98] group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>A Processar...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>{isRecovering ? 'Redefinir Senha' : isRegister ? 'Finalizar Registo' : 'Entrar no Sistema'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-slate-500 text-[9px] uppercase tracking-[0.2em] font-black opacity-60">
            <ShieldCheck className="w-3 h-3 text-brand-500" />
            <span>Infraestrutura Protegida</span>
          </div>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Versão 1.0.0  © 2026 Projecto Zênite360
          </p>
        </div>
      </main>
    </div>
  );
}