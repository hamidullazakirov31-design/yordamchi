// Kirish sahifasi — Telegram deep-link orqali avtorizatsiya.

const BOT_USERNAME = process.env.NEXT_PUBLIC_BOT_USERNAME ?? "zxi540bot";

export const dynamic = "force-dynamic";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const deepLink = BOT_USERNAME
    ? `https://t.me/${BOT_USERNAME}?start=login`
    : "#";

  const errorText =
    searchParams.error === "invalid"
      ? "Kirish havolasi eskirgan yoki yaroqsiz. Qaytadan urinib ko'ring."
      : searchParams.error === "notoken"
        ? "Kirish tokeni topilmadi. Qaytadan urinib ko'ring."
        : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
        <div className="mb-2 text-3xl">🎯</div>
        <h1 className="text-2xl font-bold">Yordamchi</h1>
        <p className="mt-2 text-sm text-slate-400">
          Shaxsiy maqsad-vazifa boshqaruv platformasi
        </p>

        {errorText && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {errorText}
          </p>
        )}

        <a
          href={deepLink}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          <span>✈️</span>
          Telegram orqali kirish
        </a>

        <p className="mt-4 text-xs text-slate-500">
          Ilovaga faqat ruxsat etilgan Telegram akkaunt kira oladi. Tugmani
          bosing → botga o&apos;ting → «Ilovaga kirish» havolasini bosing.
        </p>
      </div>
    </main>
  );
}
