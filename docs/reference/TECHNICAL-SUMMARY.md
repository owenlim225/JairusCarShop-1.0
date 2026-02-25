# TECHNICAL SUMMARY

Quick reference guide for technical decisions, architecture, and implementation details.

## Tech Stack

### Backend
- **Language:** [TypeScript / Python / Other]
- **Framework:** [FastAPI / Express / Other]
- **Runtime:** [Node.js / Python 3.11+ / Other]

### Frontend
- **Framework:** [Next.js / React / Vue / Other]
- **Language:** TypeScript
- **Styling:** [Tailwind CSS / Other]

### Database
- **Primary:** PostgreSQL
- **Cache:** Redis
- **Vector DB:** [Pinecone / pgvector / Other] (if applicable)

### Infrastructure
- **Hosting:** [Vercel / Render / AWS / Other]
- **CI/CD:** GitHub Actions
- **Monitoring:** [Datadog / Sentry / Other]

### Authentication
- **Provider:** [Clerk / Auth0 / Supabase / Custom]

## Architecture Pattern

**Selected:** [Monolithic / Microservices / Serverless / Other]

**Rationale:** [Why this pattern was chosen]

## Key Components

1. **[Component 1]**
   - Purpose: [Description]
   - Technology: [Tech stack]
   - Location: `src/components/[name]`

2. **[Component 2]**
   - Purpose: [Description]
   - Technology: [Tech stack]
   - Location: `src/components/[name]`

## API Structure

### REST API
- **Base URL:** `https://api.[your-domain].com/v1`
- **Authentication:** Bearer token
- **Documentation:** `docs/api/rest-api.md`

### GraphQL API (if applicable)
- **Endpoint:** `https://api.[your-domain].com/graphql`
- **Documentation:** `docs/api/graphql-api.md`

## Development Workflow

1. Create feature branch: `git checkout -b feature/[name]`
2. Develop and test locally
3. Create pull request
4. Code review (2 approvals required)
5. Merge to main
6. Auto-deploy to staging
7. Manual approval for production

## Testing Strategy

- **Unit Tests:** Jest/pytest, target 80%+ coverage
- **Integration Tests:** Test API endpoints
- **E2E Tests:** Critical user flows
- **Run:** `npm test` or `pytest`

## Deployment

### Staging
- **URL:** `https://staging.[your-domain].com`
- **Auto-deploy:** On merge to main
- **Manual approval:** Not required

### Production
- **URL:** `https://[your-domain].com`
- **Auto-deploy:** On staging approval
- **Manual approval:** Required

## Monitoring

- **Uptime:** Target 99.9%
- **Response Time:** Target <200ms (p95)
- **Error Rate:** Target <0.1%
- **Dashboard:** [URL]

## Security

- **Authentication:** [Method]
- **Authorization:** [Method]
- **Encryption:** [Method]
- **Vulnerability Scanning:** [Tool]
- **Audit Frequency:** Quarterly

## Key Decisions

See [ADR Log](./docs/adr/) for all architecture decisions.

---

**Last Updated:** [Date]  
**Owner:** Technical Lead

