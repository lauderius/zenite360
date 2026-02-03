// ============================================================================
// 🏥 ZÊNITE360 - TIPOS TYPESCRIPT
// ============================================================================

// ENUMS DE LOCALIZAÇÃO
export type Provincia =
  | 'BENGO' | 'BENGUELA' | 'BIE' | 'CABINDA' | 'CUANDO_CUBANGO'
  | 'CUANZA_NORTE' | 'CUANZA_SUL' | 'CUNENE' | 'HUAMBO' | 'HUILA'
  | 'LUANDA' | 'LUNDA_NORTE' | 'LUNDA_SUL' | 'MALANJE' | 'MOXICO'
  | 'NAMIBE' | 'UIGE' | 'ZAIRE';

export type TipoDocumento = 'BI' | 'PASSAPORTE' | 'CEDULA' | 'CARTA_CONDUCAO' | 'OUTRO';
export type Genero = 'MASCULINO' | 'FEMININO' | 'OUTRO';
export type EstadoCivil = 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO' | 'UNIAO_FACTO';

export type GrupoSanguineo =
  | 'A_POSITIVO' | 'A_NEGATIVO' | 'B_POSITIVO' | 'B_NEGATIVO'
  | 'AB_POSITIVO' | 'AB_NEGATIVO' | 'O_POSITIVO' | 'O_NEGATIVO' | 'DESCONHECIDO';

// ENUMS ORGANIZACIONAIS
export type CodigoDepartamento =
  | 'DG' | 'DC' | 'SBU_SC' | 'SCE' | 'SM' | 'SE' | 'SF' | 'BO' | 'SL' | 'SESH'
  | 'DPC' | 'DPG' | 'DFP' | 'DE' | 'SA' | 'SI' | 'DA' | 'RH' | 'DGITI' | 'DGF' | 'CM' | 'SG';

export type NivelAcesso =
  | 'SUPER_ADMIN' | 'ADMIN_DEPARTAMENTO' | 'GESTOR' | 'MEDICO' | 'ENFERMEIRO'
  | 'TECNICO' | 'ADMINISTRATIVO' | 'RECEPCAO' | 'FARMACEUTICO' | 'FINANCEIRO'
  | 'MANUTENCAO' | 'VISUALIZADOR';

export type StatusFuncionario =
  | 'ACTIVO' | 'INACTIVO' | 'FERIAS' | 'LICENCA' | 'SUSPENSO' | 'APOSENTADO' | 'DESLIGADO';

export type TipoContrato =
  | 'EFECTIVO' | 'CONTRATADO' | 'ESTAGIARIO' | 'PRESTADOR_SERVICO' | 'TEMPORARIO';

// ENUMS DE ATENDIMENTO
export type StatusAgendamento =
  | 'AGENDADO' | 'CONFIRMADO' | 'EM_ESPERA' | 'EM_ATENDIMENTO'
  | 'ATENDIDO' | 'REAGENDADO' | 'CANCELADO' | 'NAO_COMPARECEU';

export type TipoAtendimento =
  | 'CONSULTA_EXTERNA' | 'URGENCIA' | 'EMERGENCIA' | 'INTERNAMENTO'
  | 'CIRURGIA' | 'EXAME' | 'PROCEDIMENTO' | 'RETORNO' | 'DOMICILIARIO';

export type PrioridadeTriagem =
  | 'EMERGENCIA' | 'MUITO_URGENTE' | 'URGENTE' | 'POUCO_URGENTE' | 'NAO_URGENTE';

export type StatusTriagem = 'AGUARDANDO_TRIAGEM' | 'EM_TRIAGEM' | 'TRIADO' | 'ENCAMINHADO';
export type StatusConsulta = 'AGUARDANDO' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA' | 'TRANSFERIDA';

export type StatusInternamento =
  | 'ADMITIDO' | 'EM_TRATAMENTO' | 'ALTA_MEDICA' | 'ALTA_PEDIDO' | 'TRANSFERIDO' | 'OBITO' | 'EVASAO';

// ENUMS DE FARMÁCIA
export type TipoMedicamento =
  | 'COMPRIMIDO' | 'CAPSULA' | 'INJECTAVEL' | 'XAROPE' | 'POMADA'
  | 'CREME' | 'GOTAS' | 'SUPOSITORIO' | 'ADESIVO' | 'INALADOR' | 'SOLUCAO' | 'SUSPENSAO' | 'OUTRO';

export type ClasseTerapeutica =
  | 'ANALGESICO' | 'ANTIBIOTICO' | 'ANTIFUNGICO' | 'ANTIVIRAL' | 'ANTI_INFLAMATORIO'
  | 'ANTIPIRETICO' | 'ANTI_HIPERTENSIVO' | 'ANTICOAGULANTE' | 'ANTIDIABETICO'
  | 'CARDIOVASCULAR' | 'GASTROINTESTINAL' | 'RESPIRATORIO' | 'NEUROLOGICO'
  | 'PSIQUIATRICO' | 'DERMATOLOGICO' | 'OFTALMOLOGICO' | 'HORMONAL' | 'VACINA' | 'OUTRO';

export type StatusLote = 'DISPONIVEL' | 'RESERVADO' | 'EM_QUARENTENA' | 'EXPIRADO' | 'DEVOLVIDO' | 'DESCARTADO';

// ENUMS DE MANUTENÇÃO
export type StatusOrdemServico =
  | 'ABERTA' | 'EM_ANALISE' | 'APROVADA' | 'EM_EXECUCAO' | 'AGUARDANDO_PECA' | 'CONCLUIDA' | 'CANCELADA';

export type PrioridadeOrdem = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAIXA';

// ENUMS FINANCEIROS
export type StatusFatura =
  | 'RASCUNHO' | 'EMITIDA' | 'PARCIALMENTE_PAGA' | 'PAGA' | 'VENCIDA' | 'CANCELADA' | 'ANULADA';

export type FormaPagamento =
  | 'DINHEIRO' | 'MULTICAIXA' | 'TRANSFERENCIA' | 'CHEQUE' | 'CONVENIO' | 'ISENTO' | 'OUTRO';

// ============================================================================
// INTERFACES - MODELOS PRINCIPAIS
// ============================================================================

export interface Usuario {
  id: number;
  name?: string;
  funcionarioId?: number;
  username: string;
  email: string;
  activo: boolean;
  bloqueado: boolean;
  ultimoLogin?: Date;
  funcionario?: Funcionario;
}

export interface Funcionario {
  id: number;
  numeroMecanografico: string;
  nomeCompleto: string;
  nomeSocial?: string;
  dataNascimento: Date;
  genero: Genero;
  estadoCivil?: EstadoCivil;
  nacionalidade: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  telefone1: string;
  telefone2?: string;
  email?: string;
  emailInstitucional?: string;
  departamentoId: number;
  cargo: string;
  especialidade?: string;
  nivelAcesso: NivelAcesso;
  status: StatusFuncionario;
  fotoUrl?: string;
  departamento?: Departamento;
}

export interface Departamento {
  id: number;
  codigo: CodigoDepartamento;
  nome: string;
  sigla: string;
  tipo: string;
  descricao?: string;
  localizacao?: string;
  telefone?: string;
  email?: string;
  activo: boolean;
  departamentoPaiId?: number;
  subdepartamentos?: Departamento[];
}

export interface Paciente {
  id: number;
  numeroProcesso: string;
  nomeCompleto: string;
  nomeSocial?: string;
  dataNascimento: Date;
  genero: Genero;
  estadoCivil?: EstadoCivil;
  nacionalidade: string;
  profissao?: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento?: string;
  telefone1?: string;
  telefone2?: string;
  email?: string;
  endereco?: string;
  provinciaId?: number;
  municipioId?: number;
  comunaId?: number;
  grupoSanguineo: GrupoSanguineo;
  alergias?: string;
  doencasCronicas?: string;
  possuiConvenio: boolean;
  convenioNome?: string;
  convenioNumero?: string;
  fotoUrl?: string;
  activo: boolean;
  criadoEm: Date;
}

export interface Agendamento {
  id: number;
  codigo: string;
  pacienteId: number;
  departamentoId: number;
  tipoAtendimento: TipoAtendimento;
  dataAgendamento: Date;
  horaInicio: string;
  horaFim?: string;
  duracaoEstimada: number;
  status: StatusAgendamento;
  prioridade?: PrioridadeTriagem;
  observacoes?: string;
  motivoConsulta?: string;
  paciente?: Paciente;
  departamento?: Departamento;
}

export interface Triagem {
  id: number;
  codigo: string;
  pacienteId: number;
  agendamentoId?: number;
  departamentoId: number;
  enfermeiroId: number;
  dataHoraChegada: Date;
  dataHoraTriagem: Date;
  pressaoSistolica?: number;
  pressaoDiastolica?: number;
  frequenciaCardiaca?: number;
  frequenciaRespiratoria?: number;
  temperatura?: number;
  saturacaoO2?: number;
  glicemiaCapilar?: number;
  peso?: number;
  altura?: number;
  queixaPrincipal: string;
  prioridade: PrioridadeTriagem;
  status: StatusTriagem;
  escalaDor?: number;
  sinaisAlerta?: string;
  observacoes?: string;
  paciente?: Paciente;
  enfermeiro?: Funcionario;
}

export interface Consulta {
  id: number;
  codigo: string;
  pacienteId: number;
  medicoId: number;
  departamentoId: number;
  triagemId?: number;
  dataHoraInicio: Date;
  dataHoraFim?: Date;
  status: StatusConsulta;
  tipoAtendimento: TipoAtendimento;
  queixaPrincipal?: string;
  historiaDoencaActual?: string;
  exameFisico?: string;
  hipoteseDiagnostica?: string;
  diagnosticoDefinitivo?: string;
  cidPrincipal?: string;
  conduta?: string;
  observacoes?: string;
  paciente?: Paciente;
  medico?: Funcionario;
}

export interface Internamento {
  id: number;
  codigo: string;
  pacienteId: number;
  departamentoId: number;
  medicoResponsavelId: number;
  leitoId?: number;
  dataAdmissao: Date;
  dataPrevisaoAlta?: Date;
  dataAlta?: Date;
  status: StatusInternamento;
  diagnosticoAdmissao?: string;
  diagnosticoAlta?: string;
  procedimentosRealizados?: string;
  observacoes?: string;
  paciente?: Paciente;
  medicoResponsavel?: Funcionario;
  leito?: Leito;
}

export interface Leito {
  id: number;
  codigo: string;
  descricao?: string;
  localizacao: string;
  tipo: string;
  activo: boolean;
  ocupado: boolean;
}

export interface Medicamento {
  id: number;
  codigo: string;
  codigoBarras?: string;
  nomeGenerico: string;
  nomeComercial?: string;
  fabricante?: string;
  apresentacao: string;
  tipo: TipoMedicamento;
  classeTerapeutica: ClasseTerapeutica;
  controlado: boolean;
  termolabil: boolean;
  unidadeMedida: string;
  unidadeDispensacao: string;
  estoqueMinimo: number;
  estoqueCritico: number;
  precoUnitario?: number;
  activo: boolean;
}

export interface Prescricao {
  id: number;
  codigo: string;
  pacienteId: number;
  medicoId: number;
  consultaId?: number;
  internamentoId?: number;
  dataPrescricao: Date;
  dataValidade?: Date;
  observacoes?: string;
  activa: boolean;
  itens?: ItemPrescricao[];
  paciente?: Paciente;
  medico?: Funcionario;
}

export interface ItemPrescricao {
  id: number;
  prescricaoId: number;
  medicamentoId: number;
  dose: string;
  frequencia: string;
  viaAdministracao: string;
  duracao?: string;
  quantidade: number;
  instrucoes?: string;
  dispensado: boolean;
  medicamento?: Medicamento;
}

export interface Exame {
  id: number;
  codigo: string;
  pacienteId: number;
  tipoExameId: number;
  consultaId?: number;
  dataSolicitacao: Date;
  dataColeta?: Date;
  dataResultado?: Date;
  status: string;
  urgente: boolean;
  resultados?: string;
  paciente?: Paciente;
}

export interface Equipamento {
  id: number;
  codigo: string;
  patrimonio?: string;
  nome: string;
  descricao?: string;
  categoria: string;
  fabricante?: string;
  modelo?: string;
  numeroSerie?: string;
  departamentoId?: number;
  localizacao?: string;
  status: string;
  activo: boolean;
}

export interface OrdemServico {
  id: number;
  codigo: string;
  equipamentoId?: number;
  departamentoId: number;
  tipo: string;
  prioridade: PrioridadeOrdem;
  status: StatusOrdemServico;
  titulo: string;
  descricaoProblema: string;
  diagnostico?: string;
  solucaoAplicada?: string;
  dataAbertura: Date;
  dataPrevisao?: Date;
  dataConclusao?: Date;
  custoTotal?: number;
  equipamento?: Equipamento;
  departamento?: Departamento;
}

export interface Fatura {
  id: number;
  numero: string;
  pacienteId: number;
  departamentoId: number;
  tipo: string;
  status: StatusFatura;
  dataEmissao: Date;
  dataVencimento: Date;
  dataPagamento?: Date;
  subtotal: number;
  desconto: number;
  impostos: number;
  total: number;
  valorPago: number;
  formaPagamento?: FormaPagamento;
  convenio: boolean;
  paciente?: Paciente;
}

// ============================================================================
// INTERFACES - AUTENTICAÇÃO
// ============================================================================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  usuario: Usuario;
  funcionario: Funcionario;
  expiresAt: Date;
}

export interface AuthContextType {
  usuario: Usuario | null;
  funcionario: Funcionario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkPermission: (nivel: NivelAcesso | NivelAcesso[]) => boolean;
}

// ============================================================================
// INTERFACES - UI
// ============================================================================

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

// ============================================================================
// CONSTANTES
// ============================================================================

export const PROVINCIAS_ANGOLA: Record<Provincia, { nome: string; capital: string }> = {
  BENGO: { nome: 'Bengo', capital: 'Caxito' },
  BENGUELA: { nome: 'Benguela', capital: 'Benguela' },
  BIE: { nome: 'Bié', capital: 'Cuíto' },
  CABINDA: { nome: 'Cabinda', capital: 'Cabinda' },
  CUANDO_CUBANGO: { nome: 'Cuando Cubango', capital: 'Menongue' },
  CUANZA_NORTE: { nome: 'Cuanza Norte', capital: "N'dalatando" },
  CUANZA_SUL: { nome: 'Cuanza Sul', capital: 'Sumbe' },
  CUNENE: { nome: 'Cunene', capital: 'Ondjiva' },
  HUAMBO: { nome: 'Huambo', capital: 'Huambo' },
  HUILA: { nome: 'Huíla', capital: 'Lubango' },
  LUANDA: { nome: 'Luanda', capital: 'Luanda' },
  LUNDA_NORTE: { nome: 'Lunda Norte', capital: 'Dundo' },
  LUNDA_SUL: { nome: 'Lunda Sul', capital: 'Saurimo' },
  MALANJE: { nome: 'Malanje', capital: 'Malanje' },
  MOXICO: { nome: 'Moxico', capital: 'Luena' },
  NAMIBE: { nome: 'Namibe', capital: 'Moçâmedes' },
  UIGE: { nome: 'Uíge', capital: 'Uíge' },
  ZAIRE: { nome: 'Zaire', capital: "M'banza Congo" },
};

export const CORES_TRIAGEM: Record<PrioridadeTriagem, { cor: string; nome: string; tempo: string }> = {
  EMERGENCIA: { cor: 'red', nome: 'Emergência', tempo: 'Imediato' },
  MUITO_URGENTE: { cor: 'orange', nome: 'Muito Urgente', tempo: '10 min' },
  URGENTE: { cor: 'yellow', nome: 'Urgente', tempo: '60 min' },
  POUCO_URGENTE: { cor: 'green', nome: 'Pouco Urgente', tempo: '120 min' },
  NAO_URGENTE: { cor: 'blue', nome: 'Não Urgente', tempo: '240 min' },
};

export const LABELS_GENERO: Record<Genero, string> = {
  MASCULINO: 'Masculino',
  FEMININO: 'Feminino',
  OUTRO: 'Outro',
};

export const LABELS_GRUPO_SANGUINEO: Record<GrupoSanguineo, string> = {
  A_POSITIVO: 'A+', A_NEGATIVO: 'A-',
  B_POSITIVO: 'B+', B_NEGATIVO: 'B-',
  AB_POSITIVO: 'AB+', AB_NEGATIVO: 'AB-',
  O_POSITIVO: 'O+', O_NEGATIVO: 'O-',
  DESCONHECIDO: 'Desconhecido',
};