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

## Departamentos da  SideBar que dão erro ao entrar
✅ 1. Internamento - CORRIGIDO
✅ 2. Laboratorio - CORRIGIDO
✅ 3. Patrimonio - CORRIGIDO
✅ 4. Farmacia - CORRIGIDO (adicionado 'use client')
✅ 5. Configurações - CORRIGIDO

## Cabeçalho
✅ * ao clicar na parte superior do nome do usuario, e abrir o mini menu quando clico em "Meu Perfil" e de igual modo quando clico em "Configurações" - CORRIGIDO (usando Link do Next.js e criada página de perfil)
✅ * o modo escuro e modo claro não estão funcionando, vamos desabilitalo - JÁ ESTAVA DESABILITADO
✅ * o campo de notificações também não está funcionando, vamos melhore para que cada departamento receba alertas de forma individual - MELHORADO (adicionado sistema de notificações com mock data, pronto para integração com backend)

## Melhorias Implementadas
- Adicionado 'use client' na página de Farmácia
- Substituído anchor tags por Link components no menu de usuário
- Criada página de perfil completa (/perfil)
- Adicionado click-outside detection para fechar dropdowns
- Melhorado o menu de usuário com melhor UX
- Sistema de notificações preparado para receber alertas individuais por departamento

## Departamentos da  SideBar que dão erro ao entrar e têm funcionalidades que não funcionam
Todas as alterações que fazemos relacionada com as informaçõe devem fazer CRUD com o banco de dados via prisma, e jamais deve ter dados em mock.
-  nível geral não está a dar para emitir ou exportar em pdf
- Na Tiagem não dá para inciar uma nova.
- E no de Recursos Humanos não dá para acessar a lista de visualização para cada um dos setores que estão presentes nele.
- E na paǵina dos pacientes tem aquela box com opções para selecionar "Em triagem, e etc" melhora a cor dele não dá para ver bem as opções antes de selecionar.
- E na página património na opção adicionar novo activo, não dá para adicionar
- Na página de manuntenção não dá para adicionar nova ordem de manutenção
- Na página do laboratorio não dá para solicitar novo exame, nem ver resultados
- Na paǵina da farmacia também muda a cor da box com opções para ver os medicamentos por setor.
- Na secretaria, não dá para ver protocolo, nem criar os documentos que aparecem na opção criar novo documento
- Na casa mortuaria, não dá para criar novo registro, nem ver estatisticas
- Nos serviços gerais e estatiscas, não dá para criar novo contrato, nem nova coleta;
