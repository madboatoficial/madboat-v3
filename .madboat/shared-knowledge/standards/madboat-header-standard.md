/**
 * @madboat/shared-knowledge
 * @file standards/madboat-header-standard.md
 * @version 1.0.0
 * @created 2025-09-06
 * @modified 2025-09-06
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description MadBoat standard header format for all source files
 * @agent-accessible true
 * @tags standards, headers, documentation, multi-agent
 * @madboat-version v2.0
 */

# 🐙 MadBoat Header Standard

> **Version**: 1.0.0  
> **Created**: 2025-09-06  
> **Status**: ACTIVE  
> **Scope**: All MadBoat source files  

## 📋 **Standard Header Format**

All MadBoat source files **MUST** include the following standardized header:

```javascript
/**
 * @madboat/[package-name]
 * @file [relative-path-from-package-root]
 * @version [semantic-version]
 * @created [YYYY-MM-DD]
 * @modified [YYYY-MM-DD]
 * @author [Primary Author + Contributors]
 * @description [Brief description of file purpose]
 * @agent-accessible [true|false]
 * @tags [comma-separated, relevant, keywords]
 * @related-files [optional: related file references]
 * @madboat-version [madboat-ecosystem-version]
 */
```

## 🔧 **Field Definitions**

### **Required Fields**

| Field | Format | Description | Example |
|-------|--------|-------------|---------|
| `@madboat/[package]` | Package identifier | MadBoat package namespace | `@madboat/rlvr` |
| `@file` | Relative path | Path from package root | `src/core/Agent.ts` |
| `@version` | Semantic version | File/component version | `1.0.0` |
| `@created` | YYYY-MM-DD | Initial creation date | `2025-09-06` |
| `@modified` | YYYY-MM-DD | Last modification date | `2025-09-06` |
| `@author` | Author(s) | Primary + contributing authors | `Claude Sonnet 4 + Captain Sandro Fidelis` |
| `@description` | Brief text | Clear, concise purpose | `RLVR Agent with verification-based learning` |
| `@agent-accessible` | Boolean | Can agents access/read this file? | `true` |
| `@tags` | CSV keywords | Relevant searchable terms | `agent, learning, memory` |
| `@madboat-version` | Version | MadBoat ecosystem version | `v2.0` |

### **Optional Fields**

| Field | Format | Description | Example |
|-------|--------|-------------|---------|
| `@related-files` | File list | Cross-references | `Verifier.ts, Reward.ts` |
| `@deprecated` | YYYY-MM-DD | Deprecation date if applicable | `2025-12-01` |
| `@experimental` | Boolean | Experimental feature flag | `true` |
| `@performance` | Critical level | Performance criticality | `high` |
| `@security` | Security level | Security sensitivity | `sensitive` |

---

## 🎯 **Usage Guidelines**

### **1. Creation Date**
- Set **once** when file is first created
- **Never** change this date
- Use format: `YYYY-MM-DD`

### **2. Modified Date**
- Update **every time** file is meaningfully changed
- Minor typo fixes may not require update
- Automated formatting changes don't require update

### **3. Version Numbers**
- Follow [semantic versioning](https://semver.org/)
- `MAJOR.MINOR.PATCH` format
- Increment appropriately for changes

### **4. Agent Accessibility**
- `true`: Agents can read and reference this file
- `false`: Internal/sensitive files agents shouldn't access
- Consider security implications carefully

### **5. Tags**
- Use lowercase, hyphen-separated keywords
- Include functional, technical, and domain tags
- Keep relevant and searchable
- Examples: `typescript`, `database`, `ui-component`, `test-suite`

---

## 📁 **File Type Examples**

### **TypeScript Source Files**
```typescript
/**
 * @madboat/rlvr
 * @file src/verifiers/TypeScriptVerifier.ts
 * @version 1.0.0
 * @created 2025-09-06
 * @modified 2025-09-06
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description TypeScript-specific verifier with strict mode support
 * @agent-accessible true
 * @tags typescript, verifier, compilation, strict-mode
 * @madboat-version v2.0
 */
```

### **Configuration Files**
```json
// package.json
{
  "name": "@madboat/rlvr",
  "version": "1.0.0",
  "created": "2025-09-06",
  "modified": "2025-09-06",
  "author": "Claude Sonnet 4 + Captain Sandro Fidelis",
  "madboat-version": "v2.0"
}
```

### **Markdown Documentation**
```markdown
/**
 * @madboat/shared-knowledge
 * @file implementation-status/002-rlvr-framework-complete.md
 * @version 1.0.0
 * @created 2025-09-06
 * @modified 2025-09-06
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description Complete RLVR framework implementation status
 * @agent-accessible true
 * @tags implementation, status, rlvr, complete
 * @madboat-version v2.0
 */
```

### **Test Files**
```typescript
/**
 * @madboat/rlvr
 * @file src/__tests__/rlvr.test.ts
 * @version 1.0.0
 * @created 2025-09-06
 * @modified 2025-09-06
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description Comprehensive test suite for RLVR framework
 * @agent-accessible true
 * @tags tests, vitest, integration, unit-tests
 * @madboat-version v2.0
 */
```

---

## 🤖 **Multi-Agent Considerations**

### **Agent Accessibility**
- **Shared Knowledge**: Always `@agent-accessible true`
- **Core Libraries**: Usually `@agent-accessible true`
- **Private/Sensitive**: Set `@agent-accessible false`
- **Configuration**: Consider security implications

### **Version Tracking**
- Enables agents to understand file evolution
- Helps prevent conflicts during simultaneous work
- Supports rollback and change tracking

### **Cross-References**
- Use `@related-files` to link connected components
- Helps agents understand system architecture
- Facilitates intelligent code navigation

---

## 🔧 **Tools & Automation**

### **Header Validation**
```bash
# Future: Automated header validation
npm run validate-headers
```

### **Header Generation**
```bash
# Future: Generate standard headers
npm run generate-header src/new-file.ts
```

### **Header Updates**
```bash
# Future: Bulk update modified dates
npm run update-headers --modified-only
```

---

## ✅ **Compliance Checklist**

- [ ] Header present at top of file
- [ ] All required fields included
- [ ] Dates in YYYY-MM-DD format
- [ ] Version follows semantic versioning
- [ ] Agent accessibility clearly specified
- [ ] Tags are relevant and lowercase
- [ ] Description is clear and concise
- [ ] MadBoat version specified

---

## 🎯 **Benefits**

### **For Development**
- **Traceability**: Clear ownership and history
- **Navigation**: Easy file identification and purpose
- **Maintenance**: Version tracking and change management

### **For Multi-Agent Systems**
- **Coordination**: Prevents conflicts between agents
- **Understanding**: Agents can assess file relevance
- **Safety**: Clear accessibility boundaries

### **For Team Collaboration**
- **Consistency**: Standardized information format
- **Documentation**: Self-documenting codebase
- **Quality**: Professional development standards

---

**🐙 MadBoat Header Standard v1.0 - Active 2025-09-06**  
*Standardizing excellence across the MadBoat ecosystem*