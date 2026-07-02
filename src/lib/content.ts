/**
 * Контент по-умолчанию. Любой ключ можно переопределить через /admin —
 * значение читается из таблицы ContentBlock на сервере во время рендера.
 */
export const DEFAULT_CONTENT: Record<string, string> = {
  // Nav
  "nav.cta": "Попробовать бесплатно",
  "nav.login": "Войти",

  // HERO
  "hero.titleLarge": "JOOZ.",
  "hero.titleSmall": "ai studio",
  "hero.tagline": "ФОТО\nСОЗДАНО ВРУЧНУЮ\nС ПОМОЩЬЮ ИИ",
  "hero.stat1.value": "50000+",
  "hero.stat1.label": "Мы знаем какой кадр продаёт, а какой — нет.",
  "hero.stat2.value": "1 000+",
  "hero.stat2.label": "артикулов обработано за год действующей студии по 50+ фото на арт.",
  "hero.stat3.value": "3+",
  "hero.stat3.label": "года продаём на маркетплейсах",
  "hero.footnote": "весь свой опыт заложили в этот сервис",

  // Features
  "features.title.line1": "ВОЗМОЖНОСТИ",
  "features.title.line2": "СЕРВИСА",
  "features.subtitle":
    "JOOZ.ai Studio объединяет все необходимые инструменты для создания продающего контента на основе ИИ",
  "features.card1.kicker": "01. ГЕНЕРАЦИЯ ОБЛОЖКИ",
  "features.card1.title": "10 главных фото для А/B теста",
  "features.card1.text":
    "Получите 10 уникальных фронтальных кадров в разных локациях и позах. Протестируйте, что лучше заходит вашей аудитории, и принимайте решения на основе аналитики, а не догадок.",
  "features.card2.kicker": "02. ПОЛНАЯ ФОТОВОРОНКА",
  "features.card2.title": "15 фото в едином стиле",
  "features.card2.text":
    "1 главное фото + 14 дополнительных ракурсов: спереди, сзади, сбоку, детали, макро, разные позы и ракурсы. Полная визуальная воронка — от клика до покупки.",
  "features.card3.kicker": "03. ВИДЕО ОБЛОЖКИ",
  "features.card3.title": "Движение, которое продаёт",
  "features.card3.text":
    "Генерируйте короткие видео-обложки, которые цепляют с первого кадра. Идеально для маркетплейсов, сторис и рекламных кампаний.",
  "features.card4.kicker": "04. ИНФОГРАФИКА",
  "features.card4.title": "Структура, которая убеждает",
  "features.card4.text":
    "Создавайте продающую инфографику на основе сгенерированных фото или загружайте свои изображения. Усильте карточку товара фактами и выгодами.",
  "features.banner":
    "Все функции работают на основе ИИ и адаптированы под задачи маркетплейсов. Экономьте время, тестируйте гипотезы и увеличивайте продажи с JOOZ.ai Studio.",

  // Process
  "process.title.line1": "КАК РАБОТАЕТ",
  "process.title.line2": "СЕРВИС",
  "process.subtitle": "От референса до готовой карточки — четыре шага",
  "process.step1.title": "Загрузка референса",
  "process.step1.text": "Загрузите фото товара или вдохновляющий референс. ИИ изучит композицию, свет и стиль.",
  "process.step2.title": "AI-анализ стиля",
  "process.step2.text": "Нейросеть выделяет ключевые атрибуты: цвет, фактуру, форму, позу — и предлагает варианты направления.",
  "process.step3.title": "Генерация",
  "process.step3.text": "Утвердите главный кадр — и получите готовую серию из 14 ракурсов в едином стиле.",
  "process.step4.title": "Экспорт",
  "process.step4.text": "Скачайте готовые JPG и PNG в форматах под Wildberries, Ozon и Яндекс.Маркет.",

  // Cases
  "cases.title.line1": "КЕЙСЫ",
  "cases.title.line2": "В ДЕЙСТВИИ",
  "cases.subtitle": "Четыре формата — четыре результата. Реальные продажи, реальные карточки.",

  // Pricing
  "pricing.title.line1": "ТАРИФЫ",
  "pricing.title.line2": "ПОДПИСКИ",
  "pricing.subtitle":
    "Выбирайте подписку под объём задач. Не хватает кредитов — докупайте пачками без смены тарифа.",
  "pricing.toggle.month": "Месяц",
  "pricing.toggle.year": "Год (-20%)",

  // FAQ title
  "faq.title.line1": "ОТВЕТЫ",
  "faq.title.line2": "НА ВОПРОСЫ",
  "faq.subtitle": "Собрали то, что чаще всего спрашивают селлеры и бренд-менеджеры.",

  // Contacts
  "contacts.title.line1": "ГОТОВ ПРОДАВАТЬ",
  "contacts.title.line2": "БОЛЬШЕ?",
  "contacts.subtitle":
    "Оставьте заявку — за 24 часа подключим к студии, перенесём референсы и сделаем первую генерацию вместе.",
  "contacts.cta": "Начать бесплатно",
  "contacts.email": "hello@jooz.ai",
  "contacts.phone": "+7 (800) 555-37-90",
  "contacts.address": "Москва, ул. Большая Пироговская, 27/4",

  // Footer
  "footer.tagline": "AI-студия продающего контента для селлеров и брендов.",
  "footer.copyright": "© 2026 JOOZ.ai Studio. Все права защищены.",
  "footer.legal":
    "ООО «ДЖУЗ АИ», ИНН 7777777777, ОГРН 1237777777777. Услуги оказываются по публичной оферте.",
};

export type Content = Record<string, string>;

export function c(content: Content, key: string): string {
  return content[key] ?? key;
}
