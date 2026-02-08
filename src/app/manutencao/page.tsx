'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Tabs, Select } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import type { StatusOrdemServico, PrioridadeOrdem } from '@/types';

interface OrdemServico {
  id: number;
  codigo: string;
  titulo: string;
  equipamento?: string;
  departamento: string;
  tipo: string;
  prioridade: PrioridadeOrdem;
  status: StatusOrdemServico;
  dataAbertura: Date;
  dataPrevisao?: Date;
  responsavel?: string;
  descricao: string;
}

interface Equipamento {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  departamento: string;
  status: 'OPERACIONAL' | 'EM_MANUTENCAO' | 'INOPERANTE' | 'DESATIVADO';
  ultimaManutencao?: Date;
  proximaManutencao?: Date;
}



const statusConfig: Record<StatusOrdemServico, { label: string; variant: 'default' | 'primary' | 'warning' | 'success' | 'danger' }> = {
  ABERTA: { label: 'Aberta', variant: 'default' },
  EM_ANALISE: { label: 'Em Análise', variant: 'primary' },
  APROVADA: { label: 'Aprovada', variant: 'primary' },
  EM_EXECUCAO: { label: 'Em Execução', variant: 'warning' },
  AGUARDANDO_PECA: { label: 'Aguardando Peça', variant: 'warning' },
  CONCLUIDA: { label: 'Concluída', variant: 'success' },
  CANCELADA: { label: 'Cancelada', variant: 'danger' },
};

const prioridadeConfig: Record<PrioridadeOrdem, { label: string; cor: string }> = {
  CRITICA: { label: 'Crítica', cor: 'bg-red-500 text-white' },
  ALTA: { label: 'Alta', cor: 'bg-orange-500 text-white' },
  MEDIA: { label: 'Média', cor: 'bg-yellow-500 text-slate-900' },
  BAIXA: { label: 'Baixa', cor: 'bg-green-500 text-white' },
};

const equipamentoStatusConfig = {
  OPERACIONAL: { label: 'Operacional', variant: 'success' as const },
  EM_MANUTENCAO: { label: 'Em Manutenção', variant: 'warning' as const },
  INOPERANTE: { label: 'Inoperante', variant: 'danger' as const },
  DESATIVADO: { label: 'Desativado', variant: 'default' as const },
};

export default function ManutencaoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [ordensRes, equipRes] = await Promise.all([
          fetch('/api/patrimonio/manutencao'),
          fetch('/api/patrimonio/ativos')
        ]);

        const ordensResult = await ordensRes.json();
        const equipResult = await equipRes.json();

        if (ordensResult.success) {
          const osStatusMap: Record<string, string> = {
            'Pendente': 'ABERTA',
            'Em Análise': 'EM_ANALISE',
            'Aprovada': 'APROVADA',
            'Em Execução': 'EM_EXECUCAO',
            'Aguardando Peça': 'AGUARDANDO_PECA',
            'Concluída': 'CONCLUIDA',
            'Cancelada': 'CANCELADA'
          };

          // Map database fields to frontend structure
          setOrdens(ordensResult.data.map((os: any) => ({
            id: os.id,
            codigo: `OS-${os.id.toString().padStart(4, '0')}`,
            titulo: os.tipo,
            equipamento: os.equipamento,
            departamento: os.departamento || 'Geral',
            tipo: os.tipo,
            prioridade: os.prioridade as any,
            status: osStatusMap[os.status] || os.status?.toUpperCase() || 'ABERTA',
            dataAbertura: new Date(os.created_at),
            descricao: os.descricao
          })));
        }

        if (equipResult.success) {
          const statusMap: Record<string, string> = {
            'Operacional': 'OPERACIONAL',
            'Em Manutenção': 'EM_MANUTENCAO',
            'Inoperante': 'INOPERANTE',
            'Desativado': 'DESATIVADO'
          };

          setEquipamentos(equipResult.data.map((eq: any) => ({
            id: eq.id,
            codigo: eq.codigo,
            nome: eq.nome,
            categoria: eq.categoria,
            departamento: eq.localizacao || 'N/A',
            status: statusMap[eq.status] || eq.status?.toUpperCase() || 'OPERACIONAL',
            ultimaManutencao: eq.updated_at ? new Date(eq.updated_at) : undefined,
          })));
        }
      } catch (error) {
        console.error("Erro ao carregar dados de manutenção:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Estatísticas
  const stats = {
    abertas: ordens.filter((o) => ['ABERTA', 'EM_ANALISE', 'APROVADA'].includes(o.status)).length,
    emExecucao: ordens.filter((o) => o.status === 'EM_EXECUCAO').length,
    aguardandoPeca: ordens.filter((o) => o.status === 'AGUARDANDO_PECA').length,
    criticas: ordens.filter((o) => o.prioridade === 'CRITICA' && o.status !== 'CONCLUIDA').length,
    equipamentosManutencao: equipamentos.filter((e) => e.status === 'EM_MANUTENCAO').length,
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
        title="Manutenção"
        description="Gestão de ordens de serviço e equipamentos"
        actions={
          <div className="flex gap-2">
            <Link href="/manutencao/equipamentos">
              <Button variant="outline">
                <Icons.Settings size={16} />
                Equipamentos
              </Button>
            </Link>
            <Link href="/manutencao/ordens/nova">
              <Button>
                <Icons.Plus size={16} />
                Nova O.S.
              </Button>
            </Link>
          </div>
        }
      />

      <PageContent>
        {/* Estatísticas */}
        <GridLayout cols={4}>
          <Card className="border-l-4 border-sky-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-sky-600">{stats.abertas}</p>
                  <p className="text-sm text-slate-500">O.S. Abertas</p>
                </div>
                <Icons.FileText className="w-8 h-8 text-sky-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-amber-600">{stats.emExecucao}</p>
                  <p className="text-sm text-slate-500">Em Execução</p>
                </div>
                <Icons.Wrench className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.criticas}</p>
                  <p className="text-sm text-slate-500">Críticas Pendentes</p>
                </div>
                <Icons.AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{stats.equipamentosManutencao}</p>
                  <p className="text-sm text-slate-500">Equip. em Manutenção</p>
                </div>
                <Icons.Settings className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </GridLayout>

        {/* Tabs */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <Tabs
              tabs={[
                {
                  id: 'ordens',
                  label: 'Ordens de Serviço',
                  content: (
                    <div className="space-y-4">
                      {ordens.map((os) => (
                        <div
                          key={os.id}
                          className={`p-4 rounded-lg border ${os.prioridade === 'CRITICA'
                            ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800'
                            : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700'
                            }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                                  {os.titulo}
                                </h3>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${prioridadeConfig[os.prioridade as keyof typeof prioridadeConfig]?.cor || 'bg-slate-500'}`}>
                                  {prioridadeConfig[os.prioridade as keyof typeof prioridadeConfig]?.label || os.prioridade}
                                </span>
                                <Badge variant={(statusConfig[os.status as keyof typeof statusConfig] || statusConfig.ABERTA).variant}>
                                  {(statusConfig[os.status as keyof typeof statusConfig] || statusConfig.ABERTA).label}
                                </Badge>
                              </div>
                              <p className="text-sm text-sky-600 font-mono mt-1">{os.codigo}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Icons.Building size={14} />
                                  {os.departamento}
                                </span>
                                {os.equipamento && (
                                  <span className="flex items-center gap-1">
                                    <Icons.Settings size={14} />
                                    {os.equipamento}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Icons.Calendar size={14} />
                                  {os.dataAbertura.toLocaleDateString('pt-AO')}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-1">
                                {os.descricao}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Link href={`/manutencao/ordens/${os.id}`}>
                                <Button variant="outline" size="sm">
                                  <Icons.Eye size={14} />
                                  Ver
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  id: 'equipamentos',
                  label: 'Equipamentos',
                  content: (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Código</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Equipamento</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Categoria</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Departamento</th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-400">Última Manut.</th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-400">Próxima Manut.</th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-400">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {equipamentos.map((eq) => (
                            <tr key={eq.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="px-4 py-3 font-mono text-sky-600">{eq.codigo}</td>
                              <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{eq.nome}</td>
                              <td className="px-4 py-3 text-slate-500">{eq.categoria}</td>
                              <td className="px-4 py-3 text-slate-500">{eq.departamento}</td>
                              <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                                {eq.ultimaManutencao?.toLocaleDateString('pt-AO') || '-'}
                              </td>
                              <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                                {eq.proximaManutencao?.toLocaleDateString('pt-AO') || '-'}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Badge variant={(equipamentoStatusConfig[eq.status as keyof typeof equipamentoStatusConfig] || equipamentoStatusConfig.OPERACIONAL).variant}>
                                  {(equipamentoStatusConfig[eq.status as keyof typeof equipamentoStatusConfig] || equipamentoStatusConfig.OPERACIONAL).label}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ),
                },
              ]}
              defaultTab="ordens"
            />
          </CardContent>
        </Card>
      </PageContent>
    </MainLayout>
  );
}