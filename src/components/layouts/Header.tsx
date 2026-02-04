'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Clock,
  Sparkles,
  SearchCode
} from 'lucide-react';
import { Avatar, cn } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { funcionario, usuario, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container') && !target.closest('.notifications-container')) {
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };
    if (showUserMenu || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showNotifications]);

  return (
    <header className="sticky top-0 z-30 h-20 glass-panel border-x-0 border-t-0 border-b border-white/5 dark:border-white/5 px-6 lg:px-10">
      <div className="flex items-center justify-between h-full">
        {/* Left Side: Mobile Menu & Breadcrumbs/Welcome */}
        <div className="flex items-center gap-6">
          <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <Menu size={24} />
          </button>

          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-500">Workspace</span>
              <div className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Geral</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Olá, <span className="text-brand-500">{funcionario?.nomeCompleto?.split(' ')[0] || usuario?.name?.split(' ')[0] || 'Utilizador'}</span>
              <Sparkles className="inline-block ml-2 w-4 h-4 text-amber-500" />
            </h2>
          </div>
        </div>

        {/* Center: Global Command Palette Style Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
            <input
              type="text"
              placeholder="Pesquisar por pacientes, exames ou processos... (⌘K)"
              className="w-full h-12 pl-12 pr-4 bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-[10px] font-black text-slate-500 shadow-sm">
              <span>CTRL</span>
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-4">
          {/* Clock */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-brand-500/5 border border-brand-500/10 rounded-2xl">
            <Clock size={16} className="text-brand-500" />
            <span className="text-sm font-black text-brand-600 dark:text-brand-400 font-mono tracking-tighter">
              {currentTime}
            </span>
          </div>

          <div className="flex items-center gap-1 border-r border-slate-200 dark:border-white/5 pr-4">
            {/* Theme Toggle Disabled */}
            {/* <button onClick={toggleTheme} className="p-2.5 text-slate-500 hover:text-brand-500 hover:bg-brand-500/5 rounded-xl transition-all">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button> */}

            <div className="relative notifications-container">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 text-slate-500 hover:text-brand-500 hover:bg-brand-500/5 rounded-xl transition-all relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-brand-500 rounded-full border-2 border-white dark:border-slate-950 text-[8px] flex items-center justify-center text-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-panel rounded-3xl p-0 z-50 animate-in fade-in zoom-in duration-200 overflow-hidden border border-white/10 shadow-xl">
                  <div className="p-4 border-b border-white/5 bg-slate-50/50 dark:bg-white/5">
                    <h3 className="font-bold text-slate-900 dark:text-white">Notificações</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs">Sem notificações</div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} onClick={() => markAsRead(notif.id)} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${notif.unread ? 'bg-brand-500/5' : ''}`}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-semibold ${notif.unread ? 'text-brand-500' : 'text-slate-700 dark:text-slate-300'}`}>{notif.title}</h4>
                            <span className="text-[10px] text-slate-400">{notif.time}</span>
                          </div>
                          <p className="text-xs text-slate-500">{notif.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 text-center border-t border-white/5">
                    <button onClick={markAllAsRead} className="text-xs font-bold text-brand-500 hover:text-brand-400">Marcar todas como lidas</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Profile */}
          <div className="relative user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-brand-500 font-black relative overflow-hidden">
                {funcionario?.nomeCompleto?.charAt(0) || 'D'}
              </div>
              <div className="hidden xl:flex flex-col text-left mr-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-none capitalize">
                  {funcionario?.nomeCompleto?.split(' ').slice(0, 2).join(' ') || usuario?.name?.split(' ').slice(0, 2).join(' ') || 'Utilizador'}
                </span>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Online</span>
              </div>
              <ChevronDown size={14} className={cn('text-slate-500 transition-transform duration-300', showUserMenu && 'rotate-180')} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-64 glass-panel rounded-3xl p-2 z-50 animate-in fade-in zoom-in duration-200 border border-white/10 shadow-2xl bg-white dark:bg-slate-950">
                <div className="px-4 py-4 mb-2 bg-slate-50 dark:bg-white/5 rounded-2xl">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Conta Ativa</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{funcionario?.nomeCompleto || usuario?.name}</p>
                  <p className="text-[10px] text-brand-500 font-bold uppercase mt-0.5">{funcionario?.cargo || 'Utilizador'}</p>
                </div>
                <div className="space-y-1">
                  <Link href="/perfil" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all">
                    <User size={16} /> Meu Perfil
                  </Link>
                  <Link href="/configuracoes" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all">
                    <Settings size={16} /> Definições
                  </Link>
                  <div className="h-px bg-slate-200 dark:bg-white/5 my-2 mx-2" />
                  <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-medium">
                    <LogOut size={16} /> Terminar Sessão
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;