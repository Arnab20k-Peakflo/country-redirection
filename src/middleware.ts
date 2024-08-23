import { defineMiddleware } from "astro:middleware";
import countries from "./countries.json";

export const prerender = false;

// @ts-ignore
export const onRequest: MiddlewareHandler = defineMiddleware(
  async (context, next) => {
    const ipRes = await fetch("https://ipinfo.io/json");
    const ipData: Record<string, string> = await ipRes.json();
    const { country } = ipData;
    // @ts-ignore
    context.locals.country = country
    return next();
  }
);
