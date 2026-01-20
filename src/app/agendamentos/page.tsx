'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Tabs } from '@/components/ui';
import { Icons } from '@/components/ui/Icons';
import type { StatusAgendamento, TipoAtendimento } from '@/types';

interface Agendamento {
  id: number;
  codigo: string;
  paciente: string;
  tipoAtendimento: TipoAtendimento;
  dataAgendamento: Date;
  horaInicio: string;
  horaFim: string;
  medico: string;
  departamento: string;
  status: StatusAgendamento;
}

const mockAgendamentos: Agendamento[] = [
  {
    id: 1,
    codigo: 'AG-2024-00001',
    paciente: 'Maria José Santos',
    tipoAtendimento: 'CONSULTA_EXTERNA',
    dataAgendamento: new Date(),
    horaInicio: '08:00',
    horaFim: '08:30',
    medico: 'Dr. Paulo Sousa',
    departamento: 'Clínica Geral',
    status: 'ATENDIDO',
  },
  {
    id: 2,
    codigo: 'AG-2024-00002',
    paciente: 'João Pedro Silva',
    tipoAtendimento: 'RETORNO',
    dataAgendamento: new Date(),
    horaInicio: '08:30',
    horaFim: '09:00',
    medico: 'Dra. Ana Reis',
    departamento: 'Cardiologia',
    status: 'EM_ATENDIMENTO',
  },
  {
    id: 3,
    codigo: 'AG-2024-00003',
    paciente: 'Ana Luísa Ferreira',
    tipoAtendimento: 'CONSULTA_EXTERNA',
    dataAgendamento: new Date(),
    horaInicio: '09:00',
    horaFim: '09:30',
    medico: 'Dr. Paulo Sousa',
    departamento: 'Clínica Geral',
    status: 'CONFIRMADO',
  },
  {
    id: 4,
    codigo: 'AG-2024-00004',
    paciente: 'Carlos Manuel Costa',
    tipoAtendimento: 'EXAME',
    dataAgendamento: new Date(),
    horaInicio: '09:30',
    horaFim: '10:00',
    medico: 'Dr. João Santos',
    departamento: 'Laboratório',
    status: 'AGENDADO',
  },
  {
    id: 5,
    codigo: 'AG-2024-00005',
    paciente: 'Teresa Antónia',
    tipoAtendimento: 'CONSULTA_EXTERNA',
    dataAgendamento: new Date(),
    horaInicio: '10:00',
    horaFim: '10:30',
    medico: 'Dra. Ana Reis',
    departamento: 'Cardiologia',
    status: 'AGENDADO',
  },
];

const statusConfig: Record<StatusAgendamento, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  AGENDADO: { label: 'Agendado', variant: 'default' },
  CONFIRMADO: { label: 'Confirmado', variant: 'primary' },
  EM_ESPERA: { label: 'Em Espera', variant: 'warning' },
  EM_ATENDIMENTO: { label: 'Em Atendimento', variant: 'warning' },
  ATENDIDO: { label: 'Atendido', variant: 'success' },
  REAGENDADO: { label: 'Reagendado', variant: 'primary' },
  CANCELADO: { label: 'Cancelado', variant: 'danger' },
  NAO_COMPARECEU: { label: 'Não Compareceu', variant: 'danger' },
};

const tipoConfig: Record<TipoAtendimento, string> = {
  CONSULTA_EXTERNA: 'Consulta Externa',
  URGENCIA: 'Urgência',
  EMERGENCIA: 'Emergência',
  INTERNAMENTO: 'Internamento',
  CIRURGIA: 'Cirurgia',
  EXAME: 'Exame',
  PROCEDIMENTO: 'Procedimento',
  RETORNO: 'Retorno',
  DOMICILIARIO: 'Domiciliário',
};

// Componente de Calendário Simples
function CalendarioSemanal({ agendamentos, dataAtual }: { agendamentos: Agendamento[]; dataAtual: Date }) {
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const horasTrabalho = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  // Gerar dias da semana atual
  const inicioSemana = new Date(dataAtual);
  inicioSemana.setDate(dataAtual.getDate() - dataAtual.getDay());
  
  const diasDaSemana = Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(inicioSemana);
    dia.setDate(inicioSemana.getDate() + i);
    return dia;
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header com dias */}
        <div className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-700">
          <div className="p-3 text-center text-sm font-medium text-slate-500"></div>
          {diasDaSemana.map((dia, index) => (
            <div
              key={index}
              className={`p-3 text-center ${
                dia.toDateString() === new Date().toDateString()
                  ? 'bg-sky-50 dark:bg-sky-900/20'
                  : ''
              }`}
            >
              <p className="text-xs text-slate-500">{diasSemana[dia.getDay()]}</p>
              <p className={`text-lg font-semibold ${
                dia.toDateString() === new Date().toDateString()
                  ? 'text-sky-600'
                  : 'text-slate-700 dark:text-slate-200'
              }`}>
                {dia.getDate()}
              </p>
            </div>
          ))}
        </div>

        {/* Grid de horários */}
        {horasTrabalho.map((hora) => (
          <div key={hora} className="grid grid-cols-8 border-b border-slate-100 dark:border-slate-700">
            <div className="p-2 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50">
              {hora}
            </div>
            {diasDaSemana.map((dia, index) => (
              <div key={index} className="p-1 min-h-[60px] border-l border-slate-100 dark:border-slate-700">
                {agendamentos
                  .filter(
                    (ag) =>
                      new Date(ag.dataAgendamento).toDateString() === dia.toDateString() &&
                      ag.horaInicio.startsWith(hora.split(':')[0])
                  )
                  .map((ag) => (
                    <div
                      key={ag.id}
                      className="p-1 mb-1 text-xs bg-sky-100 dark:bg-sky-900/30 rounded border-l-2 border-sky-500 cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-900/50"
                    >
                      <p className="font-medium text-sky-700 dark:text-sky-300 truncate">
                        {ag.paciente.split(' ')[0]}
                      </p>
                      <p className="text-sky-600 dark:text-sky-400 truncate">{ag.horaInicio}</p>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente de Lista
function ListaAgendamentos({ agendamentos }: { agendamentos: Agendamento[] }) {
  return (
    <div className="space-y-3">
      {agendamentos.map((ag) => (
        <div
          key={ag.id}
          className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-600">{ag.horaInicio}</p>
              <p className="text-xs text-slate-500">{ag.horaFim}</p>
            </div>
            <div className="h-12 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">{ag.paciente}</p>
              <p className="text-sm text-slate-500">
                {ag.medico} • {ag.departamento}
              </p>
              <p className="text-xs text-slate-400">{tipoConfig[ag.tipoAtendimento]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={statusConfig[ag.status].variant}>
              {statusConfig[ag.status].label}
            </Badge>
            <Button variant="ghost" size="icon">
              <Icons.MoreVertical size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AgendamentosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [dataAtual, setDataAtual] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => {
      setAgendamentos(mockAgendamentos);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const navegarData = (direcao: 'anterior' | 'proximo') => {
    setDataAtual((prev) => {
      const novaData = new Date(prev);
      novaData.setDate(prev.getDate() + (direcao === 'proximo' ? 7 : -7));
      return novaData;
    });
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
        title="Agendamentos"
        description="Gestão de consultas e procedimentos agendados"
        actions={
          <Link href="/agendamentos/novo">
            <Button>
              <Icons.Plus size={16} />
              Novo Agendamento
            </Button>
          </Link>
        }
      />

      <PageContent>
        {/* Navegação de Data */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navegarData('anterior')}>
                  <Icons.ChevronLeft size={16} />
                </Button>
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    {dataAtual.toLocaleDateString('pt-AO', { month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-slate-500">
                    Semana de {new Date(dataAtual.setDate(dataAtual.getDate() - dataAtual.getDay())).toLocaleDateString('pt-AO', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navegarData('proximo')}>
                  <Icons.ChevronRight size={16} />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setDataAtual(new Date())}>
                  Hoje
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Visualização */}
        <Card>
          <CardContent className="p-4">
            <Tabs
              tabs={[
                {
                  id: 'calendario',
                  label: 'Calendário',
                  content: <CalendarioSemanal agendamentos={agendamentos} dataAtual={dataAtual} />,
                },
                {
                  id: 'lista',
                  label: 'Lista',
                  content: <ListaAgendamentos agendamentos={agendamentos} />,
                },
              ]}
              defaultTab="calendario"
            />
          </CardContent>
        </Card>

        {/* Resumo do Dia */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-sky-600">{agendamentos.length}</p>
              <p className="text-sm text-slate-500">Total Hoje</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">
                {agendamentos.filter((a) => a.status === 'ATENDIDO').length}
              </p>
              <p className="text-sm text-slate-500">Atendidos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">
                {agendamentos.filter((a) => ['AGENDADO', 'CONFIRMADO'].includes(a.status)).length}
              </p>
              <p className="text-sm text-slate-500">Pendentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-600">
                {agendamentos.filter((a) => a.status === 'CANCELADO').length}
              </p>
              <p className="text-sm text-slate-500">Cancelados</p>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </MainLayout>
  );
}