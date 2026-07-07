# Yordamchi — Maqsad-Vazifa Boshqaruv Platformasi

AI-yordamchili shaxsiy produktivlik platformasi. Foydalanuvchi uzoq muddatli
maqsadlarini kiritadi, AI ularni bosqich va vazifalarga bo'ladi, har kun tahlil
qilib ertangi kunga reja beradi, Google Calendar bilan sinxronlanadi va Telegram
orqali eslatma yuboradi.

## Asosiy imkoniyatlar

- 🎯 **3 darajali tuzilma:** Maqsad → Kichik maqsad → Vazifa
- 🤖 **AI dvigateli:** kunlik tahlil + ertangi reja, vazifalarni avto-tartiblash,
  maqsadni vazifalarga bo'lish, haftalik hisobot
- 📅 **Google Calendar** bilan ikki tomonlama sinxronizatsiya
- 🔔 **Telegram bot:** muddat eslatmasi, ertalabki reja, kechqurun tahlil so'rovi,
  bot orqali vazifa qo'shish
- 🖥️ **Web ilova** — asosiy ish maydoni

## Texnik stack (tavsiya)

- **Frontend/Backend:** Next.js (React) + TypeScript + Tailwind
- **Ma'lumotlar bazasi:** PostgreSQL + Prisma
- **AI:** Anthropic Claude API
- **Telegram:** grammY / Telegraf
- **Kalendar:** Google Calendar API (OAuth2)
- **Scheduler:** node-cron → BullMQ + Redis

## Hujjatlar

To'liq texnik hujjat (PRD), ma'lumot modeli, AI qismi, cheklovlar, xatarlar va
4 ta sprint rejasi: [`docs/PRD.md`](docs/PRD.md).

## Loyiha holati

📝 **Reja bosqichi** — PRD tayyor. Keyingi qadam: Sprint 1 (poydevor + vazifa
boshqaruvi).
