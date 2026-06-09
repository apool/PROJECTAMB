# 🍔 American Burguer — Site Oficial

Site com cardápio digital, carrinho e integração WhatsApp para a **American Burguer** de Coronel Vivida — PR.

## Stack

- **Next.js 15** App Router + Server Components
- **TypeScript** strict
- **Tailwind CSS** + tema dark customizado
- **shadcn/ui** (base de componentes)
- **Supabase** (Auth + PostgreSQL + Storage)
- **Prisma** (ORM + migrations)
- **React Hook Form** + **Zod** (validação)
- **WhatsApp** (integração de pedidos via wa.me)

## Funcionalidades

- 🏠 **Home** com hero, destaques e seção "sobre"
- 🍔 **Cardápio** com filtro por categoria, cards com foto e botão de adicionar ao carrinho
- 🛒 **Carrinho** lateral com controle de quantidade
- 💬 **Pedido via WhatsApp** — carrinho montado é enviado como mensagem formatada
- 🔐 **Painel Admin** protegido por Supabase Auth
- ✏️ **CRUD completo** do cardápio (criar, editar, ativar/desativar, excluir)
- 📱 **Responsivo** mobile-first
- ⚡ **ISR** — cardápio atualiza automaticamente a cada 60s

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
# Preencha com suas credenciais do Supabase
```

### 3. Criar banco de dados

Copie o conteúdo de `supabase/migrations/001_initial.sql` e execute no **SQL Editor** do Supabase Dashboard.
Isso cria as tabelas, políticas RLS e dados iniciais de exemplo.

### 4. Gerar cliente Prisma

```bash
npm run db:generate
```

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse em `http://localhost:3000`

## Painel Admin

URL: `http://localhost:3000/admin`

Para criar um usuário admin, vá ao **Supabase Dashboard → Authentication → Users → Add user**.

## Deploy (Vercel)

```bash
vercel deploy
```

Não esqueça de adicionar as variáveis de ambiente no painel da Vercel.

## Estrutura

```
src/
├── app/
│   ├── (site)/          # Site público
│   │   ├── page.tsx     # Home
│   │   └── cardapio/    # Cardápio completo
│   ├── admin/           # Painel admin (protegido)
│   └── api/             # Route handlers
├── components/
│   ├── menu/            # Cards, grid, carrinho, filtros
│   ├── admin/           # Tabela e formulário do admin
│   └── shared/          # Header, Footer, WhatsApp FAB, CartContext
├── actions/             # Server Actions (CRUD)
├── lib/supabase/        # Clientes client/server
├── hooks/               # useCart
├── types/               # Tipos TypeScript
└── validators/          # Schemas Zod
```
