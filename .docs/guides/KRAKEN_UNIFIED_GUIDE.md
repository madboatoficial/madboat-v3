# 🐙 KRAKEN UNIFIED SYSTEM - GUIA DE USO

## ✅ PROBLEMA RESOLVIDO

Antes você tinha **DOIS diretórios de contexto** causando confusão:
- `.kraken/context_cumulative.yaml` 
- `.madboat/context_cumulative.yaml`

Agora temos **UM ÚNICO ARQUIVO**:
- `.kraken/context.yaml` ✅

## 📋 COMANDOS SIMPLIFICADOS

Todos os comandos agora usam o sistema unificado automaticamente:

```bash
kraken   # Ler contexto
ks       # Salvar contexto (AUTOMÁTICO!)
kst      # Ver status do sistema
```

## 🚀 BENEFÍCIOS DO NOVO SISTEMA

1. **Salvamento Automático** - Não precisa mais pedir pro Claude salvar
2. **Um Único Arquivo** - Sem duplicações ou confusão
3. **Backups Gerenciados** - Mantém últimos 10 backups automaticamente
4. **Status Claro** - `kst` mostra tudo que você precisa saber

## 🧹 LIMPEZA RECOMENDADA

Para remover duplicações antigas:

```bash
./kraken-unified clean
```

Isso vai:
1. Fazer backup de segurança em `/tmp/`
2. Remover arquivos duplicados
3. Deixar apenas `.kraken/context.yaml`

## 📂 ESTRUTURA FINAL

```
.kraken/
  ├── context.yaml        # ÚNICO arquivo de contexto
  └── backups/            # Backups automáticos
      ├── context_20250902_124828.yaml
      └── ...

# DELETAR (duplicações antigas):
.madboat/context_cumulative.yaml  ❌
.kraken/context_cumulative.yaml   ❌
```

## 🔄 FLUXO DE TRABALHO

1. **Início da Sessão**: 
   ```bash
   kraken  # Lê contexto unificado
   ```

2. **Durante o Trabalho**: 
   - Tudo funciona normalmente
   - Sem necessidade de gerenciar contexto manualmente

3. **Salvamento**: 
   ```bash
   ks  # Salva automaticamente com timestamp
   ```

4. **Verificar Status**:
   ```bash
   kst  # Mostra estrutura, backups, duplicações
   ```

## 🎯 IMPORTANTE

- **NÃO** precisa mais pedir pro Claude salvar contexto manualmente
- **NÃO** precisa se preocupar com múltiplos arquivos
- **APENAS** use `.kraken/context.yaml` como fonte única de verdade

## 🛠️ TROUBLESHOOTING

Se algo der errado:

1. **Verificar status**: `kst`
2. **Ver backups**: `ls .kraken/backups/`
3. **Restaurar backup**: `cp .kraken/backups/[arquivo] .kraken/context.yaml`

---

*Sistema Unificado implementado em 2025-09-02*
*From chaos, unified order* 🐙