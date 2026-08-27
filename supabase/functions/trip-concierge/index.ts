/**
 * Trip Concierge — Supabase Edge Function (Deno).
 *
 * POST { car: { name, type, seats }, startDate, endDate, from, to, language }
 * → { days: [{ day, title, stops: [{ time, name, note }] }], tips: string[] }
 *
 * Calls an OpenAI-compatible chat completions API and enforces a strict JSON
 * response shape. See README.md in this folder for deploy instructions.
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ConciergeRequest {
  car: { name: string; type: string; seats: number };
  startDate: string;
  endDate: string;
  from: string;
  to: string;
  language: "en" | "ar";
}

interface ItineraryStop {
  time: string;
  name: string;
  note: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  stops: ItineraryStop[];
}

interface Itinerary {
  days: ItineraryDay[];
  tips: string[];
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function validateRequest(body: unknown): ConciergeRequest | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const car = b.car as Record<string, unknown> | undefined;
  if (
    !car ||
    !isString(car.name) ||
    !isString(car.type) ||
    typeof car.seats !== "number" ||
    !isString(b.startDate) ||
    !isString(b.endDate) ||
    !isString(b.from) ||
    !isString(b.to) ||
    (b.language !== "en" && b.language !== "ar")
  ) {
    return null;
  }
  return {
    car: { name: car.name, type: car.type, seats: car.seats },
    startDate: b.startDate,
    endDate: b.endDate,
    from: b.from,
    to: b.to,
    language: b.language,
  };
}

/** Rejects any LLM output that does not match the itinerary contract exactly. */
function validateItinerary(data: unknown): Itinerary | null {
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.days) || d.days.length === 0) return null;
  if (!Array.isArray(d.tips)) return null;

  const days: ItineraryDay[] = [];
  for (const raw of d.days) {
    if (typeof raw !== "object" || raw === null) return null;
    const day = raw as Record<string, unknown>;
    if (typeof day.day !== "number" || !isString(day.title) || !Array.isArray(day.stops))
      return null;
    const stops: ItineraryStop[] = [];
    for (const rawStop of day.stops) {
      if (typeof rawStop !== "object" || rawStop === null) return null;
      const stop = rawStop as Record<string, unknown>;
      if (!isString(stop.time) || !isString(stop.name) || !isString(stop.note)) return null;
      stops.push({ time: stop.time, name: stop.name, note: stop.note });
    }
    days.push({ day: day.day, title: day.title, stops });
  }

  const tips = d.tips.filter(isString);
  return { days, tips };
}

function buildSystemPrompt(language: "en" | "ar"): string {
  const langLine =
    language === "ar"
      ? "Write ALL user-facing text (titles, stop names, notes, tips) in Modern Standard Arabic."
      : "Write ALL user-facing text in English.";
  return [
    "You are Trip Concierge for Re7lety, a premium car rental service in Egypt (Al Omda Office).",
    "Given a rented car, rental dates, an origin, and a destination, produce a realistic",
    "day-by-day DRIVING itinerary inside Egypt: highway choices, realistic driving times,",
    "rest stops, fuel stops, sights, food, and arrival timing. Account for Egyptian road",
    "conditions, checkpoints, and daylight. Match the plan to the car type and seat count.",
    langLine,
    "Respond with STRICT JSON only — no markdown, no code fences, no commentary. Shape:",
    '{ "days": [{ "day": 1, "title": "...", "stops": [{ "time": "08:00", "name": "...", "note": "..." }] }], "tips": ["..."] }',
    "Every day needs 3-6 stops with 24h times. tips is 3-6 short strings.",
  ].join(" ");
}

async function callModel(req: ConciergeRequest): Promise<Itinerary> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const baseUrl = (Deno.env.get("OPENAI_BASE_URL") ?? "https://api.openai.com/v1").replace(
    /\/$/,
    "",
  );
  const model = Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini";

  const userPrompt = JSON.stringify({
    car: req.car,
    startDate: req.startDate,
    endDate: req.endDate,
    from: req.from,
    to: req.to,
    language: req.language,
  });

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt(req.language) },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Upstream model error ${res.status}: ${detail.slice(0, 300)}`);
  }

  const payload = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("Model returned an empty response");

  // Some models wrap JSON in code fences despite instructions; strip them.
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Model response was not valid JSON");
  }

  const itinerary = validateItinerary(parsed);
  if (!itinerary) throw new Error("Model response did not match the itinerary schema");
  return itinerary;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const req = validateRequest(body);
  if (!req) {
    return json(
      { error: "Expected { car: {name, type, seats}, startDate, endDate, from, to, language }" },
      400,
    );
  }

  try {
    const itinerary = await callModel(req);
    return json(itinerary);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Itinerary generation failed" }, 502);
  }
});
