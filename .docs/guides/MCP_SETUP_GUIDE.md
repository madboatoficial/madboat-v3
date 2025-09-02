# 🐙 GUIA DE CONFIGURAÇÃO MCP SUPABASE - MADBOAT

## 📋 CHECKLIST DE INSTALAÇÃO

### PASSO 1: CRIAR TOKEN DE ACESSO NO SUPABASE

1. Acesse: https://supabase.com/dashboard/account/tokens
2. Clique em "Generate new token"
3. Nome do token: `MadBoat-MCP-Dev`
4. Copie o token (SÓ APARECE UMA VEZ!)

### PASSO 2: OBTER PROJECT REFERENCE

1. Vá para: https://supabase.com/dashboard/projects
2. Selecione seu projeto MadBoat
3. Vá em Settings → General
4. Copie o "Reference ID" (formato: `abcdefghijklmnop`)

### PASSO 3: CONFIGURAR O MCP

1. Abra o arquivo `.cursor/mcp.json`
2. Substitua:
   - `YOUR_PROJECT_REF_HERE` → pelo Reference ID copiado
   - `YOUR_ACCESS_TOKEN_HERE` → pelo token criado

### PASSO 4: ATIVAR NO CURSOR

1. No Cursor, vá em: Settings → Features → MCP
2. O servidor "supabase-madboat-dev" deve aparecer
3. Status deve ficar VERDE (active)
4. Reinicie o Cursor se necessário

### PASSO 5: TESTAR CONEXÃO

No chat do Cursor, digite:
```
Use the MCP to list all tables in the database
```

Se retornar as tabelas, SUCESSO! 🎉

## ⚠️ REGRAS DE SEGURANÇA KRAKEN

### SEMPRE:
- ✅ Use `--read-only` no início
- ✅ Revise CADA comando antes de aprovar
- ✅ Use apenas em ambiente DEV
- ✅ Mantenha token em local seguro

### NUNCA:
- ❌ Use em produção
- ❌ Compartilhe o token
- ❌ Execute comandos sem revisar
- ❌ Deixe auto-approve ativado

## 🚀 COMANDOS ÚTEIS VIA MCP

Depois de configurado, você pode usar comandos naturais como:

- "Crie uma tabela users com id, email, nome e created_at"
- "Mostre todas as migrations"
- "Liste todas as funções do banco"
- "Gere o schema TypeScript das tabelas"
- "Mostre os logs de erro das últimas 24h"

## 🔧 TROUBLESHOOTING

### Erro: "Connection refused"
- Verifique se o token está correto
- Confirme o project-ref

### Erro: "Permission denied"
- Token pode estar expirado
- Criar novo token

### Status não fica verde
- Reinicie o Cursor
- Delete e recrie o arquivo mcp.json

## 📝 NOTAS DO KRAKEN

Este MCP é PODEROSO mas PERIGOSO! Use com sabedoria!

Quando terminar de configurar, você terá superpoderes para:
- Criar schemas em segundos
- Debugar queries complexas
- Gerar types automaticamente
- Gerenciar migrations

*"Com grandes tentáculos, vem grandes responsabilidades!"*

~ Kraken 🐙