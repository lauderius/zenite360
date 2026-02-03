'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  User,
  Stethoscope,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { MainLayout, PageHeader, PageContent } from '@/components/layouts';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Modal, Select, Spinner } from '@/components/ui';
import Link from 'next/link';
import { api } from '@/services/api';

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<'lista' | 'calendario'>('lista');

  // New Appointment Form State
  const [formData, setFormData] = useState({
    paciente_id: '',
    medico_id: '1', // Placeholder doctor ID
    data_agendamento: '',
    hora_inicio: '',
    tipo_agendamento: 'Consulta',
    especialidade: 'Clínica Geral',
    motivo_consulta: ''
  });

  const fetchAgendamentos = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ data: any[] }>('/agendamentos');
      setAgendamentos(res.data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setAgendamentos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPacientes = async () => {
    try {
      const res = await api.get<{ data: any[] }>('/pacientes');
      setPacientes(res.data || []);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
    fetchPacientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/agendamentos', formData);
      setIsModalOpen(false);
      setFormData({
        paciente_id: '',
        medico_id: '1',
        data_agendamento: '',
        hora_inicio: '',
        tipo_agendamento: 'Consulta',
        especialidade: 'Clínica Geral',
        motivo_consulta: ''
      });
      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pendente': return <Badge variant="warning" className="uppercase text-[9px] font-black">Pendente</Badge>;
      case 'Confirmado': return <Badge variant="primary" className="uppercase text-[9px] font-black">Confirmado</Badge>;
      case 'Em_Andamento': return <Badge variant="info" className="uppercase text-[9px] font-black">Em Atendimento</Badge>;
      case 'Concluido': return <Badge variant="success" className="uppercase text-[9px] font-black">Concluido</Badge>;
      case 'Cancelado': return <Badge variant="danger" className="uppercase text-[9px] font-black">Cancelado</Badge>;
      default: return <Badge variant="secondary" className="uppercase text-[9px] font-black">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Agenda Médica"
        description="Gestão centralizada de consultas, retornos e procedimentos."
        actions={
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gradient-brand border-none rounded-2xl font-bold px-6 shadow-lg shadow-brand-500/20 group"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        }
      />

      <PageContent>
        {/* Modal Novo Agendamento */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Agendar Nova Consulta"
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Paciente"
                required
                options={pacientes.map(p => ({ value: p.id, label: p.nome_completo }))}
                value={formData.paciente_id}
                onChange={(e) => setFormData({ ...formData, paciente_id: e.target.value })}
              />
              <Select
                label="Especialidade"
                options={[
                  { value: 'Clínica Geral', label: 'Clínica Geral' },
                  { value: 'Pediatria', label: 'Pediatria' },
                  { value: 'Ginecologia', label: 'Ginecologia' },
                  { value: 'Ortopedia', label: 'Ortopedia' },
                  { value: 'Cardiologia', label: 'Cardiologia' }
                ]}
                value={formData.especialidade}
                onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
              />
              <Input
                label="Data da Consulta"
                type="date"
                required
                value={formData.data_agendamento}
                onChange={(e) => setFormData({ ...formData, data_agendamento: e.target.value })}
              />
              <Input
                label="Horário"
                type="time"
                required
                value={formData.hora_inicio}
                onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
              />
              <Select
                label="Tipo de Atendimento"
                options={[
                  { value: 'Consulta', label: 'Consulta de Rotina' },
                  { value: 'Retorno', label: 'Retorno' },
                  { value: 'Urgencia', label: 'Urgência' },
                  { value: 'Exame', label: 'Exame' }
                ]}
                value={formData.tipo_agendamento}
                onChange={(e) => setFormData({ ...formData, tipo_agendamento: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Motivo da Consulta</label>
              <textarea
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all min-h-[100px]"
                placeholder="Descreva brevemente o motivo do agendamento..."
                value={formData.motivo_consulta}
                onChange={(e) => setFormData({ ...formData, motivo_consulta: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="gradient-brand border-none" isLoading={isSubmitting}>Confirmar Agendamento</Button>
            </div>
          </form>
        </Modal>

        {/* View Toggle & Filters */}
        <div className="flex flex-col xl:flex-row gap-6 mb-8 items-center justify-between">
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => setView('lista')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${view === 'lista' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Vista em Lista
            </button>
            <button
              onClick={() => setView('calendario')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${view === 'calendario' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Vista em Calendário
            </button>
          </div>

          <div className="flex gap-3 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input className="input-premium pl-12 h-12 text-xs" placeholder="Pesquisar agendamento..." />
            </div>
            <Button variant="outline" className="h-12 w-12 rounded-2xl border-white/5">
              <Filter className="w-4 h-4 text-slate-500" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Hoje" value={agendamentos.length.toString()} icon={<Calendar className="text-brand-500" />} />
          <StatsCard title="Atendidos" value="12" icon={<CheckCircle2 className="text-emerald-500" />} />
          <StatsCard title="Em Espera" value="05" icon={<Clock className="text-amber-500" />} />
          <StatsCard title="Cancelados" value="02" icon={<XCircle className="text-red-500" />} />
        </div>

        {/* Main Content */}
        <Card className="glass-card border-none rounded-3xl overflow-hidden min-h-[500px]">
          {isLoading ? (
            <div className="flex items-center justify-center p-20">
              <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
            </div>
          ) : view === 'lista' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <th className="px-8 py-5">Horário / Data</th>
                    <th className="px-6 py-5">Paciente</th>
                    <th className="px-6 py-5">Especialidade / Médico</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right">Acções</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {agendamentos.map((ag) => (
                    <tr key={ag.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-brand-500" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white">{ag.hora_inicio.substring(0, 5)}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">{new Date(ag.data_agendamento).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-400">
                            {ag.pacientes?.nome_completo?.charAt(0)}
                          </div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">{ag.pacientes?.nome_completo}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-300">{ag.especialidade}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase mt-0.5">Dr. {ag.medicos?.name || 'Não atribuído'}</p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {getStatusBadge(ag.status)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-brand-500/10 text-brand-500">
                            <Activity className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white/10 text-slate-500">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {agendamentos.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhum agendamento encontrado</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center">
              <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">A vista de calendário está a ser integrada...</p>
            </div>
          )}
        </Card>
      </PageContent>
    </MainLayout>
  );
}

function StatsCard({ title, value, icon }: any) {
  return (
    <Card className="glass-card border-none rounded-3xl p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-3xl font-black text-white">{value}</h3>
        </div>
        <div className="p-3 rounded-2xl bg-white/5">
          {icon}
        </div>
      </div>
    </Card>
  );
}