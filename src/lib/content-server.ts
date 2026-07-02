import { prisma } from "./prisma";
import { DEFAULT_CONTENT, type Content } from "./content";

/**
 * Загружает все ключи контента из БД и накладывает поверх дефолтов.
 * Безопасно к ошибкам — если БД недоступна, возвращает только дефолты.
 * Импортировать только из серверных компонентов/route-хендлеров.
 */
export async function getContent(): Promise<Content> {
  try {
    const rows = await prisma.contentBlock.findMany();
    const overrides: Content = {};
    for (const r of rows) overrides[r.key] = r.value;
    return { ...DEFAULT_CONTENT, ...overrides };
  } catch {
    return { ...DEFAULT_CONTENT };
  }
}
