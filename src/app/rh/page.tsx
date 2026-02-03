'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Tabs, Avatar } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import type { StatusFuncionario, NivelAcesso } from '@/types';

interface Funcionario {
  id: number;
  numeroMecanografico: string;
  nomeCompleto: string;
  cargo: string;
  departamento: string;
  especialidade?: string;
  nivelAcesso: NivelAcesso;
  status: StatusFuncionario;
  dataAdmissao: Date;
  telefone: string;
  email: string;
  fotoUrl?: string;
}

interface Departamento {
  id: number;
  nome: string;
  sigla: string;
  responsavel?: string;
  totalFuncionarios: number;
  activo: boolean;
}

import { api } from '@/services/api';


const statusConfig: Record<StatusFuncionario, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'primary' }> = {
  ACTIVO: { label: 'Activo', variant: 'success' },
  INACTIVO: { label: 'Inactivo', variant: 'default' },
  FERIAS: { label: 'Férias', variant: 'primary' },
  LICENCA: { label: 'Licença', variant: 'warning' },
  SUSPENSO: { label: 'Suspenso', variant: 'danger' },
  APOSENTADO: { label: 'Aposentado', variant: 'default' },
  DESLIGADO: { label: 'Desligado', variant: 'danger' },
};

const nivelAcessoLabels: Record<NivelAcesso, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN_DEPARTAMENTO: 'Admin Departamento',
  GESTOR: 'Gestor',
  MEDICO: 'Médico',
  ENFERMEIRO: 'Enfermeiro',
  TECNICO: 'Técnico',
  ADMINISTRATIVO: 'Administrativo',
  RECEPCAO: 'Recepção',
  FARMACEUTICO: 'Farmacêutico',
  FINANCEIRO: 'Financeiro',
  MANUTENCAO: 'Manutenção',
  VISUALIZADOR: 'Visualizador',
};

export default function RHPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDepartamento, setFilterDepartamento] = useState<string>('');

  useEffect(() => {
    async function fetchRH() {
      try {
        const [funcsRes, deptsRes] = await Promise.all([
          api.get<{ data: Funcionario[] }>('/rh/funcionarios'),
          api.get<{ data: Departamento[] }>('/rh/departamentos'),
        ]);

        // As APIs retornam um objeto com propriedade data
        setFuncionarios(funcsRes.data || []);
        setDepartamentos(deptsRes.data || []);
      } catch (error) {
        console.error('Erro ao carregar dados do RH:', error);
        setFuncionarios([]);
        setDepartamentos([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRH();
  }, []);

  // Filtrar funcionários
  const funcionariosFiltrados = funcionarios.filter((f) => {
    const matchSearch = f.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.numeroMecanografico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = !filterStatus || f.status === filterStatus;
    const matchDepartamento = !filterDepartamento || f.departamento === filterDepartamento;

    return matchSearch && matchStatus && matchDepartamento;
  });

  // Estatísticas
  const stats = {
    totalFuncionarios: funcionarios.length,
    activos: funcionarios.filter((f) => f.status === 'ACTIVO').length,
    ferias: funcionarios.filter((f) => f.status === 'FERIAS').length,
    licenca: funcionarios.filter((f) => f.status === 'LICENCA').length,
    totalDepartamentos: departamentos.filter((d) => d.activo).length,
    medicos: funcionarios.filter((f) => f.nivelAcesso === 'MEDICO').length,
    enfermeiros: funcionarios.filter((f) => f.nivelAcesso === 'ENFERMEIRO').length,
  };

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterDepartamento('');
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
        title="Recursos Humanos"
        description="Gestão de funcionários, departamentos e escalas"
        actions={
          <div className="flex gap-2">
            <Link href="/rh/escalas">
              <Button variant="outline">
                <Icons.Calendar size={16} />
                Escalas
              </Button>
            </Link>
            <Link href="/rh/departamentos">
              <Button variant="outline">
                <Icons.Building size={16} />
                Departamentos
              </Button>
            </Link>
            <Link href="/rh/funcionarios/novo">
              <Button>
                <Icons.UserPlus size={16} />
                Novo Funcionário
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
                  <p className="text-2xl font-bold text-sky-600">{stats.totalFuncionarios}</p>
                  <p className="text-sm text-slate-500">Total Funcionários</p>
                </div>
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                  <Icons.Users className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{stats.activos}</p>
                  <p className="text-sm text-slate-500">Activos</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <Icons.Check className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-amber-600">{stats.ferias + stats.licenca}</p>
                  <p className="text-sm text-slate-500">Férias/Licença</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <Icons.Calendar className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalDepartamentos}</p>
                  <p className="text-sm text-slate-500">Departamentos</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Icons.Building className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </GridLayout>

        {/* Distribuição por Categoria */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-3 text-center">
              <Icons.Stethoscope className="w-6 h-6 mx-auto text-sky-600 mb-1" />
              <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{stats.medicos}</p>
              <p className="text-xs text-slate-500">Médicos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Icons.Heart className="w-6 h-6 mx-auto text-pink-600 mb-1" />
              <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{stats.enfermeiros}</p>
              <p className="text-xs text-slate-500">Enfermeiros</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Icons.TestTube className="w-6 h-6 mx-auto text-purple-600 mb-1" />
              <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                {funcionarios.filter((f) => f.nivelAcesso === 'TECNICO').length}
              </p>
              <p className="text-xs text-slate-500">Técnicos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Icons.Pill className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
              <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                {funcionarios.filter((f) => f.nivelAcesso === 'FARMACEUTICO').length}
              </p>
              <p className="text-xs text-slate-500">Farmacêuticos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Icons.FileText className="w-6 h-6 mx-auto text-amber-600 mb-1" />
              <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                {funcionarios.filter((f) => ['ADMINISTRATIVO', 'RECEPCAO', 'FINANCEIRO'].includes(f.nivelAcesso)).length}
              </p>
              <p className="text-xs text-slate-500">Administrativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Icons.Wrench className="w-6 h-6 mx-auto text-slate-600 mb-1" />
              <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                {funcionarios.filter((f) => f.nivelAcesso === 'MANUTENCAO').length}
              </p>
              <p className="text-xs text-slate-500">Manutenção</p>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <Tabs
              tabs={[
                {
                  id: 'funcionarios',
                  label: `Funcionários (${funcionariosFiltrados.length})`,
                  content: (
                    <div>
                      {/* Filtros */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="md:col-span-2">
                          <div className="relative">
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Pesquisar por nome, matrícula, cargo ou email..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>
                        </div>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="">Todos os Status</option>
                          {Object.entries(statusConfig).map(([key, value]) => (
                            <option key={key} value={key}>{value.label}</option>
                          ))}
                        </select>
                        <select
                          value={filterDepartamento}
                          onChange={(e) => setFilterDepartamento(e.target.value)}
                          className="px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="">Todos os Departamentos</option>
                          {departamentos.map((dept) => (
                            <option key={dept.id} value={dept.nome}>{dept.nome}</option>
                          ))}
                        </select>
                      </div>

                      {(searchTerm || filterStatus || filterDepartamento) && (
                        <div className="mb-4 flex items-center gap-2">
                          <span className="text-sm text-slate-500">
                            {funcionariosFiltrados.length} resultado(s)
                          </span>
                          <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <Icons.X size={14} />
                            Limpar filtros
                          </Button>
                        </div>
                      )}

                      {/* Lista de Funcionários */}
                      <div className="space-y-3">
                        {funcionariosFiltrados.length === 0 ? (
                          <div className="text-center py-12">
                            <Icons.Users size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500">Nenhum funcionário encontrado</p>
                          </div>
                        ) : (
                          funcionariosFiltrados.map((func) => (
                            <div
                              key={func.id}
                              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <Avatar
                                  fallback={func.nomeCompleto.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                  size="lg"
                                />
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                                      {func.nomeCompleto}
                                    </h3>
                                    <Badge variant={statusConfig[func.status].variant}>
                                      {statusConfig[func.status].label}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-sky-600 font-mono">{func.numeroMecanografico}</p>
                                  <p className="text-sm text-slate-500">
                                    {func.cargo} • {func.departamento}
                                  </p>
                                  {func.especialidade && (
                                    <p className="text-xs text-slate-400">Especialidade: {func.especialidade}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right text-sm hidden md:block">
                                  <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1 justify-end">
                                    <Icons.Phone size={14} />
                                    {func.telefone}
                                  </p>
                                  <p className="text-slate-500 text-xs flex items-center gap-1 justify-end">
                                    <Icons.Mail size={14} />
                                    {func.email}
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  <Link href={`/rh/funcionarios/${func.id}`}>
                                    <Button variant="ghost" size="icon" title="Ver Detalhes">
                                      <Icons.Eye size={16} />
                                    </Button>
                                  </Link>
                                  <Link href={`/rh/funcionarios/${func.id}/editar`}>
                                    <Button variant="ghost" size="icon" title="Editar">
                                      <Icons.Edit size={16} />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'departamentos',
                  label: `Departamentos (${departamentos.length})`,
                  content: (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {departamentos.map((dept) => (
                        <Card key={dept.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                                  {dept.nome}
                                </h3>
                                <p className="text-sm text-sky-600 font-mono">{dept.sigla}</p>
                              </div>
                              <Badge variant={dept.activo ? 'success' : 'default'}>
                                {dept.activo ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </div>
                            <div className="mt-4 space-y-2">
                              {dept.responsavel && (
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <Icons.User size={14} />
                                  <span>Responsável: {dept.responsavel}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Icons.Users size={14} />
                                <span>{dept.totalFuncionarios} funcionários</span>
                              </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Link href={`/rh/departamentos/${dept.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                  <Icons.Eye size={14} />
                                  Ver
                                </Button>
                              </Link>
                              <Link href={`/rh/departamentos/${dept.id}/editar`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                  <Icons.Edit size={14} />
                                  Editar
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ),
                },
                {
                  id: 'relatorios',
                  label: 'Relatórios',
                  content: (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { titulo: 'Lista de Funcionários', desc: 'Relatório completo de todos os funcionários', icon: 'Users' },
                        { titulo: 'Funcionários por Departamento', desc: 'Distribuição de funcionários por setor', icon: 'Building' },
                        { titulo: 'Aniversariantes do Mês', desc: 'Lista de aniversários do mês actual', icon: 'Calendar' },
                        { titulo: 'Funcionários em Férias', desc: 'Lista de funcionários em período de férias', icon: 'Calendar' },
                        { titulo: 'Admissões do Mês', desc: 'Funcionários admitidos no mês', icon: 'UserPlus' },
                        { titulo: 'Escala de Plantões', desc: 'Escala de plantões do mês', icon: 'Clock' },
                      ].map((relatorio, index) => {
                        const IconComponent = Icons[relatorio.icon as keyof typeof Icons];
                        return (
                          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
                                  <IconComponent className="w-5 h-5 text-sky-600" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-slate-700 dark:text-slate-200">
                                    {relatorio.titulo}
                                  </h3>
                                  <p className="text-sm text-slate-500 mt-1">{relatorio.desc}</p>
                                </div>
                              </div>
                              <div className="mt-4 flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Icons.Eye size={14} />
                                  Visualizar
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Icons.Download size={14} />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Icons.Printer size={14} />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ),
                },
              ]}
              defaultTab="funcionarios"
            />
          </CardContent>
        </Card>
      </PageContent>
    </MainLayout>
  );
}