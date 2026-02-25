#!/bin/bash
# Claude Skills Validation Script
# Tests that all skills are properly set up and accessible

set -e

echo "🔍 Validating Claude Skills Setup..."
echo "===================================="

# Check if .claude/skills exists
if [ ! -d ".claude/skills" ]; then
    echo "❌ Error: .claude/skills directory not found"
    exit 1
fi

echo "✅ .claude/skills directory exists"

# Define expected skills
SKILLS=(
  "tech-stack-selector"
  "architecture-decisions"
  "code-standards-enforcer"
  "ci-cd-pipeline-builder"
  "agile-executor"
  "project-risk-identifier"
)

# Check each skill
all_good=true

for skill in "${SKILLS[@]}"; do
    skill_path=".claude/skills/$skill"

    if [ ! -d "$skill_path" ]; then
        echo "❌ Missing: $skill directory"
        all_good=false
    else
        echo "✅ Found: $skill/"

        # Check SKILL.md
        if [ ! -f "$skill_path/SKILL.md" ]; then
            echo "  ❌ Missing: SKILL.md"
            all_good=false
        else
            echo "  ✅ SKILL.md exists"
        fi

        # Check references directory
        if [ ! -d "$skill_path/references" ]; then
            echo "  ❌ Missing: references/"
            all_good=false
        else
            echo "  ✅ references/ exists"
        fi

        # Check scripts directory
        if [ ! -d "$skill_path/scripts" ]; then
            echo "  ❌ Missing: scripts/"
            all_good=false
        else
            echo "  ✅ scripts/ exists"
        fi
    fi
done

echo ""

if [ "$all_good" = true ]; then
    echo "🎉 All skills properly set up!"
    echo ""
    echo "Next: Test in Claude Code with:"
    echo "  claude 'What skills are available?'"
else
    echo "❌ Setup incomplete. Please run setup script first."
    exit 1
fi
