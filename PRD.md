# 📄 PRD — Maqsad-Vazifa Boshqaruv Platformasi

> **Loyiha nomi (ishchi):** *Yordamchi — Goal & Task Platform*
> **Versiya:** 1.0 (reja bosqichi) · **Sana:** 2026-07-07 · **Turi:** Shaxsiy produktivlik platformasi

---

## Yig'ilgan tasavvur (qisqacha)

- 👤 **Foydalanuvchi:** shaxsiy (bitta odam)
- 🖥️ **Interfeys:** Web ilova + interaktiv Telegram bot
- 🎯 **Tuzilma:** Maqsad → Kichik maqsad → Vazifa (3 daraja)
- 🤖 **AI:** kunlik tahlil + ertangi reja, avto-tartiblash, maqsadni bo'lish, haftalik hisobot
- 📅 **Kalendar:** Google Calendar (ikki tomonlama)
- 🔔 **Telegram:** muddat eslatmasi, ertalabki reja, kechqurun tahlil so'rovi, bot orqali vazifa qo'shish
- ⚙️ **Stack:** tavsiya etilgan (Next.js + TS + PostgreSQL + Claude API)
- 🚀 **MVP yadrosi:** avval vazifa boshqaruvi, keyin AI va integratsiyalar

---

## 1. Maqsad (Vision)

Foydalanuvchiga o'z **uzoq muddatli maqsadlarini** aniq bosqichlar va kunlik vazifalarga aylantirib, ularni izchil bajarishga yordam beradigan aqlli produktivlik platformasi yaratish. Platforma shunchaki "to-do ro'yxat" emas — u **AI-yordamchi** bo'lib, har kun tahlil qiladi, ertangi kunga reja tuzadi, vazifalarni ustuvorlashtiradi va Telegram orqali foydalanuvchini "yo'lda" ushlab turadi.

**Asosiy qiymat:** *"Katta maqsad → aniq bosqichlar → bugungi 3 ta muhim ish → bajarildi."*

## 2. Muammo (Problem)

- Odamlar katta maqsad qo'yadi, lekin uni **kichik amaliy qadamlarga** bo'la olmaydi → maqsad "og'ir" bo'lib qoladi.
- Kunlik vazifalar ro'yxati o'sib ketadi, lekin **qaysi biri muhim** ekani noaniq.
- Kun oxirida "bugun nima qildim, ertaga nima qilaman?" degan **refleksiya odat**i yo'q.
- Eslatmalar tarqoq (telefon, daftar, boshdagi fikr) → vazifalar unutiladi.
- Mavjud ilovalar (Todoist, Notion) **maslahat bermaydi** — faqat saqlaydi.

## 3. Foydalanuvchi va stsenariylar (Personas & Scenarios)

**Persona:** Motivatsiyali, lekin band shaxs — bir nechta uzoq muddatli maqsadga ega (masalan: "IELTS 7.0", "Startap ishga tushirish", "Sport odatini shakllantirish"), lekin fokus va izchillikda qiynaladi.

**Asosiy stsenariylar:**

| # | Stsenariy |
|---|-----------|
| S1 | Foydalanuvchi web'da yangi maqsad kiritadi → AI uni kichik maqsad va vazifalarga bo'lib beradi → foydalanuvchi tasdiqlaydi/tahrirlaydi. |
| S2 | Ertalab Telegram'ga "Bugungi 3 ta ustuvor ish" xabari keladi. |
| S3 | Kun davomida vazifa muddati yaqinlashsa, Telegram eslatma yuboradi. |
| S4 | Kechqurun bot "Bugun nima bajarding?" deb so'raydi → foydalanuvchi belgilaydi → AI tahlil qilib ertangi rejani tayyorlaydi. |
| S5 | Vazifaga vaqt belgilanganda u Google Calendar'ga chiqadi; kalendardagi bandlik AI rejasiga ta'sir qiladi. |
| S6 | Yakshanba kuni AI haftalik hisobot va motivatsiya xabarini yuboradi. |

## 4. Asosiy modullar (Core Modules)

1. **Auth & Profil** — ro'yxatdan o'tish/kirish, Telegram akkauntini bog'lash, vaqt mintaqasi (timezone) sozlamasi.
2. **Maqsad boshqaruvi** — 3 darajali iyerarxiya: Maqsad → Kichik maqsad (milestone) → Vazifa. CRUD, holat (rejada/jarayonda/bajarildi), progress %.
3. **Vazifa boshqaruvi** — muddat, muhimlik darajasi, taxminiy vaqt, kalendar bog'lanishi, belgilash.
4. **AI dvigateli** — 4 ta funksiya: (a) kunlik tahlil + ertangi reja, (b) avto-tartiblash, (c) maqsadni bo'lish, (d) haftalik hisobot.
5. **Kalendar integratsiyasi** — Google Calendar OAuth, ikki tomonlama sinxronizatsiya.
6. **Telegram bot** — eslatmalar, ertalabki reja, kechqurun tahlil so'rovi, bot orqali CRUD.
7. **Rejalashtiruvchi (Scheduler)** — belgilangan vaqtlarda ishlaydigan fon jarayonlari (cron): eslatmalar, kunlik AI tahlili, haftalik hisobot.
8. **Bildirishnoma servisi** — Telegram (asosiy), keyinchalik email/push (ixtiyoriy).

## 5. Ma'lumot modeli (Data Model — konseptual)

> *Kod emas, entity/maydonlar tavsifi.*

- **User** — `id, email, parolHash, timezone, telegramChatId, googleTokens, yaratilganSana`
- **Goal (Maqsad)** — `id, userId, sarlavha, tavsif, muddat, holat, progress, yaratilganSana`
- **Milestone (Kichik maqsad)** — `id, goalId, sarlavha, tartib, holat, progress`
- **Task (Vazifa)** — `id, userId, milestoneId?, sarlavha, tavsif, muddat(deadline), boshlanishVaqti?, davomiylik, muhimlik(1-3), holat, calendarEventId?, yaratilganSana`
- **DailyPlan (Kunlik reja)** — `id, userId, sana, aiTahlilMatni, tavsiyaEtilganVazifalar[], yaratilganSana`
- **AIInteraction (jurnal)** — `id, userId, tur, kirishKontekst, chiqishNatija, model, tokenlar, sana` — kuzatuv/xarajat uchun.
- **Reminder** — `id, taskId, vaqt, kanal, yuborildimi`

**Munosabatlar:** User 1—N Goal 1—N Milestone 1—N Task. User 1—N DailyPlan.

## 6. AI qismi (AI Layer)

**Model:** Claude (Anthropic API) — masalan `claude-sonnet-5` tez/arzon operatsiyalar, murakkab tahlil uchun `claude-opus-4-8`. (Xarajatni boshqarish uchun oddiy tartiblashda arzonroq model.)

**AI funksiyalari va yondashuvi:**

| Funksiya | Kirish (kontekst) | Chiqish |
|----------|-------------------|---------|
| **Maqsadni bo'lish** | Maqsad matni, muddat | Tuzilgan kichik maqsad + vazifalar ro'yxati (JSON) |
| **Avto-tartiblash** | Ochiq vazifalar, muddatlar, muhimlik, kalendar bandligi | Ustuvorlashtirilgan ro'yxat + sabab |
| **Kunlik tahlil + ertangi reja** | Bugun bajarilgan/bajarilmagan, ertangi kalendar, ochiq maqsadlar | Qisqa tahlil + ertangi 3-5 ustuvor vazifa |
| **Haftalik hisobot** | 7 kunlik progress, tendensiyalar | Hisobot + motivatsion xabar |

**Muhim tamoyillar:**
- AI **strukturlangan chiqish** (JSON) qaytaradi → tizim ishonchli parse qiladi.
- AI **taklif qiladi, foydalanuvchi tasdiqlaydi** (avtomatik o'chirib tashlamaydi).
- Har bir chaqiruv jurnalga yoziladi (token/xarajat kuzatuvi).
- Kontekst cheklangan holda beriladi (barcha ma'lumot emas — kerakli qismi).

## 7. Texnik stack (tavsiya)

| Qatlam | Texnologiya | Sabab |
|--------|-------------|-------|
| Frontend | **Next.js (React) + TypeScript + Tailwind** | Bitta framework'da SSR + UI, tez rivojlanish |
| Backend | **Next.js API routes / Node.js** (yoki alohida NestJS keyin) | Bir til (TS), MVP uchun soddalik |
| Ma'lumotlar bazasi | **PostgreSQL + Prisma ORM** | Ishonchli relyatsion model, migratsiyalar oson |
| Auth | **Auth.js (NextAuth)** | Email + OAuth qulay |
| AI | **Anthropic Claude API** | Yuqori sifatli tahlil, JSON chiqish |
| Telegram | **grammY / Telegraf (Node)** | Bot uchun yetuk kutubxona |
| Kalendar | **Google Calendar API (OAuth2)** | Ikki tomonlama sinxron |
| Scheduler | **node-cron** (MVP) → keyin **BullMQ + Redis** | Vaqtli vazifalar, keyinchalik masshtab |
| Hosting | **Vercel** (web) + **Railway/Render** (bot+DB+cron) | Arzon, tez deploy |

## 8. Cheklovlar — nima KIRMAYDI (Out of Scope, v1)

- ❌ Ko'p foydalanuvchili / jamoa / rollar tizimi (faqat shaxsiy).
- ❌ Native mobil ilova (faqat web + Telegram).
- ❌ To'lov / obuna tizimi (monetizatsiya).
- ❌ Google'dan boshqa kalendarlar (Outlook, Apple) — keyin.
- ❌ Telegram'dan boshqa messenjerlar (WhatsApp va h.k.).
- ❌ Vazifalar bo'yicha jamoaviy hamkorlik, izohlar, fayl biriktirish.
- ❌ Ovozli kiritish / murakkab analitika dashboard'lari.
- ❌ Offline rejim.

## 9. Xatarlar (Risks) va yumshatish

| Xatar | Ta'sir | Yumshatish |
|-------|--------|-----------|
| AI xarajati oshib ketishi | Byudjet | Arzon modeldan foydalanish, kontekstni cheklash, kunlik limit |
| AI noto'g'ri/g'alati chiqish (JSON buzilishi) | Ishonchsizlik | Schema validatsiya, fallback, "tasdiqlash" bosqichi |
| Google OAuth murakkabligi | Kechikish | Alohida sprintga ajratish, avval bir tomonlama sinov |
| Telegram bot uzilishlari | Eslatma kelmasligi | Xatolarni qayta urinish (retry), monitoring |
| Scheduler timezone xatolari | Noto'g'ri vaqtda eslatma | User timezone'ni aniq saqlash, UTC bilan ishlash |
| Scope kengayib ketishi (feature creep) | Cho'zilish | Qat'iy "Out of Scope" ro'yxati, sprintlarga sodiqlik |

---

# 🏃 Sprintlar (4 ta ketma-ket sprint)

Har biri ~1.5–2 hafta (shaxsiy temp'ga qarab). MVP yadrosi — **vazifa boshqaruvi avval** — shu tartibda aks etgan.

### 🟦 Sprint 1 — Poydevor + Vazifa boshqaruvi (MVP yadrosi)
**Maqsad:** Ishlaydigan web ilova — foydalanuvchi kirib, maqsad/kichik maqsad/vazifa yaratib, boshqara oladi.

**Deliverable:**
- Loyiha skeleti (Next.js + TS + Tailwind), PostgreSQL + Prisma sxema.
- Auth (email bilan ro'yxat/kirish).
- 3 darajali CRUD: Maqsad → Kichik maqsad → Vazifa (yaratish, ko'rish, tahrirlash, belgilash).
- Vazifa maydonlari: muddat, muhimlik, holat, progress ko'rsatkichi.
- Asosiy UI: maqsadlar ro'yxati va vazifa ko'rinishi.

**Tayyorlik mezoni (DoD):** Foydalanuvchi ro'yxatdan o'tib, kamida bitta maqsadni to'liq iyerarxiya bilan yaratadi va vazifani "bajarildi" deb belgilay oladi; ma'lumot bazada saqlanadi.

---

### 🟩 Sprint 2 — AI dvigateli
**Maqsad:** Claude integratsiyasi — maqsadni bo'lish, avto-tartiblash va kunlik tahlil ishlaydi.

**Deliverable:**
- Anthropic API integratsiyasi + strukturlangan (JSON) chiqish + schema validatsiya.
- **Maqsadni bo'lish**: maqsad matni → kichik maqsad + vazifalar taklifi → foydalanuvchi tasdiqlaydi.
- **Avto-tartiblash**: ochiq vazifalarni ustuvorlashtirish.
- **Kunlik tahlil + ertangi reja**: DailyPlan yaratish (hozircha qo'lda ishga tushirish tugmasi orqali).
- AIInteraction jurnali (token/xarajat kuzatuvi).

**DoD:** Foydalanuvchi maqsad kiritganda AI uni tuzilgan vazifalarga bo'lib beradi (tasdiqlash bilan), va "Kunni tahlil qil" tugmasi ertangi ustuvor rejani ishonchli chiqaradi.

---

### 🟨 Sprint 3 — Telegram bot + Scheduler
**Maqsad:** Telegram orqali interaktiv tajriba va avtomatik eslatmalar ishlaydi.

**Deliverable:**
- Telegram akkauntni profilga bog'lash (chatId).
- Bot buyruqlari: vazifa qo'shish/ko'rish/belgilash (ikki tomonlama).
- Scheduler (node-cron): muddat eslatmalari, ertalabki kun rejasi, kechqurun "Bugun nima bajarding?" so'rovi.
- Kechqurun so'rov → Sprint 2'dagi AI tahlilini avtomatik ishga tushiradi.
- Timezone bilan to'g'ri ishlash.

**DoD:** Foydalanuvchi Telegram'dan vazifa qo'sha oladi, belgilangan vaqtlarda eslatma/reja xabarlari avtomatik keladi, kechqurun so'rovga javob berib AI tahlilini oladi.

---

### 🟥 Sprint 4 — Google Calendar + Haftalik hisobot + Sayqal
**Maqsad:** Kalendar ikki tomonlama sinxroni, haftalik motivatsiya va umumiy pardoz.

**Deliverable:**
- Google OAuth2 + ikki tomonlama sinxron: vazifa → Calendar event; kalendar bandligi AI rejasiga kontekst.
- **Haftalik hisobot** AI funksiyasi + yakshanba Telegram xabari.
- Xatolarni boshqarish, retry, oddiy monitoring/loglar.
- UI sayqal, progress vizualizatsiyasi, deploy (Vercel + Railway/Render).

**DoD:** Vaqtli vazifa Google Calendar'da paydo bo'ladi va o'zgarish sinxronlanadi; kalendar bandligi ertangi rejaga ta'sir qiladi; har yakshanba haftalik hisobot Telegram'ga keladi; tizim production'da barqaror ishlaydi.
