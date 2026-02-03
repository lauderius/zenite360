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
                        <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
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
// ESTATÍSTICAS DEFAULT
// ============================================================================

const defaultStats = {
    pacientesHoje: 0,
    consultasAgendadas: 0,
    internamentosActivos: 0,
    triagemPendente: 0,
    prescricoesPendentes: 0,
    faturasVencidas: 0,
    ordensAbertas: 0,
    estoqueCritico: 0,
};

// ============================================================================
// PÁGINA DO DASHBOARD CLÍNICO
// ============================================================================

export default function DashboardClinicoPage() {
    const { funcionario } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState(defaultStats);

    useEffect(() => {
        let mounted = true;
        async function loadStats() {
            try {
                const res = await fetch('/api/dashboard');
                if (!res.ok) throw new Error('Falha ao buscar estatísticas');
                const data = await res.json();
                if (!mounted) return;
                setStats({
                    pacientesHoje: data.pacientesHoje ?? 0,
                    consultasAgendadas: data.consultasAgendadas ?? 0,
                    internamentosActivos: data.internamentosActivos ?? 0,
                    triagemPendente: data.triagemPendente ?? 0,
                    prescricoesPendentes: data.prescricoesPendentes ?? 0,
                    faturasVencidas: data.faturasVencidas ?? 0,
                    ordensAbertas: data.ordensAbertas ?? 0,
                    estoqueCritico: data.estoqueCritico ?? 0,
                });
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setIsLoading(false);
            }
        }

        loadStats();
        return () => { mounted = false; };
    }, []);

    const [filaTriagem, setFilaTriagem] = useState<
        { id: number; paciente: string; prioridade: PrioridadeTriagem; tempoEspera: number }[]
    >([]);
    const [consultasHoje, setConsultasHoje] = useState<
        { id: number; hora: string; paciente: string; medico: string; status: string }[]
    >([]);
    const [alertasEstoque, setAlertasEstoque] = useState<
        { id: number; medicamento: string; quantidade: number; minimo: number; status: string }[]
    >([]);

    useEffect(() => {
        let mounted = true;
        async function loadLists() {
            try {
                const [triRes, consRes, farmRes] = await Promise.all([
                    fetch('/api/triagem'),
                    fetch('/api/consultas'),
                    fetch('/api/farmacia'),
                ]);

                const tri = triRes.ok ? await triRes.json() : [];
                const cons = consRes.ok ? await consRes.json() : [];
                const farm = farmRes.ok ? await farmRes.json() : { data: [] };

                if (!mounted) return;

                setFilaTriagem(
                    (Array.isArray(tri) ? tri : []).slice(0, 5).map((t: unknown, idx: number) => {
                        const tt: any = t as any;
                        return {
                            id: tt.id ?? idx,
                            paciente: (tt.pacienteNome || (tt.paciente && (tt.paciente.nomeCompleto || tt.paciente.nome)) || `Paciente ${idx + 1}`) as string,
                            prioridade: (tt.prioridade || 'NAO_URGENTE') as PrioridadeTriagem,
                            tempoEspera: tt.tempoEsperaMin ?? 0,
                        };
                    })
                );

                setConsultasHoje(
                    (Array.isArray(cons) ? cons : []).slice(0, 5).map((c: unknown, idx: number) => {
                        const cc: any = c as any;
                        return {
                            id: cc.id ?? idx,
                            hora: cc.hora || (cc.dataHoraInicio ? new Date(cc.dataHoraInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'),
                            paciente: (cc.paciente && (cc.paciente.nomeCompleto || cc.paciente.nome)) || `Paciente ${idx + 1}`,
                            medico: cc.medico?.nomeCompleto || cc.medicoNome || '—',
                            status: cc.status || 'AGENDADO',
                        };
                    })
                );

                setAlertasEstoque(
                    (Array.isArray(farm.data) ? farm.data : []).slice(0, 5).map((a: unknown, idx: number) => {
                        const aa: any = a as any;
                        const quantidade = aa.estoque ?? aa.quantidade_stock ?? 0;
                        const minimo = aa.estoqueMinimo ?? aa.stock_minimo ?? 0;
                        return {
                            id: aa.id ?? idx,
                            medicamento: aa.nome || aa.nome_artigo || `Medicamento ${idx + 1}`,
                            quantidade,
                            minimo,
                            status: quantidade < minimo ? 'CRITICO' : 'BAIXO',
                        };
                    })
                );
            } catch (err) {
                console.error('Erro ao carregar listas do dashboard:', err);
            }
        }

        loadLists();
        return () => { mounted = false; };
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
                title="Dashboard Clínico"
                description={`Operação Hospitalar — ${new Date().toLocaleDateString('pt-AO', { weekday: 'long', day: 'numeric', month: 'long' })}`}
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
                                <Badge variant="warning">{filaTriagem.length} na fila</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {filaTriagem.map((item, index) => (
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
                                <Badge variant="primary">{consultasHoje.length} agendadas</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {consultasHoje.map((consulta) => (
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
                                <Badge variant="danger">{alertasEstoque.length} alertas</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {alertasEstoque.map((item) => (
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
