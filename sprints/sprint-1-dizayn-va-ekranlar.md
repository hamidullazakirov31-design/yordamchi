# 🟦 Sprint 1 — Dizayn va Ekranlar

> **Loyiha:** Yordamchi — Maqsad-Vazifa Boshqaruv Platformasi
> **Bosqich:** 1/4 · **Fokus:** UI/UX dizayn, ekranlar va dizayn tizimi
> **Taxminiy davomiylik:** ~1.5–2 hafta

---

## 🎯 Maqsad

Mahsulotning butun vizual va foydalanuvchi tajribasi asosini yaratish: dizayn
tizimi (ranglar, shriftlar, komponentlar) va barcha asosiy ekranlarning
maketlari (mockup/prototip). Bu sprint oxirida "qanday ko'rinadi va qanday
ishlaydi" degan savolga to'liq javob bo'lishi kerak — hali backend'siz, faqat
statik/interaktiv UI.

## 📋 Ish qamrovi (Scope)

### 1. Dizayn tizimi (Design System)
- Rang palitrasi: asosiy (primary), ikkilamchi, muvaffaqiyat/ogohlantirish/xato
  ranglari, neytral (kulrang) shkalasi.
- Light va Dark rejim (ikkalasi ham).
- Tipografiya: sarlavha/matn shriftlari, o'lchamlar shkalasi.
- Masofa (spacing) va radius (border-radius) tokenlari.
- Ikonkalar to'plami tanlash (masalan Lucide / Heroicons).

### 2. Qayta ishlatiladigan komponentlar (UI kit)
- Tugmalar (primary, secondary, ghost, danger), input maydonlari, checkbox,
  select/dropdown, modal, toast/xabar, card, badge (muhimlik/holat), progress bar,
  avatar, navigatsiya (sidebar/topbar), bo'sh holat (empty state).

### 3. Asosiy ekranlar (maketlar)
| Ekran | Tavsif |
|-------|--------|
| **Kirish / Ro'yxatdan o'tish** | Email bilan auth formalari |
| **Dashboard (Bosh sahifa)** | Bugungi ustuvor vazifalar, progress umumiy ko'rinishi |
| **Maqsadlar ro'yxati** | Barcha maqsadlar, progress %, holat |
| **Maqsad tafsiloti** | Maqsad → Kichik maqsadlar → Vazifalar iyerarxiyasi |
| **Vazifa yaratish/tahrirlash** | Muddat, muhimlik, davomiylik, milestone tanlash |
| **Kalendar ko'rinishi** | Kun/hafta ko'rinishida vazifalar |
| **Kunlik AI reja** | AI tahlili + ertangi ustuvor vazifalar taklifi |
| **Haftalik hisobot** | Progress grafiklari, tendensiya |
| **Sozlamalar / Profil** | Timezone, Telegram bog'lash, Google Calendar ulash |

### 4. Foydalanuvchi oqimlari (User Flows)
- Ro'yxatdan o'tish → birinchi maqsad yaratish (onboarding).
- Maqsad yaratish → AI bo'lishini kutish → tasdiqlash oqimi (UI holatlari).
- Vazifani belgilash → progress yangilanishi.
- Bo'sh holatlar (hech qanday maqsad yo'q, internet yo'q va h.k.).

### 5. Responsiv dizayn
- Desktop (asosiy), planshet va mobil ko'rinishlar.
- Mini web app (Telegram ichida ochiladigan) uchun mobil-birinchi maket eskizi
  (to'liq ishlanishi Sprint 4'da).

## 📦 Deliverable (aniq natija)

1. **Dizayn tizimi hujjati** — ranglar, tipografiya, spacing tokenlari (Figma yoki
   kod ichida `globals.css` / Tailwind config sifatida).
2. **Figma maketlari** (yoki HTML/React statik prototip) — yuqoridagi barcha 9 ta
   ekran, light + dark.
3. **Komponentlar kutubxonasi** — kamida asosiy 12 ta UI komponent (statik).
4. **Interaktiv prototip** — asosiy oqimlar bo'ylab bosib o'tish mumkin (Figma
   prototype yoki Next.js sahifalar navigatsiyasi).
5. **User flow diagrammalari** — asosiy 4 oqim uchun.

## ✅ Tayyorlik mezoni (Definition of Done)

- [ ] Barcha 9 ta asosiy ekran maketi light va dark rejimda tayyor.
- [ ] Dizayn tizimi tokenlari aniqlangan va hujjatlashtirilgan.
- [ ] Kamida 12 ta qayta ishlatiladigan komponent yaratilgan.
- [ ] Asosiy foydalanuvchi oqimlari bo'yicha interaktiv prototip mavjud.
- [ ] Dizayn desktop va mobil ekranlarda ko'rib chiqilgan (responsiv).
- [ ] Dizayn tasdiqlangan — Sprint 2 (backend) uchun ekranlar aniq.

## ⚠️ Eslatmalar / Chegaralar
- Bu sprintda **real ma'lumot yoki backend yo'q** — hammasi statik/mock.
- AI va kalendar ekranlari faqat **ko'rinish** sifatida (funksiyasiz).
- Maqsad — keyingi sprintlarda ishonchli asos bo'lishi.

## 🔜 Keyingi sprintga bog'liqlik
Sprint 2 (DB + backend) shu ekranlar asosida ma'lumot modelini va API'larni
quradi. Shuning uchun ekranlardagi barcha maydonlar (vazifa maydonlari, maqsad
maydonlari) aniq belgilanган bo'lishi shart.

## 📝 Bajarilgan ishlar (hisobot)

### 2026-07-07
- Sprint rejasi to'liq hujjatlashtirildi: dizayn tizimi, UI kit, 9 ta ekran, user flow'lar va deliverable'lar aniqlandi — `85dae5d`.
- **Holat:** Reja va tayyorgarlik bosqichi yakunlandi. Amaliy dizayn ishi (dizayn tokenlari, komponentlar kutubxonasi, ekran maketlari, interaktiv prototip) hali **boshlanmagan** — quyidagi DoD bandlari tegishli deliverable'lar tayyor bo'lgach belgilanadi.
