'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, Textarea, Alert } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import { PROVINCIAS_ANGOLA } from '@/types';
import type { Genero, TipoDocumento, GrupoSanguineo, EstadoCivil } from '@/types';

import { api } from '@/services/api';

export default function NovoPacientePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nome_completo: '', // Adjusted to match DB schema
    nome_social: '',
    data_nascimento: '',
    genero: '' as Genero | '',
    estado_civil: '' as EstadoCivil | '',
    nacionalidade: 'Angolana',
    profissao: '',
    tipo_documento: 'BI' as TipoDocumento,
    numero_documento: '',
    telefone_principal: '',
    telefone_secundario: '',
    email: '',
    provincia: '',
    municipio: '',
    endereco: '',
    grupo_sanguineo: 'DESCONHECIDO' as GrupoSanguineo,
    alergias: '',
    doencas_cronicas: '',
    possuiConvenio: false,
    convenioNome: '',
    convenioNumero: '',
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
      if (!formData.nome_completo || !formData.data_nascimento || !formData.genero) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      await api.post('/pacientes', formData);

      setSuccess(true);
      setTimeout(() => router.push('/pacientes'), 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar paciente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Novo Paciente"
        description="Cadastrar um novo paciente no sistema"
        actions={
          <Link href="/pacientes">
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
            Paciente cadastrado com sucesso! Redirecionando...
          </Alert>
        )}

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dados Pessoais */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.User size={20} className="text-sky-600" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Nome Completo *"
                      value={formData.nome_completo}
                      onChange={(e) => handleChange('nome_completo', e.target.value)}
                      placeholder="Nome completo do paciente"
                      required
                    />
                  </div>
                  <Input
                    label="Nome Social"
                    value={formData.nome_social || ''}
                    onChange={(e) => handleChange('nome_social', e.target.value)}
                    placeholder="Nome social (se aplicável)"
                  />
                  <Input
                    label="Data de Nascimento *"
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => handleChange('data_nascimento', e.target.value)}
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
                    value={formData.estado_civil}
                    onChange={(e) => handleChange('estado_civil', e.target.value)}
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
                    label="Profissão"
                    value={formData.profissao}
                    onChange={(e) => handleChange('profissao', e.target.value)}
                    placeholder="Profissão do paciente"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Documentação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.FileText size={20} className="text-sky-600" />
                  Documentação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Tipo de Documento"
                  value={formData.tipo_documento}
                  onChange={(e) => handleChange('tipo_documento', e.target.value)}
                  options={[
                    { value: 'BI', label: 'Bilhete de Identidade' },
                    { value: 'PASSAPORTE', label: 'Passaporte' },
                    { value: 'CEDULA', label: 'Cédula' },
                    { value: 'CARTA_CONDUCAO', label: 'Carta de Condução' },
                    { value: 'OUTRO', label: 'Outro' },
                  ]}
                />
                <Input
                  label="Número do Documento"
                  value={formData.numero_documento}
                  onChange={(e) => handleChange('numero_documento', e.target.value)}
                  placeholder="Ex: 000123456LA042"
                />
              </CardContent>
            </Card>

            {/* Contactos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.Phone size={20} className="text-sky-600" />
                  Contactos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Telefone Principal *"
                  value={formData.telefone_principal}
                  onChange={(e) => handleChange('telefone_principal', e.target.value)}
                  placeholder="+244 9XX XXX XXX"
                />
                <Input
                  label="Telefone Secundário"
                  value={formData.telefone_secundario}
                  onChange={(e) => handleChange('telefone_secundario', e.target.value)}
                  placeholder="+244 9XX XXX XXX"
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.MapPin size={20} className="text-sky-600" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <Textarea
                  label="Endereço Completo"
                  value={formData.endereco}
                  onChange={(e) => handleChange('endereco', e.target.value)}
                  placeholder="Rua, número, bairro..."
                />
              </CardContent>
            </Card>

            {/* Informações Médicas */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.Heart size={20} className="text-sky-600" />
                  Informações Médicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Grupo Sanguíneo"
                    value={formData.grupo_sanguineo}
                    onChange={(e) => handleChange('grupo_sanguineo', e.target.value)}
                    options={[
                      { value: 'A_POSITIVO', label: 'A+' },
                      { value: 'A_NEGATIVO', label: 'A-' },
                      { value: 'B_POSITIVO', label: 'B+' },
                      { value: 'B_NEGATIVO', label: 'B-' },
                      { value: 'AB_POSITIVO', label: 'AB+' },
                      { value: 'AB_NEGATIVO', label: 'AB-' },
                      { value: 'O_POSITIVO', label: 'O+' },
                      { value: 'O_NEGATIVO', label: 'O-' },
                      { value: 'DESCONHECIDO', label: 'Desconhecido' },
                    ]}
                  />
                </div>
                <Textarea
                  label="Alergias Conhecidas"
                  value={formData.alergias}
                  onChange={(e) => handleChange('alergias', e.target.value)}
                  placeholder="Liste as alergias conhecidas do paciente..."
                />
                <Textarea
                  label="Doenças Crónicas"
                  value={formData.doencas_cronicas}
                  onChange={(e) => handleChange('doencas_cronicas', e.target.value)}
                  placeholder="Liste as doenças crónicas do paciente..."
                />
              </CardContent>
            </Card>

            {/* Convénio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.Building size={20} className="text-sky-600" />
                  Convénio / Seguro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="possuiConvenio"
                    checked={formData.possuiConvenio}
                    onChange={(e) => handleChange('possuiConvenio', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <label htmlFor="possuiConvenio" className="text-sm text-slate-700 dark:text-slate-300">
                    Paciente possui convénio/seguro
                  </label>
                </div>
                {formData.possuiConvenio && (
                  <>
                    <Input
                      label="Nome do Convénio"
                      value={formData.convenioNome}
                      onChange={(e) => handleChange('convenioNome', e.target.value)}
                      placeholder="Ex: ENSA Seguros"
                    />
                    <Input
                      label="Número do Convénio"
                      value={formData.convenioNumero}
                      onChange={(e) => handleChange('convenioNumero', e.target.value)}
                      placeholder="Número do cartão/apólice"
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contacto de Emergência */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.AlertCircle size={20} className="text-sky-600" />
                  Contacto de Emergência
                </CardTitle>
              </CardHeader>
              <CardContent>
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
          </div>

          {/* Botões de Acção */}
          <div className="flex justify-end gap-4 mt-6">
            <Link href="/pacientes">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" isLoading={isLoading}>
              <Icons.Save size={16} />
              Cadastrar Paciente
            </Button>
          </div>
        </form>
      </PageContent>
    </MainLayout>
  );
}