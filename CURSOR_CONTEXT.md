# 🎯 CURSOR_CONTEXT.md - Template para Novo Projeto

## 📋 **Cole isso quando abrir projeto no Cursor:**

```
Estou iniciando o desenvolvimento do MadBoat System v2.0.

CONTEXTO TÉCNICO:
- Next.js 15 + React 19 + TypeScript
- Tailwind v4 + Radix UI + Framer Motion
- Metodologia YAML-driven para database
- Primeira implementação: Tela de login premium

ARQUIVOS DE REFERÊNCIA:
- Leia: PROJETO_PLANEJAMENTO.yaml (planejamento completo)
- Leia: USERFLOW.md (jornada do usuário)
- Leia: domain/authentication.yaml (contexto auth)
- Leia: docs/glossary.md (linguagem ubíqua)
- Use: prompts/schema_generator.md (para gerar SQL)

PRIMEIRA TAREFA:
Implementar tela de login premium em src/app/(auth)/login/page.tsx com:
- Design glassmorphism (azul/roxo + dourado)
- Validação Zod robusta
- Animações Framer Motion
- Estados loading/erro/sucesso
- Integração Supabase Auth
- Mobile-first design

METODOLOGIA DATABASE:
1. Implementar funcionalidade
2. Documentar regras no YAML
3. Gerar SQL via IA com contrato
4. Aplicar no Supabase
5. Commit: código + YAML + SQL

DOMÍNIOS MADBOAT:
- Tripulante (usuário), Âncora Interior (valores), DNA Criativo (resultado fase 1)
- A.L.M.A.: Autenticidade → Legado → Mapeamento → Aplicação
- Personas: Analítico, Criativo, Emotivo, Pragmático, Inseguro
- Chat efêmero + analytics JSONl éticos

Começar implementação da tela de login seguindo especificações do planejamento.
```

## 🚀 **Comandos Setup (Resumido)**

```bash
# 1. Base
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. UI Complete
npm install @radix-ui/themes @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tooltip @radix-ui/react-avatar tailwind-merge class-variance-authority clsx lucide-react

# 3. Logic & State  
npm install zustand @tanstack/react-query zod react-hook-form @hookform/resolvers

# 4. Animations
npm install framer-motion gsap

# 5. Backend
npm install @supabase/supabase-js ai @vercel/analytics
```