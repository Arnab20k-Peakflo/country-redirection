import { defineMiddleware } from "astro:middleware";
import countries from "./countries.json";

interface props {
  request: Request;
  next: () => Promise<Response>;
}

// @ts-ignore
export const onRequest: MiddlewareHandler = defineMiddleware(
  (context, next) => {
    // Get geolocation data from Vercel headers
    const request = context.request;
    const geo = {
      country: request.headers.get("x-vercel-ip-country") || "US",
      city: request.headers.get("x-vercel-ip-city") || "San Francisco",
      region: request.headers.get("x-vercel-ip-country-region") || "CA",
    };

    // Find country information
    const countryInfo = countries.find((x) => x.cca2 === geo.country);
    console.log({ countryInfo });
    if (countryInfo) {
      const currencyCode = Object.keys(countryInfo.currencies)[0];
      // @ts-ignore
      const currency = countryInfo?.currencies[currencyCode] || "";
      const languages = Object.values(countryInfo.languages).join(", ");

      // Append geolocation and currency information to the URL
      const url = new URL(request.url);
      url.searchParams.set("country", geo.country);
      url.searchParams.set("city", geo.city);
      url.searchParams.set("region", geo.region);
      url.searchParams.set("currencyCode", currencyCode);
      url.searchParams.set("currencySymbol", currency.symbol);
      url.searchParams.set("name", currency.name);
      url.searchParams.set("languages", languages);
      console.log({ url: url.toString() });

      // @ts-ignore
      context.locals.country = geo.country;
      // @ts-ignore
      context.locals.city = geo.city;
      // @ts-ignore
      context.locals.region = geo.region;
      // @ts-ignore
      context.locals.currencyCode = currencyCode;
      // @ts-ignore
      context.locals.currencySymbol = currency.symbol;
      // @ts-ignore
      context.locals.code = currencyCode;
      // @ts-ignore
      context.locals.name = currency.name;
      // @ts-ignore
      context.locals.languages = languages;
    }

    return next();
  }
);
