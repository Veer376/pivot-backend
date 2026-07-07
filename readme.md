# Backend API

Minimal Express backend for the project.

## Clone

```bash
git clone <your-backend-repo-url>
cd backend
```

## Install

```bash
npm install
```

## Run

```bash
node --watch server.js
```

## Health Check

The server exposes a simple health endpoint at `/` that responds with:

```json
{ "status": "ok" }
```
