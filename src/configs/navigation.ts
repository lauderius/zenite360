// Adicionar aos itens de navegação existentes

export const adminNavItems: NavItem[] = [
  // ... itens existentes ...
  
  {
    title: 'Património',
    href: '/patrimonio',
    icon: 'Package',
    children: [
      { title: 'Dashboard', href: '/patrimonio' },
      { title: 'Ativos', href: '/patrimonio/ativos' },
      { title: 'Manutenção', href: '/patrimonio/manutencao' },
      { title: 'Gases Medicinais', href: '/patrimonio/gases' },
      { title: 'Calibrações', href: '/patrimonio/calibracoes' },
    ],
  },
  {
    title: 'Casa Mortuária',
    href: '/casa-mortuaria',
    icon: 'Home',
    children: [
      { title: 'Dashboard', href: '/casa-mortuaria' },
      { title: 'Registros', href: '/casa-mortuaria/registros' },
      { title: 'Câmaras Frias', href: '/casa-mortuaria/camaras' },
      { title: 'Estatísticas', href: '/casa-mortuaria/estatisticas' },
    ],
  },
  {
    title: 'Serviços Gerais',
    href: '/servicos-gerais',
    icon: 'Settings',
    children: [
      { title: 'Dashboard', href: '/servicos-gerais' },
      { title: 'Contratos', href: '/servicos-gerais/contratos' },
      { title: 'Terceirizados', href: '/servicos-gerais/funcionarios' },
      { title: 'Resíduos', href: '/servicos-gerais/residuos' },
      { title: 'Estoque Cozinha', href: '/servicos-gerais/cozinha' },
    ],
  },
  {
    title: 'Secretaria Geral',
    href: '/secretaria',
    icon: 'FileText',
    children: [
      { title: 'Dashboard', href: '/secretaria' },
      { title: 'Documentos', href: '/secretaria/documentos' },
      { title: 'Protocolo', href: '/secretaria/protocolo' },
      { title: 'Suprimentos', href: '/secretaria/suprimentos' },
      { title: 'Requisições', href: '/secretaria/requisicoes' },
    ],
  },
];
```

---

## 📋 RESUMO DA ESTRUTURA COMPLETA
```
src/
├── app/
│   ├── api/
│   │   ├── patrimonio/
│   │   │   ├── ativos/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── manutencao/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── concluir/route.ts
│   │   │   ├── gases/
│   │   │   │   ├── route.ts
│   │   │   │   └── alertas/route.ts
│   │   │   └── dashboard/route.ts
│   │   ├── casa-mortuaria/
│   │   │   ├── registros/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── guia-saida/route.ts
│   │   │   ├── camaras/route.ts
│   │   │   └── estatisticas/route.ts
│   │   ├── servicos-gerais/
│   │   │   ├── contratos/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── avaliar/route.ts
│   │   │   ├── residuos/route.ts
│   │   │   ├── cozinha/estoque/route.ts
│   │   │   └── funcionarios-terceirizados/route.ts
│   │   └── secretaria/
│   │       ├── documentos/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       ├── tramitar/route.ts
│   │       │       └── assinar/route.ts
│   │       ├── suprimentos/route.ts
│   │       └── requisicoes/
│   │           ├── route.ts
│   │           └── [id]/atender/route.ts
│   ├── patrimonio/page.tsx
│   ├── casa-mortuaria/page.tsx
│   ├── servicos-gerais/page.tsx
│   └── secretaria/page.tsx
├── hooks/
│   ├── usePatrimonio.ts
│   ├── useCasaMortuaria.ts
│   ├── useServicosGerais.ts
│   └── useSecretaria.ts
├── services/
│   └── pdf/
│       ├── relatorioManutencao.ts
│       ├── guiaSaidaCorpo.ts
│       └── manifestoResiduos.ts
├── types/
│   └── administrativo.ts
└── config/
    └── navigation.ts (atualizado)