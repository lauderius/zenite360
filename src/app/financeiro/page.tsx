'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  BarChart3,
  Receipt,
  History,
  PlusCircle,
  Filter,
  Search,
  MoreHorizontal,
  ChevronDown,
  Info,
  Calendar,
  Wallet,
  Building2,
  FileText,
  BadgeAlert
} from 'lucide-react';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { api } from '@/services/api';

export default function FinanceiroPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<any>('/financeiro');
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas financeiras:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <MainLayout>
      <PageHeader
        title="Dashboard Financeiro (DGF)"
        description="Controlo de facturação, tesouraria e análise de custos operacionais."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl border-white/5 hover:bg-white/5">
              <BarChart3 className="w-4 h-4 mr-2" />
              Balancete Mensal
            </Button>
            <Button className="gradient-brand border-none rounded-xl font-bold px-6 shadow-lg shadow-brand-500/20 group">
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Lançamento
            </Button>
          </div>
        }
      />

      <PageContent>
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Facturação Total"
            value={stats?.facturacaoMensal?.toLocaleString('pt-AO') || '45.280.000,00'}
            unit="AOA"
            trend="+12,4%"
            icon={<Receipt className="w-6 h-6 text-emerald-500" />}
            color="emerald"
          />
          <KPICard
            title="Pacientes Registados"
            value={stats?.totalPacientes?.toString() || '0'}
            unit="Total"
            badge="+5,2%"
            icon={<DollarSign className="w-6 h-6 text-amber-500" />}
            color="amber"
            pulse
          />
          <KPICard
            title="Consultas Realizadas"
            value={stats?.totalConsultas?.toString() || '0'}
            unit="Total"
            trend="-2,1%"
            icon={<TrendingDown className="w-6 h-6 text-red-500" />}
            color="red"
          />
          <KPICard
            title="Margem Líquida"
            value="38,5"
            unit="%"
            warning="+4,3% meta"
            icon={<BarChart3 className="w-6 h-6 text-brand-400" />}
            color="brand"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Main Cashflow Chart Simulation */}
          <Card className="lg:col-span-8 glass-card border-none rounded-3xl overflow-hidden min-h-[400px]">
            <CardHeader className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-white text-xl">Facturação vs Despesas</CardTitle>
                  <p className="text-sm text-slate-500 font-medium mt-1">Fluxo de caixa consolidado (Mensal)</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receitas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Despesas</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              {isLoading ? (
                <div className="flex items-center justify-center h-[280px]">
                  <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="h-[280px] w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 1000 280">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map(i => (
                      <line key={i} x1="0" y1={70 * i} x2="1000" y2={70 * i} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    ))}
                    {/* Area and Line */}
                    <path d="M0,240 Q150,200 300,160 T600,100 T1000,40 L1000,280 L0,280 Z" fill="url(#chartGradient)" />
                    <path d="M0,240 Q150,200 300,160 T600,100 T1000,40" fill="none" stroke="#10b981" strokeWidth="4" />
                    <path d="M0,260 Q150,240 300,220 T600,180 T1000,150" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="8 6" />
                  </svg>
                  <div className="flex justify-between items-center mt-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-2">
                    <span>Início Mês</span>
                    <span>Semana 2</span>
                    <span>Semana 3</span>
                    <span>Hoje</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vertical Breakdown */}
          <Card className="lg:col-span-4 glass-card border-none rounded-3xl p-8">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-white text-xl">Receita por Dept.</CardTitle>
              <p className="text-sm text-slate-500 font-medium mt-1">Sectores com maior rentabilidade</p>
            </CardHeader>
            <CardContent className="p-0 space-y-8">
              <DeptProgress label="Clínica Médica" value={55} amount="22.4M" color="bg-emerald-500" />
              <DeptProgress label="Farmácia Central" value={38} amount="15.1M" color="bg-brand-500" />
              <DeptProgress label="Administração" value={17} amount="7.7M" color="bg-amber-500" />

              <div className="pt-8 border-t border-white/5">
                <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl p-4 flex gap-4">
                  <Info className="w-5 h-5 text-brand-500 shrink-0" />
                  <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                    O departamento de <span className="text-white">Clínica</span> atingiu <span className="text-emerald-500">110%</span> da meta mensal prevista.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="glass-card border-none rounded-3xl overflow-hidden">
          <CardHeader className="bg-white/5 border-b border-white/5 p-8 flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <History className="w-5 h-5 text-brand-500" />
              Transacções Recentes
            </CardTitle>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-brand-500 rounded-xl" onClick={fetchStats}>Actualizar Dados</Button>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="px-8 py-5">Identificador / Guia</th>
                  <th className="px-6 py-5">Entidade / Paciente</th>
                  <th className="px-6 py-5">Data Operação</th>
                  <th className="px-6 py-5 text-right">Valor Líquido (AOA)</th>
                  <th className="px-6 py-5 text-center">Estado</th>
                  <th className="px-8 py-5 text-right">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {stats?.movimentos?.map((mv: any) => (
                  <TxRow
                    key={mv.id}
                    id={`#MV-${mv.id}`}
                    entity={mv.pacientes?.nome_completo || 'Stock Saída'}
                    sub={mv.tipo_movimento}
                    date={new Date(mv.data_movimento).toLocaleDateString('pt-AO')}
                    value={Number(mv.valor_total || 0).toLocaleString('pt-AO')}
                    status={mv.sentido === 'Entrada' ? 'Pago' : 'Pendente'}
                    statusColor={mv.sentido === 'Entrada' ? 'text-emerald-500' : 'text-amber-500'}
                    bgStatus={mv.sentido === 'Entrada' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}
                  />
                ))}
                {(!stats?.movimentos || stats.movimentos.length === 0) && !isLoading && (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-slate-500 uppercase font-black text-xs tracking-widest">Nenhuma transacção encontrada</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </PageContent>
    </MainLayout>
  );
}

function KPICard({ title, value, unit, trend, badge, warning, icon, color, pulse }: any) {
  return (
    <Card className={`glass-card border-none rounded-3xl p-6 relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
          {icon}
        </div>
        {trend && <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px]">{trend}</Badge>}
        {badge && <Badge className={`bg-amber-500/10 text-amber-500 border-none font-black text-[10px] ${pulse ? 'animate-pulse' : ''}`}>{badge}</Badge>}
        {warning && <Badge className="bg-red-500 text-white border-none font-black text-[10px] uppercase">{warning}</Badge>}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</p>
        <div className="flex flex-col">
          <span className="text-2xl font-black text-white tracking-widest">{value}</span>
          <span className="text-[10px] font-black text-slate-600 mt-0.5 tracking-tighter uppercase">{unit}</span>
        </div>
      </div>
    </Card>
  );
}

function DeptProgress({ label, value, amount, color }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-sm font-black text-white tracking-widest">AOA {amount}</p>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${color.replace('bg-', 'text-')}`}>{value}%</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.1)]`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function TxRow({ id, entity, sub, date, value, status, statusColor, bgStatus }: any) {
  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
      <td className="px-8 py-5">
        <p className="text-[10px] font-black text-slate-500 font-mono tracking-widest uppercase mb-1">{id}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-500" />
          <span className="text-xs font-bold text-white uppercase tracking-tight">Guia Facturada</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <p className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-brand-400 transition-colors">{entity}</p>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">{sub}</p>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{date}</span>
        </div>
      </td>
      <td className="px-6 py-5 text-right">
        <span className="text-sm font-black text-white tracking-widest font-mono">{value}</span>
      </td>
      <td className="px-6 py-5 text-center">
        <Badge className={`${bgStatus} ${statusColor} border-none font-black uppercase tracking-widest text-[9px] px-4 py-1.5 rounded-xl`}>
          {status}
        </Badge>
      </td>
      <td className="px-8 py-5 text-right">
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-500">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </td>
    </tr>
  );
}