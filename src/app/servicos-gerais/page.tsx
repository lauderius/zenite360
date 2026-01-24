'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Tabs, Modal } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import { api } from '@/services/api';

// ============================================================================
// TIPOS LOCAIS
// ============================================================================

interface DashboardData {
  contratosVigentes: number;
  valorTotalContratos: number;
  funcionariosTerceirizados: number;
  residuosTotalKgMes: number;
  residuosInfectantesKg: number;
  avaliacaoMediaContratos: number;
  contratosProximoVencimento: number;
}

interface ContratoData {
  id: number;
  codigo: string;
  empresaContratada: string;
  objeto: string;
  tipo: string;
  status: string;
  valorMensal: number;
  quantidadeFuncionarios: number;
  diasParaVencimento: number;
  notaAvaliacao?: number;
}

interface ColetaData {
  id: number;
  codigo: string;
  data: Date;
  turno: string;
  status: string;
  pesoTotalKg: number;
  volumeTotalLitros: number;
  manifestoEmitido: boolean;
}

interface CozinhaData {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  unidadeMedida: string;
  validade?: Date;
}

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

const tipoContratoConfig: Record<string, { label: string; icon: string; cor: string }> = {
  LIMPEZA: { label: 'Limpeza', icon: 'Sparkles', cor: 'bg-cyan-500' },
  SEGURANCA: { label: 'Segurança', icon: 'Shield', cor: 'bg-blue-500' },
  MANUTENCAO_PREDIAL: { label: 'Manutenção Predial', icon: 'Building', cor: 'bg-amber-500' },
  JARDINAGEM: { label: 'Jardinagem', icon: 'Leaf', cor: 'bg-emerald-500' },
  ALIMENTACAO: { label: 'Alimentação', icon: 'UtensilsCrossed', cor: 'bg-orange-500' },
  LAVANDERIA: { label: 'Lavanderia', icon: 'Shirt', cor: 'bg-purple-500' },
  TRANSPORTE: { label: 'Transporte', icon: 'Truck', cor: 'bg-slate-500' },
  TI: { label: 'TI', icon: 'Monitor', cor: 'bg-indigo-500' },
  OUTROS: { label: 'Outros', icon: 'Package', cor: 'bg-gray-500' },
};

const statusContratoConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' | 'primary' }> = {
  VIGENTE: { label: 'Vigente', variant: 'success' },
  PROXIMO_VENCIMENTO: { label: 'Próximo Vencimento', variant: 'warning' },
  VENCIDO: { label: 'Vencido', variant: 'danger' },
  SUSPENSO: { label: 'Suspenso', variant: 'default' },
  CANCELADO: { label: 'Cancelado', variant: 'danger' },
  EM_RENOVACAO: { label: 'Em Renovação', variant: 'primary' },
};

const classeResiduoConfig: Record<string, { label: string; descricao: string; cor: string }> = {
  A1: { label: 'A1', descricao: 'Infectante - Culturas', cor: 'bg-red-600' },
  A2: { label: 'A2', descricao: 'Infectante - Animais', cor: 'bg-red-500' },
  A3: { label: 'A3', descricao: 'Infectante - Peças anatômicas', cor: 'bg-red-400' },
  A4: { label: 'A4', descricao: 'Infectante - Outros', cor: 'bg-red-300' },
  A5: { label: 'A5', descricao: 'Infectante - Órgãos', cor: 'bg-red-700' },
  B: { label: 'B', descricao: 'Químico', cor: 'bg-orange-500' },
  C: { label: 'C', descricao: 'Radioativo', cor: 'bg-purple-500' },
  D: { label: 'D', descricao: 'Comum', cor: 'bg-gray-500' },
  E: { label: 'E', descricao: 'Perfurocortante', cor: 'bg-amber-500' },
};

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

export default function ServicosGeraisPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [contratos, setContratos] = useState<ContratoData[]>([]);
  const [coletas, setColetas] = useState<ColetaData[]>([]);
  const [estoqueCozinha, setEstoqueCozinha] = useState<CozinhaData[]>([]);

  useEffect(() => {
    async function fetchServicosGerais() {
      try {
        const [dashResult, contsResult, colsResult, cozResult] = await Promise.all([
          api.get<DashboardData>('/servicos-gerais/dashboard'),
          api.get<{ data: ContratoData[] }>('/servicos-gerais/contratos'),
          api.get<{ data: ColetaData[] }>('/servicos-gerais/residuos'),
          api.get<{ data: CozinhaData[] }>('/servicos-gerais/cozinha'),
        ]);

        setDashboard(dashResult);
        setContratos(contsResult.data || []);
        setColetas(colsResult.data || []);
        setEstoqueCozinha(cozResult.data || []);
      } catch (error) {
        console.error('Erro ao carregar dados de serviços gerais:', error);
        // Dados mock em caso de erro
        setDashboard({
          contratosVigentes: 8,
          valorTotalContratos: 2500000,
          funcionariosTerceirizados: 45,
          residuosTotalKgMes: 1250,
          residuosInfectantesKg: 320,
          avaliacaoMediaContratos: 4.2,
          contratosProximoVencimento: 2,
        });
        setContratos([]);
        setColetas([]);
        setEstoqueCozinha([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchServicosGerais();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(value / 100) + ' Kz';
  };

  const itensEstoqueBaixo = estoqueCozinha.filter(i => i.quantidadeAtual < i.quantidadeMinima);

  if (isLoading || !dashboard) {
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
        title="Serviços Gerais e Logística"
        description="Gestão de contratos, resíduos hospitalares e estoque"
        actions={
          <div className="flex gap-2">
            <Link href="/servicos-gerais/residuos/coleta">
              <Button variant="outline">
                <Icons.Trash2 size={16} />
                Nova Coleta
              </Button>
            </Link>
            <Link href="/servicos-gerais/contratos/novo">
              <Button>
                <Icons.Plus size={16} />
                Novo Contrato
              </Button>
            </Link>
          </div>
        }
      />

      <PageContent>
        {/* Alertas */}
        {(dashboard.contratosProximoVencimento > 0 || itensEstoqueBaixo.length > 0) && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboard.contratosProximoVencimento > 0 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icons.AlertTriangle className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-400">
                      {dashboard.contratosProximoVencimento} contrato(s) próximo(s) do vencimento
                    </p>
                    <Link href="/servicos-gerais/contratos?status=PROXIMO_VENCIMENTO">
                      <span className="text-sm text-amber-700 dark:text-amber-300 hover:underline">
                        Ver contratos →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {itensEstoqueBaixo.length > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icons.AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-400">
                      {itensEstoqueBaixo.length} item(ns) com estoque baixo na cozinha
                    </p>
                    <Link href="/servicos-gerais/cozinha">
                      <span className="text-sm text-red-700 dark:text-red-300 hover:underline">
                        Ver estoque →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* KPIs */}
        <GridLayout cols={4}>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Contratos Vigentes</p>
                  <p className="text-3xl font-bold mt-1">{dashboard.contratosVigentes}</p>
                  <p className="text-xs opacity-70 mt-1">{formatCurrency(dashboard.valorTotalContratos)}/mês</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.FileText className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Terceirizados</p>
                  <p className="text-3xl font-bold mt-1">{dashboard.funcionariosTerceirizados}</p>
                  <p className="text-xs opacity-70 mt-1">funcionários</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Resíduos (Mês)</p>
                  <p className="text-3xl font-bold mt-1">{dashboard.residuosTotalKgMes.toLocaleString()} kg</p>
                  <p className="text-xs opacity-70 mt-1">{dashboard.residuosInfectantesKg} kg infectantes</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.Trash2 className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Avaliação Média</p>
                  <p className="text-3xl font-bold mt-1">{dashboard.avaliacaoMediaContratos}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icons.Star
                        key={star}
                        size={12}
                        className={star <= Math.round(dashboard.avaliacaoMediaContratos) ? 'fill-white' : 'opacity-50'}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.Star className="w-6 h-6" />
                </div>
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
                  id: 'contratos',
                  label: `Contratos (${contratos.length})`,
                  content: (
                    <div className="space-y-4">
                      {contratos.map((contrato) => (
                        <div
                          key={contrato.id}
                          className={`p-4 rounded-lg border ${
                            contrato.status === 'PROXIMO_VENCIMENTO'
                              ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800'
                              : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tipoContratoConfig[contrato.tipo].cor}`}>
                                <Icons.FileText className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                                    {contrato.empresaContratada}
                                  </h3>
                                  <Badge variant={statusContratoConfig[contrato.status].variant}>
                                    {statusContratoConfig[contrato.status].label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-sky-600 font-mono">{contrato.codigo}</p>
                                <p className="text-sm text-slate-500 mt-1">{contrato.objeto}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Icons.DollarSign size={14} />
                                    {formatCurrency(contrato.valorMensal)}/mês
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Icons.Users size={14} />
                                    {contrato.quantidadeFuncionarios} funcionários
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Icons.Calendar size={14} />
                                    Vence em {contrato.diasParaVencimento} dias
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {contrato.notaAvaliacao && (
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Icons.Star
                                      key={star}
                                      size={14}
                                      className={star <= Math.round(contrato.notaAvaliacao!) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                                    />
                                  ))}
                                </div>
                              )}
                              <div className="flex gap-1">
                                <Link href={`/servicos-gerais/contratos/${contrato.id}`}>
                                  <Button variant="outline" size="sm">
                                    <Icons.Eye size={14} />
                                    Ver
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  id: 'residuos',
                  label: 'Resíduos Hospitalares',
                  content: (
                    <div>
                      {/* Classes de Resíduos */}
                      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 mb-6">
                        {Object.entries(classeResiduoConfig).map(([key, value]) => (
                          <div key={key} className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className={`w-8 h-8 ${value.cor} rounded-full mx-auto flex items-center justify-center text-white text-sm font-bold`}>
                              {value.label}
                            </div>
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">{value.descricao}</p>
                          </div>
                        ))}
                      </div>

                      {/* Coletas Recentes */}
                      <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-3">Coletas Recentes</h4>
                      <div className="space-y-3">
                        {coletas.map((coleta) => (
                          <div key={coleta.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                coleta.status === 'CONCLUIDA' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                              }`}>
                                <Icons.Trash2 className={`w-5 h-5 ${
                                  coleta.status === 'CONCLUIDA' ? 'text-emerald-600' : 'text-amber-600'
                                }`} />
                              </div>
                              <div>
                                <p className="font-medium text-slate-700 dark:text-slate-200">{coleta.codigo}</p>
                                <p className="text-sm text-slate-500">
                                  {coleta.data.toLocaleDateString('pt-AO')} - Turno {coleta.turno}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-medium text-slate-700 dark:text-slate-200">{coleta.pesoTotalKg} kg</p>
                                <p className="text-sm text-slate-500">{coleta.volumeTotalLitros} L</p>
                              </div>
                              <Badge variant={coleta.status === 'CONCLUIDA' ? 'success' : 'warning'}>
                                {coleta.status === 'CONCLUIDA' ? 'Concluída' : 'Agendada'}
                              </Badge>
                              {coleta.manifestoEmitido && (
                                <Button variant="outline" size="sm">
                                  <Icons.FileText size={14} />
                                  Manifesto
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'cozinha',
                  label: 'Estoque Cozinha',
                  content: (
                    <div>
                      {/* Alertas de Estoque Baixo */}
                      {itensEstoqueBaixo.length > 0 && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <h4 className="font-medium text-red-800 dark:text-red-400 mb-2">
                            Itens com Estoque Baixo
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {itensEstoqueBaixo.map((item) => (
                              <Badge key={item.id} variant="danger">
                                {item.nome}: {item.quantidadeAtual}/{item.quantidadeMinima} {item.unidadeMedida}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tabela de Estoque */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">Código</th>
                              <th className="px-4 py-3 text-left font-semibold">Item</th>
                              <th className="px-4 py-3 text-center font-semibold">Categoria</th>
                              <th className="px-4 py-3 text-center font-semibold">Qtd. Atual</th>
                              <th className="px-4 py-3 text-center font-semibold">Mínimo</th>
                              <th className="px-4 py-3 text-center font-semibold">Validade</th>
                              <th className="px-4 py-3 text-center font-semibold">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {estoqueCozinha.map((item) => {
                              const isBaixo = item.quantidadeAtual < item.quantidadeMinima;
                              return (
                                <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700">
                                  <td className="px-4 py-3 font-mono text-sky-600">{item.codigo}</td>
                                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{item.nome}</td>
                                  <td className="px-4 py-3 text-center text-slate-500">{item.categoria}</td>
                                  <td className={`px-4 py-3 text-center font-medium ${isBaixo ? 'text-red-600' : 'text-slate-700 dark:text-slate-200'}`}>
                                    {item.quantidadeAtual} {item.unidadeMedida}
                                  </td>
                                  <td className="px-4 py-3 text-center text-slate-500">{item.quantidadeMinima} {item.unidadeMedida}</td>
                                  <td className="px-4 py-3 text-center text-slate-500">
                                    {item.validade?.toLocaleDateString('pt-AO') || '-'}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <Badge variant={isBaixo ? 'danger' : 'success'}>
                                      {isBaixo ? 'Baixo' : 'OK'}
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
              defaultTab="contratos"
            />
          </CardContent>
        </Card>
      </PageContent>
    </MainLayout>
  );
}