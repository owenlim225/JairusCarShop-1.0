# MDX Documentation

This directory contains all MDX documentation files for the project.

## Structure

All MDX files are organized here for easy management and routing through Next.js.

## Available Documentation

- **README.mdx** - Documentation hub and navigation
- **getting-started.mdx** - Quick setup guide
- **planning-framework.mdx** - 12-section planning framework
- **technical-guide.mdx** - Technical implementation guide
- **claude-skills.mdx** - AI-powered Claude skills
- **quick-reference.mdx** - Daily cheat sheet
- **use-cases.mdx** - Real-world scenarios
- **skills-examples.mdx** - Practical examples
- **faq.mdx** - Frequently asked questions

## Access

These files are accessible via the `/docs` route:

- `/docs` - Documentation index
- `/docs/getting-started` - Getting started
- `/docs/planning-framework` - Planning framework
- `/docs/technical-guide` - Technical guide
- `/docs/claude-skills` - Claude skills
- `/docs/quick-reference` - Quick reference
- `/docs/use-cases` - Use cases
- `/docs/skills-examples` - Skills examples
- `/docs/faq` - FAQ

## Adding New Documentation

To add new MDX documentation:

1. Create a new `.mdx` file in this directory
2. The file will automatically be accessible at `/docs/[filename]`
3. Update `src/app/docs/page.tsx` to add it to the index

## File Naming

- Use lowercase with hyphens: `my-documentation.mdx`
- URLs will match: `/docs/my-documentation`

