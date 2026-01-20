'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Input, Tabs } from '@/components/ui';
import { Icons } from '@/components/ui/Icons';

interface Medicamento {
  id: number;
  codigo: string;
  nome: string;
  apresentacao: string;
  tipo: string;
  estoque: number;
  estoqueMinimo: number;
  preco: number;
  validade: Date;
  controlado: boolean;
}

interface Prescricao {
  id: number;
  codigo: string;
  paciente: string;
  medico: string;
  data: Date;
  status: 'PENDENTE' | 'DISPENSADO' | 'PARCIAL';
  itens: number;
}

const mockMedicamentos: Medicamento[] = [
  { id: 1, codigo: 'MED-001', nome: 'Paracetamol', apresentacao: '500mg - Cx 20 comprimidos', tipo: 'Comprimido', estoque: 50, estoqueMinimo: 100, preco: 250, validade: new Date('2025-06-15'), controlado: false },
  { id: 2, codigo: 'MED-002', nome: 'Amoxicilina', apresentacao: '250mg - Cx 21 cápsulas', tipo: 'Cápsula', estoque: 80, estoqueMinimo: 150, preco: 1200, validade: new Date('2025-03-20'), controlado: false },
  { id: 3, codigo: 'MED-003', nome: 'Ibuprofeno', apresentacao: '400mg - Cx 20 comprimidos', tipo: 'Comprimido', estoque: 30, estoqueMinimo: 100, preco: 350, validade: new Date('2024-12-10'), controlado: false },
  { id: 4, codigo: 'MED-004', nome: 'Omeprazol', apresentacao: '20mg - Cx 28 cápsulas', tipo: 'Cápsula', estoque: 120, estoqueMinimo: 200, preco: 800, validade: new Date('2025-08-25'), controlado: false },
  { id: 5, codigo: 'MED-005', nome: 'Tramadol', apresentacao: '50mg - Cx 10 comprimidos', tipo: 'Comprimido', estoque: 25, estoqueMinimo: 50, preco: 1500, validade: new Date('2025-04-30'), controlado: true },
];

const mockPrescricoes: Prescricao[] = [
  { id: 1, codigo: 'RX-2024-00001', paciente: 'Maria José Santos', medico: 'Dr. Paulo Sousa', data: new Date(), status: 'PENDENTE', itens: 3 },
  { id: 2, codigo: 'RX-2024-00002', paciente: 'João Pedro Silva', medico: 'Dra. Ana Reis', data: new Date(), status: 'PARCIAL', itens: 5 },
  { id: 3, codigo: 'RX-2024-00003', paciente: 'Ana Ferreira', medico: 'Dr. Paulo Sousa', data: new Date(), status: 'DISPENSADO', itens: 2 },
];

export default function FarmaciaPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [prescricoes, setPrescricoes] = useState<Prescricao[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMedicamentos(mockMedicamentos);
      setPrescricoes(mockPrescricoes);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const medicamentosFiltrados = medicamentos.filter((m) =>
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Alertas
  const estoqueCritico = medicamentos.filter((m) => m.estoque < m.estoqueMinimo * 0.5);
  const estoqueBaixo = medicamentos.filter((m) => m.estoque >= m.estoqueMinimo * 0.5 && m.estoque < m.estoqueMinimo);
  const proximoVencer = medicamentos.filter((m) => {
    const diasParaVencer = Math.ceil((m.validade.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diasParaVencer <= 90 && diasParaVencer > 0;
  });

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
        title="Farmácia"
        description="Gestão de medicamentos, estoque e dispensação"
        actions={
          <div className="flex gap-2">
            <Link href="/farmacia/medicamentos">
              <Button variant="outline">
                <Icons.Pill size={16} />
                Medicamentos
              </Button>
            </Link>
            <Link href="/farmacia/dispensacao">
              <Button>
                <Icons.Plus size={16} />
                Dispensar
              </Button>
            </Link>
          </div>
        }
      />

      <PageContent>
        {/* Alertas */}
        <GridLayout cols={4}>
          <Card className="border-l-4 border-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{estoqueCritico.length}</p>
                  <p className="text-sm text-slate-500">Estoque Crítico</p>
                </div>
                <Icons.AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-amber-600">{estoqueBaixo.length}</p>
                  <p className="text-sm text-slate-500">Estoque Baixo</p>
                </div>
                <Icons.AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{proximoVencer.length}</p>
                  <p className="text-sm text-slate-500">Próximo a Vencer</p>
                </div>
                <Icons.Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-sky-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-sky-600">
                    {prescricoes.filter((p) => p.status === 'PENDENTE').length}
                  </p>
                  <p className="text-sm text-slate-500">Prescrições Pendentes</p>
                </div>
                <Icons.FileText className="w-8 h-8 text-sky-500" />
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
                  id: 'prescricoes',
                  label: 'Prescrições Pendentes',
                  content: (
                    <div className="space-y-3">
                      {prescricoes.filter((p) => p.status !== 'DISPENSADO').map((rx) => (
                        <div
                          key={rx.id}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-700 dark:text-slate-200">{rx.paciente}</p>
                              <Badge variant={rx.status === 'PENDENTE' ? 'warning' : 'primary'}>
                                {rx.status === 'PENDENTE' ? 'Pendente' : 'Parcial'}
                              </Badge>
                            </div>
                            <p className="text-sm text-sky-600 font-mono">{rx.codigo}</p>
                            <p className="text-sm text-slate-500">
                              {rx.medico} • {rx.itens} itens
                            </p>
                          </div>
                          <Button size="sm">
                            <Icons.Check size={14} />
                            Dispensar
                          </Button>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  id: 'estoque',
                  label: 'Estoque',
                  content: (
                    <div>
                      <div className="mb-4">
                        <div className="relative">
                          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Pesquisar medicamento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Medicamento</th>
                              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Apresentação</th>
                              <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-400">Estoque</th>
                              <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-400">Mínimo</th>
                              <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-400">Validade</th>
                              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">Preço</th>
                              <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-400">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {medicamentosFiltrados.map((med) => {
                              const isLow = med.estoque < med.estoqueMinimo;
                              const isCritical = med.estoque < med.estoqueMinimo * 0.5;
                              return (
                                <tr key={med.id} className="border-b border-slate-100 dark:border-slate-700">
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-slate-700 dark:text-slate-200">{med.nome}</span>
                                      {med.controlado && (
                                        <Badge variant="danger">Controlado</Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-500">{med.codigo}</p>
                                  </td>
                                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{med.apresentacao}</td>
                                  <td className={`px-4 py-3 text-center font-medium ${
                                    isCritical ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-slate-700 dark:text-slate-200'
                                  }`}>
                                    {med.estoque}
                                  </td>
                                  <td className="px-4 py-3 text-center text-slate-500">{med.estoqueMinimo}</td>
                                  <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                                    {med.validade.toLocaleDateString('pt-AO')}
                                  </td>
                                  <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-200">
                                    {med.preco.toLocaleString('pt-AO')} Kz
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <Badge variant={isCritical ? 'danger' : isLow ? 'warning' : 'success'}>
                                      {isCritical ? 'Crítico' : isLow ? 'Baixo' : 'OK'}
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ),
                },
              ]}
              defaultTab="prescricoes"
            />
          </CardContent>
        </Card>
      </PageContent>
    </MainLayout>
  );
}