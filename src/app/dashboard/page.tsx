'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Spinner } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/contexts/AuthContext';
import type { PrioridadeTriagem } from '@/types';

// ============================================================================
// COMPONENTE CARD DE ESTATÍSTICA
// ============================================================================

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
}: {
  title: string;
  value: string | number;
  icon: keyof typeof Icons;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: 'sky' | 'emerald' | 'amber' | 'red' | 'purple' | 'orange';
}) {
  const IconComponent = Icons[Icon];
  
  const colorClasses = {
    sky: 'bg-sky-500 shadow-sky-500/30',
    emerald: 'bg-emerald-500 shadow-emerald-500/30',
    amber: 'bg-amber-500 shadow-amber-500/30',
    red: 'bg-red-500 shadow-red-500/30',
    purple: 'bg-purple-500 shadow-purple-500/30',
    orange: 'bg-orange-500 shadow-orange-500/30',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${colorClasses[color]}`}>
            <IconComponent size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          </div>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm ${
              trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
            }`}>
              {trend === 'up' ? <Icons.TrendingUp size={16} /> : <Icons.TrendingDown size={16} />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// BADGE DE TRIAGEM MANCHESTER
// ============================================================================

function TriagemBadge({ prioridade }: { prioridade: PrioridadeTriagem }) {
  const config = {
    EMERGENCIA: { label: 'Emergência', class: 'badge-emergencia' },
    MUITO_URGENTE: { label: 'Muito Urggirente', class: 'badge-muito-urgente' },
    URGENTE: { label: 'Urgente', class: 'badge-urgente' },
    POUCO_URGENTE: { label: 'Pouco Urgente', class: 'badge-pouco-urgente' },
    NAO_URGENTE: { label: 'Não Urgente', class: 'badge-nao-urgente' },
  };

  return <span className={config[prioridade].class}>{config[prioridade].label}</span>;
}

// ============================================================================
// DADOS SIMULADOS (MOCK)
// ============================================================================

const mockStats = {
  pacientesHoje: 47,
  consultasAgendadas: 32,
  internamentosActivos: 18,
  triagemPendente: 5,
  prescricoesPendentes: 12,
  faturasVencidas: 3,
  ordensAbertas: 8,
  estoqueCritico: 4,
};

const mockFilaTriagem = [
  { id: 1, paciente: 'Maria José Santos', prioridade: 'EMERGENCIA' as PrioridadeTriagem, tempoEspera: 2 },
  { id: 2, paciente: 'João Pedro Silva', prioridade: 'MUITO_URGENTE' as PrioridadeTriagem, tempoEspera: 8 },
  { id: 3, paciente: 'Ana Luísa Ferreira', prioridade: 'URGENTE' as PrioridadeTriagem, tempoEspera: 25 },
  { id: 4, paciente: 'Carlos Manuel Costa', prioridade: 'POUCO_URGENTE' as PrioridadeTriagem, tempoEspera: 45 },
  { id: 5, paciente: 'Teresa Antónia', prioridade: 'NAO_URGENTE' as PrioridadeTriagem, tempoEspera: 60 },
];

const mockConsultasHoje = [
  { id: 1, hora: '08:30', paciente: 'António Mendes', medico: 'Dr. Paulo Sousa', status: 'ATENDIDO' },
  { id: 2, hora: '09:00', paciente: 'Beatriz Lopes', medico: 'Dra. Ana Reis', status: 'EM_ATENDIMENTO' },
  { id: 3, hora: '09:30', paciente: 'Carlos Fernandes', medico: 'Dr. Paulo Sousa', status: 'AGENDADO' },
  { id: 4, hora: '10:00', paciente: 'Diana Martins', medico: 'Dra. Ana Reis', status: 'AGENDADO' },
  { id: 5, hora: '10:30', paciente: 'Eduardo Costa', medico: 'Dr. João Santos', status: 'AGENDADO' },
];

const mockAlertasEstoque = [
  { id: 1, medicamento: 'Paracetamol 500mg', quantidade: 50, minimo: 100, status: 'CRITICO' },
  { id: 2, medicamento: 'Amoxicilina 250mg', quantidade: 80, minimo: 150, status: 'BAIXO' },
  { id: 3, medicamento: 'Ibuprofeno 400mg', quantidade: 30, minimo: 100, status: 'CRITICO' },
  { id: 4, medicamento: 'Omeprazol 20mg', quantidade: 120, minimo: 200, status: 'BAIXO' },
];

// ============================================================================
// PÁGINA DO DASHBOARD
// ============================================================================

export default function DashboardPage() {
  const { funcionario } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    // Simular carregamento de dados
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Dashboard"
        description={`Visão geral do hospital — ${new Date().toLocaleDateString('pt-AO', { weekday: 'long', day: 'numeric', month: 'long' })}`}
        actions={
          <Button variant="outline" size="sm">
            <Icons.Download size={16} />
            Exportar Relatório
          </Button>
        }
      />

      <PageContent>
        {/* Cards de Estatísticas - Linha 1 */}
        <GridLayout cols={4}>
          <StatCard
            title="Pacientes Hoje"
            value={stats.pacientesHoje}
            icon="Users"
            color="sky"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Consultas Agendadas"
            value={stats.consultasAgendadas}
            icon="Calendar"
            color="emerald"
          />
          <StatCard
            title="Internamentos"
            value={stats.internamentosActivos}
            icon="Bed"
            color="purple"
          />
          <StatCard
            title="Triagem Pendente"
            value={stats.triagemPendente}
            icon="Activity"
            color="amber"
          />
        </GridLayout>

        {/* Cards de Estatísticas - Linha 2 */}
        <div className="mt-6">
          <GridLayout cols={4}>
            <StatCard
              title="Prescrições Pendentes"
              value={stats.prescricoesPendentes}
              icon="FileText"
              color="orange"
            />
            <StatCard
              title="Faturas Vencidas"
              value={stats.faturasVencidas}
              icon="DollarSign"
              color="red"
            />
            <StatCard
              title="Ordens de Serviço"
              value={stats.ordensAbertas}
              icon="Wrench"
              color="amber"
            />
            <StatCard
              title="Estoque Crítico"
              value={stats.estoqueCritico}
              icon="AlertTriangle"
              color="red"
            />
          </GridLayout>
        </div>

        {/* Seção de Conteúdo Principal */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fila de Triagem */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Icons.Activity className="w-5 h-5 text-sky-600" />
                  Fila de Triagem
                </CardTitle>
                <Badge variant="warning">{mockFilaTriagem.length} na fila</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockFilaTriagem.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {item.paciente}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {item.tempoEspera} min de espera
                        </p>
                      </div>
                    </div>
                    <TriagemBadge prioridade={item.prioridade} />
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                Ver Todos
                <Icons.ArrowRight size={16} />
              </Button>
            </CardContent>
          </Card>

          {/* Consultas de Hoje */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Icons.Calendar className="w-5 h-5 text-sky-600" />
                  Consultas Hoje
                </CardTitle>
                <Badge variant="primary">{mockConsultasHoje.length} agendadas</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockConsultasHoje.map((consulta) => (
                  <div
                    key={consulta.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-medium text-sky-600 dark:text-sky-400">
                        {consulta.hora}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {consulta.paciente}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {consulta.medico}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        consulta.status === 'ATENDIDO'
                          ? 'success'
                          : consulta.status === 'EM_ATENDIMENTO'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {consulta.status === 'ATENDIDO'
                        ? 'Atendido'
                        : consulta.status === 'EM_ATENDIMENTO'
                        ? 'Em Atend.'
                        : 'Agendado'}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                Ver Agenda Completa
                <Icons.ArrowRight size={16} />
              </Button>
            </CardContent>
          </Card>

          {/* Alertas de Estoque */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Icons.AlertTriangle className="w-5 h-5 text-amber-500" />
                  Alertas de Estoque
                </CardTitle>
                <Badge variant="danger">{mockAlertasEstoque.length} alertas</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAlertasEstoque.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {item.medicamento}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.quantidade} un. (mín: {item.minimo})
                      </p>
                    </div>
                    <Badge variant={item.status === 'CRITICO' ? 'danger' : 'warning'}>
                      {item.status === 'CRITICO' ? 'Crítico' : 'Baixo'}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                Ir para Farmácia
                <Icons.ArrowRight size={16} />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Acções Rápidas */}
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle>Acções Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Icons.UserPlus size={24} className="text-sky-600" />
                <span className="text-xs">Novo Paciente</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Icons.Calendar size={24} className="text-emerald-600" />
                <span className="text-xs">Agendar Consulta</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Icons.Activity size={24} className="text-amber-600" />
                <span className="text-xs">Nova Triagem</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Icons.FileText size={24} className="text-purple-600" />
                <span className="text-xs">Nova Prescrição</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Icons.Bed size={24} className="text-orange-600" />
                <span className="text-xs">Admitir Paciente</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Icons.Wrench size={24} className="text-red-600" />
                <span className="text-xs">Abrir O.S.</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </MainLayout>
  );
}