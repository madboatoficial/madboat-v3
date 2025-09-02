# 🔌 MCP - Guia Simples para Sandro

## O que é MCP?

**MCP = Model Context Protocol** - É como um "cabo USB" que conecta ferramentas externas (Figma, bancos de dados, etc) diretamente ao Claude.

## Por que é revolucionário?

Imagine que você está no Figma desenhando um botão. Com MCP, você pode:
1. Pedir pro Claude: "pegue esse botão do Figma"
2. Claude puxa o design DIRETO do Figma
3. Gera o código React EXATO do design
4. Mantém cores, espaçamentos, TUDO!

## Como configurar (SIMPLES!)

### Passo 1: Baixar Claude Desktop
```bash
# Vai em claude.ai/desktop e baixa o app
# MCP SÓ funciona no app desktop, NÃO no navegador!
```

### Passo 2: Instalar o MCP do Figma
```bash
# No terminal:
npm install -g @figma/mcp-server-figma
```

### Passo 3: Pegar seu Token do Figma
1. Vai no Figma
2. Settings > Account > Personal Access Tokens
3. Cria um token e copia

### Passo 4: Configurar no Claude Desktop
```json
// No Mac: ~/Library/Application Support/Claude/claude_desktop_config.json
// No Windows: %APPDATA%/Claude/claude_desktop_config.json

{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["/usr/local/bin/figma-mcp", "--token", "SEU_TOKEN_AQUI"]
    }
  }
}
```

### Passo 5: Reiniciar Claude Desktop
Fecha e abre o Claude Desktop. Pronto!

## Como usar?

No Claude Desktop, você pode dizer:
- "Pegue o componente Header do Figma"
- "Importe as cores do design system"
- "Transforme esse frame em React"

## Outros MCPs úteis:

### 1. **Supabase MCP** (pra Poseidon!)
```bash
npm install -g @supabase/mcp-server
# Conecta direto com seu banco!
```

### 2. **GitHub MCP**
```bash
npm install -g @github/mcp-server
# Acessa repos, issues, PRs direto!
```

### 3. **Filesystem MCP**
```bash
# Já vem instalado!
# Permite Claude ler/escrever arquivos
```

## Limitações:

1. **SÓ funciona no Claude Desktop** (app)
2. **NÃO funciona no navegador**
3. **Precisa de tokens/credenciais** das ferramentas
4. **Cada MCP precisa ser instalado** separadamente

## Por que isso muda tudo pro MadBoat?

1. **Design → Código**: Mandarin Fish pode puxar designs do Figma direto
2. **Dados → UI**: Poseidon pode conectar Supabase direto
3. **Consistência**: Design system sempre sincronizado
4. **Velocidade**: 10x mais rápido que copiar/colar

## Próximos passos:

1. Baixar Claude Desktop
2. Instalar Figma MCP
3. Fazer primeiro teste
4. Mind = Blown 🤯

---

*"MCP é a ponte entre o mundo do design e o mundo do código. É como se o Mandarin Fish pudesse nadar direto do Figma pro VSCode!"*

~ Kraken 🐙