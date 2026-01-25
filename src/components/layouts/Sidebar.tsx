'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import type { NivelAcesso } from '@/types';

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Icons;
  href: string;
  permissoes?: NivelAcesso[];
  badge?: string | number;
}

interface MenuGroup {
  id: string;
  label: string;
  icon: keyof typeof Icons;
  items: MenuItem[];
  permissoes?: NivelAcesso[];
}

const menuGroups: MenuGroup[] = [
  {
    id: 'clinica',
    label: 'Área Clínica',
    icon: 'Heart',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'Dashboard',
        href: '/dashboard'
      },
      {
        id: 'pacientes',
        label: 'Pacientes',
        icon: 'Users',
        href: '/pacientes',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'MEDICO', 'ENFERMEIRO', 'RECEPCAO', 'ADMINISTRATIVO']
      },
      {
        id: 'agendamentos',
        label: 'Agendamentos',
        icon: 'Calendar',
        href: '/agendamentos',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'MEDICO', 'ENFERMEIRO', 'RECEPCAO', 'ADMINISTRATIVO']
      },
      {
        id: 'triagem',
        label: 'Triagem',
        icon: 'Activity',
        href: '/triagem',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'MEDICO', 'ENFERMEIRO']
      },
      {
        id: 'consultas',
        label: 'Consultas',
        icon: 'Stethoscope',
        href: '/consultas',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'MEDICO', 'ENFERMEIRO']
      },
      {
        id: 'internamento',
        label: 'Internamento',
        icon: 'Bed',
        href: '/internamento',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'MEDICO', 'ENFERMEIRO']
      },
    ]
  },
  {
    id: 'tecnica',
    label: 'Área Técnica',
    icon: 'TestTube',
    items: [
      {
        id: 'farmacia',
        label: 'Farmácia',
        icon: 'Pill',
        href: '/farmacia',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'FARMACEUTICO', 'MEDICO']
      },
      {
        id: 'laboratorio',
        label: 'Laboratório',
        icon: 'TestTube',
        href: '/laboratorio',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'TECNICO', 'MEDICO']
      },
      {
        id: 'manutencao',
        label: 'Manutenção',
        icon: 'Wrench',
        href: '/manutencao',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'MANUTENCAO']
      },
      {
        id: 'patrimonio',
        label: 'Patrimônio',
        icon: 'Building',
        href: '/patrimonio',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'ADMINISTRATIVO']
      },
    ]
  },
  {
    id: 'administrativa',
    label: 'Área Administrativa',
    icon: 'Briefcase',
    items: [
      {
        id: 'rh',
        label: 'Recursos Humanos',
        icon: 'Users',
        href: '/rh',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'ADMINISTRATIVO']
      },
      {
        id: 'financeiro',
        label: 'Financeiro',
        icon: 'DollarSign',
        href: '/financeiro',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'FINANCEIRO']
      },
      {
        id: 'secretaria',
        label: 'Secretaria',
        icon: 'FileText',
        href: '/secretaria',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'ADMINISTRATIVO']
      },
      {
        id: 'servicos-gerais',
        label: 'Serviços Gerais',
        icon: 'Wrench',
        href: '/servicos-gerais',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'ADMINISTRATIVO']
      },
      {
        id: 'casa-mortuaria',
        label: 'Casa Mortuária',
        icon: 'Activity',
        href: '/casa-mortuaria',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO', 'GESTOR', 'ADMINISTRATIVO']
      },
    ]
  },
  {
    id: 'sistema',
    label: 'Sistema',
    icon: 'Settings',
    items: [
      {
        id: 'configuracoes',
        label: 'Configurações',
        icon: 'Settings',
        href: '/configuracoes',
        permissoes: ['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO']
      },
    ]
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { funcionario, checkPermission } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['clinica']); // Dashboard sempre expandido por padrão

  // Filtrar grupos de menu com base nas permissões
  const filteredMenuGroups = menuGroups.filter((group) => {
    if (!group.permissoes) return true;
    return checkPermission(group.permissoes);
  });

  // Verificar se um item está ativo
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  // Verificar se um grupo deve estar expandido
  const isGroupExpanded = (groupId: string) => expandedGroups.includes(groupId);

  // Alternar expansão de grupo
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Verificar se um grupo tem algum item ativo
  const hasActiveItem = (group: MenuGroup) => {
    return group.items.some(item => isActive(item.href));
  };

  // Itens de menu filtrados (aplanar grupos e verificar permissões por item)
  const filteredMenuItems: MenuItem[] = filteredMenuGroups.flatMap(group =>
    group.items.filter(item => {
      if (!item.permissoes) return true;
      return checkPermission(item.permissoes);
    })
  );

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Icons.Hospital className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Zênite360</h1>
              <p className="text-[10px] text-slate-400 -mt-1">Gestão Hospitalar</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <Icons.X size={20} />
          </button>
        </div>

        {/* Menu de navegação */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {filteredMenuItems.map((item) => {
              const IconComponent = Icons[item.icon];
              const active = isActive(item.href);

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'sidebar-item',
                      active && 'active'
                    )}
                  >
                    <IconComponent size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Rodapé do sidebar - Info do usuário */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
              {funcionario?.nomeCompleto?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {funcionario?.nomeCompleto || 'Utilizador'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {funcionario?.cargo || 'Cargo'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;