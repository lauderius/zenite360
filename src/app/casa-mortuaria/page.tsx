'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner, Tabs, Modal, Avatar } from '@/components/ui';
import { Icons } from '@/components/ui/Icons';
import type { 
  RegistroObito, 
  CamaraFria, 
  StatusObito, 
  CausaObito,
  DashboardCasaMortuaria 
} from '@/types/administrativo';

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

const statusConfig: Record<StatusObito, { label: string; variant: 'default' | 'primary' | 'warning' | 'success' | 'danger' }> = {
  ADMITIDO: { label: 'Admitido', variant: 'primary' },
  EM_CONSERVACAO: { label: 'Em Conservação', variant: 'default' },
  AGUARDANDO_DOCUMENTACAO: { label: 'Aguardando Doc.', variant: 'warning' },
  LIBERADO: { label: 'Liberado', variant: 'success' },
  TRANSFERIDO: { label: 'Transferido', variant: 'default' },
  ENTREGUE: { label: 'Entregue', variant: 'success' },
};

const causaConfig: Record<CausaObito, { label: string; cor: string }> = {
  NATURAL: { label: 'Natural', cor: 'bg-blue-500' },
  ACIDENTAL: { label: 'Acidental', cor: 'bg-amber-500' },
  VIOLENTA: { label: 'Violenta', cor: 'bg-red-500' },
  INDETERMINADA: { label: 'Indeterminada', cor: 'bg-slate-500' },
  INVESTIGACAO: { label: 'Em Investigação', cor: 'bg-purple-500' },
};

const mockDashboard: DashboardCasaMortuaria = {
  corposEmConservacao: 8,
  capacidadeTotalCamaras: 12,
  ocupacaoPercentual: 66.7,
  obitosHoje: 2,
  obitosMes: 47,
  tempoMedioConservacao: 18.5,
  aguardandoDocumentacao: 3,
  liberadosHoje: 1,
  camarasComAlerta: [],
  distribuicaoPorCausa: [
    { causa: 'NATURAL', quantidade: 32 },
    { causa: 'ACIDENTAL', quantidade: 8 },
    { causa: 'VIOLENTA', quantidade: 4 },
    { causa: 'INDETERMINADA', quantidade: 3 },
  ],
  distribuicaoPorGenero: [
    { genero: 'MASCULINO', quantidade: 28 },
    { genero: 'FEMININO', quantidade: 19 },
  ],
};

const mockRegistros: RegistroObito[] = [
  {
    id: 1,
    codigo: 'OB-2024-00047',
    nomeCompleto: 'José António Silva',
    dataNascimento: new Date('1952-03-15'),
    idade: 71,
    genero: 'MASCULINO',
    nacionalidade: 'Angolana',
    numeroDocumento: '000123456LA040',
    tipoDocumento: 'BI',
    dataHoraObito: new Date('2024-01-15T04:30:00'),
    localObito: 'UTI - Leito 3',
    causaObito: 'NATURAL',
    cid10Principal: 'I21.0',
    medicoResponsavelId: 1,
    medicoResponsavel: 'Dr. Paulo Sousa',
    dataAdmissao: new Date('2024-01-15T05:15:00'),
    camaraFria: 'CF-01',
    posicao: 'A1',
    temperaturaConservacao: -5,
    status: 'EM_CONSERVACAO',
    responsavelNome: 'Maria Silva',
    responsavelParentesco: 'Esposa',
    responsavelTelefone: '+244 923 456 789',
    declaracaoObitoEmitida: true,
    declaracaoObitoNumero: 'DO-2024-00047',
    autopsiaRealizada: false,
    guiaSaidaEmitida: false,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
  {
    id: 2,
    codigo: 'OB-2024-00046',
    nomeCompleto: 'Ana Maria Ferreira',
    dataNascimento: new Date('1978-08-22'),
    idade: 45,
    genero: 'FEMININO',
    nacionalidade: 'Angolana',
    numeroDocumento: '000987654LA041',
    tipoDocumento: 'BI',
    dataHoraObito: new Date('2024-01-14T22:15:00'),
    localObito: 'Urgência',
    causaObito: 'ACIDENTAL',
    medicoResponsavelId: 2,
    medicoResponsavel: 'Dra. Ana Reis',
    dataAdmissao: new Date('2024-01-14T23:00:00'),
    camaraFria: 'CF-02',
    posicao: 'B1',
    temperaturaConservacao: -4,
    status: 'AGUARDANDO_DOCUMENTACAO',
    responsavelNome: 'Carlos Ferreira',
    responsavelParentesco: 'Irmão',
    responsavelTelefone: '+244 912 345 678',
    declaracaoObitoEmitida: false,
    autopsiaRealizada: true,
    autopsiaResultado: 'Aguardando laudo',
    guiaSaidaEmitida: false,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  },
];

const mockCamaras: CamaraFria[] = [
  { id: 1, codigo: 'CF-01', nome: 'Câmara Fria 01', capacidade: 4, ocupacaoAtual: 3, temperaturaAtual: -5.2, temperaturaMinimaAlerta: -10, temperaturaMaximaAlerta: 0, status: 'OPERACIONAL', activo: true },
  { id: 2, codigo: 'CF-02', nome: 'Câmara Fria 02', capacidade: 4, ocupacaoAtual: 2, temperaturaAtual: -4.8, temperaturaMinimaAlerta: -10, temperaturaMaximaAlerta: 0, status: 'OPERACIONAL', activo: true },
  { id: 3, codigo: 'CF-03', nome: 'Câmara Fria 03', capacidade: 4, ocupacaoAtual: 3, temperaturaAtual: -3.5, temperaturaMinimaAlerta: -10, temperaturaMaximaAlerta: 0, status: 'OPERACIONAL', activo: true },
];

// ============================================================================
// COMPONENTES
// ============================================================================

function TemperaturaIndicador({ temperatura, min, max }: { temperatura: number; min: number; max: number }) {
  const isAlerta = temperatura > max || temperatura < min;
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
      isAlerta ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
    }`}>
      <Icons.Thermometer className={`w-4 h-4 ${isAlerta ? 'text-red-600' : 'text-blue-600'}`} />
      <span className={`text-sm font-bold ${isAlerta ? 'text-red-600' : 'text-blue-600'}`}>
        {temperatura.toFixed(1)}°C
      </span>
    </div>
  );
}

function CamaraFriaCard({ camara }: { camara: CamaraFria }) {
  const ocupacaoPercent = (camara.ocupacaoAtual / camara.capacidade) * 100;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{camara.nome}</h3>
            <p className="text-sm text-slate-500">{camara.codigo}</p>
          </div>
          <Badge variant={camara.status === 'OPERACIONAL' ? 'success' : 'danger'}>
            {camara.status}
          </Badge>
        </div>
        
        {camara.temperaturaAtual && (
          <TemperaturaIndicador
            temperatura={camara.temperaturaAtual}
            min={camara.temperaturaMinimaAlerta}
            max={camara.temperaturaMaximaAlerta}
          />
        )}
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Ocupação</span>
            <span className="text-sm font-medium">{camara.ocupacaoAtual}/{camara.capacidade}</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                ocupacaoPercent >= 90 ? 'bg-red-500' :
                ocupacaoPercent >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${ocupacaoPercent}%` }}
            />
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-4 gap-2">
          {Array.from({ length: camara.capacidade }).map((_, i) => (
            <div
              key={i}
              className={`h-8 rounded flex items-center justify-center text-xs font-medium ${
                i < camara.ocupacaoAtual
                  ? 'bg-slate-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
              }`}
            >
              {String.fromCharCode(65 + Math.floor(i / 2))}{(i % 2) + 1}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RegistroObitoCard({ registro, onViewDetails }: { registro: RegistroObito; onViewDetails: () => void }) {
  const tempoConservacao = Math.round((Date.now() - registro.dataAdmissao.getTime()) / (1000 * 60 * 60));
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar fallback={registro.nomeCompleto.charAt(0)} size="lg" />
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">{registro.nomeCompleto}</h3>
              <p className="text-sm text-sky-600 font-mono">{registro.codigo}</p>
              <p className="text-sm text-slate-500">
                {registro.idade} anos • {registro.genero === 'MASCULINO' ? 'Masculino' : 'Feminino'}
              </p>
            </div>
          </div>
          <Badge variant={statusConfig[registro.status].variant}>
            {statusConfig[registro.status].label}
          </Badge>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Câmara</p>
            <p className="font-medium text-slate-700 dark:text-slate-200">{registro.camaraFria} - {registro.posicao}</p>
          </div>
          <div>
            <p className="text-slate-500">Tempo</p>
            <p className={`font-medium ${tempoConservacao > 48 ? 'text-amber-600' : 'text-slate-700 dark:text-slate-200'}`}>
              {tempoConservacao}h de conservação
            </p>
          </div>
          <div>
            <p className="text-slate-500">Causa</p>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${causaConfig[registro.causaObito].cor}`}></span>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {causaConfig[registro.causaObito].label}
              </span>
            </div>
          </div>
          <div>
            <p className="text-slate-500">Responsável</p>
            <p className="font-medium text-slate-700 dark:text-slate-200">
              {registro.responsavelNome || 'Não informado'}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          {registro.declaracaoObitoEmitida && (
            <Badge variant="success">
              <Icons.Check size={12} className="mr-1" />
              Decl. Óbito
            </Badge>
          )}
          {registro.autopsiaRealizada && (
            <Badge variant="primary">
              <Icons.FileText size={12} className="mr-1" />
              Autópsia
            </Badge>
          )}
          {!registro.guiaSaidaEmitida && registro.status !== 'ENTREGUE' && (
            <Badge variant="warning">
              Guia Pendente
            </Badge>
          )}
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onViewDetails}>
            <Icons.Eye size={14} />
            Detalhes
          </Button>
          {!registro.guiaSaidaEmitida && registro.declaracaoObitoEmitida && (
            <Button size="sm" className="flex-1">
              <Icons.FileText size={14} />
              Emitir Guia
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

export default function CasaMortuariaPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardCasaMortuaria | null>(null);
  const [registros, setRegistros] = useState<RegistroObito[]>([]);
  const [camaras, setCamaras] = useState<CamaraFria[]>([]);
  const [selectedRegistro, setSelectedRegistro] = useState<RegistroObito | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboard(mockDashboard);
      setRegistros(mockRegistros);
      setCamaras(mockCamaras);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
        title="Casa Mortuária"
        description="Gestão de registros, conservação e liberação de corpos"
        actions={
          <div className="flex gap-2">
            <Link href="/casa-mortuaria/estatisticas">
              <Button variant="outline">
                <Icons.BarChart size={16} />
                Estatísticas
              </Button>
            </Link>
            <Link href="/casa-mortuaria/novo">
              <Button>
                <Icons.Plus size={16} />
                Novo Registro
              </Button>
            </Link>
          </div>
        }
      />

      <PageContent>
        {/* KPIs */}
        <GridLayout cols={4}>
          <Card className="bg-gradient-to-br from-slate-700 to-slate-800 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Em Conservação</p>
                  <p className="text-3xl font-bold mt-1">{dashboard.corposEmConservacao}</p>
                  <p className="text-xs opacity-70 mt-1">de {dashboard.capacidadeTotalCamaras} posições</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.Bed className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Aguardando Doc.</p>
                  <p className="text-3xl font-bold mt-1">{dashboard.aguardandoDocumentacao}</p>
                  <p className="text-xs opacity-70 mt-1">pendentes</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.FileText className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Óbitos Hoje</p>
                  <p className="text-3xl font-bold mt-1">{dashboard.obitosHoje}</p>
                  <p className="text-xs opacity-70 mt-1">{dashboard.obitosMes} este mês</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.Calendar className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Tempo Médio</p>
                  <p className="text-3xl font-bold mt-1">{dashboard.tempoMedioConservacao}h</p>
                  <p className="text-xs opacity-70 mt-1">de conservação</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icons.Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </GridLayout>

        {/* Câmaras Frias */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Thermometer size={20} className="text-blue-600" />
              Câmaras de Conservação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {camaras.map((camara) => (
                <CamaraFriaCard key={camara.id} camara={camara} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Registros */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Registros em Conservação</CardTitle>
              <Link href="/casa-mortuaria/registros">
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registros.filter(r => r.status !== 'ENTREGUE').map((registro) => (
                <RegistroObitoCard
                  key={registro.id}
                  registro={registro}
                  onViewDetails={() => {
                    setSelectedRegistro(registro);
                    setShowModal(true);
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Causa */}
        <GridLayout cols={2}>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Óbitos por Causa (Mês)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboard.distribuicaoPorCausa.map((item) => (
                  <div key={item.causa} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${causaConfig[item.causa as CausaObito].cor}`}></span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {causaConfig[item.causa as CausaObito].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${causaConfig[item.causa as CausaObito].cor}`}
                          style={{ width: `${(item.quantidade / dashboard.obitosMes) * 100}%` }}
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
              <CardTitle>Óbitos por Género (Mês)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-8">
                {dashboard.distribuicaoPorGenero.map((item) => (
                  <div key={item.genero} className="text-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                      item.genero === 'MASCULINO' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-pink-100 dark:bg-pink-900/30'
                    }`}>
                      <span className={`text-3xl font-bold ${
                        item.genero === 'MASCULINO' ? 'text-blue-600' : 'text-pink-600'
                      }`}>
                        {item.quantidade}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      {item.genero === 'MASCULINO' ? 'Masculino' : 'Feminino'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </GridLayout>

        {/* Modal de Detalhes */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Detalhes do Registro"
          size="lg"
        >
          {selectedRegistro && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar fallback={selectedRegistro.nomeCompleto.charAt(0)} size="xl" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {selectedRegistro.nomeCompleto}
                  </h3>
                  <p className="text-sky-600 font-mono">{selectedRegistro.codigo}</p>
                  <Badge variant={statusConfig[selectedRegistro.status].variant} className="mt-2">
                    {statusConfig[selectedRegistro.status].label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase">Data/Hora do Óbito</p>
                  <p className="text-sm font-medium">{selectedRegistro.dataHoraObito.toLocaleString('pt-AO')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Local</p>
                  <p className="text-sm font-medium">{selectedRegistro.localObito}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Médico Responsável</p>
                  <p className="text-sm font-medium">{selectedRegistro.medicoResponsavel}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Causa</p>
                  <p className="text-sm font-medium">{causaConfig[selectedRegistro.causaObito].label}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-2">Responsável pela Liberação</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Nome</p>
                    <p className="font-medium">{selectedRegistro.responsavelNome || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Parentesco</p>
                    <p className="font-medium">{selectedRegistro.responsavelParentesco || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Telefone</p>
                    <p className="font-medium">{selectedRegistro.responsavelTelefone || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <Icons.Printer size={16} />
                  Imprimir Declaração
                </Button>
                {!selectedRegistro.guiaSaidaEmitida && (
                  <Button className="flex-1">
                    <Icons.FileText size={16} />
                    Emitir Guia de Saída
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal>
      </PageContent>
    </MainLayout>
  );
}