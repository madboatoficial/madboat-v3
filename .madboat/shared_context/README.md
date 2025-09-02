# 🌊 MADBOAT SHARED CONTEXT SYSTEM

## 📋 O QUE É ISSO?

Este é o **cérebro compartilhado** do sistema multi-agente MadBoat. Todos os agentes leem e escrevem aqui, criando uma memória coletiva que evolui em tempo real.

## 🧠 COMO FUNCIONA

### Para Agentes:
1. **Ao acordar**: Lê o contexto atual
2. **Durante trabalho**: Consulta conhecimento
3. **Ao completar**: Atualiza com aprendizados
4. **Ao colaborar**: Deixa mensagens para outros

### Para Humanos:
- **Visualize** o que agentes estão fazendo
- **Entenda** decisões tomadas
- **Rastreie** evolução do conhecimento
- **Debugue** problemas de coordenação

## 📁 ESTRUTURA

```
shared_context/
├── state.json          # Estado atual do sistema
├── tasks.json          # Tarefas em andamento
├── agents.json         # Status de cada agente
├── knowledge/          # Base de conhecimento
│   ├── patterns/       # Padrões descobertos
│   ├── solutions/      # Soluções para problemas
│   └── decisions/      # Decisões arquiteturais
├── messages/           # Comunicação inter-agentes
└── metrics/           # Performance e estatísticas
```

## 🔄 PROTOCOLO DE ATUALIZAÇÃO

### Leitura (READ)
```json
// Qualquer agente pode ler
{
  "action": "read",
  "path": "shared_context/state.json",
  "agent": "poseidon"
}
```

### Escrita (WRITE)
```json
// Agente escreve após completar
{
  "action": "write",
  "path": "shared_context/knowledge/patterns/",
  "agent": "artemis",
  "data": {
    "pattern": "novo_pattern_ui",
    "description": "..."
  }
}
```

### Broadcast (NOTIFY)
```json
// Notifica todos os agentes
{
  "action": "broadcast",
  "agent": "kraken",
  "message": "Schema database atualizado"
}
```

## 🚀 EXEMPLO PRÁTICO

### Cenário: Criar Login Page

1. **Kraken** recebe comando
2. **Kraken** escreve em `tasks.json`:
```json
{
  "task_id": "001",
  "description": "Create login page",
  "subtasks": [
    {"agent": "artemis", "task": "UI design"},
    {"agent": "poseidon", "task": "Auth tables"},
    {"agent": "hermes", "task": "API endpoints"}
  ]
}
```

3. **Agentes** leem suas tarefas e trabalham
4. **Poseidon** completa e atualiza:
```json
{
  "task_id": "001",
  "subtask": "Auth tables",
  "status": "completed",
  "output": {
    "tables": ["users", "sessions"],
    "schema_file": "schema.sql"
  }
}
```

5. **Hermes** vê update e usa schema para criar APIs
6. **Artemis** usa APIs para conectar UI
7. **Kraken** consolida e reporta

## 📊 MÉTRICAS

- **Tarefas/dia**: 0 (iniciando)
- **Conhecimento acumulado**: 0 patterns
- **Colaborações**: 0
- **Tempo médio de task**: N/A

## 🔐 SEGURANÇA

- Nunca commitar tokens/secrets aqui
- Dados sensíveis em `.env` apenas
- Logs sanitizados
- Acesso controlado por agente

## 🎯 BENEFÍCIOS

1. **Sem repetição**: Agente aprende uma vez, todos sabem
2. **Evolução contínua**: Fica mais inteligente a cada dia
3. **Debugging fácil**: Tudo rastreável
4. **Colaboração natural**: Agentes se ajudam

---

*"Um cérebro, múltiplos tentáculos, infinitas possibilidades!"*

~ Sistema Multi-Agente MadBoat 🌊