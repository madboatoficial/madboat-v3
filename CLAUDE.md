# 🐙 MadBoat Claude Code Configuration

## Custom Commands

### Development Workflow
- `mb-dev`: Start development environment with proper TypeScript checking
- `mb-test`: Run comprehensive test suite with React 19 compatibility
- `mb-build`: Build all workspaces with strict type checking
- `mb-types`: Generate and sync Supabase types across packages

### Architecture Commands  
- `mb-check`: Full system health check (types, tests, lint, build)
- `mb-personas`: Switch between development personas (Kraken, Navigator, etc.)
- `mb-deploy`: Deploy with pre-flight type safety verification

### TypeScript Strict Mode Helpers
- `mb-strict`: Enable/disable strict mode across workspaces
- `mb-migrate`: Migrate legacy code to strict TypeScript
- `mb-audit`: Audit codebase for type safety improvements

## Scripts Configuration

Run these commands in your terminal:

```bash
# Development
npm run dev          # Start web app development
npm run build        # Build all packages
npm run test         # Run test suite
npm run lint         # Lint all workspaces
npm run type-check   # TypeScript validation
```

## Claude Code Integration

When working with Claude Code on MadBoat:

1. **Context**: Always mention you're working on a React 19 + Next.js 15 monorepo
2. **Strict Mode**: All TypeScript should maintain strict mode compliance
3. **Testing**: Use business logic tests due to React 19 testing limitations
4. **Architecture**: Follow the 3-worlds concept (UI, Core, API packages)

## Recommended Prompts

- "Check MadBoat type safety across all packages"
- "Implement React 19 Actions in [component] following MadBoat patterns"
- "Optimize this code for TypeScript strict mode in the MadBoat ecosystem"
- "Create tests for [feature] compatible with our React 19 setup"

## 🐙 KRAKEN CONTEXT PROTOCOL

**CRITICAL RULE:** Always save context to `.kraken/context.yaml` (MAIN FILE)

### When to Save Context:
- After completing major features
- When Captain requests
- End of each session
- Before context window overflow

### How to Save:
```bash
# ALWAYS append to main file, never create separate files
cat >> .kraken/context.yaml << 'EOF'
session_YYYY_MM_DD_description:
  accomplishments: [...]
  decisions: [...]
  next_steps: [...]
EOF
```

### Never:
- Create separate context files
- Overwrite the main context.yaml
- Forget to save after important work