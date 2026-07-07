# 🟨 Sprint 3 — Asosiy Funksiyalar, AI va Kalendar Ulash

> **Loyiha:** Yordamchi — Maqsad-Vazifa Boshqaruv Platformasi
> **Bosqich:** 3/4 · **Fokus:** AI dvigateli + Google Calendar integratsiyasi
> **Taxminiy davomiylik:** ~2–2.5 hafta

---

## 🎯 Maqsad

Platformani oddiy "to-do" dan **aqlli yordamchi**ga aylantirish. Claude AI orqali
maqsadni bo'lish, vazifalarni tartiblash, kunlik tahlil va reja berish; hamda
Google Calendar bilan ikki tomonlama sinxronizatsiyani ishga tushirish. Bu sprint
mahsulotning "yuragi".

## 📋 Ish qamrovi (Scope)

### 1. AI infratuzilmasi (Claude API)
- Anthropic Claude API integratsiyasi (`claude-sonnet-5` asosiy, murakkab tahlil
  uchun `claude-opus-4-8`).
- **Strukturlangan chiqish (JSON)** + schema validatsiya (zod).
- Xato/fallback boshqaruvi (JSON buzilsa qayta urinish yoki xavfsiz standart).
- Har bir chaqiruvni `AIInteraction` jadvaliga yozish (model, token, xarajat kuzatuvi).
- Kontekstni cheklash — barcha ma'lumot emas, faqat kerakli qismi yuboriladi.
- Kunlik/foydalanuvchi bo'yicha xarajat limiti.

### 2. AI funksiyalari (4 ta)
| Funksiya | Kirish | Chiqish |
|----------|--------|---------|
| **Maqsadni bo'lish** | Maqsad matni + muddat | Kichik maqsadlar + vazifalar (JSON), foydalanuvchi tasdiqlaydi |
| **Vazifalarni avto-tartiblash** | Ochiq vazifalar, muddat, muhimlik, kalendar bandligi | Ustuvorlashtirilgan ro'yxat + sabab |
| **Kunlik tahlil + ertangi reja** | Bugungi bajarilgan/qolgan, ertangi kalendar, ochiq maqsadlar | Qisqa tahlil + ertangi 3–5 ustuvor vazifa (`DailyPlan`) |
| **Haftalik hisobot** | 7 kunlik progress, tendensiyalar | Hisobot matni + motivatsiya |

> **Muhim tamoyil:** AI **taklif qiladi**, foydalanuvchi **tasdiqlaydi** — AI hech
> narsani avtomatik o'chirmaydi/o'zgartirmaydi.

### 3. Google Calendar integratsiyasi (ikki tomonlama)
- Google OAuth2 orqali kalendar ruxsatini olish (`User.googleTokens`).
- **Chiqarish:** vaqti bor vazifa → Google Calendar event yaratish/yangilash/o'chirish
  (`Task.calendarEventId` orqali bog'lash).
- **Kirish:** kalendardagi mavjud bandliklarni o'qib, AI rejasiga kontekst berish
  (bo'sh vaqtga vazifa taklif qilish).
- Token yangilash (refresh) va ruxsatni bekor qilish oqimi.
- Sinxronizatsiya xatolarini boshqarish (retry, konflikt).

### 4. UI ulanishi
- "Maqsadni AI bilan bo'lish" tugmasi + taklif tasdiqlash ekrani.
- "Kunni tahlil qil" tugmasi → kunlik reja ko'rsatish.
- Kalendar ekranida Google eventlarini ko'rsatish.
- Haftalik hisobot sahifasi (grafiklar + AI matni).
- AI ishlayotganini bildiruvchi holatlar (loading/streaming).

## 📦 Deliverable (aniq natija)

1. **Ishlaydigan AI dvigateli** — 4 ta funksiya JSON validatsiya bilan.
2. **Maqsadni bo'lish** — matndan tuzilgan vazifalarga, tasdiqlash oqimi bilan.
3. **Kunlik tahlil + ertangi reja** — `DailyPlan` yaratiladi va ko'rsatiladi.
4. **Avto-tartiblash** — ochiq vazifalarni ustuvorlashtirish.
5. **Google Calendar ikki tomonlama sinxron** — vazifa ↔ event.
6. **AIInteraction jurnali** — token/xarajat kuzatuvi ishlaydi.

## ✅ Tayyorlik mezoni (Definition of Done)

- [ ] Maqsad matni kiritilganda AI uni kichik maqsad + vazifalarga bo'ladi va
      foydalanuvchi tasdiqlaydi.
- [ ] "Kunni tahlil qil" ertangi ustuvor rejani ishonchli (validatsiyalangan) chiqaradi.
- [ ] Vazifalarni avto-tartiblash sababi bilan ishlaydi.
- [ ] Vaqti bor vazifa Google Calendar'da event sifatida paydo bo'ladi; o'zgarish
      sinxronlanadi; o'chirilsa event ham o'chadi.
- [ ] Kalendardagi bandlik AI rejasiga ta'sir qiladi.
- [ ] Har bir AI chaqiruvi jurnalga yoziladi va xarajat kuzatiladi.
- [ ] JSON buzilishida tizim yiqilmaydi (fallback ishlaydi).

## ⚠️ Eslatmalar / Chegaralar
- Bu sprintda **Telegram bot va avtomatik scheduler yo'q** — AI hozircha qo'lda
  (tugma bilan) ishga tushiriladi. Avtomatlashtirish Sprint 4'da.
- Haftalik hisobot funksiyasi tayyorlanadi, lekin avtomatik yuborish Sprint 4'da.

## 🔜 Keyingi sprintga bog'liqlik
Sprint 4 (Telegram + scheduler) shu AI funksiyalarini **avtomatik** ishga tushiradi
(ertalabki reja, kechqurun tahlil, haftalik hisobot) va natijalarni Telegram
orqali yetkazadi.

## 📝 Bajarilgan ishlar (hisobot)

### 2026-07-07
- Sprint rejasi to'liq hujjatlashtirildi: AI funksiyalari, Google Calendar sinxroni va AIInteraction jurnali qamrovi aniqlandi — `85dae5d`.
- **Holat:** Reja bosqichi yakunlandi. Amaliy ishlanma (AI dvigateli, kalendar sinxroni, xarajat kuzatuvi) hali **boshlanmagan** — DoD bandlari tegishli funksiyalar ishga tushgach belgilanadi.
