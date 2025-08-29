# 🌊 MadBoat v2.0 - Universo dos 3 Mundos

## Estrutura Monorepo

```
madboat-ecosystem/
├── apps/
│   ├── web/          # Next.js 15 - Web Application
│   └── mobile/       # Expo - Mobile Application (futuro)
├── packages/
│   ├── core/         # Business Logic compartilhada
│   ├── ui/           # Componentes UI compartilhados
│   └── api/          # API clients (Supabase, etc.)
└── supabase/         # Database e backend
```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture Benefits

- ✅ **70% código compartilhado** entre web e mobile
- ✅ **Type safety** cross-platform
- ✅ **Single source of truth** para business logic
- ✅ **Desarrollo paralelo** web/mobile
- ✅ **Deploy independente** por aplicação

## Tech Stack

- **Framework**: Next.js 15 + React 19
- **TypeScript**: Full type safety
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Package Manager**: npm workspaces
- **Mobile**: Expo (React Native)

## Development

Cada package pode ser desenvolvido independentemente:

```bash
# Trabalhar no core
cd packages/core && npm run dev

# Trabalhar na UI  
cd packages/ui && npm run dev

# Trabalhar no web app
cd apps/web && npm run dev
```

## Next Steps

1. ✅ Monorepo configurado
2. 🔄 Tela de login
3. 🔄 Supabase integration
4. 🔄 Sistema de personas
5. 🔄 Mundo A.L.M.A.