'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent } from '@/components/layouts/MainLayout';
import { Card, CardContent, Button, Badge, Spinner, Modal } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import type { PrioridadeTriagem, StatusTriagem } from '@/types';
import { CORES_TRIAGEM } from '@/types';
import { api } from '@/services/api';

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

const prioridadeConfig: Record<PrioridadeTriagem, { cor: string; bg: string; border: string }> = {
  EMERGENCIA: { cor: 'text-white', bg: 'bg-red-600', border: 'border-red-600' },
  MUITO_URGENTE: { cor: 'text-white', bg: 'bg-orange-500', border: 'border-orange-500' },
  URGENTE: { cor: 'text-slate-900', bg: 'bg-yellow-400', border: 'border-yellow-400' },
  POUCO_URGENTE: { cor: 'text-white', bg: 'bg-green-500', border: 'border-green-500' },
  NAO_URGENTE: { cor: 'text-white', bg: 'bg-blue-500', border: 'border-blue-500' },
};

// --- ListaTriagem ---
function ListaTriagem({ pacientes, onSelect }: { pacientes: TriagemFila[]; onSelect: (p: TriagemFila) => void }) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [items, setItems] = useState(pacientes);

  React.useEffect(() => { setItems(pacientes); }, [pacientes]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir esta triagem?")) return;
    setDeletingId(id);
    setError("");
    try {
      await api.delete(`/triagem/${id}`);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || "Erro ao excluir triagem");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {error && <div className="text-red-600 text-sm col-span-full">{error}</div>}
      {items.map((paciente) => (
        <Card key={paciente.id} className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center justify-between p-4">
            <div onClick={() => onSelect(paciente)} className="flex-1 cursor-pointer">
              <p className="font-semibold text-slate-700 dark:text-slate-200">{paciente.paciente}</p>
              <p className="text-xs text-slate-500">{paciente.idade} anos • {paciente.genero === 'M' ? 'Masculino' : 'Feminino'}</p>
              <p className="text-xs text-slate-400">{paciente.queixaPrincipal}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="primary">{paciente.prioridade}</Badge>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(paciente.id)} disabled={deletingId === paciente.id}>
                {deletingId === paciente.id ? <Spinner size="sm" /> : "Excluir"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function TriagemPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [fila, setFila] = useState<TriagemFila[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<TriagemFila | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchFilaTriagem() {
      try {
        const data = await api.get<TriagemFila[]>('/triagem');
        setFila(data);
      } catch (error) {
        setFila([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFilaTriagem();
  }, []);

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
                <ListaTriagem pacientes={pacientes} onSelect={handleSelectPaciente} />
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
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500">FC</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                        {selectedPaciente.sinaisVitais.fc}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500">FR</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                        {selectedPaciente.sinaisVitais.fr}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500">Temp</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                        {selectedPaciente.sinaisVitais.temp}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500">SpO2</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                        {selectedPaciente.sinaisVitais.spo2}%
                      </p>
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
