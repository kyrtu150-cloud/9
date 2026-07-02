import { getContent } from "@/lib/content-server";
import { AdminContentEditor } from "@/components/admin/content-editor";

export const dynamic = "force-dynamic";

const GROUPS: { title: string; keys: string[] }[] = [
  {
    title: "Навигация",
    keys: ["nav.cta", "nav.login"],
  },
  {
    title: "Hero",
    keys: [
      "hero.titleLarge",
      "hero.titleSmall",
      "hero.tagline",
      "hero.stat1.value",
      "hero.stat1.label",
      "hero.stat2.value",
      "hero.stat2.label",
      "hero.stat3.value",
      "hero.stat3.label",
      "hero.footnote",
    ],
  },
  {
    title: "Возможности сервиса",
    keys: [
      "features.title.line1",
      "features.title.line2",
      "features.subtitle",
      "features.card1.kicker",
      "features.card1.title",
      "features.card1.text",
      "features.card2.kicker",
      "features.card2.title",
      "features.card2.text",
      "features.card3.kicker",
      "features.card3.title",
      "features.card3.text",
      "features.card4.kicker",
      "features.card4.title",
      "features.card4.text",
      "features.banner",
    ],
  },
  {
    title: "Процесс",
    keys: [
      "process.title.line1",
      "process.title.line2",
      "process.subtitle",
      "process.step1.title",
      "process.step1.text",
      "process.step2.title",
      "process.step2.text",
      "process.step3.title",
      "process.step3.text",
      "process.step4.title",
      "process.step4.text",
    ],
  },
  {
    title: "Кейсы",
    keys: ["cases.title.line1", "cases.title.line2", "cases.subtitle"],
  },
  {
    title: "Тарифы",
    keys: ["pricing.title.line1", "pricing.title.line2", "pricing.subtitle", "pricing.toggle.month", "pricing.toggle.year"],
  },
  {
    title: "FAQ",
    keys: ["faq.title.line1", "faq.title.line2", "faq.subtitle"],
  },
  {
    title: "Контакты",
    keys: [
      "contacts.title.line1",
      "contacts.title.line2",
      "contacts.subtitle",
      "contacts.cta",
      "contacts.email",
      "contacts.phone",
      "contacts.address",
    ],
  },
  {
    title: "Footer",
    keys: ["footer.tagline", "footer.copyright", "footer.legal"],
  },
];

export default async function AdminPage() {
  const content = await getContent();

  return (
    <div className="container-wide py-10">
      <div className="mb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/85">CMS</div>
        <h1 className="mt-2 font-display text-4xl uppercase text-white">Редактирование контента</h1>
        <p className="mt-2 text-white/65 max-w-xl">
          Меняйте любой текст лендинга без разработчика. Изменения применяются сразу после сохранения.
        </p>
      </div>

      <AdminContentEditor groups={GROUPS} initial={content} />
    </div>
  );
}
