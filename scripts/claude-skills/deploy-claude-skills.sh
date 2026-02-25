#!/bin/bash
# Claude Skills Deployment Script
# Commits skills to git repository

set -e

echo "🚀 Deploying Claude Skills to repository..."
echo "==========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "⚠️  Git repository not initialized"
    echo "Running: git init"
    git init
fi

# Check if .claude/skills exists
if [ ! -d ".claude/skills" ]; then
    echo "❌ Error: .claude/skills not found. Run setup first."
    exit 1
fi

# Add .claude to git
echo "Adding .claude/ to git..."
git add .claude/

# Check if there are changes
if git diff --staged --quiet; then
    echo "⚠️  No changes to commit"
    exit 0
fi

# Commit
echo "Committing..."
git commit -m "Add 6 Claude Agent Skills (Anthropic-standard)

- tech-stack-selector: Technology decision framework
- architecture-decisions: ADR documentation
- code-standards-enforcer: 40+ item code review checklist
- ci-cd-pipeline-builder: GitHub Actions templates
- agile-executor: Sprint planning & ceremonies
- project-risk-identifier: Risk assessment framework"

# Push if remote exists
if git remote | grep -q .; then
    echo "Pushing to remote..."
    git push
else
    echo "⚠️  No remote configured"
    echo "Add remote with: git remote add origin <your-repo-url>"
fi

echo ""
echo "✅ Skills deployed successfully!"
echo ""
echo "Team members can now:"
echo "1. Pull the latest changes"
echo "2. Run: claude 'What skills are available?'"
echo "3. Start using skills immediately"
