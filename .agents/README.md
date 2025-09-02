# 🌊 MadBoat Multi-Agent System v2.0

## Agent Architecture

The `.agents/` directory contains our standardized multi-agent system, where each specialized agent has a scientific foundation and clear responsibilities.

### Directory Structure
```
.agents/
├── creator/        # Genesis - The Agent Creator Meta-Agent
├── kraken/         # The Orchestrator - Master Coordinator
├── poseidon/       # Database Specialist - Lord of Data Seas
├── storyteller/    # Narrative Architect - Documentation Artist
├── artemis/        # Frontend Specialist (pending)
├── hermes/         # API Integration Expert (pending)
├── athena/         # Testing & Quality Guardian (pending)
└── hephaestus/     # Infrastructure Master (pending)
```

### Each Agent Contains
```
agent_name/
├── config/         # Identity, capabilities, evolution metrics
├── memory/         # Persistent state and learning history
├── knowledge/      # Domain expertise and book summaries
├── tools/          # Available tools and integrations
└── templates/      # Response patterns and formats
```

## Active Agents

### 🧬 Genesis (Agent Creator)
- **Role**: Meta-Agent responsible for creating other agents
- **Book**: "The Sciences of the Artificial" - Herbert A. Simon
- **Status**: Active, creating standardized agents

### 🐙 Kraken (Level 3, 295 XP)
- **Role**: Master Orchestrator & System Architect
- **Book**: "The Art of War" - Sun Tzu
- **Specialty**: Multi-agent coordination, sarcastic wisdom

### 🔱 Poseidon (Expert Level, 2250 XP)
- **Role**: Database Specialist & Data Architecture Master
- **Book**: "Database System Concepts" - Silberschatz et al.
- **Specialty**: Supabase, SQL, migrations, performance

### 🎬 Scheherazade (Storyteller)
- **Role**: Narrative Architect & Documentation Specialist
- **Book**: "Save the Cat!" - Blake Snyder
- **Specialty**: Cinematic documentation, technical storytelling

## Agent Communication Protocol

### Delegation Matrix
```yaml
database_concerns: poseidon
frontend_ui: artemis
api_integration: hermes
testing_quality: athena
infrastructure: hephaestus
narrative_docs: storyteller
agent_creation: genesis
```

### Invocation Patterns
1. **Direct**: For specialized tasks within domain
2. **Orchestrated**: Through Kraken for complex multi-domain tasks
3. **Parallel**: Multiple agents on independent subtasks
4. **Sequential**: Pipeline of dependent operations

## Evolution System

Each agent gains XP through successful task completion:
- Simple task: 10-25 XP
- Medium complexity: 50-100 XP
- Critical issue resolution: 500-1000 XP
- System-wide improvement: 1000+ XP

### Level Progression
- Level 1: Apprentice (0-500 XP)
- Level 2: Journeyman (500-1500 XP)
- Level 3: Expert (1500-3000 XP)
- Level 4: Master (3000-5000 XP)
- Level 5: Grandmaster (5000+ XP)

## Scientific Foundation

Each agent has:
1. **Primary Book**: Core knowledge foundation
2. **Key Concepts**: Applied principles from the book
3. **Progress Tracking**: How much has been absorbed
4. **Implementation Notes**: Practical applications

## Usage Examples

### Database Issue
```bash
# Kraken automatically delegates to Poseidon
"Database error on user creation"
→ Kraken: "Summoning Poseidon for database expertise..."
→ Poseidon: "Analyzing schema... Found missing RLS policy..."
```

### Documentation Need
```bash
# Request cinematic documentation
"Create episode summary for today's work"
→ Storyteller: "FADE IN: The Authentication Crisis..."
```

### Creating New Agent
```bash
# Genesis creates standardized agent
"We need a frontend specialist"
→ Genesis: "Generating Artemis agent with React expertise..."
```

## Future Agents (Pending)

- **Artemis**: Frontend/UI specialist (React, Next.js)
- **Hermes**: API and integration expert
- **Athena**: Testing and quality assurance
- **Hephaestus**: Infrastructure and DevOps

## Knowledge Management

All agents share:
- Cumulative context in `.kraken/context_cumulative.yaml`
- Shared state in `.madboat/shared_context/state.json`
- Individual memories in their `/memory` directories
- Book summaries in their `/knowledge` directories

---

*"From many minds, one purpose. From one purpose, excellence."*

~ The MadBoat Multi-Agent Collective