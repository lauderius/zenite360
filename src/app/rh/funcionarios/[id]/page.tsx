'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Avatar, Tabs } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import type { StatusFuncionario, NivelAcesso } from '@/types';

interface FuncionarioDetalhes {
  id: number;
  numeroMecanografico: string;
  nomeCompleto: string;
  nomeSocial?: string;
  dataNascimento: Date;
  genero: string;
  estadoCivil: string;
  nacionalidade: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nif?: string;
  niss?: string;
  telefone1: string;
  telefone2?: string;
  email: string;
  emailInstitucional?: string;
  endereco?: string;
  provincia?: string;
  municipio?: string;
  cargo: string;
  funcao?: string;
  departamento: string;
  especialidade?: string;
  nivelAcesso: NivelAcesso;
  tipoContrato: string;
  status: StatusFuncionario;
  dataAdmissao: Date;
  cargaHoraria: number;
  salarioBase?: number;
  grauAcademico?: string;
  instituicao?: string;
  registroProfissional?: string;
  contatoEmergenciaNome?: string;
  contatoEmergenciaTelefone?: string;
  contatoEmergenciaParentesco?: string;
  fotoUrl?: string;
}

const mockFuncionario: FuncionarioDetalhes = {
  id: 1,
  numeroMecanografico: 'F-00001',
  nomeCompleto: 'Dr. Paulo Roberto Sousa',
  dataNascimento: new Date('1975-05-15'),
  genero: 'MASCULINO',
  estadoCivil: 'CASADO',
  nacionalidade: 'Angolana',
  tipoDocumento: 'BI',
  numeroDocumento: '000123456LA042',
  nif: '5000123456',
  niss: '123456789',
  telefone1: '+244 923 456 789',
  telefone2: '+244 912 345 678',
  email: 'paulo.sousa@gmail.com',
  emailInstitucional: 'paulo.sousa@hospital.co.ao',
  endereco: 'Rua da Missão, nº 45, Maianga',
  provincia: 'LUANDA',
  municipio: 'Maianga',
  cargo: 'Médico',
  funcao: 'Médico Assistente',
  departamento: 'Clínica Geral',
  especialidade: 'Clínica Médica',
  nivelAcesso: 'MEDICO',
  tipoContrato: 'EFECTIVO',
  status: 'ACTIVO',
  dataAdmissao: new Date('2020-03-15'),
  cargaHoraria: 40,
  salarioBase: 450000,
  grauAcademico: 'Doutorado',
  instituicao: 'Universidade Agostinho Neto',
  registroProfissional: 'OM-12345',
  contatoEmergenciaNome: 'Maria Helena Sousa',
  contatoEmergenciaTelefone: '+244 934 567 890',
  contatoEmergenciaParentesco: 'Cônjuge',
};

const statusConfig: Record<StatusFuncionario, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'primary' }> = {
  ACTIVO: { label: 'Activo', variant: 'success' },
  INACTIVO: { label: 'Inactivo', variant: 'default' },
  FERIAS: { label: 'Férias', variant: 'primary' },
  LICENCA: { label: 'Licença', variant: 'warning' },
  SUSPENSO: { label: 'Suspenso', variant: 'danger' },
  APOSENTADO: { label: 'Aposentado', variant: 'default' },
  DESLIGADO: { label: 'Desligado', variant: 'danger' },
};

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

// Calcular tempo de serviço
function calcularTempoServico(dataAdmissao: Date): string {
  const hoje = new Date();
  const admissao = new Date(dataAdmissao);
  const diffTime = Math.abs(hoje.getTime() - admissao.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const anos = Math.floor(diffDays / 365);
  const meses = Math.floor((diffDays % 365) / 30);
  
  if (anos === 0) return `${meses} meses`;
  if (meses === 0) return `${anos} ano(s)`;
  return `${anos} ano(s) e ${meses} meses`;
}

export default function FuncionarioDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [funcionario, setFuncionario] = useState<FuncionarioDetalhes | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFuncionario(mockFuncionario);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [params.id]);

  if (isLoading || !funcionario) {
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
        title="Detalhes do Funcionário"
        description={funcionario.numeroMecanografico}
        actions={
          <div className="flex gap-2">
            <Link href="/rh">
              <Button variant="outline">
                <Icons.ArrowLeft size={16} />
                Voltar
              </Button>
            </Link>
            <Link href={`/rh/funcionarios/${funcionario.id}/editar`}>
              <Button>
                <Icons.Edit size={16} />
                Editar
              </Button>
            </Link>
          </div>
        }
      />

      <PageContent>
        {/* Cabeçalho do Perfil */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar
                fallback={funcionario.nomeCompleto.split(' ').map(n => n[0]).slice(0, 2).join('')}
                size="xl"
                className="w-24 h-24 text-2xl"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {funcionario.nomeCompleto}
                  </h1>
                  <Badge variant={statusConfig[funcionario.status].variant} className="text-sm">
                    {statusConfig[funcionario.status].label}
                  </Badge>
                </div>
                <p className="text-sky-600 font-mono mt-1">{funcionario.numeroMecanografico}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Icons.Building size={16} />
                    {funcionario.departamento}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icons.User size={16} />
                    {funcionario.cargo}
                  </span>
                  {funcionario.especialidade && (
                    <span className="flex items-center gap-1">
                      <Icons.Stethoscope size={16} />
                      {funcionario.especialidade}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Icons.Calendar size={16} />
                    {calcularTempoServico(funcionario.dataAdmissao)} de serviço
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">
                  <Icons.Printer size={16} />
                  Imprimir Ficha
                </Button>
                <Button variant="outline" size="sm">
                  <Icons.Download size={16} />
                  Exportar PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Detalhadas */}
        <Tabs
          tabs={[
            {
              id: 'pessoal',
              label: 'Dados Pessoais',
              content: (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Informações Básicas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Data de Nascimento</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.dataNascimento.toLocaleDateString('pt-AO')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Idade</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {calcularIdade(funcionario.dataNascimento)} anos
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Género</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.genero === 'MASCULINO' ? 'Masculino' : 'Feminino'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Estado Civil</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.estadoCivil}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Nacionalidade</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.nacionalidade}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Documentação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Tipo de Documento</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.tipoDocumento}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Número</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.numeroDocumento}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">NIF</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.nif || 'Não informado'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">NISS</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.niss || 'Não informado'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Contactos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Icons.Phone size={18} className="text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{funcionario.telefone1}</p>
                            <p className="text-xs text-slate-500">Principal</p>
                          </div>
                        </div>
                        {funcionario.telefone2 && (
                          <div className="flex items-center gap-3">
                            <Icons.Phone size={18} className="text-slate-400" />
                            <div>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{funcionario.telefone2}</p>
                              <p className="text-xs text-slate-500">Secundário</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <Icons.Mail size={18} className="text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{funcionario.email}</p>
                            <p className="text-xs text-slate-500">Pessoal</p>
                          </div>
                        </div>
                        {funcionario.emailInstitucional && (
                          <div className="flex items-center gap-3">
                            <Icons.Mail size={18} className="text-slate-400" />
                            <div>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{funcionario.emailInstitucional}</p>
                              <p className="text-xs text-slate-500">Institucional</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Endereço</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <Icons.MapPin size={18} className="text-slate-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.endereco || 'Não informado'}
                          </p>
                          {funcionario.municipio && funcionario.provincia && (
                            <p className="text-sm text-slate-500">
                              {funcionario.municipio}, {funcionario.provincia}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ),
            },
            {
              id: 'profissional',
              label: 'Dados Profissionais',
              content: (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Vínculo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Data de Admissão</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.dataAdmissao.toLocaleDateString('pt-AO')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Tempo de Serviço</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {calcularTempoServico(funcionario.dataAdmissao)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Tipo de Contrato</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.tipoContrato}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Carga Horária</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.cargaHoraria}h semanais
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Nível de Acesso</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.nivelAcesso}
                          </p>
                        </div>
                        {funcionario.salarioBase && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase">Salário Base</p>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {funcionario.salarioBase.toLocaleString('pt-AO')} Kz
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Formação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Grau Académico</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.grauAcademico || 'Não informado'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Instituição</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.instituicao || 'Não informado'}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-slate-500 uppercase">Registo Profissional</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.registroProfissional || 'Não informado'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icons.AlertCircle size={18} className="text-amber-500" />
                        Contacto de Emergência
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Nome</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.contatoEmergenciaNome || 'Não informado'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Telefone</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.contatoEmergenciaTelefone || 'Não informado'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Parentesco</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {funcionario.contatoEmergenciaParentesco || 'Não informado'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ),
            },
            {
              id: 'historico',
              label: 'Histórico',
              content: (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <Icons.FileText size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500">Histórico de alterações em desenvolvimento</p>
                    </div>
                  </CardContent>
                </Card>
              ),
            },
          ]}
          defaultTab="pessoal"
        />
      </PageContent>
    </MainLayout>
  );
}