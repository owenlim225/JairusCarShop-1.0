# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records documenting significant technical decisions made during the project.

## What are ADRs?

ADRs are documents that capture important architectural decisions along with their context and consequences. They help teams:

- **Preserve knowledge** - Understand why decisions were made
- **Avoid repetition** - Don't re-debate settled decisions
- **Onboard new team members** - Quickly understand system rationale
- **Track evolution** - See how architecture changes over time

## When to Create an ADR

Create an ADR when making decisions about:

- Technology choices (database, framework, language)
- Architecture patterns (monolithic vs microservices)
- Integration approaches (API design, data flow)
- Infrastructure decisions (hosting, deployment)
- Security implementations
- Performance optimizations
- Any decision that affects multiple team members or systems

## ADR Naming Convention

Format: `adr-XXX-short-description.md`

Examples:
- `adr-001-postgresql-database-choice.md`
- `adr-002-nextjs-framework-selection.md`
- `adr-003-api-authentication-strategy.md`

## ADR Template

Use this template for new ADRs:

```markdown
# ADR [Number]: [Decision Title]

**Status:** [Proposed / Accepted / Deprecated / Superseded]  
**Date:** [YYYY-MM-DD]  
**Deciders:** [Names]  
**Consulted:** [Names]  
**Informed:** [Names]

## Context

[What is the issue we're seeing that is motivating this decision?]

## Decision

[What is the change we're proposing or have agreed to implement?]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Neutral
- [Impact 1]

## Alternatives Considered

### Alternative 1: [Name]
- **Pros:** [List]
- **Cons:** [List]
- **Why not chosen:** [Reason]

## References

- [Link to related documentation]
```

## ADR Status

- **Proposed** - Decision is being considered
- **Accepted** - Decision has been made and implemented
- **Deprecated** - Decision is no longer valid
- **Superseded** - Replaced by a newer ADR

## Quick Start

### Create a New ADR

Use the Claude skill:
```
"Create an ADR for [decision description]"
```

Or use the script:
```bash
./.claude/skills/architecture-decisions/scripts/generate-adr.sh "Decision Title"
```

### View All ADRs

```bash
ls -la docs/adr/
```

## Related Documentation

- [Section 13: Lessons Learned](../../planning/13-Lessons-Learned-Continuous-Improvement.md) - ADR process details
- [Architecture Decisions Skill](../../.claude/skills/architecture-decisions/SKILL.md) - Auto-activated help
- [ADR Template](../../.claude/skills/architecture-decisions/references/adr-template.md) - Full template

---

**Next ADR Number:** Check existing ADRs and use the next sequential number.

