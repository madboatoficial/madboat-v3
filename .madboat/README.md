# 🌊 MadBoat Unified Agent System

## Directory Structure

```
.madboat/
├── agents/           # Individual agent configurations
├── rlvr/            # RLVR Framework (AI Learning System)
├── shared/          # Shared knowledge between agents
├── bin/             # Executable scripts
├── archive/         # Historical context
└── docs/            # Documentation
```

## Quick Start

### Activate Kraken (Master Orchestrator)
```bash
# In Claude Code/Cursor:
"Activate Kraken orchestrator for MadBoat"

# In terminal:
.madboat/bin/agent kraken
```

### Activate Specific Agent
```bash
.madboat/bin/agent [agent-name]
# Example: .madboat/bin/agent poseidon
```

### Check Agent Status
```bash
cat .madboat/shared/status/agents.json
```

## Available Agents

1. **Kraken** - Master Orchestrator (TypeScript, Architecture)
2. **Poseidon** - Database Specialist (SQL, Supabase)
3. **Artemis** - Frontend Specialist (React, UI/UX)
4. **Hermes** - API Specialist (REST, GraphQL)
5. **Athena** - Testing Specialist (Unit, E2E)
6. **Hephaestus** - DevOps Specialist (Docker, CI/CD)
7. **Mandarin Fish** - UI Artist (Animations, Visual Design)
8. **Uncle McDuck** - Financial Advisor (Business Strategy)
9. **Ulisses** - Chronicle Writer (Documentation)
10. **Thaumoctopus** - Git Master (Version Control)
11. **Ostra** - Pearl Maker (Agent Creator)
12. **UNI** - Meta-Orchestrator (System Coherence)

## RLVR Framework

The system includes RLVR (Reinforcement Learning from Verifiable Rewards):
- Auto-learning from patterns
- Code verification before commits
- XP and evolution system
- Pattern recognition

## Shared Consciousness Protocol

All agents follow these rules:
1. Read `.madboat/shared/status/agents.json` on wake
2. Read `.madboat/shared/knowledge/recent.yaml` for context
3. Update status after completing tasks
4. Broadcast discoveries to shared knowledge

## Migration Notes

This unified structure replaces:
- `.agents/` → Merged into `.madboat/`
- `.kraken/` → Merged into `.madboat/agents/kraken/`
- Multiple agent locations → Single `.madboat/agents/`

## Support

Captain: Sandro Fidelis
System: MadBoat v2.0
Framework: RLVR 1.0.0