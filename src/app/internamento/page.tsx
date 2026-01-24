'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Avatar } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import type { StatusInternamento } from '@/types';

interface Internamento {
  id: number;
  codigo: string;
  paciente: string;
  leito: string;
  setor: string;
  medicoResponsavel: string;
  dataAdmissao: Date;
  diagnostico: string;
  status: StatusInternamento;
  diasInternado: number;
}

import { api } from '@/services/api';

// Mapa de leitos (dados dinâmicos baseados nos internamentos)
const setoresFixos = [
  { nome: 'Enfermaria Geral', prefixo: 'E-', totalLeitos: 6 },
  { nome: 'UTI', prefixo: 'UTI-', totalLeitos: 4 },
  { nome: 'Cirurgia', prefixo: 'C-', totalLeitos: 6 },
];

const statusConfig: Record<StatusInternamento, { label: string; variant: 'default' | 'warning' | 'success' | 'danger' | 'primary' }> = {
  ADMITIDO: { label: 'Admitido', variant: 'primary' },
  EM_TRATAMENTO: { label: 'Em Tratamento', variant: 'warning' },
  ALTA_MEDICA: { label: 'Alta Médica', variant: 'success' },
  ALTA_PEDIDO: { label: 'Alta a Pedido', variant: 'default' },
  TRANSFERIDO: { label: 'Transferido', variant: 'default' },
  OBITO: { label: 'Óbito', variant: 'danger' },
  EVASAO: { label: 'Evasão', variant: 'danger' },
};

// Componente ListaInternamentos
function ListaInternamentos({ internamentos }: { internamentos: Internamento[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [items, setItems] = useState(internamentos);

  React.useEffect(() => { setItems(internamentos); }, [internamentos]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este internamento?")) return;
    setDeletingId(id);
    setError("");
    try {
      await api.delete(`/internamento/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      setError(err.message || "Erro ao excluir internamento");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {items.map((int) => (
        <Card key={int.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Icons.Bed size={24} className="text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                      {int.paciente}
                    </h3>
                    <Badge variant={statusConfig[int.status].variant}>
                      {statusConfig[int.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-sky-600 font-mono">{int.codigo}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Icons.Bed size={14} />
                      Leito: {int.leito}
                    </span>
                    <span>{int.setor}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span className="font-medium">Diagnóstico:</span> {int.diagnostico}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Médico: {int.medicoResponsavel}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">
                  {new Date(int.dataAdmissao).toLocaleDateString('pt-AO')}
                </p>
                <p className="text-lg font-bold text-purple-600 mt-1">
                  {int.diasInternado} dias
                </p>
                <div className="flex gap-2 mt-2">
                  <Link href={`/internamento/${int.id}`}>
                    <Button variant="outline" size="sm">
                      <Icons.Eye size={14} />
                      Ver
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(int.id)} disabled={deletingId === int.id}>
                    {deletingId === int.id ? <Spinner size="sm" /> : "Excluir"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function InternamentoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [internamentos, setInternamentos] = useState<Internamento[]>([]);
  const [viewMode, setViewMode] = useState<'lista' | 'mapa'>('lista');

  useEffect(() => {
    async function fetchInternamentos() {
      try {
        const data = await api.get<Internamento[]>('/internamento');
        setInternamentos(data);
      } catch (error) {
        // TODO: adicionar feedback de erro
        setInternamentos([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInternamentos();
  }, []);

  // Gerar mapa dinâmico de leitos baseado nos internamentos
  const setores = setoresFixos.map((setorFixo) => {
    const leitos = [];
    for (let i = 1; i <= setorFixo.totalLeitos; i++) {
      const codigo = `${setorFixo.prefixo}${String(i).padStart(3, '0')}`;
      const internamentoNoLeito = internamentos.find(int => int.leito === codigo);
      leitos.push({
        codigo,
        ocupado: !!internamentoNoLeito,
        paciente: internamentoNoLeito?.paciente || '',
        critico: setorFixo.nome === 'UTI' && internamentoNoLeito?.status === 'EM_TRATAMENTO',
      });
    }
    return {
      nome: setorFixo.nome,
      leitos,
    };
  });

  // Estatísticas
  const totalLeitos = setores.reduce((acc, s) => acc + s.leitos.length, 0);
  const leitosOcupados = setores.reduce((acc, s) => acc + s.leitos.filter((l) => l.ocupado).length, 0);
  const taxaOcupacao = Math.round((leitosOcupados / totalLeitos) * 100);

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
        title="Internamento"
        description="Gestão de pacientes internados e leitos"
        actions={
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'lista' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('lista')}
            >
              <Icons.FileText size={16} />
              Lista
            </Button>
            <Button
              variant={viewMode === 'mapa' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mapa')}
            >
              <Icons.Dashboard size={16} />
              Mapa de Leitos
            </Button>
            <Link href="/internamento/novo">
              <Button>
                <Icons.Plus size={16} />
                Nova Admissão
              </Button>
            </Link>
          </div>
        }
      />

      <PageContent>
        {/* Estatísticas */}
        <GridLayout cols={4}>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-sky-600">{totalLeitos}</p>
              <p className="text-sm text-slate-500">Total de Leitos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">{totalLeitos - leitosOcupados}</p>
              <p className="text-sm text-slate-500">Disponíveis</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">{leitosOcupados}</p>
              <p className="text-sm text-slate-500">Ocupados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${taxaOcupacao > 80 ? 'text-red-600' : 'text-purple-600'}`}>
                {taxaOcupacao}%
              </p>
              <p className="text-sm text-slate-500">Taxa de Ocupação</p>
            </CardContent>
          </Card>
        </GridLayout>

        {/* Conteúdo baseado no modo de visualização */}
        <div className="mt-6">
          {viewMode === 'mapa' ? (
            // Mapa de Leitos
            <div className="space-y-6">
              {setores.map((setor) => (
                <Card key={setor.nome}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{setor.nome}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {setor.leitos.map((leito) => (
                        <div
                          key={leito.codigo}
                          className={`p-3 rounded-lg border-2 text-center cursor-pointer transition-all hover:shadow-md ${
                            leito.ocupado
                              ? leito.critico
                                ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                                : 'border-amber-300 bg-amber-50 dark:bg-amber-900/20'
                              : 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100'
                          }`}
                        >
                          <Icons.Bed
                            size={24}
                            className={`mx-auto mb-1 ${
                              leito.ocupado
                                ? leito.critico
                                  ? 'text-red-600'
                                  : 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          />
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {leito.codigo}
                          </p>
                          {leito.ocupado ? (
                            <p className="text-xs text-slate-500 truncate">{leito.paciente}</p>
                          ) : (
                            <p className="text-xs text-emerald-600">Disponível</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Legenda */}
              <div className="flex gap-6 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">Ocupado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">Crítico (UTI)</span>
                </div>
              </div>
            </div>
          ) : (
            // Lista de Internamentos
            <ListaInternamentos internamentos={internamentos} />

// --- ListaInternamentos ---
function ListaInternamentos({ internamentos }: { internamentos: Internamento[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [items, setItems] = useState(internamentos);

  React.useEffect(() => { setItems(internamentos); }, [internamentos]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este internamento?")) return;
    setDeletingId(id);
    setError("");
    try {
      await api.delete(`/internamento/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      setError(err.message || "Erro ao excluir internamento");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {items.map((int) => (
        <Card key={int.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Icons.Bed size={24} className="text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                      {int.paciente}
                    </h3>
                    <Badge variant={statusConfig[int.status].variant}>
                      {statusConfig[int.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-sky-600 font-mono">{int.codigo}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Icons.Bed size={14} />
                      Leito: {int.leito}
                    </span>
                    <span>{int.setor}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span className="font-medium">Diagnóstico:</span> {int.diagnostico}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Médico: {int.medicoResponsavel}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">
                  {new Date(int.dataAdmissao).toLocaleDateString('pt-AO')}
                </p>
                <p className="text-lg font-bold text-purple-600 mt-1">
                  {int.diasInternado} dias
                </p>
                <div className="flex gap-2 mt-2">
                  <Link href={`/internamento/${int.id}`}>
                    <Button variant="outline" size="sm">
                      <Icons.Eye size={14} />
                      Ver
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(int.id)} disabled={deletingId === int.id}>
                    {deletingId === int.id ? <Spinner size="sm" /> : "Excluir"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
          )}
        </div>
      </PageContent>
    </MainLayout>
  );
}