'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Avatar } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import type { StatusConsulta } from '@/types';

interface Consulta {
  id: number;
  codigo: string;
  paciente: string;
  medico: string;
  departamento: string;
  dataHoraInicio: Date;
  status: StatusConsulta;
  tipoAtendimento: string;
  queixaPrincipal?: string;
}

import { api } from '@/services/api';

const statusConfig: Record<StatusConsulta, { label: string; variant: 'default' | 'warning' | 'success' | 'danger' }> = {
  AGUARDANDO: { label: 'Aguardando', variant: 'default' },
  EM_ANDAMENTO: { label: 'Em Andamento', variant: 'warning' },
  FINALIZADA: { label: 'Finalizada', variant: 'success' },
  CANCELADA: { label: 'Cancelada', variant: 'danger' },
  TRANSFERIDA: { label: 'Transferida', variant: 'default' },
};

// --- ListaConsultas ---
function ListaConsultas({ consultas }: { consultas: Consulta[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [items, setItems] = useState(consultas);

  React.useEffect(() => { setItems(consultas); }, [consultas]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir esta consulta?")) return;
    setDeletingId(id);
    setError("");
    try {
      await api.delete(`/consultas/${id}`);
      setItems((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message || "Erro ao excluir consulta");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {items.map((consulta) => (
        <Card key={consulta.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar fallback={consulta.paciente.charAt(0)} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                      {consulta.paciente}
                    </h3>
                    <Badge variant={statusConfig[consulta.status].variant}>
                      {statusConfig[consulta.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-sky-600 font-mono">{consulta.codigo}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {consulta.medico} • {consulta.departamento}
                  </p>
                  {consulta.queixaPrincipal && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      <span className="font-medium">Queixa:</span> {consulta.queixaPrincipal}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-sm text-slate-500">
                  {new Date(consulta.dataHoraInicio).toLocaleDateString('pt-AO')}
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {new Date(consulta.dataHoraInicio).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="flex gap-2 mt-2">
                  <Link href={`/consultas/${consulta.id}`}>
                    <Button variant="outline" size="sm">
                      <Icons.Eye size={14} />
                      Ver
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(consulta.id)} disabled={deletingId === consulta.id}>
                    {deletingId === consulta.id ? <Spinner size="sm" /> : "Excluir"}
                  </Button>
                  {consulta.status === 'EM_ANDAMENTO' && (
                    <Button size="sm">
                      <Icons.Edit size={14} />
                      Continuar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ConsultasPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<StatusConsulta | ''>('');

  useEffect(() => {
    async function fetchConsultas() {
      try {
        const data = await api.get<Consulta[]>('/consultas');
        setConsultas(data);
      } catch (error) {
        // TODO: adicionar feedback de erro
        setConsultas([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchConsultas();
  }, []);

  const consultasFiltradas = filtroStatus
    ? consultas.filter((c) => c.status === filtroStatus)
    : consultas;

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
        title="Consultas"
        description="Gestão de consultas médicas"
        actions={
          <Link href="/consultas/novo">
            <Button>
              <Icons.Plus size={16} />
              Nova Consulta
            </Button>
          </Link>
        }
      />

      <PageContent>
        {/* Filtros de Status */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={filtroStatus === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFiltroStatus('')}
          >
            Todas ({consultas.length})
          </Button>
          {(Object.keys(statusConfig) as StatusConsulta[]).map((status) => (
            <Button
              key={status}
              variant={filtroStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltroStatus(status)}
            >
              {statusConfig[status].label} ({consultas.filter((c) => c.status === status).length})
            </Button>
          ))}
        </div>

        {/* Lista de Consultas */}
        <ListaConsultas consultas={consultasFiltradas} />
        {consultasFiltradas.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Icons.Stethoscope size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                Nenhuma consulta encontrada
              </h3>
              <p className="text-slate-500 mt-1">
                Não há consultas com o filtro selecionado.
              </p>
            </CardContent>
          </Card>
        )}
      </PageContent>
    </MainLayout>
  );
}

