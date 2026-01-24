'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Modal, Input, Textarea } from '@/components/ui';
import { Icons } from '@/components/ui/icons';

interface Departamento {
  id: number;
  codigo: string;
  nome: string;
  sigla: string;
  tipo: string;
  descricao?: string;
  localizacao?: string;
  telefone?: string;
  email?: string;
  responsavel?: string;
  responsavelCargo?: string;
  totalFuncionarios: number;
  activo: boolean;
  subdepartamentos?: { id: number; nome: string; sigla: string }[];
}

const mockDepartamentos: Departamento[] = [
  {
    id: 1,
    codigo: 'DG',
    nome: 'Direcção Geral',
    sigla: 'DG',
    tipo: 'ADMINISTRATIVO',
    descricao: 'Órgão máximo de gestão do hospital',
    localizacao: 'Edifício Principal, 5º Andar',
    telefone: '+244 222 123 001',
    email: 'direccao@hospital.co.ao',
    responsavel: 'Dr. Manuel Alves',
    responsavelCargo: 'Director Geral',
    totalFuncionarios: 5,
    activo: true,
  },
  {
    id: 2,
    codigo: 'DC',
    nome: 'Direcção Clínica',
    sigla: 'DC',
    tipo: 'CLINICO',
    descricao: 'Coordenação de todos os serviços clínicos',
    localizacao: 'Edifício Principal, 4º Andar',
    telefone: '+244 222 123 002',
    email: 'clinica@hospital.co.ao',
    responsavel: 'Dr. Carlos Mendes',
    responsavelCargo: 'Director Clínico',
    totalFuncionarios: 8,
    activo: true,
    subdepartamentos: [
      { id: 21, nome: 'Clínica Geral', sigla: 'CG' },
      { id: 22, nome: 'Cardiologia', sigla: 'CAR' },
      { id: 23, nome: 'Pediatria', sigla: 'PED' },
    ],
  },
  {
    id: 3,
    codigo: 'URG',
    nome: 'Urgência e Emergência',
    sigla: 'URG',
    tipo: 'ASSISTENCIAL',
    descricao: 'Atendimento de urgência e emergência 24 horas',
    localizacao: 'Edifício de Emergência, Térreo',
    telefone: '+244 222 123 100',
    email: 'urgencia@hospital.co.ao',
    responsavel: 'Dr. Luís Ferreira',
    responsavelCargo: 'Chefe de Serviço',
    totalFuncionarios: 45,
    activo: true,
  },
  {
    id: 4,
    codigo: 'UTI',
    nome: 'Unidade de Terapia Intensiva',
    sigla: 'UTI',
    tipo: 'ASSISTENCIAL',
    descricao: 'Cuidados intensivos a pacientes críticos',
    localizacao: 'Edifício Principal, 2º Andar',
    telefone: '+244 222 123 200',
    email: 'uti@hospital.co.ao',
    responsavel: 'Dr. Pedro Nunes',
    responsavelCargo: 'Coordenador UTI',
    totalFuncionarios: 30,
    activo: true,
  },
  {
    id: 5,
    codigo: 'LAB',
    nome: 'Laboratório de Análises Clínicas',
    sigla: 'LAB',
    tipo: 'APOIO_DIAGNOSTICO',
    descricao: 'Exames laboratoriais e análises clínicas',
    localizacao: 'Edifício de Diagnóstico, 1º Andar',
    telefone: '+244 222 123 300',
    email: 'laboratorio@hospital.co.ao',
    responsavel: 'Dra. Ana Costa',
    responsavelCargo: 'Chefe de Laboratório',
    totalFuncionarios: 15,
    activo: true,
  },
  {
    id: 6,
    codigo: 'FAR',
    nome: 'Farmácia Hospitalar',
    sigla: 'FAR',
    tipo: 'APOIO',
    descricao: 'Dispensação e controle de medicamentos',
    localizacao: 'Edifício Principal, Térreo',
    telefone: '+244 222 123 400',
    email: 'farmacia@hospital.co.ao',
    responsavel: 'Beatriz Mendes',
    responsavelCargo: 'Farmacêutica Chefe',
    totalFuncionarios: 12,
    activo: true,
  },
  {
    id: 7,
    codigo: 'ENF',
    nome: 'Enfermaria Geral',
    sigla: 'ENF',
    tipo: 'ASSISTENCIAL',
    descricao: 'Internamento geral de pacientes',
    localizacao: 'Edifício de Internamento, 1º-3º Andar',
    telefone: '+244 222 123 500',
    email: 'enfermaria@hospital.co.ao',
    responsavel: 'Maria Fernandes',
    responsavelCargo: 'Enfermeira Chefe',
    totalFuncionarios: 50,
    activo: true,
  },
  {
    id: 8,
    codigo: 'FIN',
    nome: 'Departamento Financeiro',
    sigla: 'FIN',
    tipo: 'ADMINISTRATIVO',
    descricao: 'Gestão financeira e faturação',
    localizacao: 'Edifício Administrativo, 2º Andar',
    telefone: '+244 222 123 600',
    email: 'financeiro@hospital.co.ao',
    responsavel: 'João Baptista',
    responsavelCargo: 'Director Financeiro',
    totalFuncionarios: 10,
    activo: true,
  },
  {
    id: 9,
    codigo: 'RH',
    nome: 'Recursos Humanos',
    sigla: 'RH',
    tipo: 'ADMINISTRATIVO',
    descricao: 'Gestão de pessoal e desenvolvimento humano',
    localizacao: 'Edifício Administrativo, 1º Andar',
    telefone: '+244 222 123 700',
    email: 'rh@hospital.co.ao',
    responsavel: 'Teresa Oliveira',
    responsavelCargo: 'Directora de RH',
    totalFuncionarios: 6,
    activo: true,
  },
  {
    id: 10,
    codigo: 'MAN',
    nome: 'Manutenção e Engenharia',
    sigla: 'MAN',
    tipo: 'APOIO',
    descricao: 'Manutenção predial e de equipamentos',
    localizacao: 'Edifício de Serviços, Térreo',
    telefone: '+244 222 123 800',
    email: 'manutencao@hospital.co.ao',
    responsavel: 'José Silva',
    responsavelCargo: 'Chefe de Manutenção',
    totalFuncionarios: 15,
    activo: true,
  },
];

const tipoConfig: Record<string, { label: string; cor: string }> = {
  ADMINISTRATIVO: { label: 'Administrativo', cor: 'bg-slate-500' },
  CLINICO: { label: 'Clínico', cor: 'bg-sky-500' },
  ASSISTENCIAL: { label: 'Assistencial', cor: 'bg-emerald-500' },
  APOIO_DIAGNOSTICO: { label: 'Apoio Diagnóstico', cor: 'bg-purple-500' },
  APOIO: { label: 'Apoio', cor: 'bg-amber-500' },
};

export default function DepartamentosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Departamento | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDepartamentos(mockDepartamentos);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filtrar departamentos
  const departamentosFiltrados = departamentos.filter((d) => {
    const matchSearch = d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.sigla.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = !filterTipo || d.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  // Estatísticas
  const totalFuncionarios = departamentos.reduce((acc, d) => acc + d.totalFuncionarios, 0);

  const handleViewDetails = (dept: Departamento) => {
    setSelectedDept(dept);
    setShowModal(true);
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
        title="Departamentos"
        description="Gestão da estrutura organizacional do hospital"
        actions={
          <div className="flex gap-2">
            <Link href="/rh">
              <Button variant="outline">
                <Icons.ArrowLeft size={16} />
                Voltar para RH
              </Button>
            </Link>
            <Link href="/rh/departamentos/novo">
              <Button>
                <Icons.Plus size={16} />
                Novo Departamento
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
              <p className="text-3xl font-bold text-sky-600">{departamentos.length}</p>
              <p className="text-sm text-slate-500">Total Departamentos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">
                {departamentos.filter((d) => d.activo).length}
              </p>
              <p className="text-sm text-slate-500">Activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{totalFuncionarios}</p>
              <p className="text-sm text-slate-500">Total Funcionários</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">
                {Math.round(totalFuncionarios / departamentos.length)}
              </p>
              <p className="text-sm text-slate-500">Média por Dept.</p>
            </CardContent>
          </Card>
        </GridLayout>

        {/* Filtros */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar departamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Todos os Tipos</option>
                {Object.entries(tipoConfig).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Departamentos */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departamentosFiltrados.map((dept) => (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
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

                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-3 h-3 rounded-full ${tipoConfig[dept.tipo]?.cor || 'bg-slate-500'}`}></span>
                  <span className="text-sm text-slate-500">{tipoConfig[dept.tipo]?.label || dept.tipo}</span>
                </div>

                {dept.responsavel && (
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Icons.User size={14} />
                    <span>{dept.responsavel}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <Icons.Users size={14} />
                  <span>{dept.totalFuncionarios} funcionários</span>
                </div>

                {dept.localizacao && (
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <Icons.MapPin size={14} />
                    <span className="truncate">{dept.localizacao}</span>
                  </div>
                )}

                {dept.subdepartamentos && dept.subdepartamentos.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {dept.subdepartamentos.map((sub) => (
                      <span key={sub.id} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                        {sub.sigla}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(dept)}
                  >
                    <Icons.Eye size={14} />
                    Ver
                  </Button>
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

        {/* Modal de Detalhes */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Detalhes do Departamento"
          size="lg"
        >
          {selectedDept && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {selectedDept.nome}
                  </h3>
                  <p className="text-sky-600 font-mono">{selectedDept.codigo} - {selectedDept.sigla}</p>
                </div>
                <Badge variant={selectedDept.activo ? 'success' : 'default'}>
                  {selectedDept.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>

              {selectedDept.descricao && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedDept.descricao}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase">Tipo</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {tipoConfig[selectedDept.tipo]?.label || selectedDept.tipo}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Funcionários</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {selectedDept.totalFuncionarios}
                  </p>
                </div>
                {selectedDept.responsavel && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Responsável</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {selectedDept.responsavel}
                    </p>
                    <p className="text-xs text-slate-500">{selectedDept.responsavelCargo}</p>
                  </div>
                )}
                {selectedDept.localizacao && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Localização</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {selectedDept.localizacao}
                    </p>
                  </div>
                )}
              </div>

              {(selectedDept.telefone || selectedDept.email) && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  {selectedDept.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Icons.Phone size={16} className="text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-200">{selectedDept.telefone}</span>
                    </div>
                  )}
                  {selectedDept.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Icons.Mail size={16} className="text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-200">{selectedDept.email}</span>
                    </div>
                  )}
                </div>
              )}

              {selectedDept.subdepartamentos && selectedDept.subdepartamentos.length > 0 && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Subdepartamentos ({selectedDept.subdepartamentos.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDept.subdepartamentos.map((sub) => (
                      <span
                        key={sub.id}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm"
                      >
                        {sub.nome} ({sub.sigla})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Link href={`/rh/departamentos/${selectedDept.id}/editar`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Icons.Edit size={16} />
                    Editar
                  </Button>
                </Link>
                <Link href={`/rh?departamento=${selectedDept.nome}`} className="flex-1">
                  <Button className="w-full">
                    <Icons.Users size={16} />
                    Ver Funcionários
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Modal>
      </PageContent>
    </MainLayout>
  );
}