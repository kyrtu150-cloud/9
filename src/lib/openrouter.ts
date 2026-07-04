/**
 * Тонкая обёртка над OpenRouter Chat Completions для генерации изображений
 * моделью google/gemini-2.5-flash-image (nano-banana).
 *
 * Если OPENROUTER_API_KEY не задан — возвращаются локальные SVG-заглушки
 * (data-URI, без внешних запросов), чтобы весь флоу студии можно было
 * тестировать бесплатно и офлайн.
 */

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export type GenerateInput = {
  prompt: string;
  style?: string;
  aspect?: string; // "3:4" | "1:1" | "9:16"
  referenceImageUrl?: string;
  variantSeed?: number;
};

export type GeneratedImageResult = {
  url: string;           // data:image/... либо https://...
  source: "openrouter" | "placeholder";
};

const ASPECT_SIZE: Record<string, [number, number]> = {
  "3:4": [768, 1024],
  "1:1": [1024, 1024],
  "9:16": [720, 1280],
};

/** Локальная SVG-заглушка в бренд-стилистике: закатный градиент + номер варианта. */
function placeholderSvg(seed: number, aspect = "3:4"): string {
  const [w, h] = ASPECT_SIZE[aspect] ?? ASPECT_SIZE["3:4"];
  const palettes = [
    ["#3a1707", "#c2470e", "#ff8a3d"],
    ["#0e2b2d", "#177a72", "#2DD4BF"],
    ["#241410", "#7a2f0c", "#ffb37a"],
    ["#1a0e1f", "#6d28d9", "#c4b5fd"],
    ["#26160a", "#b45309", "#fcd34d"],
    ["#0f1d2b", "#1d4ed8", "#93c5fd"],
    ["#2b0f14", "#be123c", "#fda4af"],
    ["#101f10", "#15803d", "#86efac"],
  ];
  const [c1, c2, c3] = palettes[((seed % palettes.length) + palettes.length) % palettes.length];
  const sunY = h * 0.62;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${c1}"/><stop offset="60%" stop-color="${c2}"/><stop offset="100%" stop-color="${c1}"/>
    </linearGradient>
    <radialGradient id="s" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c3}"/><stop offset="100%" stop-color="${c2}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w / 2}" cy="${sunY}" r="${w * 0.28}" fill="url(#s)"/>
  <path d="M0 ${h * 0.78} Q ${w * 0.3} ${h * 0.74} ${w * 0.55} ${h * 0.79} T ${w} ${h * 0.77} V ${h} H 0 Z" fill="#0d0603" opacity="0.85"/>
  <text x="${w / 2}" y="${h * 0.5}" text-anchor="middle" font-family="monospace" font-size="${Math.round(w * 0.05)}" fill="#ffffff" opacity="0.85">JOOZ • DEMO</text>
  <text x="${w / 2}" y="${h * 0.5 + w * 0.07}" text-anchor="middle" font-family="monospace" font-size="${Math.round(w * 0.032)}" fill="#ffffff" opacity="0.5">вариант ${(seed % 99) + 1} • подключите OpenRouter</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function generateImage(input: GenerateInput): Promise<GeneratedImageResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash-image";
  const seed = input.variantSeed ?? Math.floor(Math.random() * 1_000_000);

  if (!apiKey) {
    // Демо-режим: локальная заглушка с имитацией времени генерации
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));
    return { url: placeholderSvg(seed, input.aspect), source: "placeholder" };
  }

  const [w, h] = ASPECT_SIZE[input.aspect ?? "3:4"] ?? ASPECT_SIZE["3:4"];
  const promptText = [
    "Marketplace product photography for Wildberries/Ozon. High commercial quality, soft warm cinematic light, sharp focus, premium feel.",
    `Style direction: ${input.style ?? "Pinterest editorial"}.`,
    `Brief: ${input.prompt}`,
    `Generate a single ${w}x${h} image (${input.aspect ?? "3:4"}) with clean composition.`,
  ].join("\n");

  const content: any[] = [{ type: "text", text: promptText }];
  if (input.referenceImageUrl) {
    content.push({ type: "image_url", image_url: { url: input.referenceImageUrl } });
  }

  const body = {
    model,
    messages: [{ role: "user", content }],
    modalities: ["image", "text"],
    extra_body: { seed },
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
      "X-Title": "JOOZ.ai Studio",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("OpenRouter error:", res.status, (await res.text()).slice(0, 300));
    return { url: placeholderSvg(seed, input.aspect), source: "placeholder" };
  }

  const data = await res.json();
  const message = data?.choices?.[0]?.message;
  const fromImagesArr = message?.images?.[0]?.image_url?.url;
  let fromContent: string | undefined;
  if (Array.isArray(message?.content)) {
    const imgBlock = message.content.find((b: any) => b?.type === "image_url");
    fromContent = imgBlock?.image_url?.url;
  }
  const url = fromImagesArr || fromContent;
  if (!url) {
    console.error("No image in OpenRouter response");
    return { url: placeholderSvg(seed, input.aspect), source: "placeholder" };
  }
  return { url, source: "openrouter" };
}

export async function generateBatch(input: GenerateInput, count: number): Promise<GeneratedImageResult[]> {
  const calls = Array.from({ length: count }).map((_, i) =>
    generateImage({ ...input, variantSeed: (input.variantSeed ?? 0) + i + 1 })
  );
  return Promise.all(calls);
}
