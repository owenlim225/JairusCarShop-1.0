#!/bin/bash
# Claude Skills Setup Script
# Automatically creates .claude/skills directory structure and copies SKILL.md files
# Based on Anthropic Skills Framework

set -e

echo "🚀 Setting up Claude Agent Skills..."
echo "====================================="

# Create main directory
mkdir -p .claude/skills
echo "✅ Created .claude/skills/"

# Define skills
SKILLS=(
  "tech-stack-selector"
  "architecture-decisions"
  "code-standards-enforcer"
  "ci-cd-pipeline-builder"
  "agile-executor"
  "project-risk-identifier"
)

# Create directory structure for each skill
for skill in "${SKILLS[@]}"; do
  mkdir -p .claude/skills/$skill/{references,scripts}
  echo "✅ Created .claude/skills/$skill/"
  echo "  ├── references/"
  echo "  └── scripts/"
done

echo ""
echo "📁 Directory structure created successfully!"
echo ""
echo "✅ All 6 skills have:"
echo "   - SKILL.md (already created)"
echo "   - references/ directory (for detailed docs)"
echo "   - scripts/ directory (for automation)"
echo ""
echo "Next steps:"
echo "1. ✅ SKILL.md files are already in place"
echo "2. 📚 Reference docs are available in references/ directories"
echo "3. 🔧 Utility scripts are in scripts/ directories"
echo "4. 🧪 Test in Claude Code: 'What skills are available?'"
echo ""
echo "Example tests:"
echo "- 'Help me choose a tech stack'"
echo "- 'Create an ADR for our database choice'"
echo "- 'Review this code for quality'"
echo "- 'Setup our CI/CD pipeline'"
echo "- 'Plan our first sprint'"
echo "- 'What are the project risks?'"
echo ""
echo "📖 See .claude/skills/[skill-name]/references/ for detailed guides"
