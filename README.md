# Forge — Technical Operations Hub

Forge is a proof-of-concept platform for searchable engineering knowledge, project workflows, producer coordination, and external system integrations.

## Core Features

- Technical document ingestion and versioning
- Searchable engineering knowledge
- AI-assisted answers with source citations
- Project creation from technical research
- Producer assignment
- External integrations
- Usage and adoption analytics

## Applications

- `apps/web` — Angular frontend
- `apps/api` — NestJS backend

## Architecture

Forge uses a modular monolith architecture with PostgreSQL as the primary data store.

Primary application modules:

- Documents
- Search
- Projects
- Producers
- Integrations
- Analytics
- Audit

## Development

```bash
nvm use
npm install