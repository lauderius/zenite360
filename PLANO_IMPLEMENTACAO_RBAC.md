# 🔐 PLANO DE IMPLEMENTAÇÃO - RBAC (Role-Based Access Control)
## Sistema de Gestão Hospitalar Zenite360

---

## 📊 ESTADO ATUAL DO PROJETO

### ✅ O que JÁ EXISTE:
1. **Base de Dados**
   - Tabela `utilizadores` (autenticação)
   - Tabela `funcionarios` (dados funcionais)
   - Tabela `departamentos` (setores hospitalares)
   - Relação: `funcionarios.departamentoId` → `departamentos.id`

2. **Autenticação**
   - Login funcional (`/api/auth/login`)
   - Geração de JWT com payload básico
   - Validação de token (`/api/auth/validate`)
   - Context API (`AuthContext.tsx`)

3. **Tipos TypeScript**
   - `NivelAcesso` (12 níveis definidos)
   - `CodigoDepartamento` (22 setores)
   - `Funcionario`, `Usuario`, `Departamento`

### ❌ O que FALTA IMPLEMENTAR:
1. Carregar dados de setor, função e hospital na sessão
2. Middleware de proteção de rotas
3. RBAC completo (controlo de acesso por setor + função)
4. Isolamento total entre setores
5. Proteção especial para "Direção Geral"
6. Layouts separados por setor
7. Menus condicionais por permissão
8. Validação backend em todas as API routes

---

## 🎯 OBJETIVOS DA IMPLEMENTAÇÃO

### 1. **Enriquecimento da Sessão**
Após login, carregar e armazenar:
- `departamentoId` e `departamento` (nome, código, tipo)
- `nivelAcesso` (função/role do utilizador)
- `hospitalId` (unidade hospitalar)
- `permissions` (array de permissões específicas)

### 2. **Middleware de Proteção**
Criar middleware Next.js que:
- Valida token JWT em todas as rotas protegidas
- Verifica permissões de acesso por setor
- Redireciona utilizadores não autorizados
- Bloqueia acesso cruzado entre setores

### 3. **RBAC Granular**
Implementar controlo de acesso baseado em:
- **Setor** (departamento)
- **Função** (nivelAcesso)
- **Combinação** setor + função

### 4. **Regra Crítica: Direção Geral**
- **APENAS** o setor "Direção Geral" (`DG`) pode aceder a `/configuracoes`
- Nenhum outro setor pode ver:
  - Nome do hospital
  - Parâmetros administrativos
  - Configurações globais

### 5. **Isolamento Total**
- Cada setor só vê seus próprios dados
- Exceção: `SUPER_ADMIN` vê tudo
- Validação no frontend E backend

---

## 📐 ARQUITETURA DA SOLUÇÃO

```
┌─────────────────────────────────────────────────────────────┐
│                        UTILIZADOR                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    LOGIN (POST /api/auth/login)             │
│  1. Valida credenciais                                      │
│  2. Busca utilizador + funcionario + departamento           │
│  3. Gera JWT com payload completo                           │
│  4. Retorna: token, usuario, funcionario, departamento      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE (middleware.ts)               │
│  1. Intercepta todas as rotas protegidas                    │
│  2. Valida JWT                                              │
│  3. Verifica permissões (setor + função)                    │
│  4. Permite ou bloqueia acesso                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    LAYOUT POR SETOR                         │
│  - Direção Geral → Layout com acesso total                 │
│  - Clínica → Layout médico                                 │
│  - Enfermagem → Layout de enfermagem                       │
│  - Farmácia → Layout farmacêutico                          │
│  - etc.                                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENTES PROTEGIDOS                   │
│  - Menus condicionais                                       │
│  - Botões com permissões                                    │
│  - Dados filtrados por setor                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ SEQUÊNCIA DE IMPLEMENTAÇÃO

### **FASE 1: Enriquecimento do Login e Sessão**

#### 1.1. Atualizar `/api/auth/login/route.ts`
**Objetivo:** Carregar dados completos do funcionário e departamento

```typescript
// Buscar utilizador + funcionario + departamento
const usuario = await prisma.utilizadores.findFirst({
  where: { OR: [{ email: username }, { username: username }] }
});

const funcionario = await prisma.funcionarios.findFirst({
  where: { /* relação com utilizador */ },
  include: { departamento: true }
});

// Gerar JWT com payload completo
const token = await new SignJWT({
  userId: usuario.id,
  email: usuario.email,
  funcionarioId: funcionario.id,
  departamentoId: funcionario.departamentoId,
  departamentoCodigo: funcionario.departamento.codigo,
  nivelAcesso: funcionario.nivelAcesso,
  hospitalId: 1, // ou buscar da configuração
})
.setExpirationTime('8h')
.sign(JWT_SECRET);

// Retornar dados completos
return NextResponse.json({
  token,
  usuario: { ... },
  funcionario: {
    ...funcionario,
    departamento: funcionario.departamento
  }
});
```

#### 1.2. Atualizar `AuthContext.tsx`
**Objetivo:** Armazenar e expor dados de departamento

```typescript
interface AuthContextType {
  usuario: Usuario | null;
  funcionario: Funcionario | null;
  departamento: Departamento | null; // NOVO
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkPermission: (nivel: NivelAcesso | NivelAcesso[]) => boolean;
  checkDepartamento: (codigo: CodigoDepartamento) => boolean; // NOVO
  canAccessConfiguracoes: () => boolean; // NOVO
}
```

---

### **FASE 2: Middleware de Proteção de Rotas**

#### 2.1. Criar `src/middleware.ts`
**Objetivo:** Interceptar e proteger rotas

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'zenite360-secret-key-change-in-production'
);

// Rotas públicas (não requerem autenticação)
const PUBLIC_ROUTES = ['/login', '/api/auth/login', '/api/auth/validate'];

// Rotas restritas por setor
const DEPARTAMENTO_ROUTES: Record<string, string[]> = {
  'DG': ['/configuracoes'], // APENAS Direção Geral
  'DC': ['/clinica'],
  'SE': ['/enfermagem'],
  'SF': ['/farmacia'],
  'DFP': ['/financeiro'],
  'RH': ['/rh'],
  // ... outros setores
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rotas públicas
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verificar token
  const token = request.cookies.get('zenite360_token')?.value 
    || request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Validar e decodificar JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Verificar acesso a /configuracoes (APENAS Direção Geral)
    if (pathname.startsWith('/configuracoes')) {
      if (payload.departamentoCodigo !== 'DG' && payload.nivelAcesso !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/dashboard?error=acesso_negado', request.url));
      }
    }

    // Verificar acesso por setor
    for (const [dept, routes] of Object.entries(DEPARTAMENTO_ROUTES)) {
      if (routes.some(route => pathname.startsWith(route))) {
        if (payload.departamentoCodigo !== dept && payload.nivelAcesso !== 'SUPER_ADMIN') {
          return NextResponse.redirect(new URL('/dashboard?error=setor_nao_autorizado', request.url));
        }
      }
    }

    // Adicionar dados do utilizador aos headers (para uso nas API routes)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId as string);
    requestHeaders.set('x-departamento-id', payload.departamentoId as string);
    requestHeaders.set('x-departamento-codigo', payload.departamentoCodigo as string);
    requestHeaders.set('x-nivel-acesso', payload.nivelAcesso as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    return NextResponse.redirect(new URL('/login?error=token_invalido', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

---

### **FASE 3: Helpers de Permissões**

#### 3.1. Criar `src/lib/permissions.ts`
**Objetivo:** Centralizar lógica de permissões

```typescript
import type { NivelAcesso, CodigoDepartamento } from '@/types';

// Matriz de permissões: Setor → Rotas permitidas
export const PERMISSIONS_MAP: Record<CodigoDepartamento, string[]> = {
  'DG': ['*'], // Direção Geral tem acesso total
  'DC': ['/clinica', '/pacientes', '/consultas', '/agendamentos'],
  'SE': ['/enfermagem', '/triagem', '/pacientes'],
  'SF': ['/farmacia', '/stock', '/prescricoes'],
  'DFP': ['/financeiro', '/faturas', '/pagamentos'],
  'RH': ['/rh', '/funcionarios', '/escalas'],
  'SL': ['/laboratorio', '/exames'],
  'CM': ['/casa-mortuaria', '/morgue'],
  'SA': ['/almoxarifado', '/stock'],
  'SI': ['/internamento', '/leitos'],
  'DGITI': ['/ti', '/configuracoes-sistema'],
  // ... outros setores
};

// Verificar se utilizador pode aceder a uma rota
export function canAccessRoute(
  departamentoCodigo: CodigoDepartamento,
  nivelAcesso: NivelAcesso,
  route: string
): boolean {
  // SUPER_ADMIN tem acesso total
  if (nivelAcesso === 'SUPER_ADMIN') return true;

  // Direção Geral tem acesso total
  if (departamentoCodigo === 'DG') return true;

  // Verificar permissões do setor
  const allowedRoutes = PERMISSIONS_MAP[departamentoCodigo] || [];
  return allowedRoutes.some(allowed => route.startsWith(allowed));
}

// Verificar acesso a configurações (APENAS Direção Geral)
export function canAccessConfiguracoes(
  departamentoCodigo: CodigoDepartamento,
  nivelAcesso: NivelAcesso
): boolean {
  return departamentoCodigo === 'DG' || nivelAcesso === 'SUPER_ADMIN';
}

// Filtrar dados por setor (isolamento)
export function filterByDepartamento<T extends { departamentoId?: number }>(
  data: T[],
  userDepartamentoId: number,
  nivelAcesso: NivelAcesso
): T[] {
  // SUPER_ADMIN e Direção Geral veem tudo
  if (nivelAcesso === 'SUPER_ADMIN') return data;

  // Outros setores veem apenas seus dados
  return data.filter(item => item.departamentoId === userDepartamentoId);
}
```

---

### **FASE 4: Proteção de API Routes**

#### 4.1. Criar `src/lib/auth-middleware.ts`
**Objetivo:** Middleware reutilizável para API routes

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'zenite360-secret-key-change-in-production'
);

export interface AuthUser {
  userId: number;
  email: string;
  funcionarioId: number;
  departamentoId: number;
  departamentoCodigo: string;
  nivelAcesso: string;
}

export async function validateAuth(request: NextRequest): Promise<AuthUser | null> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthUser;
  } catch {
    return null;
  }
}

export function requireAuth(handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const user = await validateAuth(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    return handler(req, user);
  };
}

export function requireDepartamento(
  allowedDepts: string[],
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>
) {
  return requireAuth(async (req, user) => {
    if (user.nivelAcesso === 'SUPER_ADMIN') {
      return handler(req, user);
    }

    if (!allowedDepts.includes(user.departamentoCodigo)) {
      return NextResponse.json(
        { error: 'Acesso negado para este setor' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}
```

#### 4.2. Exemplo de uso em API route

```typescript
// src/app/api/configuracoes/route.ts
import { requireDepartamento } from '@/lib/auth-middleware';

export const GET = requireDepartamento(['DG'], async (req, user) => {
  // Apenas Direção Geral pode aceder
  const config = await prisma.configuracoes.findFirst();
  return NextResponse.json({ data: config });
});

// src/app/api/pacientes/route.ts
import { requireAuth } from '@/lib/auth-middleware';
import { filterByDepartamento } from '@/lib/permissions';

export const GET = requireAuth(async (req, user) => {
  const pacientes = await prisma.pacientes.findMany();
  
  // Filtrar por setor (isolamento)
  const filtered = filterByDepartamento(
    pacientes,
    user.departamentoId,
    user.nivelAcesso
  );

  return NextResponse.json({ data: filtered });
});
```

---

### **FASE 5: Layouts Separados por Setor**

#### 5.1. Criar layouts dinâmicos

```typescript
// src/app/(dashboard)/layout.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import SidebarDirecaoGeral from '@/components/sidebars/SidebarDirecaoGeral';
import SidebarClinica from '@/components/sidebars/SidebarClinica';
import SidebarEnfermagem from '@/components/sidebars/SidebarEnfermagem';
// ... outros sidebars

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { funcionario, departamento } = useAuth();

  const getSidebar = () => {
    switch (departamento?.codigo) {
      case 'DG': return <SidebarDirecaoGeral />;
      case 'DC': return <SidebarClinica />;
      case 'SE': return <SidebarEnfermagem />;
      case 'SF': return <SidebarFarmacia />;
      // ... outros casos
      default: return <SidebarDefault />;
    }
  };

  return (
    <div className="flex h-screen">
      {getSidebar()}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
```

---

### **FASE 6: Componentes de Proteção**

#### 6.1. Criar `<ProtectedRoute>`

```typescript
// src/components/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { NivelAcesso, CodigoDepartamento } from '@/types';

interface Props {
  children: React.ReactNode;
  requiredNivel?: NivelAcesso[];
  requiredDepartamento?: CodigoDepartamento[];
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredNivel,
  requiredDepartamento,
  fallback
}: Props) {
  const { funcionario, departamento, checkPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!funcionario || !departamento) {
      router.push('/login');
      return;
    }

    if (requiredNivel && !checkPermission(requiredNivel)) {
      router.push('/dashboard?error=sem_permissao');
      return;
    }

    if (requiredDepartamento && !requiredDepartamento.includes(departamento.codigo)) {
      router.push('/dashboard?error=setor_nao_autorizado');
      return;
    }
  }, [funcionario, departamento]);

  if (!funcionario || !departamento) {
    return fallback || <div>Carregando...</div>;
  }

  if (requiredNivel && !checkPermission(requiredNivel)) {
    return fallback || <div>Sem permissão</div>;
  }

  if (requiredDepartamento && !requiredDepartamento.includes(departamento.codigo)) {
    return fallback || <div>Setor não autorizado</div>;
  }

  return <>{children}</>;
}
```

#### 6.2. Criar `<Can>` (renderização condicional)

```typescript
// src/components/Can.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import type { NivelAcesso, CodigoDepartamento } from '@/types';

interface Props {
  children: React.ReactNode;
  nivel?: NivelAcesso[];
  departamento?: CodigoDepartamento[];
  fallback?: React.ReactNode;
}

export default function Can({ children, nivel, departamento, fallback }: Props) {
  const { funcionario, departamento: userDept, checkPermission } = useAuth();

  if (!funcionario || !userDept) return fallback || null;

  if (nivel && !checkPermission(nivel)) return fallback || null;

  if (departamento && !departamento.includes(userDept.codigo)) {
    return fallback || null;
  }

  return <>{children}</>;
}
```

---

### **FASE 7: Menus Condicionais**

#### 7.1. Exemplo de menu com permissões

```typescript
// src/components/sidebars/SidebarDirecaoGeral.tsx
import { Can } from '@/components/Can';

export default function SidebarDirecaoGeral() {
  return (
    <nav>
      <MenuItem href="/dashboard" icon={Home}>Dashboard</MenuItem>
      
      <Can departamento={['DG']}>
        <MenuItem href="/configuracoes" icon={Settings}>
          Configurações Globais
        </MenuItem>
      </Can>

      <Can nivel={['SUPER_ADMIN', 'ADMIN_DEPARTAMENTO']}>
        <MenuItem href="/relatorios" icon={Chart}>
          Relatórios Gerenciais
        </MenuItem>
      </Can>
    </nav>
  );
}
```

---

## 🧪 TESTES E VALIDAÇÃO

### Cenários de Teste:

1. **Login de utilizador do setor Clínica**
   - ✅ Deve ver menu de clínica
   - ✅ Deve aceder a `/clinica`, `/pacientes`, `/consultas`
   - ❌ NÃO deve aceder a `/configuracoes`
   - ❌ NÃO deve ver dados de outros setores

2. **Login de utilizador da Direção Geral**
   - ✅ Deve ver menu completo
   - ✅ Deve aceder a `/configuracoes`
   - ✅ Deve ver dados de todos os setores

3. **Tentativa de acesso direto via URL**
   - Utilizador de Enfermagem tenta aceder `/configuracoes`
   - ❌ Deve ser redirecionado para `/dashboard?error=acesso_negado`

4. **API Routes**
   - GET `/api/pacientes` por utilizador de Clínica
   - ✅ Deve retornar apenas pacientes do setor Clínica
   - GET `/api/configuracoes` por utilizador de Farmácia
   - ❌ Deve retornar 403 Forbidden

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] **Fase 1:** Atualizar login para carregar departamento
- [ ] **Fase 1:** Atualizar AuthContext com dados de departamento
- [ ] **Fase 2:** Criar middleware.ts
- [ ] **Fase 2:** Configurar rotas protegidas
- [ ] **Fase 3:** Criar lib/permissions.ts
- [ ] **Fase 4:** Criar lib/auth-middleware.ts
- [ ] **Fase 4:** Proteger todas as API routes
- [ ] **Fase 5:** Criar layouts por setor
- [ ] **Fase 6:** Criar componentes ProtectedRoute e Can
- [ ] **Fase 7:** Implementar menus condicionais
- [ ] **Testes:** Validar isolamento entre setores
- [ ] **Testes:** Validar acesso exclusivo de Direção Geral a configurações
- [ ] **Documentação:** Atualizar README com matriz de permissões

---

## 🚀 PRÓXIMOS PASSOS

Após confirmação, vou implementar **fase por fase**, começando pela **Fase 1** (enriquecimento do login e sessão).

Deseja que eu prossiga com a implementação?
