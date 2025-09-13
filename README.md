# 🌊 MadBoat v3 - Digital Ocean Transformation Platform

## 🚢 Project Overview

MadBoat v3 is a comprehensive digital transformation platform featuring an AI-powered multi-agent system for personal and professional growth. Built with cutting-edge technology and an ocean-themed metaphor throughout.

## 🏗️ Architecture

```
madboat-v3/
├── apps/
│   └── web/                  # Next.js 15 - Main web application
├── packages/
│   ├── core/                 # Shared business logic
│   ├── ui/                   # Shared UI components
│   ├── api/                  # API clients (Supabase integration)
│   ├── persona/              # Persona identification system
│   └── rlvr/                 # RLVR framework
├── db/                       # Database schemas and migrations
├── .madboat/                 # Project management and ship logs
├── .claude/                  # Claude Code agent configurations
└── .cursorrules/            # Agent behavioral rules
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Type checking
npm run type-check
```

## 🐙 Agent System

MadBoat features an advanced multi-agent AI system:

- **Kraken** - Master orchestrator
- **Poseidon** - Database specialist
- **Mandarin Fish** - UI/UX expert
- **Ulisses** - Chronicle writer
- **Thaumoctopus** - Git master
- **Ostra** - Agent creator
- **Uncle McDuck** - Financial advisor
- **UNI** - Meta-orchestrator

Activate with: `release the kraken`

## 🛠️ Tech Stack

- **Framework**: Next.js 15 + React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Package Manager**: npm workspaces
- **Version Control**: Git with systematic branching

## 📊 Project Status

- **Sprint**: Day 3 of 30 (MVP)
- **Current Phase**: Foundation & Organization
- **Target Launch**: 30 days from start

## 🌟 Key Features

- Advanced persona identification system
- ALMA methodology implementation
- Credit-based AI generation system
- Real-time chat with 3 channels
- Horizontal timeline navigation
- Digital diary (Diário de Bordo)
- Admin dashboard for agent monitoring

## 📝 Development Guidelines

1. **Code Style**: Maintain TypeScript strict mode
2. **Components**: Follow React 19 best practices
3. **Testing**: Business logic focus (React 19 limitations)
4. **Documentation**: Update ship logs daily
5. **Version Control**: Commit with meaningful messages

## 🔗 Resources

- [Ship Logs](.madboat/ship-log/)
- [Agent Documentation](.claude/agents/)
- [Database Documentation](db/documentation/)
- [Claude Code Config](CLAUDE.md)

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