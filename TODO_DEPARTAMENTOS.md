# Plano de Correção dos Departamentos - Zênite360

## Objetivo
Corrigir os erros nos departamentos após remoção dos dados mock, implementando CRUD funcional com o banco de dados.

## Tarefas por Departamento

### 1. Dashboard (/dashboard)
- [ ] Criar rota `/api/dashboard` com estatísticas agregadas
- [ ] Conectar páginas de departamento ao dashboard

### 2. Património (/patrimonio)
- [ ] Criar rota `/api/patrimonio/dashboard` com dados agregados
- [ ] Ajustar rota `/api/patrimonio/ativos` para retornar dados do banco
- [ ] Criar rota `/api/patrimonio/gases` com dados mock compatíveis
- [ ] Criar rota `/api/patrimonio/gases/alertas`
- [ ] Criar rota `/api/patrimonio/manutencao`
- [ ] Ajustar página `patrimonio/page.tsx`

### 3. Farmácia (/farmacia)
- [ ] Ajustar rota `/api/farmacia` para retornar medicamentos
- [ ] Criar rota `/api/farmacia/prescricoes`
- [ ] Ajustar página `farmacia/page.tsx`

### 4. Financeiro (/financeiro)
- [ ] Criar rota `/api/financeiro/dashboard` com resumo
- [ ] Criar rota `/api/financeiro/resumo`
- [ ] Ajustar rota `/api/financeiro/faturas`
- [ ] Ajustar página `financeiro/page.tsx`

### 5. RH (/rh)
- [ ] Criar rota `/api/rh/departamentos`
- [ ] Criar rota `/api/rh/funcionarios`
- [ ] Ajustar rota `/api/rh` existente
- [ ] Ajustar página `rh/page.tsx`

### 6. Casa Mortuária (/casa-mortuaria)
- [ ] Criar rota `/api/casa-mortuaria/dashboard`
- [ ] Criar rota `/api/casa-mortuaria/registros`
- [ ] Criar rota `/api/casa-mortuaria/camaras`
- [ ] Ajustar página `casa-mortuaria/page.tsx`

### 7. Secretaria (/secretaria)
- [ ] Criar rota `/api/secretaria/dashboard`
- [ ] Criar rota `/api/secretaria/documentos`
- [ ] Ajustar rota `/api/secretaria/suprimentos`
- [ ] Criar rota `/api/secretaria/requisicoes`
- [ ] Ajustar página `secretaria/page.tsx`

### 8. Serviços Gerais (/servicos-gerais)
- [ ] Criar rota `/api/servicos-gerais/dashboard`
- [ ] Criar rota `/api/servicos-gerais/contratos`
- [ ] Criar rota `/api/servicos-gerais/residuos`
- [ ] Criar rota `/api/servicos-gerais/cozinha/estoque`
- [ ] Ajustar página `servicos-gerais/page.tsx`

## Entregáveis
- Rotas de API funcionais com dados mock quando banco vazio
- Páginas carregando dados corretamente
- Interface de CRUD básica funcional
- Mensagens de erro amigáveis quando dados indisponíveis

## Prioridade
1. Dashboard e Património
2. Farmácia e Financeiro
3. RH e Casa Mortuária
4. Secretaria e Serviços Gerais

