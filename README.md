# SKILL-TRADE

Marketplace de troc de competences et services construit avec `Next.js`, `Tailwind CSS` et `Prisma`.

## Stack

- `Next.js` App Router
- `Tailwind CSS`
- `Prisma ORM`
- `PostgreSQL`

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run db:generate
npm run db:push
npm run db:seed
```

## Configuration PostgreSQL

1. Creer une base PostgreSQL nommee `skill_trade`.
2. Copier `.env.example` vers `.env`.
3. Renseigner `DATABASE_URL`.

Exemple:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skill_trade?schema=public"
```

## Initialiser la base

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## Mode fallback

Si `DATABASE_URL` est absent, l'application continue de fonctionner avec les donnees mockees de [src/data/mockData.js](C:/Users/Lenovo/skill-trade/src/data/mockData.js).

Des qu'une base PostgreSQL est configuree et seedee, les pages lisent la base via Prisma.
