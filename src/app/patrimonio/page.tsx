'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Tabs, Modal, Input, Select } from '@/components/ui';
import { Icons } from '@/components/ui/Icons';
import type { 
  Ativo, 
  CategoriaAtivo, 
  StatusAtivo, 
  OrdemManutencaoPatrimonio,
  CentralGases,
  AlertaGas,
  DashboardPatrimonio 
} from '@/types/administrativo';

// ============================================================================
// CONFIGURAÇÕES E MOCKS
// ============================================================================

const categoriaConfig: Record<CategoriaAtivo, { label: string; cor: string; icon: string }> = {
  ELECTROMEDICINA: { label: 'Electromedicina', cor: 'bg-purple-500', icon: 'Activity' },
  MOBILIARIO_HOSPITALAR: { label: 'Mobiliário Hospitalar', cor: 'bg-amber-500', icon: 'Bed' },
  INFORMATICA: { label: 'Informática', cor: 'bg-blue-500', icon: 'Monitor' },
  VEICULOS: { label: 'Veículos', cor: 'bg-slate-500', icon: 'Truck' },
  INFRAESTRUTURA: { label: 'Infraestrutura', cor: 'bg-emerald-500', icon: 'Building' },
  GASES_MEDICINAIS: { label: 'Gases Medicinais', cor: 'bg-cyan-500', icon: 'Wind' },
  INSTRUMENTOS_CIRURGICOS: { label: 'Inst. Cirúrgicos', cor: 'bg-red-500', icon: 'Scissors' },
  LABORATORIO: { label: 'Laboratório', cor: 'bg-indigo-500', icon: 'TestTube' },
  IMAGEM_DIAGNOSTICO: { label: 'Imagem/Diagnóstico', cor: 'bg-pink-500', icon: 'Scan' },
  OUTROS: { label: 'Outros', cor: 'bg-gray-500', icon: 'Package' },
};

const statusConfig: Record<StatusAtivo, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' | 'primary' }> = {
  OPERACIONAL: { label: 'Operacional', variant: 'success' },
  EM_MANUTENCAO: { label: 'Em Manutenção', variant: 'warning' },
  AGUARDANDO_PECAS: { label: 'Aguardando Peças', variant: 'warning' },
  INOPERANTE: { label: 'Inoperante', variant: 'danger' },
  EM_CALIBRACAO: { label: 'Em Calibração', variant: 'primary' },
  DESATIVADO: { label: 'Desativado', variant: 'default' },
  ABATIDO: { label: 'Abatido', variant: 'default' },
};

const mockDashboard: DashboardPatrimonio = {
  totalAtivos: 1247,
  ativosOperacionais: 1089,
  ativosEmManutencao: 87,
  ativosInoperantes: 23,
  valorTotalPatrimonio: 2850000000,
  manutencoesAbertasHoje: 12,
  manutencoesCriticas: 3,
  manutencoesPreventivas30Dias: 45,
  custosManutencaoMes: 15600000,
  tempoMedioReparo: 4.5,
  taxaDisponibilidade: 94.2,
  alertasGases: 2,
  niveisGasesCriticos: [],
  ativosGarantiaVencer: [],
  calibracoesVencer: [],
};

const mockAtivos: Ativo[] = [
  {
    id: 1,
    codigo: 'EQP-001',
    numeroPatrimonio: 'PAT-2024-00001',
    nome: 'Monitor Multiparamétrico',
    categoria: 'ELECTROMEDICINA',
    marca: 'Philips',
    modelo: 'IntelliVue MX800',
    numeroSerie: 'SN123456789',
    dataAquisicao: new Date('2023-06-15'),
    valorAquisicao: 85000000,
    localizacao: 'UTI - Sala 1',
    departamentoId: 4,
    departamento: 'UTI',
    status: 'OPERACIONAL',
    proximaManutencao: new Date('2024-02-15'),
    ultimaManutencao: new Date('2023-12-15'),
    garantiaAte: new Date('2026-06-15'),
    activo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: 2,
    codigo: 'EQP-002',
    numeroPatrimonio: 'PAT-2024-00002',
    nome: 'Ventilador Pulmonar',
    categoria: 'ELECTROMEDICINA',
    marca: 'Dräger',
    modelo: 'Evita V500',
    numeroSerie: 'SN987654321',
    dataAquisicao: new Date('2022-03-20'),
    valorAquisicao: 120000000,
    localizacao: 'UTI - Sala 2',
    departamentoId: 4,
    departamento: 'UTI',
    status: 'EM_MANUTENCAO',
    proximaManutencao: new Date('2024-01-20'),
    ultimaManutencao: new Date('2023-10-20'),
    activo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: 3,
    codigo: 'EQP-003',
    numeroPatrimonio: 'PAT-2024-00003',
    nome: 'Tomógrafo Computadorizado',
    categoria: 'IMAGEM_DIAGNOSTICO',
    marca: 'Siemens',
    modelo: 'SOMATOM go.Top',
    numeroSerie: 'CT2024001',
    dataAquisicao: new Date('2024-01-10'),
    valorAquisicao: 950000000,
    localizacao: 'Radiologia - Sala TC',
    departamentoId: 8,
    departamento: 'Radiologia',
    status: 'OPERACIONAL',
    validadeCalibracao: new Date('2024-07-10'),
    activo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
];

const mockCentraisGases: CentralGases[] = [
  {
    id: 1,
    nome: 'Central de Oxigénio - Principal',
    localizacao: 'Casa de Gases - Bloco A',
    tipoGas: 'OXIGENIO',
    capacidadeTotal: 10000,
    nivelAtualPercentual: 72,
    pressaoAtualBar: 150,
    pressaoMinimaAlerta: 50,
    nivelMinimoAlerta: 30,
    status: 'NORMAL',
    ultimaRecarga: new Date('2024-01-10'),
    activo: true,
  },
  {
    id: 2,
    nome: 'Central de Ar Comprimido',
    localizacao: 'Casa de Gases - Bloco A',
    tipoGas: 'AR_COMPRIMIDO',
    capacidadeTotal: 5000,
    nivelAtualPercentual: 45,
    pressaoAtualBar: 120,
    pressaoMinimaAlerta: 60,
    nivelMinimoAlerta: 25,
    status: 'ALERTA',
    ultimaRecarga: new Date('2024-01-05'),
    activo: true,
  },
  {
    id: 3,
    nome: 'Central de Vácuo',
    localizacao: 'Casa de Gases - Bloco A',
    tipoGas: 'VACUO',
    capacidadeTotal: 3000,
    nivelAtualPercentual: 85,
    pressaoAtualBar: 0.8,
    pressaoMinimaAlerta: 0.3,
    nivelMinimoAlerta: 20,
    status: 'NORMAL',
    activo: true,
  },
  {
    id: 4,
    nome: 'Central de Óxido Nitroso',
    localizacao: 'Centro Cirúrgico',
    tipoGas: 'OXIDO_NITROSO',
    capacidadeTotal: 2000,
    nivelAtualPercentual: 18,
    pressaoAtualBar: 40,
    pressaoMinimaAlerta: 30,
    nivelMinimoAlerta: 20,
    status: 'CRITICO',
    activo: true,
  },
];

const mockAlertas: AlertaGas[] = [
  {
    id: 1,
    centralId: 4,
    tipoAlerta: 'NIVEL_BAIXO',
    severidade: 'CRITICO',
    mensagem: 'Nível crítico de Óxido Nitroso - 18%. Solicitar recarga urgente!',
    dataHora: new Date(),
    reconhecido: false,
    resolvido: false,
  },
  {
    id: 2,
    centralId: 2,
    tipoAlerta: 'NIVEL_BAIXO',
    severidade: 'AVISO',
    mensagem: 'Nível de Ar Comprimido em 45%. Programar recarga.',
    dataHora: new Date(Date.now() - 3600000),
    reconhecido: true,
    reconhecidoPor: 'João Técnico',
    dataReconhecimento: new Date(Date.now() - 1800000),
    resolvido: false,
  },
];

// ============================================================================
// COMPONENTES
// ============================================================================

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'sky',
  subtitle
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  color?: 'sky' | 'emerald' | 'amber' | 'red' | 'purple';
  subtitle?: string;
}) {
  const colors = {
    sky: 'from-sky-500 to-sky-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <Card className={`bg-gradient-to-br ${colors[color]} text-white`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
            {trend && (
              <div className={`flex items-center gap-1 mt-1 text-xs ${trend.positive ? 'text-emerald-200' : 'text-red-200'}`}>
                {trend.positive ? <Icons.TrendingUp size={12} /> : <Icons.TrendingDown size={12} />}
                {trend.value}%
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GaugeChart({ value, label, status }: { value: number; label: string; status: 'NORMAL' | 'ALERTA' | 'CRITICO' | 'MANUTENCAO' }) {
  const getColor = () => {
    if (status === 'CRITICO' || value < 20) return 'stroke-red-500';
    if (status === 'ALERTA' || value < 40) return 'stroke-amber-500';
    return 'stroke-emerald-500';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx="48"
            cy="48"
            r="45"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-500 ${getColor()}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{value}%</span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 text-center">{label}</p>
    </div>
  );
}

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

export default function PatrimonioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardPatrimonio | null>(null);
  const [ativos, setAtivos] = useState<Ativo[]>([]);
  const [centraisGases, setCentraisGases] = useState<CentralGases[]>([]);
  const [alertas, setAlertas] = useState<AlertaGas[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboard(mockDashboard);
      setAtivos(mockAtivos);
      setCentraisGases(mockCentraisGases);
      setAlertas(mockAlertas);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value / 100) + ' Kz';
  };

  const ativosFiltrados = ativos.filter((a) => {
    const matchSearch = a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.numeroPatrimonio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = !filterCategoria || a.categoria === filterCategoria;
    const matchStatus = !filterStatus || a.status === filterStatus;
    return matchSearch && matchCategoria && matchStatus;
  });

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
        title="Património e Electromedicina"
        description="Gestão de ativos, manutenção e monitorização de gases medicinais"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAlertModal(true)}>
              <Icons.Bell size={16} />
              Alertas ({alertas.filter(a => !a.reconhecido).length})
            </Button>
            <Link href="/patrimonio/manutencao">
              <Button variant="outline">
                <Icons.Wrench size={16} />
                Manutenções
              </Button>
            </Link>
            <Link href="/patrimonio/ativos/novo">
              <Button>
                <Icons.Plus size={16} />
                Novo Ativo
              </Button>
            </Link>
          </div>
        }
      />

      <PageContent>
        {/* Alertas Críticos */}
        {alertas.filter(a => a.severidade === 'CRITICO' && !a.resolvido).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Icons.AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 dark:text-red-400">Alertas Críticos</h3>
                {alertas.filter(a => a.severidade === 'CRITICO' && !a.resolvido).map((alerta) => (
                  <p key={alerta.id} className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {alerta.mensagem}
                  </p>
                ))}
              </div>
              <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                Ver Todos
              </Button>
            </div>
          </div>
        )}

        {/* KPIs Principais */}
        <GridLayout cols={4}>
          <StatCard
            title="Total de Ativos"
            value={dashboard.totalAtivos.toLocaleString()}
            icon={Icons.Package}
            color="sky"
            subtitle={`${dashboard.ativosOperacionais} operacionais`}
          />
          <StatCard
            title="Taxa de Disponibilidade"
            value={`${dashboard.taxaDisponibilidade}%`}
            icon={Icons.Check}
            color="emerald"
            trend={{ value: 2.3, positive: true }}
          />
          <StatCard
            title="Em Manutenção"
            value={dashboard.ativosEmManutencao}
            icon={Icons.Wrench}
            color="amber"
            subtitle={`${dashboard.manutencoesCriticas} críticas`}
          />
          <StatCard
            title="Valor do Património"
            value={formatCurrency(dashboard.valorTotalPatrimonio)}
            icon={Icons.DollarSign}
            color="purple"
          />
        </GridLayout>

        {/* Monitorização de Gases Medicinais */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Icons.Wind size={20} className="text-cyan-600" />
                Monitorização de Gases Medicinais
              </CardTitle>
              <Link href="/patrimonio/gases">
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {centraisGases.map((central) => (
                <div key={central.id} className="text-center">
                  <GaugeChart
                    value={central.nivelAtualPercentual}
                    label={central.nome.replace('Central de ', '')}
                    status={central.status}
                  />
                  <Badge
                    variant={
                      central.status === 'CRITICO' ? 'danger' :
                      central.status === 'ALERTA' ? 'warning' : 'success'
                    }
                    className="mt-2"
                  >
                    {central.pressaoAtualBar} bar
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Conteúdo */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <Tabs
              tabs={[
                {
                  id: 'ativos',
                  label: `Ativos (${ativos.length})`,
                  content: (
                    <div>
                      {/* Filtros */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="md:col-span-2">
                          <div className="relative">
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Pesquisar ativo..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                            />
                          </div>
                        </div>
                        <select
                          value={filterCategoria}
                          onChange={(e) => setFilterCategoria(e.target.value)}
                          className="px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                        >
                          <option value="">Todas as Categorias</option>
                          {Object.entries(categoriaConfig).map(([key, value]) => (
                            <option key={key} value={key}>{value.label}</option>
                          ))}
                        </select>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                        >
                          <option value="">Todos os Status</option>
                          {Object.entries(statusConfig).map(([key, value]) => (
                            <option key={key} value={key}>{value.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Tabela de Ativos */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">Código</th>
                              <th className="px-4 py-3 text-left font-semibold">Equipamento</th>
                              <th className="px-4 py-3 text-left font-semibold">Categoria</th>
                              <th className="px-4 py-3 text-left font-semibold">Localização</th>
                              <th className="px-4 py-3 text-center font-semibold">Status</th>
                              <th className="px-4 py-3 text-center font-semibold">Próx. Manutenção</th>
                              <th className="px-4 py-3 text-center font-semibold">Acções</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ativosFiltrados.map((ativo) => (
                              <tr key={ativo.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="px-4 py-3">
                                  <div>
                                    <p className="font-mono text-sky-600">{ativo.codigo}</p>
                                    <p className="text-xs text-slate-500">{ativo.numeroPatrimonio}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div>
                                    <p className="font-medium text-slate-700 dark:text-slate-200">{ativo.nome}</p>
                                    <p className="text-xs text-slate-500">{ativo.marca} {ativo.modelo}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${categoriaConfig[ativo.categoria].cor}`}></span>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                      {categoriaConfig[ativo.categoria].label}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                  {ativo.localizacao}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Badge variant={statusConfig[ativo.status].variant}>
                                    {statusConfig[ativo.status].label}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                                  {ativo.proximaManutencao?.toLocaleDateString('pt-AO') || '-'}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex justify-center gap-1">
                                    <Link href={`/patrimonio/ativos/${ativo.id}`}>
                                      <Button variant="ghost" size="icon">
                                        <Icons.Eye size={16} />
                                      </Button>
                                    </Link>
                                    <Button variant="ghost" size="icon" title="Abrir O.S.">
                                      <Icons.Wrench size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" title="QR Code">
                                      <Icons.QrCode size={16} />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'manutencoes',
                  label: 'Manutenções Pendentes',
                  content: (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card className="border-l-4 border-red-500">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-red-600">{dashboard.manutencoesCriticas}</p>
                            <p className="text-sm text-slate-500">Críticas</p>
                          </CardContent>
                        </Card>
                        <Card className="border-l-4 border-amber-500">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-amber-600">{dashboard.manutencoesAbertasHoje}</p>
                            <p className="text-sm text-slate-500">Abertas Hoje</p>
                          </CardContent>
                        </Card>
                        <Card className="border-l-4 border-sky-500">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-sky-600">{dashboard.manutencoesPreventivas30Dias}</p>
                            <p className="text-sm text-slate-500">Preventivas (30 dias)</p>
                          </CardContent>
                        </Card>
                        <Card className="border-l-4 border-emerald-500">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-emerald-600">{dashboard.tempoMedioReparo}h</p>
                            <p className="text-sm text-slate-500">Tempo Médio Reparo</p>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="text-center py-8 text-slate-500">
                        <Icons.Wrench size={48} className="mx-auto mb-4 text-slate-300" />
                        <p>Lista de manutenções pendentes</p>
                        <Link href="/patrimonio/manutencao">
                          <Button className="mt-4">Ver Todas as Manutenções</Button>
                        </Link>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'calibracoes',
                  label: 'Calibrações',
                  content: (
                    <div className="text-center py-8 text-slate-500">
                      <Icons.Activity size={48} className="mx-auto mb-4 text-slate-300" />
                      <p>Gestão de calibrações de equipamentos</p>
                      <Link href="/patrimonio/calibracoes">
                        <Button className="mt-4">Ver Calibrações</Button>
                      </Link>
                    </div>
                  ),
                },
              ]}
              defaultTab="ativos"
            />
          </CardContent>
        </Card>

        {/* Modal de Alertas */}
        <Modal
          isOpen={showAlertModal}
          onClose={() => setShowAlertModal(false)}
          title="Alertas de Gases Medicinais"
          size="lg"
        >
          <div className="space-y-4">
            {alertas.map((alerta) => (
              <div
                key={alerta.id}
                className={`p-4 rounded-lg border ${
                  alerta.severidade === 'CRITICO'
                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                    : alerta.severidade === 'AVISO'
                    ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                    : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icons.AlertTriangle
                      className={`w-5 h-5 mt-0.5 ${
                        alerta.severidade === 'CRITICO' ? 'text-red-600' :
                        alerta.severidade === 'AVISO' ? 'text-amber-600' : 'text-blue-600'
                      }`}
                    />
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200">{alerta.mensagem}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {alerta.dataHora.toLocaleString('pt-AO')}
                      </p>
                      {alerta.reconhecido && (
                        <p className="text-xs text-slate-500">
                          Reconhecido por {alerta.reconhecidoPor} em {alerta.dataReconhecimento?.toLocaleString('pt-AO')}
                        </p>
                      )}
                    </div>
                  </div>
                  {!alerta.reconhecido && (
                    <Button variant="outline" size="sm">
                      Reconhecer
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      </PageContent>
    </MainLayout>
  );
}