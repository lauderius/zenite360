'use client';

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/ui/Icons';
import { Avatar, cn } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { funcionario, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Atualizar relógio
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-AO', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Africa/Luanda',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('pt-AO', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          timeZone: 'Africa/Luanda',
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Verificar tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem('zenite360_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle tema claro/escuro
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zenite360_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zenite360_theme', 'light');
    }
  };

  // Saudação baseada na hora
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return 'Bom dia';
    if (hora >= 12 && hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Lado Esquerdo */}
        <div className="flex items-center gap-4">
          {/* Botão Menu Mobile */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <Icons.Menu size={24} />
          </button>

          {/* Saudação e Data */}
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {getSaudacao()}, <span className="text-sky-600 dark:text-sky-400">{funcionario?.nomeCompleto?.split(' ')[0] || 'Utilizador'}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {currentDate}
            </p>
          </div>
        </div>

        {/* Centro - Busca Global */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar paciente, processo, medicamento..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-200"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center gap-1 rounded border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 px-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Lado Direito */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Relógio */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Icons.Clock size={16} className="text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-mono font-medium text-slate-700 dark:text-slate-200">
              {currentTime}
            </span>
          </div>

          {/* Toggle Tema */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title={isDark ? 'Modo Claro' : 'Modo Escuro'}
          >
            {isDark ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}
          </button>

          {/* Notificações */}
          <button className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Icons.Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          {/* Menu do Usuário */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Avatar
                fallback={funcionario?.nomeCompleto?.charAt(0) || 'U'}
                size="sm"
              />
              <Icons.ChevronDown
                size={16}
                className={cn(
                  'hidden sm:block text-slate-500 transition-transform duration-200',
                  showUserMenu && 'rotate-180'
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 animate-scale-in">
                  {/* Info do Usuário */}
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {funcionario?.nomeCompleto || 'Utilizador'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {funcionario?.cargo || 'Cargo'}
                    </p>
                    <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">
                      {funcionario?.departamento?.nome || 'Departamento'}
                    </p>
                  </div>

                  {/* Opções */}
                  <div className="py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <Icons.User size={16} />
                      Meu Perfil
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <Icons.Settings size={16} />
                      Configurações
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-1 mt-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Icons.LogOut size={16} />
                      Terminar Sessão
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;