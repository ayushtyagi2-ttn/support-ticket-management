# support-ticket-management

Minimal Express app for creating and listing support tickets during local development.

## Prerequisites

- Node.js 20+

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open `http://localhost:3000` to use the UI, or call the API:

- `GET /api/health` — readiness check
- `GET /api/tickets` — list tickets
- `POST /api/tickets` — create a ticket (`subject`, `description`, optional `priority`)

## Tests

```bash
npm test
```