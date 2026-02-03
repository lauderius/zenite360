'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Bed,
  Package,
  TrendingUp,
  Activity,
  MapPin,
  ArrowUpRight,
  History,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Avatar } from '@/components/ui';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading || !data) {
    return (
      <MainLayout>
        <PageHeader title="Visão 360" description="A carregar dados do painel..." />
        <PageContent>
          <div className="flex items-center justify-center p-20">
            <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          </div>
        </PageContent>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Visão 360"
        description="Painel Administrativo Hospitalar — Monitorização Global em Tempo Real"
        actions={
          <div className="flex gap-2">
            <Button
              onClick={fetchDashboardData}
              variant="outline" size="sm" className="rounded-xl border-white/10 hover:bg-white/5">
              <History className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Button size="sm" className="gradient-brand border-none rounded-xl font-bold shadow-lg shadow-brand-500/20">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Exportar BI
            </Button>
          </div>
        }
      />

      <PageContent>
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Consultas Hoje"
            value={data.stats.consultasHoje.toString()}
            trend="+12%"
            icon={<Calendar className="w-6 h-6 text-brand-400" />}
            color="brand"
          />
          <KPICard
            title="Em Triagem"
            value={data.stats.emTriagem.toString()}
            badge="3 Críticos"
            icon={<Activity className="w-6 h-6 text-orange-500" />}
            color="orange"
            pulse
          />
          <KPICard
            title="Admissões Ativas"
            value={data.stats.admissoesAtivas.toString()}
            trend="85% Ocup."
            icon={<Bed className="w-6 h-6 text-indigo-400" />}
            color="indigo"
          />
          <KPICard
            title="Alertas de Stock"
            value={data.stats.stockCritico.toString()}
            warning={data.stats.stockCritico > 0 ? "Ação Necessária" : "Normal"}
            icon={<Package className="w-6 h-6 text-red-500" />}
            color="red"
          />
        </div>

        {/* Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Triage Analytics */}
          <Card className="lg:col-span-2 glass-card border-none rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div>
                <CardTitle className="text-white text-xl">Volume de Triagem (Manchester)</CardTitle>
                <p className="text-sm text-slate-500 font-medium mt-1">Pacientes classificados hoje por nível de urgência</p>
              </div>
              <Button variant="ghost" className="text-brand-500 hover:text-brand-400 hover:bg-brand-500/5">Ver Detalhes</Button>
            </CardHeader>
            <CardContent className="h-[300px] flex items-end justify-between gap-4 px-4 pb-2">
              {data.chartData.map((item: any) => (
                <ChartBar
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  total={50}
                  color={
                    item.label === 'Emergência' ? 'bg-red-500' :
                      item.label === 'M. Urgente' ? 'bg-orange-500' :
                        item.label === 'Urgente' ? 'bg-amber-500' :
                          item.label === 'Pouco Urg.' ? 'bg-emerald-500' : 'bg-sky-500'
                  }
                />
              ))}
            </CardContent>
          </Card>

          {/* Regional Performance */}
          <Card className="glass-card border-none rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white text-xl">Fluxo Regional</CardTitle>
                <p className="text-sm text-slate-500 font-medium mt-1">Origem dos pacientes (Mês)</p>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-500"><MoreHorizontal className="w-5 h-5" /></Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <ProgressBar label="Luanda" value={65} color="bg-brand-500" />
              <ProgressBar label="Huíla" value={18} color="bg-brand-500/70" />
              <ProgressBar label="Benguela" value={12} color="bg-brand-500/50" />
              <ProgressBar label="Cabinda" value={5} color="bg-brand-500/30" />
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: Activities & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="glass-card border-none rounded-3xl overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between p-6">
              <CardTitle className="text-white flex items-center gap-2">
                <History className="w-5 h-5 text-brand-500" />
                Atividade Recente
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-brand-500">Ver Tudo</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {data.atividades.map((atv: any) => (
                  <ActivityItem
                    key={atv.id}
                    title={atv.titulo}
                    time={atv.tempo}
                    description={atv.descricao}
                    icon={
                      <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
                        <Calendar className="w-4 h-4" />
                      </div>
                    }
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Critical Patients Table */}
          <Card className="glass-card border-none rounded-3xl overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between p-6">
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Pacientes Críticos
              </CardTitle>
              <Badge className="bg-red-500/20 text-red-500 border-none font-black px-3">3 PACIENTES</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <th className="px-6 py-4 text-left">Paciente</th>
                    <th className="px-6 py-4 text-center">Tempo Espera</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  <CriticalPatientRow name="João Manuel" id="#4918" urgency="Emergência" color="bg-red-500" waitTime="12 min" />
                  <CriticalPatientRow name="Maria Costa" id="#4892" urgency="M. Urgente" color="bg-orange-500" waitTime="45 min" />
                  <CriticalPatientRow name="Pedro Afonso" id="#4901" urgency="M. Urgente" color="bg-orange-500" waitTime="38 min" />
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </MainLayout>
  );
}


function KPICard({ title, value, trend, badge, warning, icon, color, pulse }: any) {
  const colorMap: any = {
    brand: 'border-brand-500/20 bg-brand-500/5',
    orange: 'border-orange-500/20 bg-orange-500/5',
    indigo: 'border-indigo-500/20 bg-indigo-500/5',
    red: 'border-red-500/20 bg-red-500/5',
  };

  return (
    <Card className={`glass-card border-none rounded-3xl p-6 relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-4 rounded-2xl ${colorMap[color]} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        {trend && (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {trend}
          </Badge>
        )}
        {badge && (
          <Badge className={`bg-red-500/10 text-red-500 border-none font-black ${pulse ? 'animate-pulse' : ''}`}>
            {badge}
          </Badge>
        )}
        {warning && (
          <Badge className="bg-red-500 text-white border-none font-black uppercase text-[10px]">
            {warning}
          </Badge>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-4xl font-black text-white">{value}</h3>
      </div>
    </Card>
  );
}

function ChartBar({ label, value, total, color }: any) {
  const height = (value / total) * 100;
  return (
    <div className="flex flex-col items-center gap-3 w-full group">
      <div className="text-[10px] font-black text-white bg-slate-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-auto">
        {value}
      </div>
      <div
        className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 relative group-hover:brightness-125 ${color} opacity-20 group-hover:opacity-40`}
        style={{ height: `${height}%` }}
      >
        <div className={`absolute top-0 left-0 right-0 h-1 ${color} rounded-t-xl`} />
      </div>
      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center h-4">{label}</span>
    </div>
  );
}

function ProgressBar({ label, value, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="font-black text-white">{value}%</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ActivityItem({ title, time, description, icon }: any) {
  return (
    <div className="flex items-start gap-4 p-6 hover:bg-white/[0.02] transition-colors group">
      <div className="group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className="text-sm font-bold text-white truncate group-hover:text-brand-400 transition-colors uppercase tracking-tight">{title}</p>
          <span className="text-[10px] font-black text-slate-600 whitespace-nowrap uppercase">{time}</span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-700 mt-1 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
    </div>
  );
}

function CriticalPatientRow({ name, id, urgency, color, waitTime }: any) {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors group">
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white uppercase tracking-tight">{name} <span className="text-slate-600 font-medium">{id}</span></span>
          <div className="flex items-center gap-2 mt-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${color.replace('bg-', 'text-')}`}>{urgency}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-center">
        <Badge className="bg-red-500/10 text-red-500 border-none font-black px-3">{waitTime}</Badge>
      </td>
      <td className="px-6 py-5 text-right">
        <Button variant="ghost" className="text-brand-500 hover:text-brand-400 hover:bg-brand-500/5 text-xs font-black uppercase tracking-widest rounded-xl">
          Prontuário
        </Button>
      </td>
    </tr>
  );
}