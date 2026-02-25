#!/bin/bash
# Skill Publishing Script
# Validates and provides instructions for publishing to skills.sh and .claude-plugin

set -e

echo "BlueprintKit Publishing Validation and Instructions"
echo "===================================================="
echo ""
echo "Skill Name: blueprintkit"
echo "Includes: All 14 planning sections + All 9 Claude Skills"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Validation functions
validate_skill_md() {
    echo "Validating skill structure..."
    
    local skill_path=".claude/skills/blueprintkit/SKILL.md"
    
    if [ ! -f "$skill_path" ]; then
        echo -e "${RED}ERROR: SKILL.md not found at ${skill_path}${NC}"
        return 1
    fi
    
    # Check for frontmatter
    if ! grep -q "^---$" "$skill_path"; then
        echo -e "${YELLOW}WARNING: SKILL.md may be missing frontmatter${NC}"
    fi
    
    # Check for required fields
    if ! grep -q "name:" "$skill_path"; then
        echo -e "${YELLOW}WARNING: SKILL.md may be missing 'name' field${NC}"
    fi
    
    if ! grep -q "description:" "$skill_path"; then
        echo -e "${YELLOW}WARNING: SKILL.md may be missing 'description' field${NC}"
    fi
    
    # Verify planning directory exists
    if [ ! -d ".claude/skills/blueprintkit/planning" ]; then
        echo -e "${YELLOW}WARNING: Planning directory not found${NC}"
    fi
    
    # Verify skills exist
    local skills_count=$(ls -d .claude/skills/blueprintkit/*/ 2>/dev/null | grep -v planning | wc -l)
    if [ "$skills_count" -lt 9 ]; then
        echo -e "${YELLOW}WARNING: Expected 9 skills, found ${skills_count}${NC}"
    fi
    
    echo -e "${GREEN}Skill structure validation passed${NC}"
    return 0
}

validate_plugin_structure() {
    echo "Validating .claude-plugin structure..."
    
    if [ ! -d ".claude-plugin" ]; then
        echo -e "${RED}ERROR: .claude-plugin directory not found${NC}"
        return 1
    fi
    
    local missing_files=0
    
    if [ ! -f ".claude-plugin/SKILL.md" ]; then
        echo -e "${RED}ERROR: .claude-plugin/SKILL.md not found${NC}"
        missing_files=$((missing_files + 1))
    fi
    
    if [ ! -f ".claude-plugin/plugin.mdc" ]; then
        echo -e "${RED}ERROR: .claude-plugin/plugin.mdc not found${NC}"
        missing_files=$((missing_files + 1))
    fi
    
    if [ ! -f ".claude-plugin/README.md" ]; then
        echo -e "${YELLOW}WARNING: .claude-plugin/README.md not found (optional but recommended)${NC}"
    fi
    
    if [ $missing_files -eq 0 ]; then
        echo -e "${GREEN}.claude-plugin structure validation passed${NC}"
        return 0
    else
        return 1
    fi
}

validate_license() {
    echo "Validating LICENSE file..."
    
    if [ ! -f "LICENSE" ]; then
        echo -e "${YELLOW}WARNING: LICENSE file not found${NC}"
        echo "  Skills.sh requires a license for published skills"
        return 1
    fi
    
    echo -e "${GREEN}LICENSE file found${NC}"
    return 0
}

check_git_repo() {
    echo "Checking Git repository status..."
    
    if [ ! -d ".git" ]; then
        echo -e "${YELLOW}WARNING: Not a Git repository${NC}"
        echo "  Skills.sh requires a Git repository for publishing"
        return 1
    fi
    
    # Check for remote
    if ! git remote | grep -q .; then
        echo -e "${YELLOW}WARNING: No Git remote configured${NC}"
        echo "  Add remote with: git remote add origin <your-repo-url>"
        return 1
    fi
    
    local remote_url=$(git remote get-url origin 2>/dev/null || echo "")
    if [ -n "$remote_url" ]; then
        echo -e "${GREEN}Git remote found: ${remote_url}${NC}"
    fi
    
    return 0
}

# Main validation
echo "Running validations..."
echo ""

validation_passed=true

if ! validate_skill_md; then
    validation_passed=false
fi

echo ""

if ! validate_plugin_structure; then
    validation_passed=false
fi

echo ""

if ! validate_license; then
    validation_passed=false
fi

echo ""

if ! check_git_repo; then
    validation_passed=false
fi

echo ""
echo "============================================="
echo ""

if [ "$validation_passed" = true ]; then
    echo -e "${GREEN}All validations passed!${NC}"
    echo ""
else
    echo -e "${YELLOW}Some validations failed. Please review warnings above.${NC}"
    echo ""
fi

# Publishing instructions
echo "Publishing Instructions"
echo "====================="
echo ""

echo "For skills.sh:"
echo "1. Ensure your repository is public or accessible"
echo "2. Verify skill structure at .claude/skills/blueprintkit/"
echo "3. Install locally to test:"
echo "   ${GREEN}npx skills add $(git remote get-url origin 2>/dev/null | sed 's/.*github.com[:/]\([^.]*\).*/\1/' || echo '[owner]/[repository]')${NC}"
echo "4. If publishing to skills.sh marketplace:"
echo "   - Follow skills.sh publishing guidelines"
echo "   - Submit repository for review"
echo "   - Visit https://skills.sh for submission process"
echo ""

echo "For .claude-plugin:"
echo "1. Ensure .claude-plugin/ directory is in repository"
echo "2. Users can clone repository to use plugin"
echo "3. Plugin auto-detects in Claude Code when .claude-plugin/ is present"
echo "4. Share repository URL for distribution"
echo ""

# Generate installation command
if git remote | grep -q .; then
    remote_url=$(git remote get-url origin 2>/dev/null || echo "")
    if [[ $remote_url == *"github.com"* ]]; then
        # Extract owner/repo from GitHub URL
        repo_path=$(echo "$remote_url" | sed -E 's/.*github.com[:/]([^/]+\/[^/]+)(\.git)?$/\1/')
        if [ -n "$repo_path" ]; then
            echo "Installation Command:"
            echo -e "${GREEN}npx skills add ${repo_path}${NC}"
            echo ""
        fi
    fi
fi

echo "Next Steps:"
echo "1. Review .claude/skills/blueprintkit/SKILL.md content for accuracy"
echo "2. Verify all planning sections and skills are present"
echo "3. Test skill installation locally"
echo "4. Verify all documentation links work"
echo "5. Commit and push changes to repository"
echo "6. Publish to skills.sh or share .claude-plugin directory"
echo ""

