# ARCHITECTURE VISUAL MAP

Visual representations of system architecture and component relationships.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
└───────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │      Frontend (Next.js)      │
        │  ┌────────┐  ┌────────────┐ │
        │  │  Pages │  │ Components │ │
        │  └───┬────┘  └─────┬──────┘ │
        └──────┼─────────────┼─────────┘
               │             │
               └──────┬──────┘
                      │
                      ▼
        ┌──────────────────────────────┐
        │      API Gateway              │
        │  (Auth, Rate Limit, Route)    │
        └──────────────┬───────────────┘
                       │
        ┌──────────────┼───────────────┐
        │              │               │
        ▼              ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  API Service│ │Worker Service│ │Auth Service │
└──────┬──────┘ └──────┬───────┘ └──────┬───────┘
       │               │                │
       └───────┬───────┴────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌──────┐ ┌──────────┐
│Postgres│ │Redis │ │Vector DB │
└────────┘ └──────┘ └──────────┘
```

## Data Flow Diagram

### User Registration Flow

```
User → Frontend → API Gateway → Auth Service → Database
                                      │
                                      ▼
                                 JWT Token
                                      │
                                      ▼
                                 Frontend (Store)
```

### API Request Flow

```
Frontend → API Gateway (Auth Check) → API Service → Database
                                              │
                                              ▼
                                         Response
                                              │
                                              ▼
                                         Frontend
```

## Component Interaction

```
┌─────────────┐         ┌─────────────┐
│   Frontend  │◄────────┤   Backend   │
│  (Next.js)  │  API    │   (FastAPI) │
└──────┬──────┘  Calls  └──────┬───────┘
       │                       │
       │                       │
       ▼                       ▼
┌─────────────┐         ┌─────────────┐
│   Browser   │         │  Database   │
│   Storage   │         │ (PostgreSQL)│
└─────────────┘         └─────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│           Production Environment        │
│                                         │
│  ┌──────────┐      ┌──────────┐        │
│  │   CDN    │      │   Load   │        │
│  │ (Static) │      │ Balancer │        │
│  └────┬─────┘      └────┬─────┘        │
│       │                │              │
│       └────────┬───────┘              │
│                │                      │
│       ┌────────▼────────┐            │
│       │  API Instances   │            │
│       │  (Auto-scaling)  │            │
│       └────────┬─────────┘            │
│                │                      │
│       ┌────────▼────────┐            │
│       │  Database       │            │
│       │  (Primary +     │            │
│       │   Replicas)     │            │
│       └─────────────────┘            │
└─────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌─────────────┐
│  Frontend   │──────▶│   Auth      │
│  (Login)     │      │  Service    │
└─────────────┘      └──────┬──────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  JWT Token     │
                    │  (Signed)      │
                    └──────┬─────────┘
                           │
                           ▼
                    ┌────────────────┐
                    │  API Requests  │
                    │  (Authenticated)│
                    └────────────────┘
```

---

**Last Updated:** [Date]  
**Owner:** Technical Lead

