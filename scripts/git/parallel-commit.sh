#!/bin/bash

# Parallel Git Commit Script
# Scans for changes and commits each file individually with parallel processing

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BRIGHT='\033[1m'
NC='\033[0m' # No Color

# Configuration
MAX_CONCURRENT=5
DRY_RUN=false
COMMIT_PREFIX="feat"

# Function to print colored output
print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to show help
show_help() {
    print_color $CYAN "Parallel Git Commit Script"
    print_color $CYAN "=========================="
    echo ""
    print_color $CYAN "Usage: $0 [options]"
    print_color $CYAN "Options:"
    print_color $CYAN "  --dry-run    Show what would be committed without actually committing"
    print_color $CYAN "  --help, -h   Show this help message"
    print_color $CYAN "  --max N      Set maximum concurrent commits (default: $MAX_CONCURRENT)"
    echo ""
    print_color $CYAN "Examples:"
    print_color $CYAN "  $0                    # Commit all changes"
    print_color $CYAN "  $0 --dry-run         # Preview what would be committed"
    print_color $CYAN "  $0 --max 3           # Use max 3 concurrent commits"
}

# Function to get commit message for a file
get_commit_message() {
    local file=$1
    local status=$2
    local filename=$(basename "$file")
    local dirname=$(dirname "$file")
    local fileext="${filename##*.}"
    
    # Determine category and purpose
    local category=""
    local purpose=""
    
    # Planning documents
    if [[ "$file" == *"planning/"* ]]; then
        category="planning"
        if [[ "$filename" == *"Executive-Summary"* ]]; then
            purpose="executive summary"
        elif [[ "$filename" == *"Objectives"* ]]; then
            purpose="objectives and metrics"
        elif [[ "$filename" == *"Scope"* ]]; then
            purpose="scope definition"
        elif [[ "$filename" == *"Architecture"* ]]; then
            purpose="system architecture"
        elif [[ "$filename" == *"Technical-Execution"* ]]; then
            purpose="technical execution workflow"
        elif [[ "$filename" == *"Timeline"* ]]; then
            purpose="project timeline"
        elif [[ "$filename" == *"Resource"* ]]; then
            purpose="resource planning"
        elif [[ "$filename" == *"Risk"* ]]; then
            purpose="risk management"
        elif [[ "$filename" == *"Execution-Strategy"* ]]; then
            purpose="execution strategy"
        elif [[ "$filename" == *"Monitoring"* ]]; then
            purpose="monitoring and reporting"
        elif [[ "$filename" == *"ROI"* ]]; then
            purpose="ROI and value realization"
        elif [[ "$filename" == *"Governance"* ]]; then
            purpose="governance and decision-making"
        elif [[ "$filename" == *"Lessons"* ]]; then
            purpose="lessons learned"
        elif [[ "$filename" == *"Master-Index"* ]]; then
            purpose="master index"
        fi
    # Documentation
    elif [[ "$file" == *"docs/mdx/"* ]]; then
        category="docs"
        if [[ "$filename" == *"getting-started"* ]]; then
            purpose="getting started guide"
        elif [[ "$filename" == *"planning-framework"* ]]; then
            purpose="planning framework docs"
        elif [[ "$filename" == *"technical-guide"* ]]; then
            purpose="technical guide"
        elif [[ "$filename" == *"claude-skills"* ]]; then
            purpose="Claude skills documentation"
        elif [[ "$filename" == *"quick-reference"* ]]; then
            purpose="quick reference"
        elif [[ "$filename" == *"use-cases"* ]]; then
            purpose="use cases"
        elif [[ "$filename" == *"skills-examples"* ]]; then
            purpose="skills examples"
        elif [[ "$filename" == *"faq"* ]]; then
            purpose="FAQ"
        fi
    # Reference guides
    elif [[ "$file" == *"docs/reference/"* ]]; then
        category="docs"
        if [[ "$filename" == *"TECHNICAL-SUMMARY"* ]]; then
            purpose="technical summary"
        elif [[ "$filename" == *"SYSTEM-ARCHITECTURE"* ]]; then
            purpose="system architecture reference"
        elif [[ "$filename" == *"COMPLETE-MONOREPO"* ]]; then
            purpose="monorepo structure"
        elif [[ "$filename" == *"ARCHITECTURE-VISUAL"* ]]; then
            purpose="architecture visual map"
        elif [[ "$filename" == *"MASTER-FILE-INDEX"* ]]; then
            purpose="master file index"
        elif [[ "$filename" == *"API-REFERENCE"* ]]; then
            purpose="API reference"
        fi
    # Claude Skills
    elif [[ "$file" == *".claude/skills/"* ]]; then
        category="claude"
        if [[ "$filename" == "SKILL.md" ]]; then
            local skillname=$(echo "$dirname" | sed 's|.*/skills/||' | sed 's|/.*||')
            purpose="${skillname} skill definition"
        elif [[ "$file" == *"references/"* ]]; then
            purpose="skill reference documentation"
        elif [[ "$file" == *"scripts/"* ]]; then
            purpose="skill automation script"
        fi
    # Configuration files
    elif [[ "$filename" == "package.json" ]] || [[ "$filename" == "tsconfig.json" ]]; then
        category="config"
        purpose="${filename%.*} configuration"
    elif [[ "$filename" == *"config.js"* ]] || [[ "$filename" == *"eslint"* ]] || [[ "$filename" == *"prettier"* ]]; then
        category="config"
        purpose="${filename%.*} configuration"
    # Source code
    elif [[ "$file" == *"src/"* ]]; then
        category="src"
        if [[ "$file" == *"components/"* ]]; then
            purpose="React component"
        elif [[ "$file" == *"app/"* ]]; then
            purpose="Next.js page"
        elif [[ "$file" == *"lib/"* ]]; then
            purpose="utility function"
        elif [[ "$file" == *"types/"* ]]; then
            purpose="TypeScript type definition"
        fi
    # Scripts
    elif [[ "$file" == *"scripts/"* ]]; then
        category="scripts"
        if [[ "$file" == *"git/"* ]]; then
            purpose="git automation script"
        elif [[ "$file" == *"claude-skills/"* ]]; then
            purpose="Claude skills setup script"
        else
            purpose="automation script"
        fi
    # Tests
    elif [[ "$file" == *"__tests__/"* ]] || [[ "$filename" == *".test."* ]] || [[ "$filename" == *".spec."* ]]; then
        category="test"
        purpose="test file"
    # Root documentation
    elif [[ "$fileext" == "md" ]] && [[ "$filename" == "README.md" ]] || [[ "$filename" == "START-HERE.md" ]] || [[ "$filename" == "QUICK-START.md" ]]; then
        category="docs"
        purpose=$(echo "$filename" | sed 's/\.md$//' | tr '[:upper:]' '[:lower:]' | sed 's/-/ /')" documentation"
    fi
    
    # Generate specific commit message
    local action=""
    case "$status" in
        *A*) action="add" ;;
        *M*) action="update" ;;
        *D*) action="remove" ;;
        *R*) action="refactor" ;;
        *) action="chore" ;;
    esac
    
    if [[ -n "$category" ]] && [[ -n "$purpose" ]]; then
        echo "${action}: ${purpose}"
    else
        # Fallback to file-based message
        local parentdir=$(echo "$dirname" | sed 's|.*/||')
        if [[ "$parentdir" != "." ]] && [[ -n "$parentdir" ]] && [[ ! "$parentdir" =~ \. ]]; then
            echo "${action}: ${filename} in ${parentdir}"
        else
            echo "${action}: ${filename}"
        fi
    fi
}

# Function to commit a single file
commit_file() {
    local file="$1"
    local status="$2"
    local commit_msg=$(get_commit_message "$file" "$status")
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_color $YELLOW "[DRY RUN] Would commit: \"$file\" - \"$commit_msg\""
        return 0
    fi
    
    # Add the specific file with proper quoting for spaces
    if git add "$file" 2>/dev/null; then
        # Commit the file with proper quoting for the message
        if git commit -m "$commit_msg" 2>/dev/null; then
            print_color $GREEN "✅ Committed: \"$file\""
            return 0
        else
            print_color $RED "❌ Failed to commit \"$file\" (commit failed)"
            return 1
        fi
    else
        print_color $RED "❌ Failed to add \"$file\" to staging"
        return 1
    fi
}

# Function to process files in parallel
process_files_parallel() {
    local files=("$@")
    local pids=()
    local results=()
    local success_count=0
    local fail_count=0
    
    print_color $CYAN "⚡ Processing ${#files[@]} files with max $MAX_CONCURRENT concurrent commits..."
    
    for ((i=0; i<${#files[@]}; i+=MAX_CONCURRENT)); do
        # Start a batch of parallel processes
        for ((j=i; j<i+MAX_CONCURRENT && j<${#files[@]}; j++)); do
            local file_info="${files[j]}"
            local file=$(echo "$file_info" | cut -d'|' -f1)
            local status=$(echo "$file_info" | cut -d'|' -f2)
            
            # Properly quote the file path for spaces
            commit_file "$file" "$status" &
            pids+=($!)
        done
        
        # Wait for this batch to complete
        for pid in "${pids[@]}"; do
            wait $pid
            local exit_code=$?
            if [[ $exit_code -eq 0 ]]; then
                ((success_count++))
            else
                ((fail_count++))
            fi
        done
        
        # Clear pids array for next batch
        pids=()
    done
    
    print_color $BRIGHT "📊 Summary:"
    print_color $BLUE "Total files processed: ${#files[@]}"
    print_color $GREEN "Successfully committed: $success_count"
    if [[ $fail_count -gt 0 ]]; then
        print_color $RED "Failed: $fail_count"
    else
        print_color $GREEN "Failed: $fail_count"
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        --max)
            MAX_CONCURRENT="$2"
            shift 2
            ;;
        *)
            print_color $RED "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
print_color $BRIGHT "🚀 Parallel Git Commit Script"
print_color $BRIGHT "=============================="

if [[ "$DRY_RUN" == "true" ]]; then
    print_color $YELLOW "🔍 DRY RUN MODE - No actual commits will be made"
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_color $RED "❌ Not in a git repository!"
    exit 1
fi

# Get changed files
print_color $BLUE "🔍 Scanning for changed files..."
changed_files=()

while IFS= read -r line; do
    if [[ -n "$line" ]]; then
        status="${line:0:2}"
        file="${line:3}"
        
        # Clean up any existing quotes from git status output
        file=$(echo "$file" | sed 's/^["'\'']\|["'\'']$//g')
        
        # Skip excluded patterns
        if [[ "$file" =~ node_modules/ ]] || 
           [[ "$file" =~ \.git/ ]] || 
           [[ "$file" =~ \.log$ ]] || 
           [[ "$file" =~ \.tmp$ ]] || 
           [[ "$file" =~ \.DS_Store$ ]] || 
           [[ "$file" =~ Thumbs\.db$ ]]; then
            continue
        fi
        
        changed_files+=("$file|$status")
    fi
done < <(git status --porcelain)

if [[ ${#changed_files[@]} -eq 0 ]]; then
    print_color $GREEN "✅ No changes to commit"
    exit 0
fi

print_color $BLUE "Found ${#changed_files[@]} changed files:"
for file_info in "${changed_files[@]}"; do
    file=$(echo "$file_info" | cut -d'|' -f1)
    status=$(echo "$file_info" | cut -d'|' -f2)
    
    case "$status" in
        *A*) icon="🆕" ;;
        *M*) icon="📝" ;;
        *D*) icon="🗑️" ;;
        *R*) icon="🔄" ;;
        *) icon="❓" ;;
    esac
    
    print_color $BLUE "  $icon \"$file\" ($status)"
done

# Process commits
process_files_parallel "${changed_files[@]}"

if [[ "$DRY_RUN" == "false" ]]; then
    print_color $GREEN "🎉 All commits completed!"
fi
