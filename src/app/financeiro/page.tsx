'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Tabs } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import type { StatusFatura, FormaPagamento } from '@/types';

interface Fatura {
  id: number;
  numero: string;
  paciente: string;
  tipo: string;
  dataEmissao: Date;
  dataVencimento: Date;
  total: number;
  valorPago: number;
  status: StatusFatura;
  formaPagamento?: FormaPagamento;
}

interface ResumoFinanceiro {
  receitaHoje: number;
  receitaMes: number;
  faturasEmitidas: number;
  faturasPendentes: number;
  faturasVencidas: number;
  ticketMedio: number;
}

import { api } from '@/services/api';



const statusConfig: Record<StatusFatura, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  RASCUNHO: { label: 'Rascunho', variant: 'default' },
  EMITIDA: { label: 'Emitida', variant: 'primary' },
  PARCIALMENTE_PAGA: { label: 'Parcial', variant: 'warning' },
  PAGA: { label: 'Paga', variant: 'success' },
  VENCIDA: { label: 'Vencida', variant: 'danger' },
  CANCELADA: { label: 'Cancelada', variant: 'default' },
  ANULADA: { label: 'Anulada', variant: 'default' },
};

const formaPagamentoLabels: Record<FormaPagamento, string> = {
  DINHEIRO: 'Dinheiro',
  MULTICAIXA: 'Multicaixa',
  TRANSFERENCIA: 'Transferência',
  CHEQUE: 'Cheque',
  CONVENIO: 'Convénio',
  ISENTO: 'Isento',
  OUTRO: 'Outro',
};

export default function FinanceiroPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  async function fetchFinanceiro() {
    try {
      const [fatsResult, res] = await Promise.all([
        api.get<{ data: Fatura[] }>('/financeiro/faturas'),
        api.get<ResumoFinanceiro>('/financeiro/resumo'),
      ]);
      // A API retorna { data: [...] } ou diretamente o array
      setFaturas(fatsResult.data || fatsResult || []);
      setResumo(res);
    } catch (error) {
      console.error('Erro ao carregar dados do financeiro:', error);
      setFaturas([]);
      setResumo(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchFinanceiro();
  }, []);

  async function handleDeleteFatura(id: number) {
    if (!window.confirm('Tem certeza que deseja excluir esta fatura?')) return;
    setIsDeleting(id);
    try {
      await api.delete(`/financeiro/faturas/${id}`);
      toast.success('Fatura excluída com sucesso');
      await fetchFinanceiro();
    } catch (error) {
      toast.error('Erro ao excluir fatura');
    } finally {
      setIsDeleting(null);
    }
  }

  const faturasFiltradas = filtroStatus
    ? faturas.filter((f) => f.status === filtroStatus)
    : faturas;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(value).replace('AOA', 'Kz');
  };

  if (isLoading || !resumo) {
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
        title="Financeiro"
        description="Gestão de faturação e pagamentos"
        actions={
          <div className="flex gap-2">
            <Link href="/financeiro/relatorios">
              <Button variant="outline">
                <Icons.BarChart size={16} />
                Relatórios
              </Button>
            </Link>
            <Link href="/financeiro/faturas/nova">
              <Button>
                <Icons.Plus size={16} />
                Nova Fatura
              </Button>
            </Link>
          </div>
        }
      />

      <PageContent>
        {/* Cards de Resumo */}
        <GridLayout cols={3}>
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Receita Hoje</p>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(resumo.receitaHoje)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sky-100 text-sm">Receita do Mês</p>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(resumo.receitaMes)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.DollarSign className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Ticket Médio</p>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(resumo.ticketMedio)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.BarChart className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </GridLayout>

        {/* Indicadores Menores */}
        <GridLayout cols={4}>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{resumo.faturasEmitidas}</p>
              <p className="text-sm text-slate-500">Faturas Emitidas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{resumo.faturasPendentes}</p>
              <p className="text-sm text-slate-500">Pendentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{resumo.faturasVencidas}</p>
              <p className="text-sm text-slate-500">Vencidas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {Math.round((resumo.faturasEmitidas - resumo.faturasPendentes - resumo.faturasVencidas) / resumo.faturasEmitidas * 100)}%
              </p>
              <p className="text-sm text-slate-500">Taxa de Recebimento</p>
            </CardContent>
          </Card>
        </GridLayout>

        {/* Lista de Faturas */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Faturas Recentes</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={filtroStatus === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFiltroStatus('')}
                >
                  Todas
                </Button>
                <Button
                  variant={filtroStatus === 'EMITIDA' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFiltroStatus('EMITIDA')}
                >
                  Pendentes
                </Button>
                <Button
                  variant={filtroStatus === 'VENCIDA' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFiltroStatus('VENCIDA')}
                >
                  Vencidas
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Fatura</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Paciente</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Tipo</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-400">Vencimento</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">Total</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">Pago</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-400">Status</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-400">Acções</th>
                  </tr>
                </thead>
                <tbody>
                  {faturasFiltradas.map((fatura) => (
                    <tr key={fatura.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sky-600">{fatura.numero}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
                        {fatura.paciente}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{fatura.tipo}</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                        {fatura.dataVencimento.toLocaleDateString('pt-AO')}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-200">
                        {formatCurrency(fatura.total)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                        {formatCurrency(fatura.valorPago)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={statusConfig[fatura.status].variant}>
                          {statusConfig[fatura.status].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link href={`/financeiro/faturas/${fatura.id}`}>
                            <Button variant="ghost" size="icon">
                              <Icons.Eye size={16} />
                            </Button>
                          </Link>
                          {['EMITIDA', 'PARCIALMENTE_PAGA', 'VENCIDA'].includes(fatura.status) && (
                            <Button variant="ghost" size="icon" title="Registrar Pagamento">
                              <Icons.DollarSign size={16} />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" title="Imprimir">
                            <Icons.Printer size={16} />
                          </Button>
                          <button
                            className="text-red-600 hover:text-red-800 disabled:opacity-50 ml-2"
                            title="Excluir"
                            disabled={isDeleting === fatura.id}
                            onClick={() => handleDeleteFatura(fatura.id)}
                          >
                            {isDeleting === fatura.id ? 'Excluindo...' : 'Excluir'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </MainLayout>
  );
}