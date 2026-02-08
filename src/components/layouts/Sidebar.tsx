'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import {
  History,
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  Stethoscope,
  Bed,
  Pill,
  TestTube,
  Wrench,
  Building,
  Briefcase,
  DollarSign,
  FileText,
  Settings,
  ChevronRight,
  LogOut,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  href: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'pacientes', label: 'Pacientes', icon: Users, href: '/pacientes' },
  { id: 'agendamentos', label: 'Agendamentos', icon: Calendar, href: '/agendamentos' },
  { id: 'triagem', label: 'Triagem', icon: Activity, href: '/triagem' },
  { id: 'enfermagem', label: 'Enfermagem', icon: ClipboardList, href: '/triagem/registo-enfermagem' },
  { id: 'consultas', label: 'Consultas', icon: Stethoscope, href: '/consultas' },
  { id: 'internamento', label: 'Internamento', icon: Bed, href: '/internamento' },
  { id: 'farmacia', label: 'Farmácia', icon: Pill, href: '/farmacia' },
  { id: 'laboratorio', label: 'Laboratório', icon: TestTube, href: '/laboratorio' },
  { id: 'rh', label: 'Recursos Humanos', icon: Briefcase, href: '/rh' },
  { id: 'patrimonio', label: 'Património', icon: Building, href: '/patrimonio' },
  { id: 'manutencao', label: 'Manutenção', icon: Wrench, href: '/manutencao' },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign, href: '/financeiro' },
  { id: 'secretaria', label: 'Secretaria', icon: FileText, href: '/secretaria' },
  { id: 'casa-mortuaria', label: 'Casa Mortuária', icon: History, href: '/casa-mortuaria' },
  { id: 'servicos-gerais', label: 'Serviços Gerais', icon: ShieldCheck, href: '/servicos-gerais' },
  { id: 'configuracoes', label: 'Definições', icon: Settings, href: '/configuracoes' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { funcionario, usuario } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    return href !== '/dashboard' && pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-slate-950 border-r border-white/5 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-24 flex items-center px-8">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300 text-white">
                <Icons.Hospital className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-widest leading-none">
                  ZÊNITE<span className="text-brand-500">360</span>
                </h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">SGH Enterprise</p>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-8 scrollbar-hide">
            <div>
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4">Navegação Principal</p>
              <ul className="space-y-1.5">
                {menuItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative',
                          active
                            ? 'bg-brand-500/10 text-brand-400 font-semibold'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        )}
                      >
                        {active && <div className="absolute left-0 w-1 h-6 bg-brand-500 rounded-full" />}
                        <Icon className={cn('w-5 h-5 transition-transform duration-300 group-hover:scale-110', active && 'text-brand-500')} />
                        <span className="text-sm">{item.label}</span>
                        {active && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* System Status Section */}
            <div className="px-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sistema Online</span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] text-slate-500 font-medium">Último Backup</p>
                  <p className="text-xs text-slate-300 font-mono">2026.02.04 - 09:42</p>
                </div>
              </div>
            </div>
          </nav>

          {/* User Profile / Logout */}
          <div className="p-6 border-t border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-brand-500 font-black text-lg overflow-hidden relative">
                {funcionario?.nomeCompleto?.charAt(0) || usuario?.name?.charAt(0) || <Users className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {funcionario?.nomeCompleto || usuario?.name || 'Utilizador'}
                </p>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-brand-500" />
                  <p className="text-[10px] text-slate-500 font-bold uppercase truncate">
                    {funcionario?.cargo || usuario?.username || 'Acesso Geral'}
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest group">
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Sair do Sistema
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;