/**
 * Тонкая обёртка над OpenRouter Chat Completions для генерации изображений
 * моделью google/gemini-2.5-flash-image (nano-banana).
 *
 * Если OPENROUTER_API_KEY не задан — возвращаются placeholder-изображения
 * со стоков, чтобы фронт можно было полноценно тестировать без расходов.
 */

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

const PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
];

export type GenerateInput = {
  prompt: string;
  style?: string;
  referenceImageUrl?: string;
  variantSeed?: number;
};

export type GeneratedImageResult = {
  url: string;           // либо data:image/..;base64,..., либо https://...
  source: "openrouter" | "placeholder";
};

function pickPlaceholder(seed: number): string {
  const idx = ((seed % PLACEHOLDERS.length) + PLACEHOLDERS.length) % PLACEHOLDERS.length;
  return `${PLACEHOLDERS[idx]}&sig=${seed}`;
}

export async function generateImage(input: GenerateInput): Promise<GeneratedImageResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash-image";
  const seed = input.variantSeed ?? Math.floor(Math.random() * 1_000_000);

  if (!apiKey) {
    // Без ключа — возвращаем стоковую заглушку для рабочего демо.
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
    return { url: pickPlaceholder(seed), source: "placeholder" };
  }

  const promptText = [
    "Marketplace product photography for Wildberries/Ozon. High commercial quality, soft warm cinematic light, sharp focus, premium feel.",
    `Style direction: ${input.style ?? "Pinterest editorial"}.`,
    `Brief: ${input.prompt}`,
    `Generate a single 1024x1280 image with clean composition.`,
  ].join("\n");

  const content: any[] = [{ type: "text", text: promptText }];
  if (input.referenceImageUrl) {
    content.push({ type: "image_url", image_url: { url: input.referenceImageUrl } });
  }

  const body = {
    model,
    messages: [{ role: "user", content }],
    modalities: ["image", "text"],
    // OpenRouter ignores unknown params gracefully, but passing seed helps with variety
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
    const t = await res.text();
    console.error("OpenRouter error:", res.status, t);
    return { url: pickPlaceholder(seed), source: "placeholder" };
  }

  const data = await res.json();
  // Extract image: OpenRouter возвращает либо message.images[0].image_url.url,
  // либо assets, либо content-блоки с image_url.
  const message = data?.choices?.[0]?.message;
  const fromImagesArr = message?.images?.[0]?.image_url?.url;
  let fromContent: string | undefined;
  if (Array.isArray(message?.content)) {
    const imgBlock = message.content.find((b: any) => b?.type === "image_url");
    fromContent = imgBlock?.image_url?.url;
  }
  const url = fromImagesArr || fromContent;
  if (!url) {
    console.error("No image in response:", JSON.stringify(data).slice(0, 500));
    return { url: pickPlaceholder(seed), source: "placeholder" };
  }
  return { url, source: "openrouter" };
}

export async function generateBatch(input: GenerateInput, count: number): Promise<GeneratedImageResult[]> {
  const calls = Array.from({ length: count }).map((_, i) =>
    generateImage({ ...input, variantSeed: (input.variantSeed ?? 0) + i + 1 })
  );
  return Promise.all(calls);
}
