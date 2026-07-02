# JOOZ.ai Studio

AI-сервис генерации продающего контента для маркетплейсов (Wildberries, Ozon, Яндекс.Маркет): лендинг + личный кабинет с AI-студией.

## Стек

Next.js 14 (App Router) + TypeScript, Tailwind CSS, Framer Motion, Prisma + SQLite, NextAuth.js, OpenRouter (Gemini 2.5 Flash Image / «nano-banana»).

## Быстрый старт

```bash
pnpm install
cp .env.example .env
# сгенерируй секрет и впиши в .env: NEXTAUTH_SECRET
openssl rand -base64 32

pnpm db:push          # создаёт SQLite-базу (prisma/dev.db)
pnpm dev              # http://localhost:3000
```

## Как получить ключи

### OpenRouter (генерация фото — «Nano Banana»)
1. Зарегистрируйся на https://openrouter.ai
2. Раздел **Keys** → создай ключ
3. Пополни баланс (модель `google/gemini-2.5-flash-image` тарифицируется по изображению)
4. В `.env`:
   ```
   OPENROUTER_API_KEY=sk-or-...
   OPENROUTER_MODEL=google/gemini-2.5-flash-image
   ```

Без ключа студия работает в демо-режиме — вместо реальной генерации подставляются стоковые фото, чтобы можно было тестировать весь флоу (hero → апрув → серия → скачивание) бесплатно.

### Яндекс OAuth (вход через Яндекс ID)
1. https://oauth.yandex.ru/client/new
2. Платформа: «Веб-сервисы», Redirect URI: `http://localhost:3000/api/auth/callback/yandex` (и продовый домен)
3. Права доступа: `login:email`, `login:info`
4. В `.env`: `YANDEX_CLIENT_ID`, `YANDEX_CLIENT_SECRET`

### ВКонтакте OAuth
1. https://dev.vk.com/admin/apps → создать приложение (тип «Веб-сайт»)
2. Redirect URI: `http://localhost:3000/api/auth/callback/vk`
3. В `.env`: `VK_CLIENT_ID`, `VK_CLIENT_SECRET`

### Email (magic link / подтверждения)
Укажи данные любого SMTP в `.env`: `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD`, `EMAIL_FROM`.

Без Яндекс/ВК/SMTP ключей эти способы входа просто не отображаются на странице логина — сайт продолжает работать через Email + пароль.

## Назначить администратора (доступ к /admin)

```bash
ADMIN_EMAIL=you@example.com pnpm db:seed
```

После этого зайди под этим email в `/auth/login`, затем открой `/admin` — там можно редактировать все тексты лендинга без разработчика.

## Структура

```
src/app/                 — лендинг, auth, /app (ЛК), /admin (CMS)
src/components/site/     — секции лендинга (hero, features, process, cases, pricing, faq, contacts, footer)
src/components/app/      — сайдбар личного кабинета
src/components/studio/   — студия генерации (промт, стили, окно с сеткой 4 фото)
src/lib/                 — auth, prisma, openrouter, content (CMS-контент)
prisma/schema.prisma     — модель данных (User, Project, GeneratedImage, Transaction, Ticket, ContentBlock)
```

## Статус интеграций

| Интеграция | Статус |
|---|---|
| Auth (Email/Яндекс/ВК) | Реально, ждёт ключи |
| Генерация фото (OpenRouter/Nano Banana) | Реально, ждёт ключ |
| База данных | SQLite (прототип) — для прод. окружения замени `DATABASE_URL` на PostgreSQL, схема совместима |
| Платежи (ЮKassa/Tinkoff) | Мок — оплата тарифов/кредитов сразу зачисляет без реального списания |
| AmoCRM / Telegram / Email-рассылки | Мок — заявки логируются в консоль сервера (`src/app/api/leads/route.ts`) |

## Известные ограничения текущей версии

- Изображения на лендинге захардкожены на Unsplash — замени на свои через CMS (`/admin`) или напрямую в компонентах `src/components/site/*`.
- Видео-фоны в Hero/Контактах пока не подключены (ТЗ предполагает `<video>` — сейчас статичное фото); добавь файлы в `public/video` и подключи в `hero.tsx`/`contacts.tsx`.
- Платежи — мок-эндпоинт `/api/billing/mock-checkout`. Для реальных платежей нужно подключить ЮKassa SDK и заменить этот роут на создание платежа + webhook подтверждения.
