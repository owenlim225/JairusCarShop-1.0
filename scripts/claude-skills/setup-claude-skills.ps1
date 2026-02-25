# Setup Claude Skills Script
# Creates the necessary directory structure for Claude Skills

Write-Host "🛠️  Setting up Claude Skills..."
Write-Host "===================================="

# Create base directory
if (-not (Test-Path ".claude/skills")) {
    New-Item -ItemType Directory -Force -Path ".claude/skills" | Out-Null
    Write-Host "✅ Created .claude/skills directory" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .claude/skills directory already exists" -ForegroundColor Gray
}

# Define skills to create
$SKILLS = @(
  "tech-stack-selector",
  "architecture-decisions",
  "code-standards-enforcer",
  "ci-cd-pipeline-builder",
  "agile-executor",
  "project-risk-identifier",
  "automation-orchestrator",
  "webapp-testing",
  "web-artifacts-builder"
)

foreach ($skill in $SKILLS) {
    $skillPath = ".claude/skills/$skill"
    
    # Create skill directory
    if (-not (Test-Path $skillPath)) {
        New-Item -ItemType Directory -Force -Path $skillPath | Out-Null
        Write-Host "✅ Created $skill directory" -ForegroundColor Green
    }
    
    # Create subdirectories
    $dirs = @("references", "scripts")
    foreach ($dir in $dirs) {
        $subPath = "$skillPath/$dir"
        if (-not (Test-Path $subPath)) {
            New-Item -ItemType Directory -Force -Path $subPath | Out-Null
            # Write-Host "  Created $dir directory" -ForegroundColor Gray
        }
    }
    
    # Create empty SKILL.md if it doesn't exist
    if (-not (Test-Path "$skillPath/SKILL.md")) {
        # Create a basic template
        $template = @"
---
name: $skill
description: Auto-generated skill description
---

# $(($skill -replace '-', ' ').ToUpper())

## Purpose
Describe the purpose of this skill.

## Usage
Describe how to use this skill.
"@
        Set-Content -Path "$skillPath/SKILL.md" -Value $template
        Write-Host "  ✅ Created basic SKILL.md for $skill" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 Setup complete! Run validate-claude-skills.ps1 to verify." -ForegroundColor Cyan
