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

## 📏 Uslub qoidalari
- Barcha hujjat va izohlar **o'zbek tilida**.
- Kod izohlari va commit xabarlari qisqa va aniq.
- Mavjud fayl uslubini saqlash; ortiqcha qayta yozmaslik.
