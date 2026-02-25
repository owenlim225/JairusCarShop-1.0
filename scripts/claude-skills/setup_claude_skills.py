#!/usr/bin/env python3
"""
Claude Skills Setup Script - Python Version
Automatically creates .claude/skills directory structure
Based on Anthropic Skills Framework
"""

import os
import sys

SKILLS = [
    "tech-stack-selector",
    "architecture-decisions", 
    "code-standards-enforcer",
    "ci-cd-pipeline-builder",
    "agile-executor",
    "project-risk-identifier"
]

def setup_skills():
    """Create the complete Claude skills directory structure"""

    base_path = ".claude/skills"

    # Create main directory
    os.makedirs(base_path, exist_ok=True)
    print(f"✅ Created {base_path}/")

    # Create structure for each skill
    for skill in SKILLS:
        skill_path = f"{base_path}/{skill}"
        references_path = f"{skill_path}/references"
        scripts_path = f"{skill_path}/scripts"

        os.makedirs(skill_path, exist_ok=True)
        os.makedirs(references_path, exist_ok=True)
        os.makedirs(scripts_path, exist_ok=True)

        print(f"✅ Created {skill_path}/")
        print(f"  ├── references/")
        print(f"  └── scripts/")

    print("
📁 Directory structure created successfully!")
    print("
Next steps:")
    print("1. Copy SKILL.md files to each skill directory")
    print("2. Run: claude 'What skills are available?'")
    print("3. Test each skill")

if __name__ == "__main__":
    setup_skills()
