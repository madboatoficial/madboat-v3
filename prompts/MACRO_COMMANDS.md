# 🚀 MadBoat v2.0 - Macro Commands para Desenvolvimento Rápido

## 🎯 **Comandos Padronizados para Claude**

### **📝 MACRO 1: Criar Novo Contexto YAML**
```
COMANDO: /create-domain

Crie um novo contexto YAML para o domínio [NOME_DOMINIO] seguindo:

1. Use template base de domain/authentication.yaml
2. Adapte para bounded_context: [NOME_DOMINIO] 
3. Defina aggregates principais baseado nas funcionalidades
4. Inclua invariants específicas do domínio
5. Configure security_rls apropriado
6. Adicione eventos relevantes
7. Use linguagem ubíqua de docs/glossary.md

Saída: Arquivo domain/[nome-dominio].yaml pronto
```

### **📊 MACRO 2: Gerar SQL do YAML**
```
COMANDO: /generate-sql

Use o contrato prompts/schema_generator.md para gerar SQL do arquivo domain/[contexto].yaml:

1. Leia o YAML especificado
2. Aplique o contrato de schema_generator.md
3. Gere DDL completo com RLS
4. Crie migração incremental V[N]__[desc].sql
5. Inclua comentários de business rules
6. Valide constraints e índices

Saída: Arquivo db/migrations/V[N]__[desc].sql pronto para Supabase
```

### **🔄 MACRO 3: Atualizar Contexto Existente**
```
COMANDO: /update-domain

Durante implementação de [FUNCIONALIDADE], encontrei novas regras:

REGRAS_DESCOBERTAS:
- [Regra 1]: [Descrição]
- [Regra 2]: [Descrição]
- [Regra 3]: [Descrição]

Atualize domain/[contexto].yaml para refletir essas regras:
1. Adicione invariants se necessário
2. Inclua novos fields se aplicável  
3. Atualize events conforme descobertas
4. Mantenha backward compatibility
5. Documente mudanças em comments

Saída: YAML atualizado + explicação das mudanças
```

### **🧪 MACRO 4: Validar Consistência**
```
COMANDO: /validate-domain

Valide consistência entre:

1. Código implementado em src/
2. Regras em domain/[contexto].yaml
3. SQL em db/migrations/
4. User flow em USERFLOW.md

Identifique:
- Inconsistências entre código e YAML
- Regras de negócio não documentadas
- Campos de banco não utilizados
- Fluxos não mapeados

Saída: Relatório de inconsistências + sugestões de correção
```

### **📈 MACRO 5: Análise de Impacto**
```
COMANDO: /impact-analysis

Analise impacto da mudança [DESCRICAO_MUDANCA]:

1. Quais contextos serão afetados
2. Que migrações serão necessárias  
3. Qual código precisa ser atualizado
4. Que testes devem ser criados/atualizados
5. Como afeta user flow existente

Saída: Plano de implementação step-by-step
```

## 🎯 **Como Usar os Macros**

### **Exemplo Prático:**
```
/create-domain personas

-> Claude criará domain/personas.yaml completo baseado no template
```

```
/generate-sql personas

-> Claude gerará db/migrations/V2__personas.sql usando o contrato
```

```
/update-domain authentication
REGRAS_DESCOBERTAS:
- Usuário deve ter profile completo antes de acessar personas
- Timezone deve ser validado contra lista oficial
- Avatar deve ter limite de tamanho

-> Claude atualizará authentication.yaml com essas regras
```

## 🚀 **Vantagens dos Macros**

### **✅ Benefícios:**
- **Padronização**: Sempre mesmo formato e qualidade
- **Velocidade**: Comandos rápidos e determinísticos  
- **Flexibilidade**: Ajustáveis para casos específicos
- **Manutenibilidade**: Fácil de atualizar templates
- **Zero Dependência**: Usa Claude padrão, não código custom

### **🎯 Comparação:**

| Aspecto | Agente Custom | Macro Commands |
|---------|---------------|----------------|
| **Setup** | Complexo | Simples |
| **Manutenção** | Alta | Baixa |
| **Flexibilidade** | Baixa | Alta |
| **Evolução** | Manual | Automática |
| **Padronização** | ✅ | ✅ |
| **Velocidade** | ✅ | ✅ |

## 📋 **Resultado**

**Os Macro Commands oferecem todos os benefícios de um agente customizado sem nenhuma das desvantagens!**

---

*Use estes comandos durante desenvolvimento para manter consistência e velocidade*