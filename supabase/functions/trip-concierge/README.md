# Trip Concierge Edge Function

Generates a day-by-day Egypt driving itinerary for a booked car using an
OpenAI-compatible chat API. The app (`src/core/concierge.ts`) calls this
function when `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` are configured;
otherwise it falls back to a built-in local itinerary generator.

## API

`POST /functions/v1/trip-concierge` with `Authorization: Bearer <anon key>`.

Request body:

```json
{
  "car": { "name": "Land Cruiser LC300", "type": "SUV", "seats": 7 },
  "startDate": "2026-09-01",
  "endDate": "2026-09-04",
  "from": "Cairo",
  "to": "North Coast",
  "language": "en"
}
```

Response (strict JSON, validated server-side):

```json
{
  "days": [
    {
      "day": 1,
      "title": "Cairo to the North Coast",
      "stops": [{ "time": "08:00", "name": "Fuel up in Sheikh Zayed", "note": "..." }]
    }
  ],
  "tips": ["Keep the tank above half on desert highways."]
}
```

Errors return `{ "error": "..." }` with status 400 (bad request) or 502
(upstream model failure). CORS is open (`*`) for app clients.

## Deploy

From the repo root (requires the [Supabase CLI](https://supabase.com/docs/guides/cli)
and a linked project — `supabase link --project-ref <ref>`):

```sh
supabase functions deploy trip-concierge
```

## Secrets

Set the model credentials before first use:

```sh
supabase secrets set OPENAI_API_KEY=sk-...
# Optional — defaults shown:
supabase secrets set OPENAI_BASE_URL=https://api.openai.com/v1
supabase secrets set OPENAI_MODEL=gpt-4o-mini
```

`OPENAI_BASE_URL` lets you point at any OpenAI-compatible endpoint
(Azure OpenAI, OpenRouter, a local gateway, etc.).

## Local testing

```sh
supabase functions serve trip-concierge --env-file supabase/.env.local
curl -s -X POST http://localhost:54321/functions/v1/trip-concierge \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"car":{"name":"Land Cruiser","type":"SUV","seats":7},"startDate":"2026-09-01","endDate":"2026-09-04","from":"Cairo","to":"North Coast","language":"en"}'
```
