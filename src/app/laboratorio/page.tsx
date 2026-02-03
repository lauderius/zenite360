'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Tabs, Avatar } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import { api } from '@/services/api';

interface Exame {
  id: number;
  codigo: string;
  paciente: string;
  tipoExame: string;
  categoria: string;
  dataSolicitacao: Date;
  dataColeta?: Date;
  dataResultado?: Date;
  solicitante: string;
  status: 'SOLICITADO' | 'COLETADO' | 'EM_ANALISE' | 'CONCLUIDO' | 'CANCELADO';
  urgente: boolean;
}

interface TipoExame {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  prazo: string;
  preco: number;
}



const statusConfig = {
  SOLICITADO: { label: 'Solicitado', variant: 'default' as const, cor: 'bg-slate-500' },
  COLETADO: { label: 'Coletado', variant: 'primary' as const, cor: 'bg-blue-500' },
  EM_ANALISE: { label: 'Em Análise', variant: 'warning' as const, cor: 'bg-amber-500' },
  CONCLUIDO: { label: 'Concluído', variant: 'success' as const, cor: 'bg-emerald-500' },
  CANCELADO: { label: 'Cancelado', variant: 'danger' as const, cor: 'bg-red-500' },
};

const categorias = ['Hematologia', 'Bioquímica', 'Uroanálise', 'Hormonal', 'Sorologia', 'Microbiologia'];

export default function LaboratorioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [exames, setExames] = useState<Exame[]>([]);
  const [tiposExame, setTiposExame] = useState<TipoExame[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');

  useEffect(() => {
    async function fetchLaboratorio() {
      try {
        const response = await api.get('/laboratorio');
        setExames(response.data || []);
        // TODO: Implementar endpoint para tipos de exame
        setTiposExame([]);
      } catch (error) {
        setExames([]);
        setTiposExame([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLaboratorio();
  }, []);

  const examesFiltrados = exames.filter((e) => {
    if (filtroStatus && e.status !== filtroStatus) return false;
    if (filtroCategoria && e.categoria !== filtroCategoria) return false;
    return true;
  });

  // Estatísticas
  const stats = {
    solicitados: exames.filter((e) => e.status === 'SOLICITADO').length,
    emAnalise: exames.filter((e) => e.status === 'EM_ANALISE').length,
    concluidos: exames.filter((e) => e.status === 'CONCLUIDO').length,
    urgentes: exames.filter((e) => e.urgente && e.status !== 'CONCLUIDO').length,
  };

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
        title="Laboratório"
        description="Gestão de exames e resultados laboratoriais"
        actions={
          <div className="flex gap-2">
            <Link href="/laboratorio/resultados">
              <Button variant="outline">
                <Icons.FileText size={16} />
                Resultados
              </Button>
            </Link>
            <Link href="/laboratorio/exames/novo">
              <Button>
                <Icons.Plus size={16} />
                Solicitar Exame
              </Button>
            </Link>
          </div>
        }
      />

      <PageContent>
        {/* Estatísticas */}
        <GridLayout cols={4}>
          <Card className="border-l-4 border-slate-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-600">{stats.solicitados}</p>
                  <p className="text-sm text-slate-500">Aguardando Coleta</p>
                </div>
                <Icons.Clock className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-amber-600">{stats.emAnalise}</p>
                  <p className="text-sm text-slate-500">Em Análise</p>
                </div>
                <Icons.Activity className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{stats.concluidos}</p>
                  <p className="text-sm text-slate-500">Concluídos Hoje</p>
                </div>
                <Icons.Check className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.urgentes}</p>
                  <p className="text-sm text-slate-500">Urgentes Pendentes</p>
                </div>
                <Icons.AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </GridLayout>

        {/* Conteúdo Principal */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <Tabs
              tabs={[
                {
                  id: 'fila',
                  label: 'Fila de Exames',
                  content: (
                    <div>
                      {/* Filtros */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Button
                          variant={filtroStatus === '' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFiltroStatus('')}
                        >
                          Todos
                        </Button>
                        {Object.entries(statusConfig).map(([key, value]) => (
                          <Button
                            key={key}
                            variant={filtroStatus === key ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFiltroStatus(key)}
                          >
                            {value.label}
                          </Button>
                        ))}
                      </div>

                      {/* Lista de Exames */}
                      <div className="space-y-3">
                        {examesFiltrados.map((exame) => (
                          <div
                            key={exame.id}
                            className={`flex items-center justify-between p-4 rounded-lg border ${exame.urgente
                                ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800'
                                : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700'
                              }`}
                          >
                            <div className="flex items-center gap-4">
                              {/* Indicador de Status */}
                              <div className={`w-2 h-12 rounded-full ${statusConfig[exame.status].cor}`} />

                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-slate-700 dark:text-slate-200">
                                    {exame.paciente}
                                  </p>
                                  {exame.urgente && (
                                    <Badge variant="danger">
                                      <Icons.AlertTriangle size={12} className="mr-1" />
                                      Urgente
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-sky-600 font-mono">{exame.codigo}</p>
                                <p className="text-sm text-slate-500">
                                  {exame.tipoExame} • {exame.categoria}
                                </p>
                                <p className="text-xs text-slate-400">
                                  Solicitado por {exame.solicitante}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Badge variant={statusConfig[exame.status].variant}>
                                {statusConfig[exame.status].label}
                              </Badge>

                              <div className="flex gap-1">
                                {exame.status === 'SOLICITADO' && (
                                  <Button size="sm" variant="outline">
                                    <Icons.Check size={14} />
                                    Coletar
                                  </Button>
                                )}
                                {exame.status === 'COLETADO' && (
                                  <Button size="sm" variant="outline">
                                    <Icons.Activity size={14} />
                                    Analisar
                                  </Button>
                                )}
                                {exame.status === 'EM_ANALISE' && (
                                  <Button size="sm">
                                    <Icons.FileText size={14} />
                                    Resultado
                                  </Button>
                                )}
                                {exame.status === 'CONCLUIDO' && (
                                  <Button size="sm" variant="outline">
                                    <Icons.Eye size={14} />
                                    Ver
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'catalogo',
                  label: 'Catálogo de Exames',
                  content: (
                    <div>
                      {/* Filtro por categoria */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Button
                          variant={filtroCategoria === '' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFiltroCategoria('')}
                        >
                          Todas
                        </Button>
                        {categorias.map((cat) => (
                          <Button
                            key={cat}
                            variant={filtroCategoria === cat ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFiltroCategoria(cat)}
                          >
                            {cat}
                          </Button>
                        ))}
                      </div>

                      {/* Tabela de Tipos de Exame */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Código</th>
                              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Exame</th>
                              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Categoria</th>
                              <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-400">Prazo</th>
                              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">Preço</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tiposExame
                              .filter((t) => !filtroCategoria || t.categoria === filtroCategoria)
                              .map((tipo) => (
                                <tr key={tipo.id} className="border-b border-slate-100 dark:border-slate-700">
                                  <td className="px-4 py-3 font-mono text-sky-600">{tipo.codigo}</td>
                                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{tipo.nome}</td>
                                  <td className="px-4 py-3 text-slate-500">{tipo.categoria}</td>
                                  <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{tipo.prazo}</td>
                                  <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-200">
                                    {tipo.preco.toLocaleString('pt-AO')} Kz
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ),
                },
              ]}
              defaultTab="fila"
            />
          </CardContent>
        </Card>
      </PageContent>
    </MainLayout>
  );
}