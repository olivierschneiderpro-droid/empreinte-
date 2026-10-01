#!/usr/bin/env node
// Lance la CLI TypeScript via tsx (installé avec le projet).
import { register } from 'tsx/esm/api'
register()
process.argv[1] = new URL('../src/main.ts', import.meta.url).pathname
await import('../src/main.ts')
