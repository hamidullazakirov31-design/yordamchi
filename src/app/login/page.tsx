// Kirish sahifasi — Telegram deep-link orqali avtorizatsiya (Aurora dizayn).

const BOT_USERNAME = process.env.NEXT_PUBLIC_BOT_USERNAME ?? "zxi540bot";

export const dynamic = "force-dynamic";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const deepLink = BOT_USERNAME ? `https://t.me/${BOT_USERNAME}?start=login` : "#";

  const errorText =
    searchParams.error === "invalid"
      ? "Kirish havolasi eskirgan yoki yaroqsiz. Qaytadan urinib ko'ring."
      : searchParams.error === "notoken"
        ? "Kirish tokeni topilmadi. Qaytadan urinib ko'ring."
        : null;

  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-4)",
        background: "var(--color-bg)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-card)",
          padding: "var(--space-6)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: "var(--space-2)" }}>🎯</div>
        <h1 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", color: "var(--color-text)" }}>
          Yordamchi
        </h1>
        <p style={{ marginTop: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
          Shaxsiy maqsad-vazifa boshqaruv platformasi
        </p>

        {errorText && (
          <p
            style={{
              marginTop: "var(--space-3)",
              borderRadius: "var(--radius-md)",
              background: "var(--color-danger-tint)",
              color: "var(--color-danger)",
              padding: "var(--space-2) var(--space-3)",
              fontSize: "var(--text-sm)",
            }}
          >
            {errorText}
          </p>
        )}

        <a
          href={deepLink}
          style={{
            marginTop: "var(--space-4)",
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-2)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-primary)",
            padding: "var(--space-3) var(--space-4)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-on-primary)",
            textDecoration: "none",
          }}
        >
          <span>✈️</span> Telegram orqali kirish
        </a>

        <p style={{ marginTop: "var(--space-3)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: "var(--leading-normal)" }}>
          Ilovaga faqat ruxsat etilgan Telegram akkaunt kira oladi. Tugmani bosing → botga o&apos;ting → «Ilovaga kirish» havolasini bosing.
        </p>
      </div>
    </main>
  );
}
