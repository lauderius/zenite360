'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Modal } from '@/components/ui';
import { Icons } from '@/components/ui/Icons';
import type { PrioridadeTriagem, StatusTriagem } from '@/types';
import { CORES_TRIAGEM } from '@/types';

interface TriagemFila {
  id: number;
  codigo: string;
  paciente: string;
  idade: number;
  genero: string;
  horaChegada: string;
  tempoEspera: number;
  prioridade: PrioridadeTriagem;
  status: StatusTriagem;
  queixaPrincipal: string;
  sinaisVitais?: {
    pressao: string;
    fc: number;
    fr: number;
    temp: number;
    spo2: number;
  };
}

const mockFilaTriagem: TriagemFila[] = [
  {
    id: 1,
    codigo: 'TR-2024-00001',
    paciente: 'António Mendes',
    idade: 45,
    genero: 'M',
    horaChegada: '07:30',
    tempoEspera: 5,
    prioridade: 'EMERGENCIA',
    status: 'TRIADO',
    queixaPrincipal: 'Dor torácica intensa, sudorese, dispneia',
    sinaisVitais: { pressao: '180/110', fc: 120, fr: 28, temp: 36.8, spo2: 92 },
  },
  {
    id: 2,
    codigo: 'TR-2024-00002',
    paciente: 'Joana Ferreira',
    idade: 32,
    genero: 'F',
    horaChegada: '07:45',
    tempoEspera: 12,
    prioridade: 'MUITO_URGENTE',
    status: 'TRIADO',
    queixaPrincipal: 'Cefaleia intensa há 3 horas, vómitos',
    sinaisVitais: { pressao: '150/95', fc: 98, fr: 20, temp: 37.2, spo2: 98 },
  },
  {
    id: 3,
    codigo: 'TR-2024-00003',
    paciente: 'Carlos Silva',
    idade: 28,
    genero: 'M',
    horaChegada: '08:00',
    tempoEspera: 35,
    prioridade: 'URGENTE',
    status: 'TRIADO',
    queixaPrincipal: 'Dor abdominal, febre há 2 dias',
    sinaisVitais: { pressao: '120/80', fc: 88, fr: 18, temp: 38.5, spo2: 99 },
  },
  {
    id: 4,
    codigo: 'TR-2024-00004',
    paciente: 'Maria Santos',
    idade: 55,
    genero: 'F',
    horaChegada: '08:15',
    tempoEspera: 50,
    prioridade: 'POUCO_URGENTE',
    status: 'AGUARDANDO_TRIAGEM',
    queixaPrincipal: 'Dor lombar crónica, piora há 1 semana',
  },
  {
    id: 5,
    codigo: 'TR-2024-00005',
    paciente: 'Pedro Costa',
    idade: 22,
    genero: 'M',
    horaChegada: '08:30',
    tempoEspera: 65,
    prioridade: 'NAO_URGENTE',
    status: 'AGUARDANDO_TRIAGEM',
    queixaPrincipal: 'Resfriado, tosse há 3 dias',
  },
];

const prioridadeConfig: Record<PrioridadeTriagem, { cor: string; bg: string; border: string }> = {
  EMERGENCIA: { cor: 'text-white', bg: 'bg-red-600', border: 'border-red-600' },
  MUITO_URGENTE: { cor: 'text-white', bg: 'bg-orange-500', border: 'border-orange-500' },
  URGENTE: { cor: 'text-slate-900', bg: 'bg-yellow-400', border: 'border-yellow-400' },
  POUCO_URGENTE: { cor: 'text-white', bg: 'bg-green-500', border: 'border-green-500' },
  NAO_URGENTE: { cor: 'text-white', bg: 'bg-blue-500', border: 'border-blue-500' },
};

// Card de Paciente na Fila
function PacienteTriagemCard({ paciente, onClick }: { paciente: TriagemFila; onClick: () => void }) {
  const config = prioridadeConfig[paciente.prioridade];
  const triagem = CORES_TRIAGEM[paciente.prioridade];

  return (
    <div
      onClick={onClick}
      className={`relative p-4 bg-white dark:bg-slate-800 border-l-4 ${config.border} rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer`}
    >
      {/* Badge de Prioridade */}
      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${config.bg} ${config.cor}`}>
        {triagem.nome}
      </div>

      {/* Info do Paciente */}
      <div className="pr-24">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200">{paciente.paciente}</h3>
        <p className="text-sm text-slate-500">
          {paciente.idade} anos • {paciente.genero === 'M' ? 'Masculino' : 'Feminino'}
        </p>
      </div>

      {/* Queixa Principal */}
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
        {paciente.queixaPrincipal}
      </p>

      {/* Tempo e Status */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-500">
          <Icons.Clock size={14} />
          <span>Chegada: {paciente.horaChegada}</span>
        </div>
        <div className={`flex items-center gap-1 ${paciente.tempoEspera > 30 ? 'text-amber-600' : 'text-slate-500'}`}>
          <span className="font-medium">{paciente.tempoEspera} min</span>
          <span>de espera</span>
        </div>
      </div>

      {/* Sinais Vitais (se triado) */}
      {paciente.sinaisVitais && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 grid grid-cols-5 gap-2 text-xs">
          <div className="text-center">
            <p className="text-slate-500">PA</p>
            <p className="font-medium text-slate-700 dark:text-slate-200">{paciente.sinaisVitais.pressao}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500">FC</p>
            <p className="font-medium text-slate-700 dark:text-slate-200">{paciente.sinaisVitais.fc}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500">FR</p>
            <p className="font-medium text-slate-700 dark:text-slate-200">{paciente.sinaisVitais.fr}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500">T°</p>
            <p className="font-medium text-slate-700 dark:text-slate-200">{paciente.sinaisVitais.temp}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500">SpO2</p>
            <p className="font-medium text-slate-700 dark:text-slate-200">{paciente.sinaisVitais.spo2}%</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TriagemPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [fila, setFila] = useState<TriagemFila[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<TriagemFila | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFila(mockFilaTriagem);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Agrupar por prioridade
  const filaAgrupada = {
    EMERGENCIA: fila.filter((p) => p.prioridade === 'EMERGENCIA'),
    MUITO_URGENTE: fila.filter((p) => p.prioridade === 'MUITO_URGENTE'),
    URGENTE: fila.filter((p) => p.prioridade === 'URGENTE'),
    POUCO_URGENTE: fila.filter((p) => p.prioridade === 'POUCO_URGENTE'),
    NAO_URGENTE: fila.filter((p) => p.prioridade === 'NAO_URGENTE'),
  };

  const handleSelectPaciente = (paciente: TriagemFila) => {
    setSelectedPaciente(paciente);
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
        title="Triagem"
        description="Protocolo de Manchester — Classificação de Risco"
        actions={
          <Link href="/triagem/novo">
            <Button>
              <Icons.Plus size={16} />
              Nova Triagem
            </Button>
          </Link>
        }
      />

      <PageContent>
        {/* Resumo */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {Object.entries(CORES_TRIAGEM).map(([key, value]) => {
            const count = filaAgrupada[key as PrioridadeTriagem].length;
            const config = prioridadeConfig[key as PrioridadeTriagem];
            return (
              <Card key={key} className={`border-l-4 ${config.border}`}>
                <CardContent className="p-4 text-center">
                  <p className={`text-3xl font-bold ${config.bg.replace('bg-', 'text-')}`}>{count}</p>
                  <p className="text-sm text-slate-500">{value.nome}</p>
                  <p className="text-xs text-slate-400">Tempo: {value.tempo}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Fila por Prioridade */}
        <div className="space-y-6">
          {Object.entries(CORES_TRIAGEM).map(([key, value]) => {
            const pacientes = filaAgrupada[key as PrioridadeTriagem];
            if (pacientes.length === 0) return null;

            return (
              <div key={key}>
                <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full ${prioridadeConfig[key as PrioridadeTriagem].bg}`}
                  ></span>
                  {value.nome} ({pacientes.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pacientes.map((paciente) => (
                    <PacienteTriagemCard
                      key={paciente.id}
                      paciente={paciente}
                      onClick={() => handleSelectPaciente(paciente)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal de Detalhes */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Detalhes da Triagem"
          size="lg"
        >
          {selectedPaciente && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedPaciente.paciente}</h3>
                  <p className="text-sm text-slate-500">
                    {selectedPaciente.idade} anos • {selectedPaciente.genero === 'M' ? 'Masculino' : 'Feminino'}
                  </p>
                  <p className="text-sm text-sky-600 font-mono">{selectedPaciente.codigo}</p>
                </div>
                <Badge
                  className={`${prioridadeConfig[selectedPaciente.prioridade].bg} ${prioridadeConfig[selectedPaciente.prioridade].cor}`}
                >
                  {CORES_TRIAGEM[selectedPaciente.prioridade].nome}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-slate-500 uppercase">Queixa Principal</p>
                <p className="text-slate-700 dark:text-slate-200">{selectedPaciente.queixaPrincipal}</p>
              </div>

              {selectedPaciente.sinaisVitais && (
                <div>
                  <p className="text-sm text-slate-500 uppercase mb-2">Sinais Vitais</p>
                  <div className="grid grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500">Pressão</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                        {selectedPaciente.sinaisVitais.pressao}
                      </p>
                      <p className="text-xs text-slate-400">mmHg</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500">FC</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                        {selectedPaciente.sinaisVitais.fc}
                      </p>
                      <p className="text-xs text-slate-400">bpm</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500">FR</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                        {selectedPaciente.sinaisVitais.fr}
                      </p>
                      <p className="text-xs text-slate-400">rpm</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500">Temp</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                        {selectedPaciente.sinaisVitais.temp}
                      </p>
                      <p className="text-xs text-slate-400">°C</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500">SpO2</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                        {selectedPaciente.sinaisVitais.spo2}%
                      </p>
                      <p className="text-xs text-slate-400">sat</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <Icons.Edit size={16} />
                  Editar Triagem
                </Button>
                <Button className="flex-1">
                  <Icons.ArrowRight size={16} />
                  Encaminhar
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </PageContent>
    </MainLayout>
  );
}