/// <reference path="../.astro/types.d.ts" />
type EdgeLocals = import('@astrojs/vercel').EdgeLocals

declare namespace App {
  interface Locals extends EdgeLocals {
    // ...
  }
}