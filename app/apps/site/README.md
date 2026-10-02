# Empreinte Site

The Empreinte public site uses [TanStack Start](https://tanstack.com/start), TanStack Router file-based routing, Tailwind CSS v4, and shadcn/ui primitives.

## Development

The [Empreinte Brand Guidelines](../../docs/charte-graphique.md) document [Illustrated Worlds](../../docs/design/illustrations.md), with visual references and prompts for creating scenes consistent with the site and application illustrations.

From the monorepo root:

```bash
yarn install
yarn dev:site
```

The application is available at `http://localhost:3000`.

## Validation

```bash
yarn workspace @empreinte/site typecheck
yarn workspace @empreinte/site build
```

Routes live in `src/routes`. Generate `src/routeTree.gen.ts` with `yarn workspace @empreinte/site generate-routes`.

The shadcn/ui components live in `components/ui`; theme variables, fonts, and global editorial styles are defined in `src/styles.css`.

## Deployment

The build produces a Nitro server in `.output/server` and public assets in `.output/public`. `vercel.json` selects the TanStack Start adapter on Vercel.
