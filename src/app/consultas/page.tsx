'use client';

import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Search,
  Filter,
  MoreVertical,
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  Activity,
  User,
  AlertCircle,
  ClipboardList,
  FileText
} from 'lucide-react';
import { MainLayout, PageHeader, PageContent } from '@/components/layouts';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Modal, Select, Avatar } from '@/components/ui';
import Link from 'next/link';
import { api } from '@/services/api';

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Todas');

  const fetchConsultas = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ data: any[] }>('/consultas');
      setConsultas(res.data || []);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      setConsultas([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  const getUrgencyColor = (urgencia: string) => {
    switch (urgencia) {
      case 'Emergencia': return 'bg-red-500';
      case 'Muito_Urgente': return 'bg-orange-500';
      case 'Urgente': return 'bg-amber-500';
      case 'Pouco_Urgente': return 'bg-emerald-500';
      default: return 'bg-sky-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aguardando': return <Badge variant="secondary">Aguardando</Badge>;
      case 'Em_Andamento': return <Badge variant="warning">Em Curso</Badge>;
      case 'Finalizada': return <Badge variant="success">Concluída</Badge>;
      case 'Cancelada': return <Badge variant="danger">Cancelada</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Consultas Médicas"
        description="Acompanhamento clínico, histórico de atendimentos e gestão de pacientes."
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => window.open('/api/pdf/consultas', '_blank')}
              variant="outline" className="rounded-2xl border-white/5 hover:bg-white/5"
            >
              <FileText className="w-4 h-4 mr-2" />
              Relatório
            </Button>
            <Link href="/consultas/novo">
              <Button className="gradient-brand border-none rounded-2xl font-bold px-6 shadow-lg shadow-brand-500/20">
                <Plus className="w-4 h-4 mr-2" />
                Nova Consulta
              </Button>
            </Link>
          </div>
        }
      />

      <PageContent>
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Atendimentos Hoje" value={consultas.length.toString()} icon={<Activity className="text-brand-500" />} />
          <StatsCard title="Em Espera" value="12" icon={<Clock className="text-amber-500" />} />
          <StatsCard title="Concluídas" value="45" icon={<CheckCircle2 className="text-emerald-500" />} />
          <StatsCard title="Taxa Ocupação" value="88%" icon={<Stethoscope className="text-indigo-500" />} />
        </div>

        {/* Filters */}
        <div className="glass-panel p-6 rounded-3xl mb-8 flex flex-col xl:flex-row gap-6 items-center border-brand-500/5">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
            <input
              className="input-premium pl-12 h-14 text-sm"
              placeholder="Pesquisar por paciente, médico ou código de atendimento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3 w-full xl:w-auto">
            <select
              className="input-premium h-14 px-6 text-sm flex-1 min-w-[180px]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>Todas as Consultas</option>
              <option>Em Andamento</option>
              <option>Aguardando</option>
              <option>Finalizadas</option>
            </select>
            <Button variant="outline" className="h-14 w-14 rounded-2xl border-white/5">
              <Filter className="w-5 h-5 text-slate-500" />
            </Button>
          </div>
        </div>

        {/* List */}
        <Card className="glass-card border-none rounded-3xl overflow-hidden min-h-[500px]">
          {isLoading ? (
            <div className="flex items-center justify-center p-20">
              <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <th className="px-8 py-5">Paciente</th>
                    <th className="px-6 py-5">Atendimento / Triagem</th>
                    <th className="px-6 py-5">Médico / Especialidade</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right">Acções</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {consultas.map((consulta) => (
                    <tr key={consulta.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-brand-500 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform">
                            {consulta.pacientes?.nome_completo?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white uppercase tracking-tight">{consulta.pacientes?.nome_completo}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5 mt-1">
                              ID: {consulta.pacientes?.id} • Processo: {consulta.pacientes?.numero_processo}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getUrgencyColor(consulta.triagem?.classificacao_manchester)}`} />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                              {consulta.triagem?.classificacao_manchester || 'Sem Triagem'}
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-brand-500" />
                            {new Date(consulta.data_hora_inicio).toLocaleDateString()} {new Date(consulta.data_hora_inicio).toLocaleTimeString().substring(0, 5)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-300">Dr. {consulta.medicos?.name}</span>
                          <span className="text-[10px] font-black text-brand-500/80 uppercase tracking-widest mt-0.5">{consulta.departamento}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {getStatusBadge(consulta.status)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/consultas/${consulta.id}`}>
                            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-brand-500/10 text-brand-500">
                              <ClipboardList className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white/10 text-slate-500">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {consultas.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Stethoscope className="w-12 h-12 text-slate-800" />
                          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhuma consulta registada no sistema</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </PageContent>
    </MainLayout>
  );
}

function StatsCard({ title, value, icon }: any) {
  return (
    <Card className="glass-card border-none rounded-3xl p-6 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-3xl font-black text-white">{value}</h3>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
    </Card>
  );
}

