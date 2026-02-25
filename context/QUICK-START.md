# Quick Start: Using the Context Directory

Quick guide for storing LLM-generated outputs.

## Two-Step Process

### 1. Save Raw Output → `content/`

When you get output from an LLM (Claude, GPT, Gemini, etc.):

```bash
# Example: Save Claude-generated code
# File: context/content/claude/code-generation/2026-01-20-api-routes.ts
```

**What to save:**
- Direct copy-paste from LLM
- Initial drafts
- Multiple versions
- Unreviewed content

### 2. Move to Final → `output/`

After reviewing and validating:

```bash
# Move reviewed content to output
# File: context/output/code/2026-01-20-api-routes.ts
```

**What to move:**
- Reviewed and approved content
- Validated code
- Finalized documentation
- Verified analysis

## File Naming

**Format:** `[date]-[llm]-[type]-[description].[ext]`

**Examples:**
- `2026-01-20-claude-code-api-routes.ts`
- `2026-01-20-gpt-docs-user-guide.md`
- `2026-01-20-gemini-analysis-performance.md`

## Directory Guide

### Content (Raw Outputs)
- `content/claude/` - Claude outputs
- `content/gpt/` - GPT outputs
- `content/gemini/` - Gemini outputs
- `content/other/` - Other LLMs

### Output (Finalized Results)
- `output/code/` - Generated code
- `output/docs/` - Generated documentation
- `output/plans/` - Generated plans
- `output/analysis/` - Generated analysis

## Example Workflow

1. **Ask Claude:** "Generate API routes for user authentication"
2. **Save to:** `context/content/claude/code-generation/2026-01-20-auth-routes.ts`
3. **Review:** Check code, test, validate
4. **Move to:** `context/output/code/2026-01-20-auth-routes.ts`
5. **Integrate:** Copy to `src/app/api/auth/` in your project

## Best Practices

- Always review before moving to `output/`
- Include context (prompt, model, date)
- Use descriptive filenames
- Commit to git for tracking
- Clean up old/unused files regularly

## See Also

- [Full Documentation](./README.md) - Complete guide
- [Content Directory](./content/README.md) - Content guidelines
- [Output Directory](./output/README.md) - Output guidelines

