# The PaaS Backend

This is the backend service for a Proof-as-a-Service (PaaS) built using [NestJS](https://nestjs.com/), a progressive Node.js framework.

## 🛠️ Technologies

- **NestJS** – Node.js framework for scalable server-side applications
- **TypeScript** – strongly typed language that builds on JavaScript
- **TypeORM** – ORM for database access
- **Jest** – testing framework
- **ESLint** & **Prettier** – linting and formatting

## 📁 Project Structure

Typical NestJS structure with:

- `src/` – application source code
- `test/` – unit and e2e tests
- `dist/` – compiled output (after build)

## 🚀 Getting Started

### Install dependencies

```bash
yarn install
````

### Run in development

```bash
yarn start:dev
```

### Run in production

```bash
yarn build
yarn start:prod
```

## 🧪 Testing

```bash
yarn test          # Run tests
yarn test:watch    # Watch mode
yarn test:cov      # Coverage report
yarn test:debug    # Debug mode
```

## 📦 Build

```bash
yarn build
```

## 🧹 Code Quality

Format code:

```bash
yarn format
```

Lint and auto-fix issues:

```bash
yarn lint
```

## 🧬 Database Migrations

Before running any migration commands, make sure to build the project:

```bash
yarn build
```

Then you can use:

```bash
yarn migration:create <name>      # Create an empty migration
yarn migration:generate <name>    # Generate migration from entity changes
yarn migration:run                # Apply all pending migrations
yarn migration:revert             # Revert the last applied migration
yarn migration:show               # Show all executed and pending migrations
```

> **Note**: Migration CLI uses `typeorm.config.ts` as the config entrypoint.
