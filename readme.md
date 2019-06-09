# Introduction

A graphql api that's conntect to an elastic search and it's used to search for companies

# Getting Started

1. Install `nvm` and then run `nvm use`
2. Run `npm install` in order to get started.
3. Run `npm run start` OR follow the instructions below to start in debug mode in VS code

# Run debug mode in VS code

Add a `launch.json`file at `.vscode/launch.json`.

```
{
  "version": "0.1.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch app",
      "args": ["${workspaceFolder}/launch.js"],
      "envFile": "${workspaceFolder}/.env"
    }
  ]
}
```

# Env variables

- ELASTIC_USERNAME
- ELASTIC_PASSWORD
- ELASTIC_CLOUD_ID
