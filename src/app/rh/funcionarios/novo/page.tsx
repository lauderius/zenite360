'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, Textarea, Alert } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import { PROVINCIAS_ANGOLA } from '@/types';
import type { Genero, TipoDocumento, EstadoCivil, NivelAcesso, TipoContrato, StatusFuncionario } from '@/types';

export default function NovoFuncionarioPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('pessoal');

  // Form state
  const [formData, setFormData] = useState({
    // Dados Pessoais
    nomeCompleto: '',
    nomeSocial: '',
    dataNascimento: '',
    genero: '' as Genero | '',
    estadoCivil: '' as EstadoCivil | '',
    nacionalidade: 'Angolana',
    naturalidade: '',
    tipoDocumento: 'BI' as TipoDocumento,
    numeroDocumento: '',
    dataEmissaoDoc: '',
    dataValidadeDoc: '',
    nif: '',
    niss: '',
    
    // Contactos
    telefone1: '',
    telefone2: '',
    email: '',
    emailInstitucional: '',
    endereco: '',
    provincia: '',
    municipio: '',
    
    // Dados Profissionais
    numeroMecanografico: '',
    dataAdmissao: '',
    departamentoId: '',
    cargo: '',
    funcao: '',
    especialidade: '',
    nivelAcesso: '' as NivelAcesso | '',
    tipoContrato: '' as TipoContrato | '',
    status: 'ACTIVO' as StatusFuncionario,
    cargaHoraria: '40',
    salarioBase: '',
    
    // Formação
    grauAcademico: '',
    instituicao: '',
    anoConclusao: '',
    registroProfissional: '',
    
    // Contacto de Emergência
    contatoEmergenciaNome: '',
    contatoEmergenciaTelefone: '',
    contatoEmergenciaParentesco: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validações básicas
      if (!formData.nomeCompleto || !formData.dataNascimento || !formData.genero) {
        throw new Error('Preencha todos os campos obrigatórios dos dados pessoais');
      }
      if (!formData.cargo || !formData.departamentoId || !formData.nivelAcesso) {
        throw new Error('Preencha todos os campos obrigatórios dos dados profissionais');
      }

      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setTimeout(() => router.push('/rh'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'pessoal', label: 'Dados Pessoais', icon: 'User' },
    { id: 'contactos', label: 'Contactos', icon: 'Phone' },
    { id: 'profissional', label: 'Dados Profissionais', icon: 'Building' },
    { id: 'formacao', label: 'Formação', icon: 'FileText' },
    { id: 'emergencia', label: 'Emergência', icon: 'AlertCircle' },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Novo Funcionário"
        description="Cadastrar um novo funcionário no sistema"
        actions={
          <Link href="/rh">
            <Button variant="outline">
              <Icons.ArrowLeft size={16} />
              Voltar
            </Button>
          </Link>
        }
      />

      <PageContent>
        {success && (
          <Alert variant="success" className="mb-6">
            <Icons.Check size={16} />
            Funcionário cadastrado com sucesso! Redirecionando...
          </Alert>
        )}

        {error && (
          <Alert variant="error" className="mb-6">
            <Icons.AlertCircle size={16} />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Tabs de Navegação */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const IconComponent = Icons[tab.icon as keyof typeof Icons];
              return (
                <Button
                  key={tab.id}
                  type="button"
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="whitespace-nowrap"
                >
                  <IconComponent size={16} />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Dados Pessoais */}
          {activeTab === 'pessoal' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.User size={20} className="text-sky-600" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <Input
                      label="Nome Completo *"
                      value={formData.nomeCompleto}
                      onChange={(e) => handleChange('nomeCompleto', e.target.value)}
                      placeholder="Nome completo do funcionário"
                      required
                    />
                  </div>
                  <Input
                    label="Nome Social"
                    value={formData.nomeSocial}
                    onChange={(e) => handleChange('nomeSocial', e.target.value)}
                    placeholder="Nome social (se aplicável)"
                  />
                  <Input
                    label="Data de Nascimento *"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleChange('dataNascimento', e.target.value)}
                    required
                  />
                  <Select
                    label="Género *"
                    value={formData.genero}
                    onChange={(e) => handleChange('genero', e.target.value)}
                    placeholder="Selecione"
                    options={[
                      { value: 'MASCULINO', label: 'Masculino' },
                      { value: 'FEMININO', label: 'Feminino' },
                      { value: 'OUTRO', label: 'Outro' },
                    ]}
                  />
                  <Select
                    label="Estado Civil"
                    value={formData.estadoCivil}
                    onChange={(e) => handleChange('estadoCivil', e.target.value)}
                    placeholder="Selecione"
                    options={[
                      { value: 'SOLTEIRO', label: 'Solteiro(a)' },
                      { value: 'CASADO', label: 'Casado(a)' },
                      { value: 'DIVORCIADO', label: 'Divorciado(a)' },
                      { value: 'VIUVO', label: 'Viúvo(a)' },
                      { value: 'UNIAO_FACTO', label: 'União de Facto' },
                    ]}
                  />
                  <Input
                    label="Nacionalidade"
                    value={formData.nacionalidade}
                    onChange={(e) => handleChange('nacionalidade', e.target.value)}
                  />
                  <Input
                    label="Naturalidade"
                    value={formData.naturalidade}
                    onChange={(e) => handleChange('naturalidade', e.target.value)}
                    placeholder="Cidade/Província de nascimento"
                  />
                </div>

                <hr className="my-6" />

                <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-4">Documentação</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select
                    label="Tipo de Documento"
                    value={formData.tipoDocumento}
                    onChange={(e) => handleChange('tipoDocumento', e.target.value)}
                    options={[
                      { value: 'BI', label: 'Bilhete de Identidade' },
                      { value: 'PASSAPORTE', label: 'Passaporte' },
                      { value: 'CEDULA', label: 'Cédula' },
                      { value: 'CARTA_CONDUCAO', label: 'Carta de Condução' },
                      { value: 'OUTRO', label: 'Outro' },
                    ]}
                  />
                  <Input
                    label="Número do Documento *"
                    value={formData.numeroDocumento}
                    onChange={(e) => handleChange('numeroDocumento', e.target.value)}
                    placeholder="Ex: 000123456LA042"
                  />
                  <Input
                    label="Data de Emissão"
                    type="date"
                    value={formData.dataEmissaoDoc}
                    onChange={(e) => handleChange('dataEmissaoDoc', e.target.value)}
                  />
                  <Input
                    label="Data de Validade"
                    type="date"
                    value={formData.dataValidadeDoc}
                    onChange={(e) => handleChange('dataValidadeDoc', e.target.value)}
                  />
                  <Input
                    label="NIF"
                    value={formData.nif}
                    onChange={(e) => handleChange('nif', e.target.value)}
                    placeholder="Número de Identificação Fiscal"
                  />
                  <Input
                    label="NISS"
                    value={formData.niss}
                    onChange={(e) => handleChange('niss', e.target.value)}
                    placeholder="Número de Segurança Social"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contactos */}
          {activeTab === 'contactos' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.Phone size={20} className="text-sky-600" />
                  Contactos e Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Telefone Principal *"
                    value={formData.telefone1}
                    onChange={(e) => handleChange('telefone1', e.target.value)}
                    placeholder="+244 9XX XXX XXX"
                  />
                  <Input
                    label="Telefone Secundário"
                    value={formData.telefone2}
                    onChange={(e) => handleChange('telefone2', e.target.value)}
                    placeholder="+244 9XX XXX XXX"
                  />
                  <Input
                    label="Email Pessoal"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                  <Input
                    label="Email Institucional"
                    type="email"
                    value={formData.emailInstitucional}
                    onChange={(e) => handleChange('emailInstitucional', e.target.value)}
                    placeholder="nome@hospital.co.ao"
                  />
                </div>

                <hr className="my-6" />

                <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-4">Endereço</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Província"
                    value={formData.provincia}
                    onChange={(e) => handleChange('provincia', e.target.value)}
                    placeholder="Selecione a província"
                    options={Object.entries(PROVINCIAS_ANGOLA).map(([key, value]) => ({
                      value: key,
                      label: value.nome,
                    }))}
                  />
                  <Input
                    label="Município"
                    value={formData.municipio}
                    onChange={(e) => handleChange('municipio', e.target.value)}
                    placeholder="Município"
                  />
                </div>
                <Textarea
                  label="Endereço Completo"
                  value={formData.endereco}
                  onChange={(e) => handleChange('endereco', e.target.value)}
                  placeholder="Rua, número, bairro..."
                />
              </CardContent>
            </Card>
          )}

          {/* Dados Profissionais */}
          {activeTab === 'profissional' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.Building size={20} className="text-sky-600" />
                  Dados Profissionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    label="Número Mecanográfico"
                    value={formData.numeroMecanografico}
                    onChange={(e) => handleChange('numeroMecanografico', e.target.value)}
                    placeholder="Gerado automaticamente se vazio"
                  />
                  <Input
                    label="Data de Admissão *"
                    type="date"
                    value={formData.dataAdmissao}
                    onChange={(e) => handleChange('dataAdmissao', e.target.value)}
                    required
                  />
                  <Select
                    label="Departamento *"
                    value={formData.departamentoId}
                    onChange={(e) => handleChange('departamentoId', e.target.value)}
                    placeholder="Selecione"
                    options={[
                      { value: '1', label: 'Direcção Geral' },
                      { value: '2', label: 'Clínica Geral' },
                      { value: '3', label: 'Cardiologia' },
                      { value: '4', label: 'UTI' },
                      { value: '5', label: 'Laboratório' },
                      { value: '6', label: 'Enfermaria Geral' },
                      { value: '7', label: 'Farmácia' },
                      { value: '8', label: 'Radiologia' },
                      { value: '9', label: 'Urgência' },
                      { value: '10', label: 'Financeiro' },
                      { value: '11', label: 'Recursos Humanos' },
                      { value: '12', label: 'Manutenção' },
                    ]}
                  />
                  <Input
                    label="Cargo *"
                    value={formData.cargo}
                    onChange={(e) => handleChange('cargo', e.target.value)}
                    placeholder="Ex: Médico, Enfermeiro, Técnico..."
                  />
                  <Input
                    label="Função"
                    value={formData.funcao}
                    onChange={(e) => handleChange('funcao', e.target.value)}
                    placeholder="Função específica"
                  />
                  <Input
                    label="Especialidade"
                    value={formData.especialidade}
                    onChange={(e) => handleChange('especialidade', e.target.value)}
                    placeholder="Especialidade médica (se aplicável)"
                  />
                  <Select
                    label="Nível de Acesso *"
                    value={formData.nivelAcesso}
                    onChange={(e) => handleChange('nivelAcesso', e.target.value)}
                    placeholder="Selecione"
                    options={[
                      { value: 'SUPER_ADMIN', label: 'Super Admin' },
                      { value: 'ADMIN_DEPARTAMENTO', label: 'Admin Departamento' },
                      { value: 'GESTOR', label: 'Gestor' },
                      { value: 'MEDICO', label: 'Médico' },
                      { value: 'ENFERMEIRO', label: 'Enfermeiro' },
                      { value: 'TECNICO', label: 'Técnico' },
                      { value: 'ADMINISTRATIVO', label: 'Administrativo' },
                      { value: 'RECEPCAO', label: 'Recepção' },
                      { value: 'FARMACEUTICO', label: 'Farmacêutico' },
                      { value: 'FINANCEIRO', label: 'Financeiro' },
                      { value: 'MANUTENCAO', label: 'Manutenção' },
                      { value: 'VISUALIZADOR', label: 'Visualizador' },
                    ]}
                  />
                  <Select
                    label="Tipo de Contrato *"
                    value={formData.tipoContrato}
                    onChange={(e) => handleChange('tipoContrato', e.target.value)}
                    placeholder="Selecione"
                    options={[
                      { value: 'EFECTIVO', label: 'Efectivo' },
                      { value: 'CONTRATADO', label: 'Contratado' },
                      { value: 'ESTAGIARIO', label: 'Estagiário' },
                      { value: 'PRESTADOR_SERVICO', label: 'Prestador de Serviço' },
                      { value: 'TEMPORARIO', label: 'Temporário' },
                    ]}
                  />
                  <Select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    options={[
                      { value: 'ACTIVO', label: 'Activo' },
                      { value: 'INACTIVO', label: 'Inactivo' },
                    ]}
                  />
                  <Select
                    label="Carga Horária Semanal"
                    value={formData.cargaHoraria}
                    onChange={(e) => handleChange('cargaHoraria', e.target.value)}
                    options={[
                      { value: '20', label: '20 horas' },
                      { value: '30', label: '30 horas' },
                      { value: '40', label: '40 horas' },
                      { value: '44', label: '44 horas' },
                    ]}
                  />
                  <Input
                    label="Salário Base (Kz)"
                    type="number"
                    value={formData.salarioBase}
                    onChange={(e) => handleChange('salarioBase', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formação */}
          {activeTab === 'formacao' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.FileText size={20} className="text-sky-600" />
                  Formação Académica e Profissional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Grau Académico"
                    value={formData.grauAcademico}
                    onChange={(e) => handleChange('grauAcademico', e.target.value)}
                    placeholder="Selecione"
                    options={[
                      { value: 'ENSINO_BASICO', label: 'Ensino Básico' },
                      { value: 'ENSINO_MEDIO', label: 'Ensino Médio' },
                      { value: 'TECNICO', label: 'Técnico' },
                      { value: 'LICENCIATURA', label: 'Licenciatura' },
                      { value: 'POS_GRADUACAO', label: 'Pós-Graduação' },
                      { value: 'MESTRADO', label: 'Mestrado' },
                      { value: 'DOUTORADO', label: 'Doutorado' },
                    ]}
                  />
                  <Input
                    label="Instituição de Ensino"
                    value={formData.instituicao}
                    onChange={(e) => handleChange('instituicao', e.target.value)}
                    placeholder="Nome da instituição"
                  />
                  <Input
                    label="Ano de Conclusão"
                    type="number"
                    value={formData.anoConclusao}
                    onChange={(e) => handleChange('anoConclusao', e.target.value)}
                    placeholder="Ex: 2020"
                  />
                  <Input
                    label="Registo Profissional"
                    value={formData.registroProfissional}
                    onChange={(e) => handleChange('registroProfissional', e.target.value)}
                    placeholder="Ordem dos Médicos, COREN, etc."
                  />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500">
                    <Icons.Info size={16} className="inline mr-1" />
                    Documentos comprovativos podem ser anexados após o cadastro inicial.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contacto de Emergência */}
          {activeTab === 'emergencia' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.AlertCircle size={20} className="text-sky-600" />
                  Contacto de Emergência
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Nome do Contacto"
                    value={formData.contatoEmergenciaNome}
                    onChange={(e) => handleChange('contatoEmergenciaNome', e.target.value)}
                    placeholder="Nome completo"
                  />
                  <Input
                    label="Telefone"
                    value={formData.contatoEmergenciaTelefone}
                    onChange={(e) => handleChange('contatoEmergenciaTelefone', e.target.value)}
                    placeholder="+244 9XX XXX XXX"
                  />
                  <Input
                    label="Parentesco"
                    value={formData.contatoEmergenciaParentesco}
                    onChange={(e) => handleChange('contatoEmergenciaParentesco', e.target.value)}
                    placeholder="Ex: Cônjuge, Pai, Mãe..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botões de Acção */}
          <div className="flex justify-between mt-6">
            <div className="flex gap-2">
              {activeTab !== 'pessoal' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
                  }}
                >
                  <Icons.ArrowLeft size={16} />
                  Anterior
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Link href="/rh">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              {activeTab !== 'emergencia' ? (
                <Button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                  }}
                >
                  Próximo
                  <Icons.ArrowRight size={16} />
                </Button>
              ) : (
                <Button type="submit" isLoading={isLoading}>
                  <Icons.Save size={16} />
                  Cadastrar Funcionário
                </Button>
              )}
            </div>
          </div>
        </form>
      </PageContent>
    </MainLayout>
  );
}