// ============================================================================
// TIPOS E INTERFACES - MÓDULOS ADMINISTRATIVOS
// Sistema Zênite360 - Gestão Hospitalar
// ============================================================================

// ============================================================================
// PATRIMÓNIO E ELECTROMEDICINA
// ============================================================================

export type CategoriaAtivo = 
  | 'ELECTROMEDICINA'
  | 'MOBILIARIO_HOSPITALAR'
  | 'INFORMATICA'
  | 'VEICULOS'
  | 'INFRAESTRUTURA'
  | 'GASES_MEDICINAIS'
  | 'INSTRUMENTOS_CIRURGICOS'
  | 'LABORATORIO'
  | 'IMAGEM_DIAGNOSTICO'
  | 'OUTROS';

export type StatusAtivo = 
  | 'OPERACIONAL'
  | 'EM_MANUTENCAO'
  | 'AGUARDANDO_PECAS'
  | 'INOPERANTE'
  | 'EM_CALIBRACAO'
  | 'DESATIVADO'
  | 'ABATIDO';

export type TipoManutencao = 
  | 'PREVENTIVA'
  | 'CORRETIVA'
  | 'PREDITIVA'
  | 'CALIBRACAO'
  | 'INSPECAO';

export type PrioridadeManutencao = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAIXA';

export type StatusOrdemManutencao = 
  | 'ABERTA'
  | 'EM_ANALISE'
  | 'APROVADA'
  | 'EM_EXECUCAO'
  | 'AGUARDANDO_PECAS'
  | 'CONCLUIDA'
  | 'CANCELADA';

export type TipoGasMedicinal = 
  | 'OXIGENIO'
  | 'AR_COMPRIMIDO'
  | 'NITROGENIO'
  | 'OXIDO_NITROSO'
  | 'DIOXIDO_CARBONO'
  | 'VACUO'
  | 'HELIO';

export type StatusCilindro = 
  | 'CHEIO'
  | 'EM_USO'
  | 'RESERVA'
  | 'VAZIO'
  | 'EM_RECARGA'
  | 'VENCIDO'
  | 'INTERDITADO';

export interface Ativo {
  id: number;
  codigo: string;
  numeroPatrimonio: string;
  nome: string;
  descricao?: string;
  categoria: CategoriaAtivo;
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
  fabricante?: string;
  fornecedor?: string;
  dataAquisicao: Date;
  valorAquisicao: number;
  valorAtual?: number;
  vidaUtilAnos?: number;
  garantiaAte?: Date;
  localizacao: string;
  departamentoId: number;
  departamento?: string;
  responsavelId?: number;
  responsavel?: string;
  status: StatusAtivo;
  proximaManutencao?: Date;
  ultimaManutencao?: Date;
  intervaloManutencaoDias?: number;
  registroAnvisa?: string;
  certificadoCalibracao?: string;
  validadeCalibracao?: Date;
  manual?: string;
  fotoUrl?: string;
  qrCode?: string;
  observacoes?: string;
  activo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface OrdemManutencaoPatrimonio {
  id: number;
  codigo: string;
  ativoId: number;
  ativo?: Ativo;
  tipo: TipoManutencao;
  prioridade: PrioridadeManutencao;
  status: StatusOrdemManutencao;
  descricaoProblema: string;
  diagnostico?: string;
  solucaoAplicada?: string;
  solicitanteId: number;
  solicitante?: string;
  tecnicoId?: number;
  tecnico?: string;
  dataAbertura: Date;
  dataPrevisao?: Date;
  dataInicio?: Date;
  dataConclusao?: Date;
  tempoParadaHoras?: number;
  custoMaoObra?: number;
  custoPecas?: number;
  custoTotal?: number;
  pecasUtilizadas?: PecaUtilizada[];
  checklistExecutado?: ChecklistItem[];
  relatorioTecnico?: string;
  assinaturaTecnico?: string;
  assinaturaResponsavel?: string;
  anexos?: string[];
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface PecaUtilizada {
  id: number;
  ordemId: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  fornecedor?: string;
}

export interface ChecklistItem {
  id: number;
  descricao: string;
  executado: boolean;
  observacao?: string;
}

export interface CilindroGas {
  id: number;
  codigo: string;
  tipoGas: TipoGasMedicinal;
  capacidadeLitros: number;
  pressaoMaximaBar: number;
  pressaoAtualBar?: number;
  nivelPercentual?: number;
  status: StatusCilindro;
  localizacao: string;
  departamentoId?: number;
  departamento?: string;
  lote?: string;
  dataEnvase?: Date;
  dataValidade?: Date;
  fornecedor?: string;
  ultimaInspecao?: Date;
  proximaInspecao?: Date;
  observacoes?: string;
  activo: boolean;
}

export interface CentralGases {
  id: number;
  nome: string;
  localizacao: string;
  tipoGas: TipoGasMedicinal;
  capacidadeTotal: number;
  nivelAtualPercentual: number;
  pressaoAtualBar: number;
  pressaoMinimaAlerta: number;
  nivelMinimoAlerta: number;
  status: 'NORMAL' | 'ALERTA' | 'CRITICO' | 'MANUTENCAO';
  ultimaRecarga?: Date;
  ultimaInspecao?: Date;
  proximaInspecao?: Date;
  sensorId?: string;
  activo: boolean;
}

export interface AlertaGas {
  id: number;
  centralId?: number;
  cilindroId?: number;
  tipoAlerta: 'NIVEL_BAIXO' | 'PRESSAO_BAIXA' | 'VAZAMENTO' | 'VALIDADE' | 'INSPECAO';
  severidade: 'INFO' | 'AVISO' | 'CRITICO';
  mensagem: string;
  dataHora: Date;
  reconhecido: boolean;
  reconhecidoPor?: string;
  dataReconhecimento?: Date;
  resolvido: boolean;
  resolvidoPor?: string;
  dataResolucao?: Date;
}

// ============================================================================
// CASA MORTUÁRIA
// ============================================================================

export type StatusObito = 
  | 'ADMITIDO'
  | 'EM_CONSERVACAO'
  | 'AGUARDANDO_DOCUMENTACAO'
  | 'LIBERADO'
  | 'TRANSFERIDO'
  | 'ENTREGUE';

export type CausaObito = 
  | 'NATURAL'
  | 'ACIDENTAL'
  | 'VIOLENTA'
  | 'INDETERMINADA'
  | 'INVESTIGACAO';

export interface RegistroObito {
  id: number;
  codigo: string;
  pacienteId?: number;
  nomeCompleto: string;
  dataNascimento?: Date;
  idade?: number;
  genero: string;
  nacionalidade?: string;
  numeroDocumento?: string;
  tipoDocumento?: string;
  endereco?: string;
  
  // Dados do Óbito
  dataHoraObito: Date;
  localObito: string;
  causaObito: CausaObito;
  cid10Principal?: string;
  cid10Secundario?: string;
  medicoResponsavelId: number;
  medicoResponsavel?: string;
  
  // Casa Mortuária
  dataAdmissao: Date;
  camaraFria: string;
  posicao?: string;
  temperaturaConservacao?: number;
  status: StatusObito;
  
  // Responsável/Familiar
  responsavelNome?: string;
  responsavelParentesco?: string;
  responsavelDocumento?: string;
  responsavelTelefone?: string;
  responsavelEndereco?: string;
  
  // Documentação
  declaracaoObitoEmitida: boolean;
  declaracaoObitoNumero?: string;
  declaracaoObitoData?: Date;
  autopsiaRealizada: boolean;
  autopsiaResultado?: string;
  
  // Liberação
  dataLiberacao?: Date;
  liberadoPara?: string;
  destinoCorpo?: string;
  funerariaResponsavel?: string;
  guiaSaidaEmitida: boolean;
  guiaSaidaNumero?: string;
  
  // Observações
  pertencesGuardados?: string;
  observacoes?: string;
  
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CamaraFria {
  id: number;
  codigo: string;
  nome: string;
  capacidade: number;
  ocupacaoAtual: number;
  temperaturaAtual?: number;
  temperaturaMinimaAlerta: number;
  temperaturaMaximaAlerta: number;
  status: 'OPERACIONAL' | 'MANUTENCAO' | 'DEFEITO';
  sensorId?: string;
  ultimaManutencao?: Date;
  proximaManutencao?: Date;
  activo: boolean;
}

export interface GuiaSaidaCorpo {
  id: number;
  numero: string;
  registroObitoId: number;
  registroObito?: RegistroObito;
  dataEmissao: Date;
  horaEmissao: string;
  responsavelRetirada: string;
  documentoResponsavel: string;
  parentesco?: string;
  funeraria?: string;
  destino: string;
  emitidoPorId: number;
  emitidoPor?: string;
  assinaturaDigital?: string;
  observacoes?: string;
}

// ============================================================================
// SERVIÇOS GERAIS E LOGÍSTICA
// ============================================================================

export type TipoContrato = 
  | 'LIMPEZA'
  | 'SEGURANCA'
  | 'MANUTENCAO_PREDIAL'
  | 'JARDINAGEM'
  | 'ALIMENTACAO'
  | 'LAVANDERIA'
  | 'TRANSPORTE'
  | 'TI'
  | 'OUTROS';

export type StatusContrato = 
  | 'VIGENTE'
  | 'PROXIMO_VENCIMENTO'
  | 'VENCIDO'
  | 'SUSPENSO'
  | 'CANCELADO'
  | 'EM_RENOVACAO';

export type ClasseResiduo = 
  | 'A1' // Infectante - Culturas
  | 'A2' // Infectante - Animais
  | 'A3' // Infectante - Peças anatômicas
  | 'A4' // Infectante - Outros
  | 'A5' // Infectante - Órgãos
  | 'B'  // Químico
  | 'C'  // Radioativo
  | 'D'  // Comum
  | 'E'; // Perfurocortante

export type StatusColeta = 
  | 'AGENDADA'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDA'
  | 'CANCELADA';

export interface ContratoTerceiro {
  id: number;
  codigo: string;
  tipo: TipoContrato;
  empresaContratada: string;
  cnpj: string;
  objeto: string;
  descricaoServicos: string;
  valorMensal: number;
  valorTotal?: number;
  dataInicio: Date;
  dataFim: Date;
  diasParaVencimento?: number;
  status: StatusContrato;
  
  // Gestor do Contrato
  gestorInternoId: number;
  gestorInterno?: string;
  
  // Contatos
  representanteLegal: string;
  telefoneEmpresa: string;
  emailEmpresa: string;
  
  // Documentação
  numeroProcesso?: string;
  garantiaContratual?: number;
  seguroResponsabilidade?: string;
  
  // Funcionários Terceirizados
  quantidadeFuncionarios?: number;
  
  // Avaliação
  ultimaAvaliacao?: Date;
  notaAvaliacao?: number;
  
  // Renovação
  renovacaoAutomatica: boolean;
  avisarDiasAntes?: number;
  
  anexos?: string[];
  observacoes?: string;
  activo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface FuncionarioTerceirizado {
  id: number;
  contratoId: number;
  contrato?: ContratoTerceiro;
  nomeCompleto: string;
  funcao: string;
  documento: string;
  telefone?: string;
  turno?: string;
  setorAtuacao?: string;
  dataInicio: Date;
  dataFim?: Date;
  activo: boolean;
}

export interface ResiduoHospitalar {
  id: number;
  codigo: string;
  classe: ClasseResiduo;
  descricao: string;
  unidadeMedida: string;
  requerTratamentoEspecial: boolean;
  instrucoesManuseio?: string;
  activo: boolean;
}

export interface ColetaResiduo {
  id: number;
  codigo: string;
  data: Date;
  turno: 'MANHA' | 'TARDE' | 'NOITE';
  status: StatusColeta;
  coletorId?: number;
  coletor?: string;
  
  // Itens coletados
  itens: ItemColetaResiduo[];
  
  // Totais
  pesoTotalKg: number;
  volumeTotalLitros?: number;
  
  // Empresa de coleta externa
  empresaColetaExterna?: string;
  responsavelExterno?: string;
  veiculoPlaca?: string;
  
  // Manifesto
  manifestoNumero?: string;
  manifestoEmitido: boolean;
  
  // Destino final
  destinoFinal?: string;
  certificadoDestinacao?: string;
  
  observacoes?: string;
  criadoEm: Date;
}

export interface ItemColetaResiduo {
  id: number;
  coletaId: number;
  residuoId: number;
  residuo?: ResiduoHospitalar;
  setorOrigem: string;
  quantidade: number;
  pesoKg: number;
  volumeLitros?: number;
  recipiente: string;
  observacao?: string;
}

export interface EstoqueCozinha {
  id: number;
  codigo: string;
  nome: string;
  categoria: 'PERECIVEIS' | 'NAO_PERECIVEIS' | 'BEBIDAS' | 'DESCARTAVEIS' | 'LIMPEZA' | 'OUTROS';
  unidadeMedida: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeMaxima?: number;
  localizacao?: string;
  fornecedorPrincipal?: string;
  precoMedio?: number;
  ultimaEntrada?: Date;
  ultimaSaida?: Date;
  validade?: Date;
  lote?: string;
  observacoes?: string;
  activo: boolean;
}

export interface MovimentacaoEstoqueCozinha {
  id: number;
  itemId: number;
  item?: EstoqueCozinha;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE' | 'PERDA';
  quantidade: number;
  quantidadeAnterior: number;
  quantidadeAtual: number;
  motivo: string;
  documentoReferencia?: string;
  fornecedor?: string;
  lote?: string;
  validade?: Date;
  responsavelId: number;
  responsavel?: string;
  dataHora: Date;
  observacoes?: string;
}

// ============================================================================
// SECRETARIA GERAL
// ============================================================================

export type TipoDocumentoOficial = 
  | 'OFICIO'
  | 'MEMORANDO'
  | 'CIRCULAR'
  | 'PORTARIA'
  | 'RESOLUCAO'
  | 'DESPACHO'
  | 'PARECER'
  | 'COMUNICADO'
  | 'ATA'
  | 'CONTRATO'
  | 'CONVENIO'
  | 'RELATORIO'
  | 'OUTROS';

export type StatusDocumentoOficial = 
  | 'RASCUNHO'
  | 'EM_ELABORACAO'
  | 'AGUARDANDO_ASSINATURA'
  | 'ASSINADO'
  | 'ENVIADO'
  | 'RECEBIDO'
  | 'ARQUIVADO'
  | 'CANCELADO';

export type PrioridadeDocumento = 'URGENTE' | 'ALTA' | 'NORMAL' | 'BAIXA';

export type TipoMovimentacao = 'ENTRADA' | 'SAIDA' | 'INTERNO';

export interface DocumentoOficial {
  id: number;
  codigo: string;
  numero: string;
  ano: number;
  tipo: TipoDocumentoOficial;
  assunto: string;
  resumo?: string;
  conteudo?: string;
  
  // Origem/Destino
  tipoMovimentacao: TipoMovimentacao;
  remetenteInterno?: string;
  remetenteExterno?: string;
  destinatarioInterno?: string;
  destinatarioExterno?: string;
  
  // Datas
  dataDocumento: Date;
  dataRecebimento?: Date;
  dataEnvio?: Date;
  prazoResposta?: Date;
  
  // Status e Prioridade
  status: StatusDocumentoOficial;
  prioridade: PrioridadeDocumento;
  
  // Responsáveis
  elaboradoPorId?: number;
  elaboradoPor?: string;
  assinadoPorId?: number;
  assinadoPor?: string;
  
  // Tramitação
  departamentoAtualId?: number;
  departamentoAtual?: string;
  tramitacoes?: TramitacaoDocumento[];
  
  // Arquivos
  arquivoOriginal?: string;
  anexos?: string[];
  
  // Vinculação
  documentoOrigemId?: number;
  documentosVinculados?: number[];
  
  // Protocolo
  protocoloExterno?: string;
  
  observacoes?: string;
  activo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface TramitacaoDocumento {
  id: number;
  documentoId: number;
  despacho?: string;
  departamentoOrigemId: number;
  departamentoOrigem?: string;
  departamentoDestinoId: number;
  departamentoDestino?: string;
  responsavelOrigemId: number;
  responsavelOrigem?: string;
  responsavelDestinoId?: number;
  responsavelDestino?: string;
  dataEnvio: Date;
  dataRecebimento?: Date;
  status: 'ENVIADO' | 'RECEBIDO' | 'DEVOLVIDO';
  observacoes?: string;
}

export interface SuprimentoEscritorio {
  id: number;
  codigo: string;
  nome: string;
  categoria: 'PAPEL' | 'ESCRITA' | 'ORGANIZACAO' | 'INFORMATICA' | 'IMPRESSAO' | 'HIGIENE' | 'OUTROS';
  unidadeMedida: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeMaxima?: number;
  localizacao?: string;
  fornecedorPrincipal?: string;
  precoMedio?: number;
  ultimaCompra?: Date;
  activo: boolean;
}

export interface RequisicaoMaterial {
  id: number;
  codigo: string;
  departamentoSolicitanteId: number;
  departamentoSolicitante?: string;
  solicitanteId: number;
  solicitante?: string;
  dataSolicitacao: Date;
  dataPrevisaoEntrega?: Date;
  dataEntrega?: Date;
  status: 'PENDENTE' | 'APROVADA' | 'PARCIALMENTE_ATENDIDA' | 'ATENDIDA' | 'CANCELADA';
  prioridade: PrioridadeDocumento;
  justificativa?: string;
  itens: ItemRequisicao[];
  aprovadoPorId?: number;
  aprovadoPor?: string;
  dataAprovacao?: Date;
  observacoes?: string;
  criadoEm: Date;
}

export interface ItemRequisicao {
  id: number;
  requisicaoId: number;
  suprimentoId: number;
  suprimento?: SuprimentoEscritorio;
  quantidadeSolicitada: number;
  quantidadeAtendida?: number;
  observacao?: string;
}

// ============================================================================
// INTEGRAÇÕES E DASHBOARDS
// ============================================================================

export interface DashboardPatrimonio {
  totalAtivos: number;
  ativosOperacionais: number;
  ativosEmManutencao: number;
  ativosInoperantes: number;
  valorTotalPatrimonio: number;
  manutencoesAbertasHoje: number;
  manutencoesCriticas: number;
  manutencoesPreventivas30Dias: number;
  custosManutencaoMes: number;
  tempoMedioReparo: number;
  taxaDisponibilidade: number;
  alertasGases: number;
  niveisGasesCriticos: CentralGases[];
  ativosGarantiaVencer: Ativo[];
  calibracoesVencer: Ativo[];
}

export interface DashboardCasaMortuaria {
  corposEmConservacao: number;
  capacidadeTotalCamaras: number;
  ocupacaoPercentual: number;
  obitosHoje: number;
  obitosMes: number;
  tempoMedioConservacao: number;
  aguardandoDocumentacao: number;
  liberadosHoje: number;
  camarasComAlerta: CamaraFria[];
  distribuicaoPorCausa: { causa: CausaObito; quantidade: number }[];
  distribuicaoPorGenero: { genero: string; quantidade: number }[];
}

export interface DashboardServicosGerais {
  contratosVigentes: number;
  contratosProximoVencimento: number;
  valorTotalContratos: number;
  funcionariosTerceirizados: number;
  coletasRealizadasMes: number;
  residuosTotalKgMes: number;
  residuosInfectantesKg: number;
  custoDestinoResiduos: number;
  itensEstoqueBaixo: EstoqueCozinha[];
  contratosVencer30Dias: ContratoTerceiro[];
  proximasColetas: ColetaResiduo[];
  avaliacaoMediaContratos: number;
}

export interface DashboardSecretaria {
  documentosPendentes: number;
  documentosUrgentes: number;
  documentosHoje: number;
  documentosMes: number;
  tramitacoesPendentes: number;
  tempoMedioTramitacao: number;
  requisicoesMateriaisPendentes: number;
  itensEstoqueBaixo: SuprimentoEscritorio[];
  documentosPorTipo: { tipo: TipoDocumentoOficial; quantidade: number }[];
  tramitacoesPorDepartamento: { departamento: string; quantidade: number }[];
}