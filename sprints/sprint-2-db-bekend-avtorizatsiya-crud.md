# 🟩 Sprint 2 — Ma'lumotlar Bazasi, Backend, Avtorizatsiya va CRUD

> **Loyiha:** Yordamchi — Maqsad-Vazifa Boshqaruv Platformasi
> **Bosqich:** 2/4 · **Fokus:** Backend poydevori — DB, API, auth, CRUD
> **Taxminiy davomiylik:** ~2 hafta
> **Holat:** 🔄 Jarayonda (2026-07-14) — avtorizatsiya + backend asosi tayyor

---

## 🎯 Maqsad

Ilovaning ishlaydigan "skeleti"ni yaratish: ma'lumotlar bazasi sxemasi, backend
API'lar, foydalanuvchi avtorizatsiyasi va maqsad/kichik maqsad/vazifa uchun to'liq
CRUD (yaratish, o'qish, tahrirlash, o'chirish). Sprint oxirida foydalanuvchi
haqiqiy ma'lumotlarni kiritib, bazada saqlashi va Sprint 1'dagi ekranlarni jonli
ma'lumot bilan ko'rishi mumkin bo'lishi kerak.

## 📋 Ish qamrovi (Scope)

### 1. Ma'lumotlar bazasi (PostgreSQL + Prisma)
Prisma sxemasi orqali quyidagi jadvallar:

| Model | Asosiy maydonlar |
|-------|------------------|
| **User** | id, email, parolHash, timezone, telegramChatId?, googleTokens?, yaratilganSana |
| **Goal** | id, userId, sarlavha, tavsif, muddat?, holat, progress, yaratilganSana |
| **Milestone** | id, goalId, sarlavha, tartib, holat, progress |
| **Task** | id, userId, milestoneId?, sarlavha, tavsif, muddat?, boshlanishVaqti?, davomiylik?, muhimlik(1-3), holat, calendarEventId?, yaratilganSana |
| **DailyPlan** | id, userId, sana, aiTahlilMatni, tavsiyaEtilganVazifalar(JSON), yaratilganSana |
| **AIInteraction** | id, userId, tur, kirishKontekst, chiqishNatija, model, tokenlar, sana |
| **Reminder** | id, taskId, vaqt, kanal, yuborildimi |

- Munosabatlar: User 1—N Goal 1—N Milestone 1—N Task; User 1—N DailyPlan.
- Migratsiyalar (`prisma migrate`) va seed (test ma'lumot) skripti.
- Holat (holat) uchun enum'lar: `REJADA | JARAYONDA | BAJARILDI`.

### 2. Avtorizatsiya (Auth.js / NextAuth)
- Email + parol bilan ro'yxatdan o'tish va kirish.
- Parolni xeshlash (bcrypt/argon2).
- Sessiya boshqaruvi (JWT yoki DB session).
- Himoyalangan route'lar (login talab qiluvchi sahifalar/API).
- Profil sozlamalari: timezone saqlash.
- (Google OAuth ulanishi uchun asos — to'liq kalendar sinxroni Sprint 3'da).

> **Yangilanish (2026-07-14):** Email+parol o'rniga **Telegram deep-link
> avtorizatsiya** qabul qilindi (bitta ruxsat etilgan foydalanuvchi, stateless
> JWT). Batafsil — pastdagi hisobot va `CLAUDE.md` Decisions Log.

### 3. Backend API'lar (CRUD)
RESTful yoki Next.js API routes / server actions orqali:

- **Goal:** yaratish, ro'yxat, bitta olish, tahrirlash, o'chirish.
- **Milestone:** goal ichida yaratish/tartiblash/tahrirlash/o'chirish.
- **Task:** yaratish, ro'yxat (filtr: kun/holat/maqsad bo'yicha), tahrirlash,
  holatni o'zgartirish (belgilash), o'chirish.
- **Progress hisoblash:** vazifalar bajarilishiga qarab milestone va goal
  progress % avtomatik yangilanadi.
- Validatsiya (zod yoki shunga o'xshash) va xato javoblari.
- Har bir foydalanuvchi faqat **o'z** ma'lumotini ko'radi (authorization).

### 4. Frontend ulanishi
- Sprint 1 ekranlarini real API'ga ulash (ma'lumot olish/yuborish).
- Yuklanish (loading), xato (error) va bo'sh holatlar (empty state).
- Form validatsiya (client + server).

## 📦 Deliverable (aniq natija)

1. **Ishlaydigan PostgreSQL bazasi** + Prisma sxema va migratsiyalar.
2. **Auth tizimi** — ro'yxat, kirish, chiqish, himoyalangan sahifalar.
3. **To'liq CRUD API'lar** — Goal, Milestone, Task uchun.
4. **Ulanган frontend** — foydalanuvchi UI orqali real ma'lumot yaratadi/ko'radi.
5. **Progress avtomatik hisoblash** ishlaydi.
6. **Seed skript** — demo ma'lumot bilan test qilish uchun.

## ✅ Tayyorlik mezoni (Definition of Done)

- [x] Foydalanuvchi tizimga kiradi (email+parol o'rniga Telegram deep-link orqali;
      ruxsat etilgan yagona foydalanuvchi, himoyalangan `/dashboard` route).
- [ ] Foydalanuvchi maqsad → kichik maqsad → vazifani UI orqali yaratadi va bazada
      saqlanadi.
- [ ] Vazifani "bajarildi" deb belgilaganda progress avtomatik yangilanadi.
- [ ] Har bir foydalanuvchi faqat o'z ma'lumotini ko'radi (izolyatsiya).
- [ ] CRUD amallari validatsiya va xato ishlovi bilan ishonchli ishlaydi.
- [ ] Migratsiyalar toza ishga tushadi (bo'sh bazadan).

## ⚠️ Eslatmalar / Chegaralar
- Bu sprintda **AI va kalendar funksiyalari yo'q** (faqat modellar joyi tayyorlanadi).
- Telegram integratsiyasi yo'q (chatId maydoni tayyorlanadi, xolos).

## 🔜 Keyingi sprintga bog'liqlik
Sprint 3 (AI + kalendar) shu ma'lumot modeli va CRUD ustiga quriladi:
`AIInteraction`, `DailyPlan`, `Task.calendarEventId`, `User.googleTokens`
maydonlaridan foydalaniladi.

## 📝 Bajarilgan ishlar (hisobot)

### 2026-07-07
- Sprint rejasi to'liq hujjatlashtirildi: ma'lumot modeli, auth, CRUD API va progress hisoblash qamrovi aniqlandi — `85dae5d`.
- **Holat:** Reja bosqichi yakunlandi. Amaliy ishlanma (Prisma sxema, migratsiyalar, auth, CRUD API, frontend ulanishi) hali **boshlanmagan** — DoD bandlari kod va baza tayyor bo'lgach belgilanadi.

### 2026-07-14
- **Telegram deep-link avtorizatsiya va backend asosi** ishlab chiqildi (foydalanuvchi buni "Sprint 1 / 1-qism" deb belgiladi, lekin mazmunan Sprint 2'ning auth+backend qismiga tegishli) — `229bf3d`.
- Next.js 14 + TypeScript + Tailwind loyiha skeleti tuzildi (`package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`).
- Avtorizatsiya oqimi: foydalanuvchi "Telegram orqali kirish" tugmasini bosadi → botga `/start login` yuboradi → bot faqat ruxsat etilgan yagona Telegram ID (`ALLOWED_TELEGRAM_ID`) ekanini tekshiradi → imzolangan qisqa muddatli (5 daqiqa) kirish havolasini beradi → havola sessiya cookie o'rnatib `/dashboard` ga kiritadi (`src/lib/telegram.ts`, `src/app/api/auth/callback/route.ts`, `src/app/login/page.tsx`).
- Xavfsizlik: faqat bitta ruxsat etilgan Telegram akkaunt kira oladi, boshqa har qanday ID rad etiladi (lokal testda tasdiqlangan: ruxsat etilgan ID kiradi, boshqa ID'lar rad etiladi).
- Stateless JWT (`jose` kutubxonasi, `src/lib/auth.ts`): auth-link (5 daqiqa) va session (30 kun) tokenlari, `AUTH_SECRET` bilan imzolangan — serverless (Vercel) uchun DB talab qilmaydi.
- `src/middleware.ts` orqali `/dashboard` route himoyasi (sessiyasiz kirishda `/login` ga yo'naltiradi).
- Telegram webhook endpoint (`src/app/api/telegram/webhook/route.ts`) `TELEGRAM_WEBHOOK_SECRET` bilan himoyalangan (noto'g'ri secret → 401).
- `prisma/schema.prisma` — PRD 5-bo'lim ma'lumot modeli asosida barcha jadvallar (User, Goal, Milestone, Task, DailyPlan, AIInteraction, Reminder) yozildi; bu backend asosi, migratsiyalar hali ishga tushirilmagan.
- Yordamchi fayllar: `scripts/set-webhook.mjs` (webhook o'rnatish), `.env.example`, `.gitignore`; maxfiy kalitlar faqat `.env.local` da saqlanadi va git'ga commit qilinmaydi.
- Eski test `index.html` o'chirildi — uy sahifasini endi Next.js ilovasi beradi.
- Lokal verifikatsiya (barchasi o'tdi): `/login`=200, `/dashboard` sessiyasiz→login'ga, sessiya bilan→200, callback→cookie o'rnatadi, webhook xato/yo'q secret→401, bot faqat ruxsat etilgan ID'ga havola beradi, `npm run build` muvaffaqiyatli.
- **Holat:** Auth va backend asosi (DB sxemasi + avtorizatsiya) tayyor. Migratsiyalar, CRUD API'lar, progress hisoblash va frontend-backend ulanishi hali **qolgan ish** — quyidagi DoD bandlari shu ishlar tugagach belgilanadi.
