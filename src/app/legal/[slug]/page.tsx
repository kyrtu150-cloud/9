import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/ui/logo";

const DOCS: Record<string, { title: string; body: string }> = {
  privacy: {
    title: "Политика конфиденциальности",
    body: `Настоящая Политика определяет порядок обработки персональных данных пользователей сервиса JOOZ.ai Studio.

Мы обрабатываем минимум данных: email, имя, информацию о подписке и платежах. Передача третьим лицам — только по требованию законодательства или с вашего согласия. Хранение — в защищённой инфраструктуре с шифрованием.

Полный текст можно запросить по адресу privacy@jooz.ai.`,
  },
  offer: {
    title: "Публичная оферта",
    body: `Оператор сервиса — ООО «ДЖУЗ АИ» — предлагает любому дееспособному лицу заключить договор на оказание услуг доступа к платформе JOOZ.ai Studio на условиях, размещённых на сайте.

Оплата подписки или докупка кредитов считается полным и безоговорочным принятием условий настоящей оферты.`,
  },
  terms: {
    title: "Пользовательское соглашение",
    body: `Используя сервис JOOZ.ai Studio, вы соглашаетесь не нарушать действующее законодательство, не загружать запрещённый контент и не пытаться нарушить работу платформы.

Все сгенерированные изображения принадлежат пользователю и могут использоваться в коммерческих целях, включая публикацию на маркетплейсах.`,
  },
};

export default function LegalDoc({ params }: { params: { slug: string } }) {
  const doc = DOCS[params.slug];
  if (!doc) notFound();
  return (
    <div className="min-h-screen bg-bg-base">
      <header className="container-wide py-6 flex items-center justify-between">
        <Logo />
        <Link href="/" className="text-sm text-white/70 hover:text-accent">
          ← Назад на главную
        </Link>
      </header>
      <main className="container-wide py-12 max-w-3xl">
        <h1 className="font-display text-4xl lg:text-5xl uppercase text-white">{doc.title}</h1>
        <article className="mt-8 text-white/75 leading-relaxed whitespace-pre-line space-y-6">
          {doc.body}
        </article>
      </main>
    </div>
  );
}
