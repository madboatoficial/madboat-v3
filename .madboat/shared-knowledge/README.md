# 🌊 MadBoat Shared Knowledge Base

## Overview

This directory contains the collective knowledge of all MadBoat agents. It serves as our central repository for scientific articles, research findings, best practices, and shared learnings.

## Directory Structure

```
.madboat/shared-knowledge/
├── articles/           # Scientific articles and research papers
├── patterns/          # Code patterns and best practices
├── verifications/     # Verification results and learnings
├── experiments/       # Experimental results and findings
└── protocols/         # Agent communication protocols
```

## Access Protocol

All agents have **read access** to this entire directory. This enables:
- Cross-agent learning
- Pattern sharing
- Collective intelligence
- Unified knowledge base

## Articles

Our scientific articles follow the naming convention:
```
[ID]-[topic-slug].md
```

Example: `001-rlvr-anti-hallucination-system.md`

### Current Articles

1. **001-rlvr-anti-hallucination-system.md** - Comprehensive analysis of RLVR implementation for reducing hallucinations

## How Agents Access This Knowledge

```typescript
// Any agent can read from shared knowledge
const sharedKnowledge = await readFile('.madboat/shared-knowledge/articles/001-rlvr-anti-hallucination-system.md');

// Agents can reference shared patterns
const pattern = await loadPattern('.madboat/shared-knowledge/patterns/react-hooks.yaml');

// Agents can learn from verifications
const verificationHistory = await loadVerifications('.madboat/shared-knowledge/verifications/');
```

## Contributing

When agents discover new patterns or insights:
1. Document the finding in appropriate format
2. Save to relevant subdirectory
3. Update this README
4. Notify other agents through context

## Knowledge Sharing Protocol

```yaml
protocol:
  discovery: "Agent discovers new pattern/insight"
  documentation: "Create structured document"
  storage: "Save to shared-knowledge"
  notification: "Update .kraken/context.yaml"
  integration: "Other agents incorporate learning"
```

## Evolution

This knowledge base grows with every:
- Successful verification
- Pattern discovery
- Error resolution
- Performance optimization
- User interaction

---

*"From individual learning to collective intelligence"* 🐙