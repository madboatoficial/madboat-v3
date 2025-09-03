# 🐙 KRAKEN CONTEXT PROTOCOL

## REGRA ABSOLUTA:
**SEMPRE salvar contexto no arquivo PRINCIPAL: `.kraken/context.yaml`**

## QUANDO SALVAR CONTEXTO:
1. Após completar features importantes
2. Quando Captain pedir
3. Ao final de cada sessão
4. Antes de mudanças grandes de contexto

## COMO SALVAR (SEMPRE FAZER):

### Método 1: Append Direto (PREFERIDO)
```bash
cat >> .kraken/context.yaml << 'EOF'
# Session content here
EOF
```

### Método 2: Usar o Script
```bash
.kraken/bin/save-context
```

### Método 3: Edit Tool
Use Edit para adicionar no final do arquivo `context.yaml`

## O QUE SALVAR:
```yaml
session_[DATE]_[DESCRIPTION]:
  date: "YYYY-MM-DD"
  time: "HH:MM"
  accomplishments:
    - Lista do que foi feito
  technical_changes:
    - Arquivos modificados
    - Features implementadas
  captain_decisions:
    - Decisões importantes
  next_priorities:
    - O que fazer depois
```

## NUNCA FAZER:
- ❌ Criar arquivos separados de contexto
- ❌ Esquecer de salvar após features importantes
- ❌ Sobrescrever o arquivo principal

## CHECKLIST DE FINAL DE SESSÃO:
- [ ] Salvar contexto no `context.yaml`
- [ ] Atualizar Mandarin Fish memory
- [ ] Criar backup se necessário
- [ ] Confirmar que será lido na próxima sessão

## COMANDO RÁPIDO:
```bash
# Para salvar rapidamente
echo "Session saved: $(date)" >> .kraken/context.yaml
```

---
LEMBRETE: Este protocolo deve ser seguido SEMPRE pelo Kraken!