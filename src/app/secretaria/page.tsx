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
  documentosHoje: number;
  documentosMes: number;
  documentosUrgentes: number;
  tramitacoesPendentes: number;
  tempoMedioTramitacao: number;
  requisicoesMateriaisPendentes: number;
  documentosPorTipo: { tipo: string; quantidade: number }[];
  tramitacoesPorDepartamento: { departamento: string; quantidade: number }[];
}

interface DocumentoData {
  id: number;
  numero: string;
  tipo: string;
  assunto: string;
  prioridade: string;
  status: string;
  tipoMovimentacao: string;
  dataDocumento: Date;
  remetenteInterno?: string;
  destinatarioInterno?: string;
  remetenteExterno?: string;
  destinatarioExterno?: string;
}

interface SuprimentoData {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  unidadeMedida: string;
}

interface RequisicaoData {
  id: number;
  codigo: string;
  departamentoSolicitante: string;
  solicitante: string;
  status: string;
  dataSolicitacao: Date;
}

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

const tipoDocumentoConfig: Record<string, { label: string; icon: string }> = {
  OFICIO: { label: 'Ofício', icon: 'Mail' },
  MEMORANDO: { label: 'Memorando', icon: 'FileText' },
  CIRCULAR: { label: 'Circular', icon: 'Send' },
  PORTARIA: { label: 'Portaria', icon: 'Gavel' },
  RESOLUCAO: { label: 'Resolução', icon: 'Scale' },
  DESPACHO: { label: 'Despacho', icon: 'CheckSquare' },
  PARECER: { label: 'Parecer', icon: 'MessageSquare' },
  COMUNICADO: { label: 'Comunicado', icon: 'Megaphone' },
  ATA: { label: 'Ata', icon: 'BookOpen' },
  CONTRATO: { label: 'Contrato', icon: 'Handshake' },
  CONVENIO: { label: 'Convénio', icon: 'Users' },
  RELATORIO: { label: 'Relatório', icon: 'BarChart' },
  OUTROS: { label: 'Outros', icon: 'File' },
};

const statusDocumentoConfig: Record<string, { label: string; variant: 'default' | 'primary' | 'warning' | 'success' | 'danger' }> = {
  RASCUNHO: { label: 'Rascunho', variant: 'default' },
  EM_ELABORACAO: { label: 'Em Elaboração', variant: 'primary' },
  AGUARDANDO_ASSINATURA: { label: 'Aguardando Assinatura', variant: 'warning' },
  ASSINADO: { label: 'Assinado', variant: 'success' },
  ENVIADO: { label: 'Enviado', variant: 'success' },
  RECEBIDO: { label: 'Recebido', variant: 'primary' },
  ARQUIVADO: { label: 'Arquivado', variant: 'default' },
  CANCELADO: { label: 'Cancelado', variant: 'danger' },
};

const prioridadeConfig: Record<string, { label: string; cor: string }> = {
  URGENTE: { label: 'Urgente', cor: 'bg-red-500 text-white' },
  ALTA: { label: 'Alta', cor: 'bg-orange-500 text-white' },
  NORMAL: { label: 'Normal', cor: 'bg-blue-500 text-white' },
  BAIXA: { label: 'Baixa', cor: 'bg-slate-500 text-white' },
};

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

export default function SecretariaPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoData[]>([]);
  const [suprimentos, setSuprimentos] = useState<SuprimentoData[]>([]);
  const [requisicoes, setRequisicoes] = useState<RequisicaoData[]>([]);
  const [showNovoDocumento, setShowNovoDocumento] = useState(false);
  const [isDeletingSuprimento, setIsDeletingSuprimento] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSecretaria() {
      try {
        const [dashResult, docsResult, supsResult, reqsResult] = await Promise.all([
          api.get<DashboardData>('/secretaria/dashboard'),
          api.get<{ data: DocumentoData[] }>('/secretaria/documentos'),
          api.get<{ data: SuprimentoData[] }>('/secretaria/suprimentos'),
          api.get<{ data: RequisicaoData[] }>('/secretaria/requisicoes'),
        ]);

        setDashboard(dashResult);
        setDocumentos(docsResult.data || []);
        setSuprimentos(supsResult.data || []);
        setRequisicoes(reqsResult.data || []);
      } catch (error) {
        console.error('Erro ao carregar dados da secretaria:', error);
        // Dados mock em caso de erro
        setDashboard({
          documentosHoje: 12,
          documentosMes: 156,
          documentosUrgentes: 3,
          tramitacoesPendentes: 8,
          tempoMedioTramitacao: 2.5,
          requisicoesMateriaisPendentes: 5,
          documentosPorTipo: [],
          tramitacoesPorDepartamento: [],
        });
        setDocumentos([]);
        setSuprimentos([]);
        setRequisicoes([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSecretaria();
  }, []);

  const itensEstoqueBaixo = suprimentos.filter(s => s.quantidadeAtual < s.quantidadeMinima);

  async function handleDeleteSuprimento(id: number) {
    if (!window.confirm('Tem certeza que deseja excluir este suprimento?')) return;
    setIsDeletingSuprimento(id);
    try {
      await api.delete(`/secretaria/suprimentos/${id}`);
      const novos = suprimentos.filter((s) => s.id !== id);
      setSuprimentos(novos);
    } catch (error) {
      console.error('Erro ao excluir suprimento:', error);
    } finally {
      setIsDeletingSuprimento(null);
    }
  }

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
        title="Secretaria Geral"
        description="Gestão de documentos oficiais e suprimentos de escritório"
        actions={
          <div className="flex gap-2">
            <Link href="/secretaria/protocolo">
              <Button variant="outline">
                <Icons.Search size={16} />
                Protocolo
              </Button>
            </Link>
            <Button onClick={() => setShowNovoDocumento(true)}>
              <Icons.Plus size={16} />
              Novo Documento
            </Button>
          </div>
        }
      />

      <PageContent>
        {/* KPIs */}
        <GridLayout cols={4}>
          <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Documentos Hoje</p>
                  <p className="text-3xl font-bold mt-1">{dashboard.documentosHoje}</p>
                  <p className="text-xs opacity-70 mt-1">{dashboard.documentosMes} este mês</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.FileText className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Urgentes</p>
                  <p className="text-3xl font-bold mt-1">{dashboard.documentosUrgentes}</p>
                  <p className="text-xs opacity-70 mt-1">requer atenção</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Em Tramitação</p>
                  <p className="text-3xl font-bold mt-1">{dashboard.tramitacoesPendentes}</p>
                  <p className="text-xs opacity-70 mt-1">média {dashboard.tempoMedioTramitacao} dias</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Requisições Pendentes</p>
                  <p className="text-3xl font-bold mt-1">{dashboard.requisicoesMateriaisPendentes}</p>
                  <p className="text-xs opacity-70 mt-1">{itensEstoqueBaixo.length} itens baixos</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.FileText className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </GridLayout>

        {/* Distribuição por Tipo */}
        <GridLayout cols={2}>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Documentos por Tipo (Mês)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboard.documentosPorTipo.map((item) => (
                  <div key={item.tipo} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icons.FileText size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {tipoDocumentoConfig[item.tipo]?.label || item.tipo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sky-500"
                          style={{ width: `${dashboard.documentosMes > 0 ? (item.quantidade / dashboard.documentosMes) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 w-8 text-right">
                        {item.quantidade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tramitações por Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboard.tramitacoesPorDepartamento.map((item) => (
                  <div key={item.departamento} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icons.Building size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {item.departamento}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-500"
                          style={{ width: `${Math.min((item.quantidade / 50) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 w-8 text-right">
                        {item.quantidade}
                      </span>
                    </div>
                  </div>
                ))}
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
                  id: 'documentos',
                  label: `Documentos Recentes`,
                  content: (
                    <div className="space-y-4">
                      {documentos.length > 0 ? documentos.map((doc) => (
                        <div
                          key={doc.id}
                          className={`p-4 rounded-lg border ${
                            doc.prioridade === 'URGENTE'
                              ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800'
                              : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                doc.tipoMovimentacao === 'ENTRADA' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                                doc.tipoMovimentacao === 'SAIDA' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                'bg-purple-100 dark:bg-purple-900/30'
                              }`}>
                                {doc.tipoMovimentacao === 'ENTRADA' ? (
                                  <Icons.ArrowLeft className={`w-5 h-5 text-emerald-600`} />
                                ) : doc.tipoMovimentacao === 'SAIDA' ? (
                                  <Icons.ArrowRight className={`w-5 h-5 text-blue-600`} />
                                ) : (
                                  <Icons.ArrowRight className={`w-5 h-5 text-purple-600`} />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                                    {doc.assunto}
                                  </h3>
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${prioridadeConfig[doc.prioridade]?.cor || prioridadeConfig.NORMAL.cor}`}>
                                    {prioridadeConfig[doc.prioridade]?.label || doc.prioridade}
                                  </span>
                                  <Badge variant={statusDocumentoConfig[doc.status]?.variant || 'default'}>
                                    {statusDocumentoConfig[doc.status]?.label || doc.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-sky-600 font-mono">{doc.numero}</p>
                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                  <span>{tipoDocumentoConfig[doc.tipo]?.label || doc.tipo}</span>
                                  <span>•</span>
                                  <span>{new Date(doc.dataDocumento).toLocaleDateString('pt-AO')}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  {doc.tipoMovimentacao === 'ENTRADA'
                                    ? `De: ${doc.remetenteExterno} → Para: ${doc.destinatarioInterno}`
                                    : doc.tipoMovimentacao === 'SAIDA'
                                    ? `De: ${doc.remetenteInterno} → Para: ${doc.destinatarioExterno}`
                                    : `${doc.remetenteInterno || ''} → ${doc.destinatarioInterno || ''}`
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Link href={`/secretaria/documentos/${doc.id}`}>
                                <Button variant="outline" size="sm">
                                  <Icons.Eye size={14} />
                                  Ver
                                </Button>
                              </Link>
                              {doc.status === 'AGUARDANDO_ASSINATURA' && (
                                <Button size="sm">
                                  <Icons.Edit size={14} />
                                  Assinar
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-8 text-slate-500">
                          <Icons.FileText size={48} className="mx-auto mb-4 text-slate-300" />
                          <p>Nenhum documento encontrado</p>
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  id: 'suprimentos',
                  label: 'Suprimentos',
                  content: (
                    <div>
                      {/* Alertas */}
                      {itensEstoqueBaixo.length > 0 && (
                        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-2">
                            Itens com Estoque Baixo
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {itensEstoqueBaixo.map((item) => (
                              <Badge key={item.id} variant="warning">
                                {item.nome}: {item.quantidadeAtual}/{item.quantidadeMinima} {item.unidadeMedida}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tabela */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">Código</th>
                              <th className="px-4 py-3 text-left font-semibold">Item</th>
                              <th className="px-4 py-3 text-center font-semibold">Categoria</th>
                              <th className="px-4 py-3 text-center font-semibold">Qtd. Atual</th>
                              <th className="px-4 py-3 text-center font-semibold">Mínimo</th>
                              <th className="px-4 py-3 text-center font-semibold">Status</th>
                              <th className="px-4 py-3 text-center font-semibold">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {suprimentos.map((item) => {
                              const isBaixo = item.quantidadeAtual < item.quantidadeMinima;
                              return (
                                <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700">
                                  <td className="px-4 py-3 font-mono text-sky-600">{item.codigo}</td>
                                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{item.nome}</td>
                                  <td className="px-4 py-3 text-center text-slate-500">{item.categoria}</td>
                                  <td className={`px-4 py-3 text-center font-medium ${isBaixo ? 'text-red-600' : 'text-slate-700 dark:text-slate-200'}`}>
                                    {item.quantidadeAtual} {item.unidadeMedida}
                                  </td>
                                  <td className="px-4 py-3 text-center text-slate-500">{item.quantidadeMinima}</td>
                                  <td className="px-4 py-3 text-center">
                                    <Badge variant={isBaixo ? 'danger' : 'success'}>
                                      {isBaixo ? 'Baixo' : 'OK'}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <button
                                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                      title="Excluir"
                                      disabled={isDeletingSuprimento === item.id}
                                      onClick={() => handleDeleteSuprimento(item.id)}
                                    >
                                      {isDeletingSuprimento === item.id ? 'Excluindo...' : 'Excluir'}
                                    </button>
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
                {
                  id: 'requisicoes',
                  label: `Requisições (${requisicoes.length})`,
                  content: (
                    <div className="space-y-4">
                      {requisicoes.length > 0 ? requisicoes.map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              req.status === 'PENDENTE' ? 'bg-amber-100 dark:bg-amber-900/30' :
                              req.status === 'APROVADA' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                              'bg-slate-100 dark:bg-slate-700'
                            }`}>
                              <Icons.FileText className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-700 dark:text-slate-200">{req.codigo}</p>
                              <p className="text-sm text-slate-500">
                                {req.departamentoSolicitante} • {req.solicitante}
                              </p>
                              <p className="text-sm text-slate-500">{new Date(req.dataSolicitacao).toLocaleDateString('pt-AO')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={
                              req.status === 'PENDENTE' ? 'warning' :
                              req.status === 'APROVADA' ? 'success' : 'default'
                            }>
                              {req.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Icons.Eye size={14} />
                              Ver
                            </Button>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-8 text-slate-500">
                          <Icons.FileText size={48} className="mx-auto mb-4 text-slate-300" />
                          <p>Nenhuma requisição encontrada</p>
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
              defaultTab="documentos"
            />
          </CardContent>
        </Card>

        {/* Modal Novo Documento */}
        <Modal
          isOpen={showNovoDocumento}
          onClose={() => setShowNovoDocumento(false)}
          title="Novo Documento"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-slate-500">Selecione o tipo de documento:</p>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(tipoDocumentoConfig).slice(0, 9).map(([key, value]) => (
                <Link key={key} href={`/secretaria/documentos/novo?tipo=${key}`}>
                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors text-center">
                    <Icons.FileText className="w-8 h-8 mx-auto text-sky-600 mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{value.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Modal>
      </PageContent>
    </MainLayout>
  );
}

