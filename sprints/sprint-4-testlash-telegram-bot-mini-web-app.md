# 🟥 Sprint 4 — Testlash, Telegram Bot Integratsiya va Mini Web App

> **Loyiha:** Yordamchi — Maqsad-Vazifa Boshqaruv Platformasi
> **Bosqich:** 4/4 · **Fokus:** Telegram bot, mini web app, scheduler, test va deploy
> **Taxminiy davomiylik:** ~2–2.5 hafta

---

## 🎯 Maqsad

Platformani foydalanuvchining kundalik hayotiga olib kirish: interaktiv Telegram
bot, Telegram ichida ochiladigan **mini web app**, avtomatik eslatma/tahlil
(scheduler), hamda mahsulotni ishonchli qilish uchun testlash va production'ga
deploy. Bu sprint oxirida to'liq ishlaydigan MVP tayyor bo'ladi.

## 📋 Ish qamrovi (Scope)

### 1. Telegram bot (grammY / Telegraf)
- Botni yaratish va profil bilan bog'lash (`User.telegramChatId`).
- Akkauntni ulash oqimi (masalan bir martalik kod / deep link).
- **Bot buyruqlari (ikki tomonlama CRUD):**
  - `/start` — ulash va tanishtirish.
  - Vazifa qo'shish (matn orqali).
  - Bugungi vazifalarni ko'rish.
  - Vazifani "bajarildi" deb belgilash (inline tugmalar).
  - Maqsadlar ro'yxatini ko'rish.
- Inline klaviatura va tugmalar orqali qulay tajriba.

### 2. Scheduler (avtomatik jarayonlar)
- node-cron (MVP) — foydalanuvchi timezone'iga mos ishlaydi (UTC asosida).
- **Muddat eslatmasi:** vazifa boshlanishi/tugashidan oldin Telegram xabar.
- **Ertalabki reja:** har kuni ertalab AI tayyorlagan ustuvor vazifalarni yuborish.
- **Kechqurun tahlil so'rovi:** "Bugun nima bajarding?" → javob → Sprint 3'dagi AI
  kunlik tahlilini avtomatik ishga tushiradi.
- **Haftalik hisobot:** yakshanba kuni AI hisobot + motivatsiya Telegram'ga.
- `Reminder` jadvali orqali yuborilgan/yuborilmagan holatini kuzatish.
- Ishonchlilik: retry, xatolarni loglash, monitoring.

### 3. Telegram Mini Web App
- Telegram ichida ochiladigan mobil-birinchi web ilova (Sprint 1'dagi mobil maket
  asosida).
- Asosiy ekranlar: bugungi vazifalar, maqsadlar, tez qo'shish, belgilash.
- Telegram Web App SDK bilan autentifikatsiya (initData tekshiruvi).
- Web va mini app o'rtasida yagona backend/ma'lumot.

### 4. Testlash
- **Unit testlar:** AI JSON parse/validatsiya, progress hisoblash, muhim biznes
  mantiq.
- **Integratsion testlar:** CRUD API'lar, auth oqimi, kalendar sinxroni (mock).
- **E2E testlar (asosiy oqimlar):** ro'yxatdan o'tish → maqsad yaratish → vazifa
  belgilash; AI bo'lish oqimi; Telegram ulash.
- Qo'lda test ssenariylari (test-plan) hujjati.
- Xato va chegaraviy holatlarni tekshirish (timezone, bo'sh ma'lumot, token
  muddati).

### 5. Deploy va yakuniy sayqal
- Production deploy: **Vercel** (web) + **Railway/Render** (bot + DB + cron).
- Muhit o'zgaruvchilari (env) va sirlar boshqaruvi.
- Loglar va oddiy monitoring/alert.
- UI sayqal: progress vizualizatsiyasi, animatsiyalar, kichik tuzatishlar.
- Foydalanuvchi hujjati / qisqa qo'llanma (README yangilash).

## 📦 Deliverable (aniq natija)

1. **Ishlaydigan Telegram bot** — ikki tomonlama CRUD, inline tugmalar.
2. **Avtomatik scheduler** — muddat eslatmasi, ertalabki reja, kechqurun so'rov,
   haftalik hisobot.
3. **Telegram Mini Web App** — Telegram ichida ochiladi va ishlaydi.
4. **Test to'plami** — unit + integratsion + asosiy E2E testlar o'tadi.
5. **Production deploy** — web, bot va DB jonli ishlaydi.
6. **Yangilangan hujjatlar** — README va qisqa foydalanish qo'llanmasi.

## ✅ Tayyorlik mezoni (Definition of Done)

- [ ] Foydalanuvchi Telegram botga akkauntini ulaydi.
- [ ] Bot orqali vazifa qo'shadi, ko'radi va "bajarildi" belgilaydi (web bilan sinxron).
- [ ] Belgilangan vaqtlarda muddat eslatmasi va ertalabki reja avtomatik keladi.
- [ ] Kechqurun so'rovga javob berilganda AI kunlik tahlili avtomatik ishlaydi.
- [ ] Yakshanba haftalik hisobot avtomatik yuboriladi.
- [ ] Telegram Mini Web App ochiladi va asosiy amallar ishlaydi.
- [ ] Asosiy oqimlar bo'yicha testlar yashil (o'tadi).
- [ ] Tizim production'da barqaror ishlaydi (web + bot + cron).

## ⚠️ Eslatmalar / Chegaralar (v1 dan tashqarida)
- Boshqa messenjerlar (WhatsApp va h.k.) — kiritilmaydi.
- To'lov/obuna, ko'p foydalanuvchi/jamoa — kiritilmaydi.
- Native mobil ilova (iOS/Android) — kiritilmaydi (faqat web + Telegram mini app).

## 🏁 Loyiha yakuni
Ushbu sprint tugagach, to'liq ishlaydigan MVP tayyor: web ilova + AI yordamchi +
Google Calendar + interaktiv Telegram bot va mini web app. Keyingi bosqichlar
(v2) uchun asos yaratilgan.
