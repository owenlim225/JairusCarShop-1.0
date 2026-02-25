# Claude Skills Directory

This directory contains Claude Skills that are automatically activated based on natural language queries.

## Available Skills

1. **tech-stack-selector** - Technology decision framework
2. **architecture-decisions** - Architecture Decision Records (ADRs)
3. **code-standards-enforcer** - Code quality and review checklist
4. **ci-cd-pipeline-builder** - CI/CD pipeline automation
5. **agile-executor** - Sprint planning and Agile ceremonies
6. **project-risk-identifier** - Risk assessment framework
7. **automation-orchestrator** - Manage setup/validate/deploy scripts
8. **webapp-testing** - Playwright-based web application testing toolkit
9. **web-artifacts-builder** - React + TypeScript artifact creation with shadcn/ui

## Structure

All skills are consolidated under the BlueprintKit skill directory:

```
.claude/skills/blueprintkit/
├── SKILL.md          # Main consolidated skill definition
├── planning/          # All 14 planning sections
├── tech-stack-selector/
│   ├── SKILL.md      # Individual skill definition
│   ├── references/   # Detailed documentation and templates
│   └── scripts/       # Utility scripts for automation
├── architecture-decisions/
├── code-standards-enforcer/
├── ci-cd-pipeline-builder/
├── agile-executor/
├── project-risk-identifier/
├── automation-orchestrator/
├── webapp-testing/
└── web-artifacts-builder/
```

## Usage

Skills are auto-activated when you ask Claude relevant questions:

- "What tech stack should we use?" → tech-stack-selector
- "Create an ADR" → architecture-decisions
- "Code review checklist" → code-standards-enforcer
- "Setup CI/CD" → ci-cd-pipeline-builder
- "Plan sprint" → agile-executor
- "Identify risks" → project-risk-identifier
- "Set up Claude skills" → automation-orchestrator
- "Test web application" → webapp-testing
- "Build web artifact" → web-artifacts-builder

## Testing

Test skills in Claude Code:

```bash
claude "What skills are available?"
```

## Documentation

- Each skill's `SKILL.md` contains activation triggers and usage
- `references/` directories contain detailed guides and templates
- `scripts/` directories contain automation utilities

## Setup

Run the setup script to ensure proper structure:

```bash
./scripts/claude-skills/setup-claude-skills.sh
```

Validate setup:

```bash
./scripts/claude-skills/validate-claude-skills.sh
```

Or use the automation-orchestrator skill:

```bash
# Ask Claude: "Use the automation orchestrator skill to set up skills here"
```

## Best Practices

- Skills are version-controlled with your codebase
- Team members automatically have access via git
- Skills stay in sync across the team
- Customize skills for your project needs

## Publishing and Distribution

### Skills.sh Publishing

This project includes a consolidated skill at `.claude/skills/blueprintkit/SKILL.md` that combines all 14 planning sections and all nine skills into a single skill for publishing to skills.sh.

**Install from skills.sh**:
```bash
npx skills add JustineDevs/BlueprintKit
```

**Validate and publish**:
```bash
./scripts/publish-skill.sh
```

This script validates the skill structure, checks required files, and provides publishing instructions.

### Claude Plugin Package

The `.claude-plugin/` directory provides a distributable plugin package for Claude Code that bundles all nine skills.

**Plugin Structure**:
- `.claude-plugin/SKILL.md` - Plugin skill definition
- `.claude-plugin/plugin.mdc` - MDC configuration
- `.claude-plugin/README.md` - Plugin documentation

**Installation**: Clone this repository or copy the `.claude-plugin/` directory to your project. Claude Code automatically detects and loads the plugin.

See [.claude-plugin/README.md](../.claude-plugin/README.md) for detailed plugin documentation.

## References

- [Anthropic Skills Framework](https://github.com/anthropics/skills)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- [Skills.sh Platform](https://skills.sh)
- [Consolidated SKILL.md](./skills/blueprintkit/SKILL.md) - BlueprintKit skill definition for skills.sh

