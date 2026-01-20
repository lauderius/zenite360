'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainLayout, PageHeader, PageContent } from '@/components/layout/MainLayout';
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Button, Input, Select, Badge, Table, Modal, 
  Spinner, EmptyState, Pagination, Avatar 
} from '@/components/ui';
import { Icons } from '@/components/ui/Icons';
import type { Paciente, Genero, GrupoSanguineo } from '@/types';
import { LABELS_GENERO, LABELS_GRUPO_SANGUINEO } from '@/types';

// Mock de pacientes
const mockPacientes: Paciente[] = [
  {
    id: 1,
    numeroProcesso: 'P-2024-000001',
    nomeCompleto: 'Maria José Santos',
    dataNascimento: new Date('1985-03-15'),
    genero: 'FEMININO',
    nacionalidade: 'Angolana',
    tipoDocumento: 'BI',
    numeroDocumento: '000123456LA042',
    telefone1: '+244 923 456 789',
    email: 'maria.santos@email.com',
    grupoSanguineo: 'A_POSITIVO',
    possuiConvenio: true,
    convenioNome: 'ENSA Seguros',
    activo: true,
    criadoEm: new Date('2024-01-15'),
  },
  {
    id: 2,
    numeroProcesso: 'P-2024-000002',
    nomeCompleto: 'João Pedro Silva',
    dataNascimento: new Date('1978-07-22'),
    genero: 'MASCULINO',
    nacionalidade: 'Angolana',
    tipoDocumento: 'BI',
    numeroDocumento: '000987654LA041',
    telefone1: '+244 912 345 678',
    grupoSanguineo: 'O_POSITIVO',
    possuiConvenio: false,
    activo: true,
    criadoEm: new Date('2024-01-20'),
  },
  {
    id: 3,
    numeroProcesso: 'P-2024-000003',
    nomeCompleto: 'Ana Luísa Ferreira',
    dataNascimento: new Date('1992-11-08'),
    genero: 'FEMININO',
    nacionalidade: 'Angolana',
    tipoDocumento: 'BI',
    numeroDocumento: '000456789LA043',
    telefone1: '+244 934 567 890',
    email: 'ana.ferreira@email.com',
    grupoSanguineo: 'B_NEGATIVO',
    possuiConvenio: true,
    convenioNome: 'AAA Seguros',
    activo: true,
    criadoEm: new Date('2024-02-05'),
  },
  {
    id: 4,
    numeroProcesso: 'P-2024-000004',
    nomeCompleto: 'Carlos Manuel Costa',
    dataNascimento: new Date('1965-04-30'),
    genero: 'MASCULINO',
    nacionalidade: 'Angolana',
    tipoDocumento: 'BI',
    numeroDocumento: '000111222LA040',
    telefone1: '+244 945 678 901',
    grupoSanguineo: 'AB_POSITIVO',
    alergias: 'Penicilina',
    doencasCronicas: 'Hipertensão, Diabetes Tipo 2',
    possuiConvenio: false,
    activo: true,
    criadoEm: new Date('2024-02-10'),
  },
  {
    id: 5,
    numeroProcesso: 'P-2024-000005',
    nomeCompleto: 'Teresa Antónia Mendes',
    dataNascimento: new Date('2000-09-12'),
    genero: 'FEMININO',
    nacionalidade: 'Angolana',
    tipoDocumento: 'BI',
    numeroDocumento: '000333444LA044',
    telefone1: '+244 956 789 012',
    grupoSanguineo: 'O_NEGATIVO',
    possuiConvenio: true,
    convenioNome: 'Nossa Seguros',
    activo: true,
    criadoEm: new Date('2024-02-15'),
  },
];

// Calcular idade
function calcularIdade(dataNascimento: Date): number {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

export default function PacientesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenero, setFilterGenero] = useState('');
  const [filterConvenio, setFilterConvenio] = useState('');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal de detalhes
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setPacientes(mockPacientes);
      setFilteredPacientes(mockPacientes);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let result = pacientes;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.nomeCompleto.toLowerCase().includes(term) ||
          p.numeroProcesso.toLowerCase().includes(term) ||
          p.numeroDocumento?.toLowerCase().includes(term) ||
          p.telefone1?.includes(term)
      );
    }

    if (filterGenero) {
      result = result.filter((p) => p.genero === filterGenero);
    }

    if (filterConvenio) {
      result = result.filter((p) => 
        filterConvenio === 'SIM' ? p.possuiConvenio : !p.possuiConvenio
      );
    }

    setFilteredPacientes(result);
    setCurrentPage(1);
  }, [searchTerm, filterGenero, filterConvenio, pacientes]);

  // Paginação
  const totalPages = Math.ceil(filteredPacientes.length / itemsPerPage);
  const paginatedPacientes = filteredPacientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setShowDetails(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterGenero('');
    setFilterConvenio('');
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
        title="Pacientes"
        description="Gestão de pacientes do hospital"
        actions={
          <Link href="/pacientes/novo">
            <Button>
              <Icons.UserPlus size={16} />
              Novo Paciente
            </Button>
          </Link>
        }
      />

      <PageContent>
        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar por nome, processo, BI ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
              <Select
                placeholder="Género"
                value={filterGenero}
                onChange={(e) => setFilterGenero(e.target.value)}
                options={[
                  { value: 'MASCULINO', label: 'Masculino' },
                  { value: 'FEMININO', label: 'Feminino' },
                ]}
              />
              <Select
                placeholder="Convénio"
                value={filterConvenio}
                onChange={(e) => setFilterConvenio(e.target.value)}
                options={[
                  { value: 'SIM', label: 'Com Convénio' },
                  { value: 'NAO', label: 'Sem Convénio' },
                ]}
              />
            </div>
            {(searchTerm || filterGenero || filterConvenio) && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-slate-500">
                  {filteredPacientes.length} resultado(s) encontrado(s)
                </span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <Icons.X size={14} />
                  Limpar filtros
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabela de Pacientes */}
        <Card>
          <CardContent className="p-0">
            {filteredPacientes.length === 0 ? (
              <EmptyState
                icon={<Icons.Users size={48} />}
                title="Nenhum paciente encontrado"
                description="Não foram encontrados pacientes com os filtros aplicados."
                action={
                  <Button onClick={clearFilters}>
                    <Icons.Refresh size={16} />
                    Limpar filtros
                  </Button>
                }
              />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">
                          Paciente
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">
                          Processo
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">
                          Idade/Género
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">
                          Contacto
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">
                          Grupo Sang.
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">
                          Convénio
                        </th>
                        <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-400">
                          Acções
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPacientes.map((paciente) => (
                        <tr
                          key={paciente.id}
                          className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar
                                fallback={paciente.nomeCompleto.charAt(0)}
                                size="sm"
                              />
                              <div>
                                <p className="font-medium text-slate-700 dark:text-slate-200">
                                  {paciente.nomeCompleto}
                                </p>
                                <p className="text-xs text-slate-500">
                                  BI: {paciente.numeroDocumento || 'N/D'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-sky-600 dark:text-sky-400">
                              {paciente.numeroProcesso}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-slate-700 dark:text-slate-200">
                                {calcularIdade(paciente.dataNascimento)} anos
                              </p>
                              <p className="text-xs text-slate-500">
                                {LABELS_GENERO[paciente.genero]}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-slate-700 dark:text-slate-200">
                                {paciente.telefone1 || 'N/D'}
                              </p>
                              {paciente.email && (
                                <p className="text-xs text-slate-500 truncate max-w-[150px]">
                                  {paciente.email}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="info">
                              {LABELS_GRUPO_SANGUINEO[paciente.grupoSanguineo]}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            {paciente.possuiConvenio ? (
                              <Badge variant="success">{paciente.convenioNome}</Badge>
                            ) : (
                              <Badge variant="secondary">Particular</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetails(paciente)}
                                title="Ver detalhes"
                              >
                                <Icons.Eye size={16} />
                              </Button>
                              <Link href={`/pacientes/${paciente.id}`}>
                                <Button variant="ghost" size="icon" title="Editar">
                                  <Icons.Edit size={16} />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Histórico"
                                onClick={() => router.push(`/pacientes/${paciente.id}/historico`)}
                              >
                                <Icons.FileText size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Modal de Detalhes */}
        <Modal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          title="Detalhes do Paciente"
          size="lg"
        >
          {selectedPaciente && (
            <div className="space-y-6">
              {/* Info Principal */}
              <div className="flex items-start gap-4">
                <Avatar
                  fallback={selectedPaciente.nomeCompleto.charAt(0)}
                  size="xl"
                />
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {selectedPaciente.nomeCompleto}
                  </h3>
                  <p className="text-sm text-sky-600 font-mono">
                    {selectedPaciente.numeroProcesso}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="info">
                      {LABELS_GRUPO_SANGUINEO[selectedPaciente.grupoSanguineo]}
                    </Badge>
                    {selectedPaciente.possuiConvenio && (
                      <Badge variant="success">{selectedPaciente.convenioNome}</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Dados Pessoais */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Data de Nascimento</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {new Date(selectedPaciente.dataNascimento).toLocaleDateString('pt-AO')} ({calcularIdade(selectedPaciente.dataNascimento)} anos)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Género</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {LABELS_GENERO[selectedPaciente.genero]}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">BI/Documento</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {selectedPaciente.numeroDocumento || 'Não informado'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Nacionalidade</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {selectedPaciente.nacionalidade}
                  </p>
                </div>
              </div>

              {/* Contactos */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Telefone</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {selectedPaciente.telefone1 || 'Não informado'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {selectedPaciente.email || 'Não informado'}
                  </p>
                </div>
              </div>

              {/* Informações Médicas */}
              {(selectedPaciente.alergias || selectedPaciente.doencasCronicas) && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                    <Icons.AlertTriangle size={16} />
                    Alertas Médicos
                  </h4>
                  {selectedPaciente.alergias && (
                    <div className="mb-2">
                      <p className="text-xs text-amber-700 dark:text-amber-500 uppercase">Alergias</p>
                      <p className="text-sm text-amber-900 dark:text-amber-300">{selectedPaciente.alergias}</p>
                    </div>
                  )}
                  {selectedPaciente.doencasCronicas && (
                    <div>
                      <p className="text-xs text-amber-700 dark:text-amber-500 uppercase">Doenças Crónicas</p>
                      <p className="text-sm text-amber-900 dark:text-amber-300">{selectedPaciente.doencasCronicas}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Link href={`/pacientes/${selectedPaciente.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Icons.Edit size={16} />
                    Editar
                  </Button>
                </Link>
                <Link href={`/agendamentos/novo?paciente=${selectedPaciente.id}`} className="flex-1">
                  <Button className="w-full">
                    <Icons.Calendar size={16} />
                    Agendar Consulta
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