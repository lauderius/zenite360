'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Modal, Input, Textarea, Select } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import { api } from '@/services/api';

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
  totalFuncionarios: number;
  activo: boolean;
}

export default function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    sigla: '',
    tipo: 'ADMINISTRATIVO',
    descricao: '',
    localizacao: '',
  });

  const fetchDepartamentos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ data: Departamento[] }>('/rh/departamentos');
      setDepartamentos(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/rh/departamentos', form);
      setShowModal(false);
      setForm({ nome: '', sigla: '', tipo: 'ADMINISTRATIVO', descricao: '', localizacao: '' });
      fetchDepartamentos();
    } catch (error) {
      console.error('Erro ao criar departamento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Departamentos e Sectores"
        description="Gestão da estrutura organizacional do hospital."
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Icons.Plus size={16} />
            Novo Departamento
          </Button>
        }
      />

      <PageContent>
        {isLoading ? (
          <div className="flex justify-center p-12"><Spinner size="lg" /></div>
        ) : (
          <GridLayout cols={3}>
            {departamentos.map((dept) => (
              <Card key={dept.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{dept.nome}</CardTitle>
                    <Badge variant={dept.tipo === 'CLINICO' ? 'primary' : 'default'}>{dept.sigla}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{dept.descricao || 'Sem descrição.'}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Icons.MapPin size={14} />
                      {dept.localizacao || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Icons.Users size={14} />
                      {dept.totalFuncionarios || 0} Funcionários
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {departamentos.length === 0 && (
              <div className="col-span-3 text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <Icons.Building size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">Nenhum departamento cadastrado.</p>
                <Button variant="ghost" className="mt-2" onClick={() => setShowModal(true)}>Clique para criar o primeiro</Button>
              </div>
            )}
          </GridLayout>
        )}
      </PageContent>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Departamento">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="nome" label="Nome do Departamento" value={form.nome} onChange={handleChange} required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="sigla" label="Sigla" value={form.sigla} onChange={handleChange} required />
            <Select
              name="tipo"
              label="Tipo"
              value={form.tipo}
              onChange={handleChange}
              options={[
                { value: 'ADMINISTRATIVO', label: 'Administrativo' },
                { value: 'CLINICO', label: 'Clínico' },
                { value: 'ASSISTENCIAL', label: 'Assistencial' },
                { value: 'APOIO_DIAGNOSTICO', label: 'Apoio Diagnóstico' },
              ]}
            />
          </div>
          <Input name="localizacao" label="Localização" value={form.localizacao} onChange={handleChange} />
          <Textarea name="descricao" label="Descrição" value={form.descricao} onChange={handleChange} />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Criar Departamento'}
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}