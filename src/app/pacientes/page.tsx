'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Circle,
  Clock,
  ExternalLink,
  ClipboardList
} from 'lucide-react';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Select, Avatar, Modal, Spinner } from '@/components/ui';
import Link from 'next/link';
import { api } from '@/services/api';

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    emergencia: 0,
    muitoUrgente: 0,
    urgente: 0,
    monitorizacao: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New Patient Form State
  const initialFormData = {
    nome_completo: '',
    bi_numero: '',
    numero_processo: '',
    data_nascimento: '',
    genero: 'Masculino',
    telefone_principal: '',
    contacto_emergencia_nome: '',
    contacto_emergencia_telefone: '',
    provincia: 'Luanda',
    municipio: '',
    grupo_sanguineo: '',
    alergias: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const fetchPacientes = async (query = "") => {
    setIsLoading(true);
    try {
      const res = await api.get<{ data: any[], stats?: any }>(`/pacientes${query ? `?q=${query}` : ""}`);
      setPacientes(res.data || []);
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      setPacientes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPacientes(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await api.put(`/pacientes/${editingId}`, formData);
      } else {
        await api.post("/pacientes", formData);
      }
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData(initialFormData);
      fetchPacientes(searchTerm);
    } catch (error) {
      console.error('Erro ao processar paciente:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (paciente: any) => {
    setIsEditing(true);
    setEditingId(paciente.id);
    setFormData({
      nome_completo: paciente.nome_completo,
      bi_numero: paciente.bi_numero,
      numero_processo: paciente.numero_processo,
      data_nascimento: paciente.data_nascimento ? paciente.data_nascimento.substring(0, 10) : '',
      genero: paciente.genero || 'Masculino',
      telefone_principal: paciente.telefone_principal || '',
      contacto_emergencia_nome: paciente.contacto_emergencia_nome || '',
      contacto_emergencia_telefone: paciente.contacto_emergencia_telefone || '',
      provincia: paciente.provincia || 'Luanda',
      municipio: paciente.municipio || '',
      grupo_sanguineo: paciente.grupo_sanguineo || '',
      alergias: paciente.alergias || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja eliminar este paciente?')) return;

    try {
      await api.delete(`/pacientes/${id}`);
      fetchPacientes(searchTerm);
    } catch (error) {
      console.error("Erro ao eliminar paciente:", error);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Gestão de Pacientes"
        description="Listagem geral, admissões e monitorização de atendimento."
        actions={
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gradient-brand border-none rounded-2xl font-bold px-6 shadow-lg shadow-brand-500/20 group"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Registro
          </Button>
        }
      />

      <PageContent>
        {/* Modal Novo Paciente */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditing(false);
            setFormData(initialFormData);
          }}
          title={isEditing ? "Editar Dados do Paciente" : "Cadastrar Novo Paciente"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome Completo"
                required
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
              />
              <Input
                label="B.I. Número"
                required
                value={formData.bi_numero}
                onChange={(e) => setFormData({ ...formData, bi_numero: e.target.value })}
              />
              <Input
                label="Nº Processo"
                required
                value={formData.numero_processo}
                onChange={(e) => setFormData({ ...formData, numero_processo: e.target.value })}
              />
              <Input
                label="Data Nascimento"
                type="date"
                required
                value={formData.data_nascimento}
                onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
              />
              <Select
                label="Género"
                options={[{ value: 'Masculino', label: 'Masculino' }, { value: 'Feminino', label: 'Feminino' }]}
                value={formData.genero}
                onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
              />
              <Input
                label="Telefone Principal"
                required
                value={formData.telefone_principal}
                onChange={(e) => setFormData({ ...formData, telefone_principal: e.target.value })}
              />
              <Input
                label="Província"
                value={formData.provincia}
                onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
              />
              <Input
                label="Município"
                value={formData.municipio}
                onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
              />
              <Select
                label="Grupo Sanguíneo"
                options={[
                  { value: '', label: 'Não Informado' },
                  { value: 'A+', label: 'A+' },
                  { value: 'A-', label: 'A-' },
                  { value: 'B+', label: 'B+' },
                  { value: 'B-', label: 'B-' },
                  { value: 'AB+', label: 'AB+' },
                  { value: 'AB-', label: 'AB-' },
                  { value: 'O+', label: 'O+' },
                  { value: 'O-', label: 'O-' },
                ]}
                value={formData.grupo_sanguineo}
                onChange={(e) => setFormData({ ...formData, grupo_sanguineo: e.target.value })}
              />
              <Input
                label="Alergias"
                placeholder="Ex: Penicilina, Dipirona..."
                value={formData.alergias}
                onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Contacto de Emergência</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome do Contacto"
                  required
                  value={formData.contacto_emergencia_nome}
                  onChange={(e) => setFormData({ ...formData, contacto_emergencia_nome: e.target.value })}
                />
                <Input
                  label="Telefone do Contacto"
                  required
                  value={formData.contacto_emergencia_telefone}
                  onChange={(e) => setFormData({ ...formData, contacto_emergencia_telefone: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="gradient-brand border-none" isLoading={isSubmitting}>Salvar Paciente</Button>
            </div>
          </form>
        </Modal>
        {/* Filters & Toolbar */}
        <div className="glass-panel p-6 rounded-3xl mb-8 flex flex-col xl:flex-row gap-6 items-center border-brand-500/5">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
            <input
              className="input-premium pl-12 h-14 text-sm"
              placeholder="Pesquisar por nome, B.I. ou número de processo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <select className="h-14 px-6 min-w-[200px] text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-bold">
              <optgroup label="Filtrar por Status" className="bg-white dark:bg-slate-900">
                <option value="">Todos os Estados</option>
                <option value="Em Triagem">Em Triagem</option>
                <option value="Aguardando">Aguardando</option>
                <option value="Em Atendimento">Em Atendimento</option>
                <option value="Alta">Alta</option>
              </optgroup>
            </select>
            <Button variant="outline" className="h-14 w-14 rounded-2xl border-white/5 hover:bg-white/5">
              <Filter className="w-5 h-5 text-slate-500" />
            </Button>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <FilterChip label="Todos" count={pacientes.length} active />
          <FilterChip label="Emergência" count={stats.emergencia} color="bg-red-500" />
          <FilterChip label="V. Urgente" count={stats.muitoUrgente} color="bg-orange-500" />
          <FilterChip label="Urgente" count={stats.urgente} color="bg-amber-500" />
          <FilterChip label="Monitorização" count={stats.monitorizacao} color="bg-brand-500" />
        </div>

        {/* Patients Table */}
        <Card className="glass-card border-none rounded-3xl overflow-hidden min-h-[400px]">
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
                    <th className="px-6 py-5">Identificação (B.I.)</th>
                    <th className="px-6 py-5 text-center">Data Registro</th>
                    <th className="px-8 py-5 text-center">Acções</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pacientes.map((p) => (
                    <PatientRow
                      key={p.id}
                      id={p.id}
                      name={p.nome_completo}
                      bi={p.bi_numero}
                      process={p.numero_processo}
                      createdAt={p.created_at}
                      initials={p.nome_completo?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                      onDelete={() => handleDelete(p.id)}
                      onEdit={() => handleEdit(p)}
                    />
                  ))}
                  {pacientes.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhum paciente encontrado</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && pacientes.length > 0 && (
            <div className="bg-white/5 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Página 1 — <span className="text-slate-200">{pacientes.length} Pacientes</span>
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled className="rounded-xl border-white/5">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="default" className="w-10 h-10 rounded-xl font-black gradient-brand border-none">1</Button>
                <Button variant="outline" size="icon" className="rounded-xl border-white/5">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </PageContent>
    </MainLayout>
  );
}

function FilterChip({ label, count, color, active }: any) {
  return (
    <button className={`flex items-center gap-2 px-4 py-2 rounded-2xl whitespace-nowrap transition-all font-bold text-xs uppercase tracking-tight ${active
      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
      : 'bg-white/5 border border-white/5 text-slate-500 hover:bg-white/10'
      }`}>
      {color && <div className={`w-2 h-2 rounded-full ${color}`} />}
      {label}
      <span className={`px-1.5 py-0.5 rounded-lg text-[10px] ${active ? 'bg-white/20' : 'bg-slate-800'}`}>{count}</span>
    </button>
  );
}

function PatientRow({ name, id, bi, process, createdAt, initials, onDelete, onEdit }: any) {
  const formattedDate = new Date(createdAt).toLocaleDateString('pt-AO');

  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-brand-500 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform">
            {initials}
            <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-tight">{name}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5 mt-1">
              <Clock className="w-3 h-3 text-brand-500" />
              Processo: {process}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <p className="text-sm font-black text-slate-400 font-mono tracking-tighter">{bi}</p>
      </td>
      <td className="px-6 py-5 text-center">
        <Badge variant="secondary" className="border-white/10 text-slate-300 font-bold uppercase text-[9px] tracking-widest px-3 py-1.5 rounded-xl">
          {formattedDate}
        </Badge>
      </td>
      <td className="px-8 py-5 text-center">
        <div className="flex items-center justify-center gap-2">
          <Link href={`/pacientes/${id}`}>
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-brand-500/10 hover:text-brand-500">
              <ClipboardList className="w-4 h-4" />
            </Button>
          </Link>
          <div className="relative group/menu">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white/10 text-slate-500">
              <MoreVertical className="w-4 h-4" />
            </Button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 p-2 text-left">
              <button
                onClick={onEdit}
                className="w-full text-left px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/5 rounded-lg flex items-center gap-2"
              >
                Editar Dados
              </button>
              <button
                onClick={onDelete}
                className="w-full text-left px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2"
              >
                Eliminar Paciente
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}