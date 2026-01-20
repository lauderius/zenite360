'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Tabs, Select } from '@/components/ui';
import { Icons } from '@/components/ui/Icons';
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

const mockOrdens: OrdemServico[] = [
  {
    id: 1,
    codigo: 'OS-2024-00001',
    titulo: 'Monitor cardíaco com falha no display',
    equipamento: 'Monitor Cardíaco MC-500',
    departamento: 'UTI',
    tipo: 'CORRETIVA',
    prioridade: 'CRITICA',
    status: 'EM_EXECUCAO',
    dataAbertura: new Date('2024-01-14'),
    dataPrevisao: new Date('2024-01-15'),
    responsavel: 'João Técnico',
    descricao: 'Display apresentando falhas intermitentes, paciente em risco.',
  },
  {
    id: 2,
    codigo: 'OS-2024-00002',
    titulo: 'Ar condicionado com vazamento',
    departamento: 'Enfermaria Geral',
    tipo: 'CORRETIVA',
    prioridade: 'ALTA',
    status: 'ABERTA',
    dataAbertura: new Date('2024-01-14'),
    descricao: 'Ar condicionado da enfermaria 3 com vazamento de água.',
  },
  {
    id: 3,
    codigo: 'OS-2024-00003',
    titulo: 'Manutenção preventiva - Autoclave',
    equipamento: 'Autoclave AC-200',
    departamento: 'Central de Esterilização',
    tipo: 'PREVENTIVA',
    prioridade: 'MEDIA',
    status: 'APROVADA',
    dataAbertura: new Date('2024-01-13'),
    dataPrevisao: new Date('2024-01-20'),
    descricao: 'Manutenção preventiva trimestral conforme calendário.',
  },
  {
    id: 4,
    codigo: 'OS-2024-00004',
    titulo: 'Troca de lâmpadas - Consultório 5',
    departamento: 'Consultas Externas',
    tipo: 'CORRETIVA',
    prioridade: 'BAIXA',
    status: 'CONCLUIDA',
    dataAbertura: new Date('2024-01-12'),
    responsavel: 'Pedro Eletricista',
    descricao: 'Lâmpadas queimadas no consultório.',
  },
];

const mockEquipamentos: Equipamento[] = [
  { id: 1, codigo: 'EQP-001', nome: 'Monitor Cardíaco MC-500', categoria: 'Monitorização', departamento: 'UTI', status: 'EM_MANUTENCAO', ultimaManutencao: new Date('2024-01-01') },
  { id: 2, codigo: 'EQP-002', nome: 'Ventilador Pulmonar VP-300', categoria: 'Respiratório', departamento: 'UTI', status: 'OPERACIONAL', ultimaManutencao: new Date('2023-12-15'), proximaManutencao: new Date('2024-03-15') },
  { id: 3, codigo: 'EQP-003', nome: 'Autoclave AC-200', categoria: 'Esterilização', departamento: 'Central de Esterilização', status: 'OPERACIONAL', proximaManutencao: new Date('2024-01-20') },
  { id: 4, codigo: 'EQP-004', nome: 'Raio-X Digital RX-100', categoria: 'Imagem', departamento: 'Radiologia', status: 'OPERACIONAL', ultimaManutencao: new Date('2023-11-20') },
  { id: 5, codigo: 'EQP-005', nome: 'Desfibrilador DF-50', categoria: 'Emergência', departamento: 'Urgência', status: 'OPERACIONAL' },
];

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
    const timer = setTimeout(() => {
      setOrdens(mockOrdens);
      setEquipamentos(mockEquipamentos);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
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
                          className={`p-4 rounded-lg border ${
                            os.prioridade === 'CRITICA'
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
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${prioridadeConfig[os.prioridade].cor}`}>
                                  {prioridadeConfig[os.prioridade].label}
                                </span>
                                <Badge variant={statusConfig[os.status].variant}>
                                  {statusConfig[os.status].label}
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
                                <Badge variant={equipamentoStatusConfig[eq.status].variant}>
                                  {equipamentoStatusConfig[eq.status].label}
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