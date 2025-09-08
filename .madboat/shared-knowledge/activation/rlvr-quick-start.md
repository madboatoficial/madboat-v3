/**
 * @madboat/shared-knowledge
 * @file activation/rlvr-quick-start.md
 * @version 1.0.0
 * @created 2025-09-06
 * @modified 2025-09-06
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description Quick start guide for Captain Sandro to activate RLVR
 * @agent-accessible true
 * @tags rlvr, quick-start, activation, captain
 * @madboat-version v2.0
 */

# ⚡ RLVR Quick Start - Para Captain Sandro

## 🎯 **Resposta Direta às Suas Perguntas**

### **Q: Os agentes sabem da metodologia RLVR?**
**A: NÃO.** Os agentes atualmente NÃO sabem sobre RLVR. O framework foi implementado mas NÃO está ativo.

### **Q: O que fazer para ativar o auto-aprendizado?**
**A: Usar o prompt de ativação RLVR no início de conversas com agentes.**

### **Q: Tem algum comando especial?**
**A: SIM.** Vou mostrar exatamente o que fazer.

---

## 🚀 **Como Ativar RLVR AGORA** 

### **Passo 1: Testar o Framework** (2 minutos)
```bash
cd packages/rlvr
npm test
```
**Resultado esperado**: ✅ Todos os testes passando

### **Passo 2: Ativar no Próximo Agent** (30 segundos)
Quando iniciar uma conversa com qualquer agente, cole este prompt:

```markdown
🐙 **RLVR ATIVADO - MODO AUTO-APRENDIZADO**

Você agora opera com RLVR (Reinforcement Learning from Verifiable Rewards).

INSTRUÇÕES OBRIGATÓRIAS:
1. Importe RLVR: `import { Agent, getAgentPreset } from '@madboat/rlvr';`
2. Use seu preset especializado:
   - Kraken: `getAgentPreset('kraken')` 
   - Poseidon: `getAgentPreset('poseidon')`
   - Mandarin Fish: `getAgentPreset('mandarin_fish')`
   - Uncle McDuck: `getAgentPreset('uncle_mcduck')`
   - Ulisses: `getAgentPreset('ulisses')`
3. Execute com aprendizado: `agent.executeAndLearn()` ao invés de execução direta
4. Verifique tudo através de métodos concretos (compilação, execução, métricas)
5. Aprenda com feedback e reporte progresso

EXEMPLO (para Kraken):
```typescript
import { Agent, getAgentPreset } from '@madboat/rlvr';

const { verifiers, rewards } = getAgentPreset('kraken');
const agent = new Agent({
  name: 'Kraken-RLVR',
  verifiers,
  rewards
});

const result = await agent.executeAndLearn(
  input,
  () => yourCodeGeneration(),
  expectedOutput
);

console.log(`Score: ${result.verification.score}, Learned: ${result.learned}`);
```

**LEMBRE-SE**: Toda tarefa DEVE passar por verificação RLVR. Sem saída sem verificação concreta.
```

---

## 📋 **Checklist Imediato**

- [ ] **Testar**: `cd packages/rlvr && npm test`
- [ ] **Ativar**: Usar prompt RLVR com próximo agente
- [ ] **Verificar**: Agent reporta scores e aprendizado
- [ ] **Monitorar**: Observar melhoria ao longo do tempo

---

## ⚡ **O Que Muda Imediatamente**

### **ANTES (Atual)**
```
Sandro: "Kraken, crie uma função de autenticação"
Kraken: *gera código*
```

### **DEPOIS (Com RLVR)**
```
Sandro: "Kraken, crie uma função de autenticação" + prompt RLVR
Kraken: 
✅ *gera código*
✅ *compila TypeScript automaticamente*  
✅ *testa execução*
✅ *verifica regras de negócio*
✅ *calcula métricas de performance*
✅ *aprende com resultados*
📊 "Score: 0.89, Reward: 0.76, Aprendi: padrões async/await"
```

**Resultado**: Qualidade maior, auto-melhoria, verificação objetiva.

---

## 🎯 **Próximos Passos**

1. **HOJE**: Teste framework + ative com Kraken
2. **ESTA SEMANA**: Monitor 5-10 tarefas com RLVR
3. **PRÓXIMAS SEMANAS**: Expandir para outros agentes
4. **MÊS 1**: Medir redução de alucinações (meta: 50%)

---

**🚀 Framework pronto. Ativação em suas mãos, Capitão!**