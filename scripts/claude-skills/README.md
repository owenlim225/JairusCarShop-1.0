# Claude Skills Setup Scripts

This directory contains scripts for setting up and managing Claude Agent Skills.

## Available Scripts

### Setup Scripts

- **setup-claude-skills.sh** - Creates complete directory structure for all 6 skills
- **setup_claude_skills.py** - Python version of setup script (cross-platform)

### Validation Scripts

- **validate-claude-skills.sh** - Validates that all skills are properly configured

### Deployment Scripts

- **deploy-claude-skills.sh** - Commits skills to git repository

### Utility Scripts

- **tech-stack-validator.sh** - Validates technology stack choices
- **quick-setup.sh** - Runs complete setup and validation (in automation-orchestrator skill)

## Usage

### Quick Setup

```bash
# From project root
./scripts/claude-skills/setup-claude-skills.sh
```

### Validate Setup

```bash
./scripts/claude-skills/validate-claude-skills.sh
```

### Deploy Skills

```bash
./scripts/claude-skills/deploy-claude-skills.sh
```

### Validate Tech Stack

```bash
./scripts/claude-skills/tech-stack-validator.sh TypeScript Next.js PostgreSQL Vercel
```

## Documentation

For more information about Claude Skills, see:
- [.claude/README.md](../.claude/README.md)
- [.claude/skills/](../.claude/skills/) - Individual skill documentation

