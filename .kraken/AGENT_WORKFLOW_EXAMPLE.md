# 🎯 WORKFLOW REAL: LOGIN PAGE + DATABASE

## CENÁRIO: Criar Sistema de Login Completo

### 🐙 PASSO 1: KRAKEN RECEBE COMANDO
```
User: "Crie a página de login com autenticação Supabase"
```

**Kraken Analisa e Decompõe:**
```yaml
# .madboat/shared_context/tasks.json
{
  "task_id": "LOGIN_001",
  "timestamp": "2025-08-31T23:50:00Z",
  "main_task": "Sistema de Login Completo",
  "subtasks": [
    {
      "id": "LOGIN_001_A",
      "agent": "kraken",
      "task": "Design UI do Login",
      "status": "in_progress",
      "dependencies": []
    },
    {
      "id": "LOGIN_001_B", 
      "agent": "poseidon",
      "task": "Setup Auth Tables + RLS",
      "status": "pending",
      "dependencies": []
    }
  ]
}
```

### 🎨 PASSO 2: KRAKEN CRIA UI
```typescript
// Kraken desenvolve o componente
// apps/web/src/components/LoginForm.tsx

export const LoginForm = () => {
  // Implementação...
}
```

**Kraken Atualiza Contexto:**
```yaml
# .madboat/shared_context/knowledge/ui_patterns/login.yaml
pattern: "Login Form MadBoat"
created_by: "kraken"
timestamp: "2025-08-31T23:55:00Z"
details:
  fields: ["email", "password"]
  validation: 
    email: "regex + required"
    password: "min 8 chars"
  features:
    - "Remember me checkbox"
    - "Forgot password link"
    - "Social login buttons"
  design_tokens:
    primary_color: "#0066CC"
    border_radius: "8px"
    mobile_first: true
learned:
  - "Input com floating labels melhora UX"
  - "Show/hide password essencial"
  - "Loading state em botão previne double submit"
```

### ⚓ PASSO 3: KRAKEN INVOCA POSEIDON

```json
// .madboat/shared_context/messages/kraken_to_poseidon.json
{
  "message_id": "MSG_001",
  "from": "kraken",
  "to": "poseidon",
  "timestamp": "2025-08-31T23:56:00Z",
  "type": "task_delegation",
  "priority": "high",
  "content": {
    "task": "Setup authentication database",
    "context": {
      "ui_ready": true,
      "fields_needed": ["email", "password", "remember_me"],
      "additional_fields": ["last_login", "login_count", "failed_attempts"],
      "requirements": [
        "Email único por usuário",
        "Password hash com bcrypt",
        "Session management",
        "Rate limiting para tentativas"
      ]
    },
    "reference_knowledge": "/knowledge/ui_patterns/login.yaml"
  }
}
```

### 🔱 PASSO 4: POSEIDON ACORDA

**Poseidon Lê Todo Contexto:**
```bash
# Poseidon ao acordar executa:
1. READ .madboat/shared_context/state.json         # Estado geral
2. READ .madboat/shared_context/tasks.json         # Suas tarefas
3. READ .madboat/shared_context/knowledge/*        # Todo conhecimento
4. READ .kraken/knowledge/rules/business_rules.yaml # Regras de negócio
5. READ message from kraken                        # Instruções específicas
```

**Poseidon Entende:**
- Sistema: MadBoat v2, Dev environment
- Arquitetura: Monorepo, Next.js 15, Supabase
- Regras: Senha min 8 chars, email verificado obrigatório
- Contexto: Login form já criado, precisa backend
- Histórico: Primeira vez criando auth (sem patterns prévios)

### 🛠️ PASSO 5: POSEIDON EXECUTA

```sql
-- Poseidon cria schema otimizado
-- Baseado em seu conhecimento profundo + contexto

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE auth_provider AS ENUM ('email', 'google', 'github', 'apple');

-- Main users table (extending Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  
  -- Login tracking (requisito do Kraken)
  last_login TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  
  -- Personas system (conhecimento das business rules)
  persona VARCHAR(20) CHECK (persona IN ('alma', 'vortice', 'odisseia')),
  persona_changed_at TIMESTAMPTZ,
  
  -- Gamification (conhecimento prévio)
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  achievements JSONB DEFAULT '[]'::jsonb,
  
  -- Audit fields (padrão Poseidon)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- soft delete pattern
);

-- Create indexes (conhecimento de otimização)
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_persona ON public.user_profiles(persona);
CREATE INDEX idx_user_profiles_deleted_at ON public.user_profiles(deleted_at) 
  WHERE deleted_at IS NULL; -- Partial index para queries de ativos

-- RLS Policies (segurança by default)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.user_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.user_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Session management table
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  remember_me BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW()
);

-- Rate limiting table (proteção contra brute force)
CREATE TABLE public.login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  ip_address INET NOT NULL,
  success BOOLEAN NOT NULL,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function para check rate limit
CREATE OR REPLACE FUNCTION check_login_rate_limit(
  p_email VARCHAR(255),
  p_ip INET
) RETURNS BOOLEAN AS $$
DECLARE
  recent_failures INTEGER;
BEGIN
  SELECT COUNT(*) INTO recent_failures
  FROM login_attempts
  WHERE email = p_email
    AND ip_address = p_ip
    AND success = FALSE
    AND attempted_at > NOW() - INTERVAL '15 minutes';
  
  RETURN recent_failures < 5; -- Max 5 tentativas em 15 min
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 📚 PASSO 6: POSEIDON APRENDE E DOCUMENTA

**Poseidon Atualiza Conhecimento Global:**
```yaml
# .madboat/shared_context/knowledge/database/auth_pattern.yaml
pattern: "MadBoat Authentication Schema"
created_by: "poseidon"
timestamp: "2025-09-01T00:10:00Z"
version: "1.0.0"

schema_decisions:
  - decision: "Separate user_profiles from auth.users"
    reasoning: "Flexibility to add custom fields without touching Supabase core"
    impact: "HIGH"
    
  - decision: "Soft delete pattern"
    reasoning: "Never lose user data, compliance with data retention"
    impact: "MEDIUM"
    
  - decision: "Rate limiting at database level"
    reasoning: "Defense in depth, works even if app layer fails"
    impact: "HIGH"

optimizations_applied:
  - "Partial index on deleted_at for active users queries"
  - "Composite index on email + deleted_at for unique active emails"
  - "INET type for IP addresses (more efficient than VARCHAR)"

learned_patterns:
  - pattern: "Session management separate from auth"
    why: "Allows multiple sessions per user"
    reusable: true
    
  - pattern: "login_attempts table for rate limiting"
    why: "Database-level brute force protection"
    reusable: true
    
  - pattern: "token_hash instead of token"
    why: "Never store tokens in plain text"
    reusable: true

performance_notes:
  - "Index on email crucial for login queries"
  - "Partial indexes reduce index size by 40%"
  - "JSONB for achievements allows flexibility"

security_implemented:
  - "RLS enabled on all tables"
  - "Rate limiting function"
  - "Token hashing"
  - "Soft delete for audit trail"

supabase_specific:
  - "Extends auth.users with user_profiles"
  - "Uses Supabase RLS for authorization"
  - "Compatible with Supabase Auth flows"

next_suggestions:
  - "Add 2FA support table"
  - "Add OAuth providers table"
  - "Add audit log table"
  - "Consider partitioning login_attempts by date"
```

**Poseidon Atualiza Seu Conhecimento Pessoal:**
```yaml
# .madboat/agents/poseidon/memory/patterns.yaml
personal_patterns:
  - id: "POS_001"
    pattern: "Rate limit at DB level"
    context: "MadBoat login system"
    performance: "5ms overhead acceptable"
    reuse_score: 10/10
    
  - id: "POS_002"  
    pattern: "Partial indexes for soft delete"
    learned: "40% index size reduction"
    applies_to: "Any soft delete scenario"
    
experience_gained:
  task: "MadBoat Auth Schema"
  complexity: 8/10
  time_taken: "15 minutes"
  new_patterns: 3
  issues_encountered:
    - issue: "Supabase auth.users is not extensible"
      solution: "Create parallel user_profiles table"
      
xp_earned: 50
total_xp: 50
level: 1
```

### 🔄 PASSO 7: SINCRONIZAÇÃO

**Poseidon Notifica Conclusão:**
```json
# .madboat/shared_context/messages/poseidon_to_kraken.json
{
  "message_id": "MSG_002",
  "from": "poseidon",
  "to": "kraken",
  "timestamp": "2025-09-01T00:15:00Z",
  "type": "task_complete",
  "content": {
    "task_id": "LOGIN_001_B",
    "status": "completed",
    "deliverables": {
      "tables_created": ["user_profiles", "user_sessions", "login_attempts"],
      "functions_created": ["check_login_rate_limit", "update_updated_at"],
      "policies_created": 2,
      "indexes_created": 3,
      "migration_file": "migrations/001_auth.sql"
    },
    "learned": {
      "new_patterns": 3,
      "optimizations": 2,
      "reusable_components": 5
    },
    "api_contract": {
      "login": "POST /api/auth/login",
      "logout": "POST /api/auth/logout", 
      "refresh": "POST /api/auth/refresh",
      "profile": "GET /api/users/profile"
    },
    "next_steps": [
      "Hermes can now create API endpoints",
      "Artemis can connect UI to APIs",
      "Athena can write auth tests"
    ]
  }
}
```

### 🎯 PASSO 8: KRAKEN CONSOLIDA

**Kraken Lê Tudo e Responde ao Usuário:**
```markdown
## ✅ Sistema de Login Completo!

### UI Criada:
- LoginForm component com validação
- Responsive e acessível
- Dark mode ready

### Database Configurado:
- 3 tabelas criadas (user_profiles, sessions, login_attempts)
- RLS policies ativas
- Rate limiting implementado
- Otimizado com indexes

### Aprendizado do Sistema:
- 3 novos patterns de auth documentados
- Schema reutilizável para futuros projetos
- Performance baseline estabelecida

### Próximos Passos:
1. Conectar UI com Supabase Auth
2. Implementar API endpoints
3. Adicionar testes

Tempo total: 25 minutos (Kraken: 10min, Poseidon: 15min)
```

## 🧠 O QUE TORNA ISSO INTELIGENTE?

### 1. CONTEXTO COMPARTILHADO PERSISTENTE
```yaml
Todo conhecimento fica em:
  - .madboat/shared_context/  # Runtime
  - .kraken/knowledge/         # Permanente
  - .madboat/agents/*/memory/  # Por agente
```

### 2. APRENDIZADO CONTÍNUO
- Cada task gera patterns
- Patterns viram templates
- Templates aceleram próximas tasks
- Sistema fica mais inteligente

### 3. ESPECIALIZAÇÃO PROFUNDA
- Poseidon SEMPRE será melhor em DB
- Artemis SEMPRE será melhor em UI
- Mas todos compartilham contexto base

### 4. EVOLUÇÃO NATURAL
```
Primeira vez: 25 minutos
Segunda vez: 15 minutos (usa patterns)
Décima vez: 5 minutos (tudo automatizado)
```

## 🚀 IMPLEMENTAÇÃO PRÁTICA

### Para Funcionar no Cursor:

1. **Estrutura de Pastas:**
```
.cursorrules/
  agents/
    kraken.md      # Orquestrador
    poseidon.md    # DB Expert
    
.madboat/
  shared_context/  # Cérebro compartilhado
    state.json
    tasks.json
    knowledge/
    messages/
    
  agents/
    poseidon/
      memory/      # Memória pessoal
```

2. **Invocar Agentes:**
```bash
/agent kraken "crie login"
# Kraken trabalha e chama:
/agent poseidon "setup auth database"
```

3. **Auto-Aprendizado:**
- Cada agente lê contexto ao acordar
- Executa task
- Atualiza conhecimento
- Notifica outros

## 🎯 RESULTADO FINAL

Com esse sistema:
- **Desenvolvimento 3x mais rápido**
- **Qualidade consistente**
- **Conhecimento acumulativo**
- **Especialização mantida**
- **Contexto sempre sincronizado**

*"É como ter uma equipe de experts que nunca esquece nada e fica mais inteligente a cada dia!"*