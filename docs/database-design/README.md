# 🗄️ MadBoat v2.0 - Database Design System

## 🎯 **Metodologia: YAML-Driven Domain Design**

Baseado na metodologia profissional de Domain-Driven Design com YAML como fonte única da verdade, gerando automaticamente SQL otimizado para Supabase/Postgres.

## 📁 **Estrutura do Sistema**

```
MadBoat-v2/
├── domain/                    # 📋 YAML Domains (Source of Truth)
│   ├── authentication.yaml   # Autenticação e usuários
│   ├── personas.yaml         # Sistema de personas
│   ├── alma-methodology.yaml # Metodologia A.L.M.A.
│   ├── chat-system.yaml     # Chat efêmero + analytics
│   ├── gamification.yaml    # Achievements e progresso
│   └── analytics.yaml       # Sistema de analytics
├── prompts/
│   └── schema_generator.md   # 🤖 Contrato fixo para IA
├── db/
│   ├── migrations/           # 📦 Migrações incrementais
│   │   ├── V1__init.sql
│   │   ├── V2__personas.sql
│   │   └── V3__alma.sql
│   ├── schema.sql           # DDL consolidado atual
│   └── seed.sql             # Dados de teste
└── docs/
    ├── glossary.md          # Linguagem ubíqua MadBoat
    └── context-map.png      # Mapa de contextos
```

## 🔄 **Fluxo de Trabalho**

### **Para cada nova funcionalidade:**

1. **📝 Atualizar YAML** → Definir domínio, agregados, invariantes
2. **🤖 Gerar SQL** → Usar prompt contrato com IA 
3. **🧪 Testar Local** → Validar DDL + constraints
4. **🚀 Deploy Supabase** → Aplicar migração via CLI/Studio
5. **💾 Commit** → YAML + DDL + Migração (nunca SQL perdido)

## 🎯 **Bounded Contexts do MadBoat**

### **1. Authentication Context**
- **Aggregate**: User, UserProfile, Session
- **Invariantes**: Email único, senha forte, perfil completo
- **RLS**: Usuário só acessa próprios dados

### **2. Personas Context**
- **Aggregate**: PersonaAssessment, PersonaResult, PersonaEvolution
- **Invariantes**: Assessment completo antes do resultado, evolução baseada em comportamento
- **RLS**: Dados privados por usuário

### **3. ALMA Methodology Context**
- **Aggregate**: ALMAProgress, Phase, Achievement
- **Invariantes**: Fases sequenciais, progresso não regressivo, achievements únicos
- **RLS**: Progresso individual isolado

### **4. Chat System Context**
- **Aggregate**: ChatSession, Message, Insight
- **Invariantes**: Sessões efêmeras, mensagens ordenadas, insights derivados
- **RLS**: Sessões isoladas por usuário

### **5. Analytics Context**
- **Aggregate**: UserBehavior, SystemMetrics, BusinessInsights  
- **Invariantes**: Dados anonimizados, retenção limitada, agregação temporal
- **RLS**: Admin apenas, dados agregados

## 🛠️ **Templates Prontos**

### **YAML Template Base:**
```yaml
version: 1
bounded_context: [ContextName]
ubiquitous_language:
  - term1: definição clara
  - term2: definição clara

aggregates:
  - name: [AggregateName]
    table: [table_name]
    invariants:
      - "regra business clara"
      - "constraint SQL equivalente"
    fields:
      - { name: id, type: uuid, pk: true, default: gen_random_uuid() }
      - { name: user_id, type: uuid, not_null: true }
      - { name: created_at, type: timestamptz, default: now() }
      - { name: updated_at, type: timestamptz, default: now() }

events:
  - name: [EventName]
    producer: [Aggregate]
    payload: [field1, field2]

security_rls:
  - table: [table_name]
    enable_rls: true
    policies:
      - { name: "select_own", action: select, using: "user_id = auth.uid()" }
```

## 📋 **Checklist de Qualidade**

### **✅ Toda tabela deve ter:**
- [ ] UUID primary key com `gen_random_uuid()`
- [ ] `created_at` e `updated_at` com triggers
- [ ] RLS configurado para dados sensíveis
- [ ] Índices em colunas de busca/join
- [ ] CHECK constraints para invariantes
- [ ] Comentários explicando regras de negócio

### **✅ Entre contextos:**
- [ ] Apenas referências por ID (sem FK)
- [ ] Comunicação via eventos
- [ ] Agregação de dados quando necessário
- [ ] Outbox pattern para integrações

## 🚀 **Próximos Passos**

1. **Começar com Authentication Context** - Base de todo sistema
2. **Implementar Personas Context** - Core do MadBoat  
3. **Desenvolver ALMA Context** - Metodologia principal
4. **Integrar Chat Context** - Gênio da Âncora
5. **Finalizar Analytics Context** - Insights e métricas

---

**Filosofia**: *Nunca editar SQL diretamente. Sempre refletir mudanças no YAML primeiro. A IA compila nosso domínio, não inventa.*