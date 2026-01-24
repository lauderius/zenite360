'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Select } from '@/components/ui';
import { Icons } from '@/components/ui/icons';

interface Escala {
  id: number;
  funcionario: string;
  cargo: string;
  departamento: string;
  turno: 'MANHA' | 'TARDE' | 'NOITE' | 'PLANTAO_12' | 'PLANTAO_24';
  horaInicio: string;
  horaFim: string;
  dias: number[];
}


const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const diasSemanaCompleto = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const turnoConfig = {
  MANHA: { label: 'Manhã', cor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  TARDE: { label: 'Tarde', cor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  NOITE: { label: 'Noite', cor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  PLANTAO_12: { label: 'Plantão 12h', cor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  PLANTAO_24: { label: 'Plantão 24h', cor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function EscalasPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const [semanaAtual, setSemanaAtual] = useState(new Date());
  const [departamentoFilter, setDepartamentoFilter] = useState('');

  useEffect(() => {
    // TODO: Integrar com API real de escalas
    setIsLoading(false);
  }, []);

  // Gerar dias da semana atual
  const getInicioSemana = (data: Date) => {
    const d = new Date(data);
    const dia = d.getDay();
    const diff = d.getDate() - dia;
    return new Date(d.setDate(diff));
  };

  const inicioSemana = getInicioSemana(semanaAtual);
  const diasDaSemana = Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(inicioSemana);
    dia.setDate(inicioSemana.getDate() + i);
    return dia;
  });

  const navegarSemana = (direcao: 'anterior' | 'proxima') => {
    setSemanaAtual((prev) => {
      const nova = new Date(prev);
      nova.setDate(prev.getDate() + (direcao === 'proxima' ? 7 : -7));
      return nova;
    });
  };

  const escalasFiltradas = departamentoFilter
    ? escalas.filter((e) => e.departamento === departamentoFilter)
    : escalas;

  const departamentos = [...new Set(escalas.map((e) => e.departamento))];

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
        title="Escalas de Trabalho"
        description="Gestão de turnos e plantões"
        actions={
          <div className="flex gap-2">
            <Link href="/rh">
              <Button variant="outline">
                <Icons.ArrowLeft size={16} />
                Voltar
              </Button>
            </Link>
            <Button>
              <Icons.Plus size={16} />
              Nova Escala
            </Button>
          </div>
        }
      />

      <PageContent>
        {/* Navegação da Semana */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navegarSemana('anterior')}>
                  <Icons.ChevronLeft size={16} />
                </Button>
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    {inicioSemana.toLocaleDateString('pt-AO', { day: 'numeric', month: 'long' })} - {' '}
                    {diasDaSemana[6].toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navegarSemana('proxima')}>
                  <Icons.ChevronRight size={16} />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setSemanaAtual(new Date())}>
                  Esta Semana
                </Button>
                <select
                  value={departamentoFilter}
                  onChange={(e) => setDepartamentoFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                >
                  <option value="">Todos os Departamentos</option>
                  {departamentos.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendário de Escalas */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400 w-48">
                      Funcionário
                    </th>
                    {diasDaSemana.map((dia, index) => (
                      <th
                        key={index}
                        className={`px-2 py-3 text-center font-semibold text-slate-600 dark:text-slate-400 ${
                          dia.toDateString() === new Date().toDateString()
                            ? 'bg-sky-50 dark:bg-sky-900/20'
                            : ''
                        }`}
                      >
                        <p className="text-xs">{diasSemana[index]}</p>
                        <p className={`text-lg ${
                          dia.toDateString() === new Date().toDateString()
                            ? 'text-sky-600 dark:text-sky-400'
                            : ''
                        }`}>
                          {dia.getDate()}
                        </p>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-400">
                      Turno
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {escalasFiltradas.map((escala) => (
                    <tr key={escala.id} className="border-b border-slate-100 dark:border-slate-700">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-200">
                            {escala.funcionario}
                          </p>
                          <p className="text-xs text-slate-500">
                            {escala.cargo} • {escala.departamento}
                          </p>
                        </div>
                      </td>
                      {diasDaSemana.map((dia, index) => {
                        const trabalha = escala.dias.includes(index);
                        return (
                          <td
                            key={index}
                            className={`px-2 py-3 text-center ${
                              dia.toDateString() === new Date().toDateString()
                                ? 'bg-sky-50 dark:bg-sky-900/20'
                                : ''
                            }`}
                          >
                            {trabalha ? (
                              <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${turnoConfig[escala.turno].cor}`}>
                                {escala.horaInicio}
                              </div>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${turnoConfig[escala.turno].cor}`}>
                          {turnoConfig[escala.turno].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Legenda */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {Object.entries(turnoConfig).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${value.cor}`}>
                {value.label}
              </span>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-sky-600">
                {escalasFiltradas.filter((e) => e.turno === 'MANHA').length}
              </p>
              <p className="text-sm text-slate-500">Turno Manhã</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">
                {escalasFiltradas.filter((e) => e.turno === 'TARDE').length}
              </p>
              <p className="text-sm text-slate-500">Turno Tarde</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {escalasFiltradas.filter((e) => e.turno === 'NOITE').length}
              </p>
              <p className="text-sm text-slate-500">Turno Noite</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                {escalasFiltradas.filter((e) => ['PLANTAO_12', 'PLANTAO_24'].includes(e.turno)).length}
              </p>
              <p className="text-sm text-slate-500">Plantões</p>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </MainLayout>
  );
}