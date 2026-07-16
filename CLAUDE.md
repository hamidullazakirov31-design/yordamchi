# CLAUDE.md — Yordamchi Loyihasi

Bu fayl Claude Code (va agentlar) uchun loyiha bo'yicha asosiy kontekst, ish
tartibi va qabul qilingan qarorlar jurnalini saqlaydi.

## 📌 Loyiha haqida

**Yordamchi** — AI-yordamchili shaxsiy maqsad-vazifa boshqaruv platformasi.
Foydalanuvchi uzoq muddatli maqsadlarini kiritadi, AI ularni bosqich va
vazifalarga bo'ladi, har kun tahlil qilib ertangi rejani beradi, Google Calendar
bilan sinxronlanadi va Telegram orqali eslatma yuboradi.

- To'liq texnik hujjat: [`PRD.md`](PRD.md)
- Sprint hujjatlari: [`sprints/`](sprints/README.md)
- Holat dashboard: [`dashboard.html`](dashboard.html)

## 🗂️ Repository tuzilishi

```
yordamchi/
├── CLAUDE.md              ← shu fayl (kontekst + qarorlar jurnali)
├── PRD.md                 ← to'liq texnik hujjat
├── README.md
├── dashboard.html         ← sprint holati dashboard'i
├── sprints/               ← har bir sprint uchun batafsil hujjat
└── .claude/agents/        ← custom agentlar (hisobotchi)
```

## ⚙️ Majburiy ish tartibi (WORKFLOW)

> **MUHIM:** Har qanday `git push` qilishdan **OLDIN**, va sprint ichidagi biror
> vazifa bajarilib bo'lganda, **`hisobotchi` agentini ishga tushirish shart.**

`hisobotchi` agenti (`.claude/agents/hisobotchi.md`):
1. Sprint fayllarini bajarilgan ishlar hisoboti bilan to'ldiradi.
2. Bajarilgan vazifalarni "bajarildi" (`- [x]`) deb belgilaydi.
3. Qabul qilingan qarorlarni shu fayldagi **Decisions Log**ga yozadi.
4. `dashboard.html` ni aktual holat bilan sinxronlaydi.

Push qilishdan oldingi tartib:
1. Ishni yakunla va commit qil.
2. `hisobotchi` agentini chaqir (Agent tool, subagent_type: "hisobotchi").
3. Agent yangilagan hujjatlarni commit qil.
4. Keyin `git push` qil.

## 🧭 Qabul qilingan qarorlar (Decisions Log)

> Bu bo'limni asosan `hisobotchi` agenti yuritadi. Har bir yozuv sana bilan.

### 2026-07-07
- **Qaror:** Interfeys — Web ilova + interaktiv Telegram bot. — **Sabab:** shaxsiy foydalanuvchi uchun qulay va arzon. (Reja)
- **Qaror:** Ma'lumot tuzilishi — Maqsad → Kichik maqsad → Vazifa (3 daraja). — **Sabab:** progressni aniq ko'rsatish. (Reja)
- **Qaror:** Texnik stack — Next.js + TypeScript + Tailwind, PostgreSQL + Prisma, Anthropic Claude API, grammY/Telegraf, Google Calendar API. — **Sabab:** bir tilli tez rivojlanish, ishonchli integratsiyalar. (Reja)
- **Qaror:** Kalendar — Google Calendar ikki tomonlama sinxron. — **Sabab:** bandlikni ham hisobga olish. (Reja)
- **Qaror:** MVP yadrosi — avval vazifa boshqaruvi, keyin AI va integratsiyalar. — **Sabab:** ishlaydigan asos tez tayyor bo'lsin. (Reja)
- **Qaror:** Barcha loyiha fayllari `yordamchi` repository'sida saqlanadi. — **Sabab:** yagona manba. (Reja)
- **Qaror:** Sprintlar tartibi: (1) Dizayn va ekranlar, (2) DB/backend/auth/CRUD, (3) Asosiy funksiyalar + AI + kalendar, (4) Testlash + Telegram bot + mini web app. — **Sabab:** poydevordan funksiyaga izchil o'sish. (Reja)
- **Qaror:** Loyiha holatini yuritish uchun `hisobotchi` agent tizimi joriy etildi (`.claude/agents/hisobotchi.md`, `.claude/hooks`, `.claude/settings.json`) va `CLAUDE.md` orqali majburiy workflow belgilandi. — **Sabab:** sprint hujjatlari, qarorlar jurnali va dashboard doimo aktual holatni aks ettirishi uchun; har `git push`dan oldin avtomatik hisobot. (Infratuzilma)

### 2026-07-14
- **Qaror:** Vercel avtomatik deploy pipeline'ini tekshirish uchun repozitoriya ildiziga vaqtinchalik test `index.html` sahifasi qo'shildi. — **Sabab:** deploy workflow to'g'ri ishlayotganini tasdiqlash; loyiha kodi yoki sprint ishiga aloqasi yo'q, faqat infratuzilma tekshiruvi. (Infratuzilma)
- **Qaror:** Avtorizatsiya usuli — Email+parol (NextAuth) o'rniga **Telegram deep-link avtorizatsiya**, faqat bitta ruxsat etilgan Telegram ID (`ALLOWED_TELEGRAM_ID`) uchun, stateless JWT (`jose`) sessiya bilan. — **Sabab:** loyiha shaxsiy, bitta foydalanuvchi uchun mo'ljallangan; ro'yxatdan o'tish/parol boshqaruvi ortiqcha; stateless JWT serverless (Vercel) muhitida DB'siz ishlaydi. (Sprint 2)
- **Qaror:** Texnik stack tasdiqlandi va amalda qo'llanildi: Next.js 14 + TypeScript + Tailwind, grammY (Telegram bot/webhook), `jose` (JWT), Prisma (ma'lumot modeli). — **Sabab:** rejadagi stack ishlab chiqarishda tasdiqlandi, birinchi ishlaydigan skelet shu asosda qurildi. (Sprint 2)

### 2026-07-16
- **Qaror:** Vizual dizayn tizimi sifatida "Aurora Design System" (Inter shrifti, indigo asosiy rang, LIGHT mavzu) qabul qilindi; ilova avvalgi DARK mavzudan LIGHT'ga o'tkazildi. — **Sabab:** foydalanuvchi tomonidan Sprint 1 uchun taqdim etilgan tayyor ekran maketlariga (Maqsadlar, Vazifalar, Kun tahlili, AI xulosasi) mos kelish. (Sprint 1/2)
- **Qaror:** Ma'lumot modelida `Task` endi `Milestone` orqali emas, to'g'ridan-to'g'ri `Goal`ga (`Task.goalId`) bog'lanadi; `Milestone` modeli schemada qoladi, lekin hozircha UI'da ishlatilmaydi. — **Sabab:** taqdim etilgan dizaynda kichik maqsad (milestone) bosqichi yo'q, vazifalar bevosita maqsadga tegishli ko'rsatilgan; MVP soddaligi uchun shu yondashuv tanlandi. (Sprint 2)
- **Qaror:** Maqsad progressi va holati (REJADA/JARAYONDA/BAJARILDI) qo'lda emas, unga bog'langan vazifalar holatidan **serverda avtomatik** hisoblanadi. — **Sabab:** foydalanuvchi progressni qo'lda kiritmasligi, ma'lumot doim izchil bo'lishi kerak. (Sprint 2)
- **Qaror:** Ishlab chiqilgan bazaviy migratsiya sifatida hozircha `prisma db push` ishlatiladi; versiyalangan `prisma migrate` fayllari keyinroq qo'shiladi. — **Sabab:** rivojlanish bosqichida tezlik; production migratsiya tarixi keyingi bosqichda rasmiylashtiriladi. (Sprint 2)

## 📏 Uslub qoidalari
- Barcha hujjat va izohlar **o'zbek tilida**.
- Kod izohlari va commit xabarlari qisqa va aniq.
- Mavjud fayl uslubini saqlash; ortiqcha qayta yozmaslik.
