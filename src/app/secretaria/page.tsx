'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Tabs, Modal } from '@/components/ui';
import { Icons } from '@/components/ui/Icons';
import type { 
  DocumentoOficial, 
  TipoDocumentoOficial, 
  StatusDocumentoOficial,
  PrioridadeDocumento,
  SuprimentoEscritorio,
  RequisicaoMaterial,
  DashboardSecretaria 
} from '@/types/administrativo';

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

const tipoDocumentoConfig: Record<TipoDocumentoOficial, { label: string; icon: string }> = {
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

const statusDocumentoConfig: Record<StatusDocumentoOficial, { label: string; variant: 'default' | 'primary' | 'warning' | 'success' | 'danger' }> = {
  RASCUNHO: { label: 'Rascunho', variant: 'default' },
  EM_ELABORACAO: { label: 'Em Elaboração', variant: 'primary' },
  AGUARDANDO_ASSINATURA: { label: 'Aguardando Assinatura', variant: 'warning' },
  ASSINADO: { label: 'Assinado', variant: 'success' },
  ENVIADO: { label: 'Enviado', variant: 'success' },
  RECEBIDO: { label: 'Recebido', variant: 'primary' },
  ARQUIVADO: { label: 'Arquivado', variant: 'default' },
  CANCELADO: { label: 'Cancelado', variant: 'danger' },
};

const prioridadeConfig: Record<PrioridadeDocumento, { label: string; cor: string }> = {
  URGENTE: { label: 'Urgente', cor: 'bg-red-500 text-white' },
  ALTA: { label: 'Alta', cor: 'bg-orange-500 text-white' },
  NORMAL: { label: 'Normal', cor: 'bg-blue-500 text-white' },
  BAIXA: { label: 'Baixa', cor: 'bg-slate-500 text-white' },
};

const mockDashboard: DashboardSecretaria = {
  documentosPendentes: 15,
  documentosUrgentes: 3,
  documentosHoje: 8,
  documentosMes: 247,
  tramitacoesPendentes: 12,
  tempoMedioTramitacao: 2.3,
  requisicoesMateriaisPendentes: 5,
  itensEstoqueBaixo: [],
  documentosPorTipo: [
    { tipo: 'OFICIO', quantidade: 85 },
    { tipo: 'MEMORANDO', quantidade: 62 },
    { tipo: 'CIRCULAR', quantidade: 28 },
    { tipo: 'DESPACHO', quantidade: 45 },
    { tipo: 'OUTROS', quantidade: 27 },
  ],
  tramitacoesPorDepartamento: [
    { departamento: 'Direcção Geral', quantidade: 35 },
    { departamento: 'RH', quantidade: 28 },
    { departamento: 'Financeiro', quantidade: 45 },
    { departamento: 'Clínica', quantidade: 22 },
  ],
};

const mockDocumentos: DocumentoOficial[] = [
  {
    id: 1,
    codigo: 'DOC-2024-001',
    numero: 'OF/DG/001/2024',
    ano: 2024,
    tipo: 'OFICIO',
    assunto: 'Solicitação de Equipamentos Médicos',
    resumo: 'Solicitação formal ao Ministério da Saúde para aquisição de equipamentos',
    tipoMovimentacao: 'SAIDA',
    remetenteInterno: 'Direcção Geral',
    destinatarioExterno: 'Ministério da Saúde',
    dataDocumento: new Date('2024-01-15'),
    status: 'ENVIADO',
    prioridade: 'ALTA',
    elaboradoPorId: 1,
    elaboradoPor: 'Maria Santos',
    assinadoPorId: 2,
    assinadoPor: 'Dr. Manuel Alves',
    activo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: 2,
    codigo: 'DOC-2024-002',
    numero: 'MEM/RH/005/2024',
    ano: 2024,
    tipo: 'MEMORANDO',
    assunto: 'Escala de Plantões - Fevereiro 2024',
    tipoMovimentacao: 'INTERNO',
    remetenteInterno: 'Recursos Humanos',
    destinatarioInterno: 'Direcção Clínica',
    dataDocumento: new Date('2024-01-14'),
    prazoResposta: new Date('2024-01-20'),
    status: 'AGUARDANDO_ASSINATURA',
    prioridade: 'URGENTE',
    elaboradoPorId: 3,
    elaboradoPor: 'Teresa Oliveira',
    departamentoAtualId: 2,
    departamentoAtual: 'Direcção Clínica',
    activo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: 3,
    codigo: 'DOC-2024-003',
    numero: 'ENT/2024/0045',
    ano: 2024,
    tipo: 'OFICIO',
    assunto: 'Resposta sobre Auditoria Externa',
    tipoMovimentacao: 'ENTRADA',
    remetenteExterno: 'Tribunal de Contas',
    destinatarioInterno: 'Direcção Geral',
    dataDocumento: new Date('2024-01-10'),
    dataRecebimento: new Date('2024-01-12'),
    protocoloExterno: 'TC/AUD/2024/001',
    status: 'RECEBIDO',
    prioridade: 'ALTA',
    departamentoAtualId: 1,
    departamentoAtual: 'Direcção Geral',
    activo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
];

const mockSuprimentos: SuprimentoEscritorio[] = [
  { id: 1, codigo: 'SUP-001', nome: 'Papel A4', categoria: 'PAPEL', unidadeMedida: 'resma', quantidadeAtual: 25, quantidadeMinima: 50, activo: true },
  { id: 2, codigo: 'SUP-002', nome: 'Caneta Esferográfica Azul', categoria: 'ESCRITA', unidadeMedida: 'cx', quantidadeAtual: 15, quantidadeMinima: 20, activo: true },
  { id: 3, codigo: 'SUP-003', nome: 'Toner HP 85A', categoria: 'IMPRESSAO', unidadeMedida: 'un', quantidadeAtual: 8, quantidadeMinima: 10, activo: true },
  { id: 4, codigo: 'SUP-004', nome: 'Grampeador', categoria: 'ORGANIZACAO', unidadeMedida: 'un', quantidadeAtual: 12, quantidadeMinima: 5, activo: true },
];

const mockRequisicoes: RequisicaoMaterial[] = [
  {
    id: 1,
    codigo: 'REQ-2024-001',
    departamentoSolicitanteId: 5,
    departamentoSolicitante: 'Laboratório',
    solicitanteId: 1,
    solicitante: 'João Silva',
    dataSolicitacao: new Date('2024-01-14'),
    status: 'PENDENTE',
    prioridade: 'NORMAL',
    justificativa: 'Reposição de estoque para o mês',
    itens: [],
    criadoEm: new Date(),
  },
  {
    id: 2,
    codigo: 'REQ-2024-002',
    departamentoSolicitanteId: 10,
    departamentoSolicitante: 'Financeiro',
    solicitanteId: 2,
    solicitante: 'Diana Santos',
    dataSolicitacao: new Date('2024-01-15'),
    status: 'APROVADA',
    prioridade: 'ALTA',
    justificativa: 'Material para fechamento do mês',
    itens: [],
    criadoEm: new Date(),
  },
];

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

export default function SecretariaPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardSecretaria | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoOficial[]>([]);
  const [suprimentos, setSuprimentos] = useState<SuprimentoEscritorio[]>([]);
  const [requisicoes, setRequisicoes] = useState<RequisicaoMaterial[]>([]);
  const [showNovoDocumento, setShowNovoDocumento] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboard(mockDashboard);
      setDocumentos(mockDocumentos);
      setSuprimentos(mockSuprimentos);
      setRequisicoes(mockRequisicoes);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const itensEstoqueBaixo = suprimentos.filter(s => s.quantidadeAtual < s.quantidadeMinima);

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
                  <Icons.Package className="w-6 h-6" />
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
                        {tipoDocumentoConfig[item.tipo as TipoDocumentoOficial]?.label || item.tipo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sky-500"
                          style={{ width: `${(item.quantidade / dashboard.documentosMes) * 100}%` }}
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
                          style={{ width: `${(item.quantidade / 50) * 100}%` }}
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
                      {documentos.map((doc) => (
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
                                  <Icons.ArrowDownLeft className={`w-5 h-5 text-emerald-600`} />
                                ) : doc.tipoMovimentacao === 'SAIDA' ? (
                                  <Icons.ArrowUpRight className={`w-5 h-5 text-blue-600`} />
                                ) : (
                                  <Icons.ArrowLeftRight className={`w-5 h-5 text-purple-600`} />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                                    {doc.assunto}
                                  </h3>
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${prioridadeConfig[doc.prioridade].cor}`}>
                                    {prioridadeConfig[doc.prioridade].label}
                                  </span>
                                  <Badge variant={statusDocumentoConfig[doc.status].variant}>
                                    {statusDocumentoConfig[doc.status].label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-sky-600 font-mono">{doc.numero}</p>
                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                  <span>{tipoDocumentoConfig[doc.tipo].label}</span>
                                  <span>•</span>
                                  <span>{doc.dataDocumento.toLocaleDateString('pt-AO')}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  {doc.tipoMovimentacao === 'ENTRADA' 
                                    ? `De: ${doc.remetenteExterno} → Para: ${doc.destinatarioInterno}`
                                    : doc.tipoMovimentacao === 'SAIDA'
                                    ? `De: ${doc.remetenteInterno} → Para: ${doc.destinatarioExterno}`
                                    : `${doc.remetenteInterno} → ${doc.destinatarioInterno}`
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
                                  <Icons.Edit3 size={14} />
                                  Assinar
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
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
                      {requisicoes.map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              req.status === 'PENDENTE' ? 'bg-amber-100 dark:bg-amber-900/30' :
                              req.status === 'APROVADA' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                              'bg-slate-100 dark:bg-slate-700'
                            }`}>
                              <Icons.Package className={`w-5 h-5 ${
                                req.status === 'PENDENTE' ? 'text-amber-600' :
                                req.status === 'APROVADA' ? 'text-emerald-600' : 'text-slate-600'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium text-slate-700 dark:text-slate-200">{req.codigo}</p>
                              <p className="text-sm text-slate-500">
                                {req.departamentoSolicitante} • {req.solicitante}
                              </p>
                              <p className="text-sm text-slate-500">{req.dataSolicitacao.toLocaleDateString('pt-AO')}</p>
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
                      ))}
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