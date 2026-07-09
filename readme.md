# Backend API

Minimal Express backend for the project.

Repository: https://github.com/Veer376/pivot-backend.git

## Clone

```bash
git clone https://github.com/Veer376/pivot-backend.git
cd backend
```

## Install

```bash
npm install
```

## Add api keys
Rename .env.example to .env and your own api keys.

## Run

```bash
node --watch server.js
```

## Test /chat endpoint on postman.
req.body = {
    "messages": [
        {
            "role": "user",
            "content": "Hello" 
        }
    ]
}
