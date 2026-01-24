# TODO - Reorganização do Dashboard Zênite360

## Objetivo
Reorganizar o dashboard principal para melhor organização hierárquica e consistência em português.

## Tarefas

### 1. Reorganização da Página do Dashboard (`src/app/dashboard/page.tsx`)

#### 1.1 Simplificar Barra de Ações Rápidas
- [ ] Reduzir de 16 botões para 6 ações principais
- [ ] Criar menu dropdown "Mais Opções" para ações secundárias
- [ ] Manter ícones e labels em português

#### 1.2 Reorganizar KPIs em Grupos Visuais
- [ ] **Grupo Clínico**: Pacientes Hoje, Triagens Pendentes, Consultas Agendadas, Internamentos
- [ ] **Grupo Operacional**: Prescrições, Farmácia, Manutenção
- [ ] **Grupo Financeiro**: Faturas, Pagamentos

#### 1.3 Reorganizar Conteúdo em Tabs
- [ ] Tab "Visão Geral" - Resumo executivo
- [ ] Tab "Área Clínica" - Triagem, Consultas, Internamento
- [ ] Tab "Área Administrativa" - Farmácia, RH, Financeiro
- [ ] Tab "Alertas" - Notificações e alertas críticos

#### 1.4 Melhorar Tradução e Consistência
- [ ] Padronizar todos os labels para português de Angola
- [ ] Ajustar descrições e textos informativos
- [ ] Manter terminologia consistente

### 2. Atualizar API do Dashboard (`src/app/api/dashboard/route.ts`)

#### 2.1 Adicionar Novos Campos
- [ ] Adicionar estatísticas por departamento
- [ ] Adicionar alertas não lidos
- [ ] Adicionar métricas de performance

### 3. Validação e Testes

#### 3.1 Testes Visuais
- [ ] Verificar responsividade em diferentes tamanhos de ecrã
- [ ] Verificar contraste de cores
- [ ] Verificar hierarquia visual

#### 3.2 Testes Funcionais
- [ ] Verificar carregamento de dados
- [ ] Verificar navegação entre tabs
- [ ] Verificar botões de ação rápida

## Prioridade: Alta
## Estimativa: 2-3 horas

