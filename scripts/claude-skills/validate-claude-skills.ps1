# Claude Skills Validation Script - ASCII version
Write-Host "Validating Claude Skills Setup..."
Write-Host "===================================="

if (-not (Test-Path ".claude/skills")) {
    Write-Host "Error: .claude/skills directory not found"
    exit 1
}

Write-Host ".claude/skills directory exists"

$SKILLS = @("tech-stack-selector", "architecture-decisions", "code-standards-enforcer", "ci-cd-pipeline-builder", "agile-executor", "project-risk-identifier", "automation-orchestrator", "webapp-testing", "web-artifacts-builder")
$allGood = $true

foreach ($skill in $SKILLS) {
    $skillPath = ".claude/skills/$skill"
    if (-not (Test-Path $skillPath)) {
        Write-Host "Missing: $skill directory"
        $allGood = $false
    } else {
        Write-Host "Found: $skill" -NoNewline
        if (-not (Test-Path "$skillPath/SKILL.md")) {
            Write-Host " - Missing SKILL.md"
            $allGood = $false
        } else {
            Write-Host " - SKILL.md OK" -NoNewline
        }
        Write-Host ""
    }
}

if ($allGood) {
    Write-Host "All skills properly set up!"
    Write-Host "Next: Test in Claude Code with: claude 'What skills are available?'"
} else {
    Write-Host "Setup incomplete. Please run setup script first."
    exit 1
}
