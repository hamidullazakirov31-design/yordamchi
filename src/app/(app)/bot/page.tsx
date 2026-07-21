"use client";

// AI bot boshqaruvi — system prompt (o'zini tutishi) va bilim bazasini
// to'ldirish/tahrirlash joyi. Telegramda botga yozilganda u shu ma'lumotlar
// va qoidalar asosida javob beradi.

import React from "react";
import { api } from "@/lib/fetcher";
import { Card, Button, Input, Textarea, EmptyState } from "@/components/ui";

type Bilim = { id: string; sarlavha: string; matn: string; faol: boolean };

export default function BotPage() {
  // System prompt
  const [prompt, setPrompt] = React.useState<string | null>(null);
  const [promptSaqlanmoqda, setPromptSaqlanmoqda] = React.useState(false);
  const [promptSaqlandi, setPromptSaqlandi] = React.useState(false);

  // Bilim bazasi
  const [bilimlar, setBilimlar] = React.useState<Bilim[] | null>(null);
  const [sarlavha, setSarlavha] = React.useState("");
  const [matn, setMatn] = React.useState("");
  const [qoshilmoqda, setQoshilmoqda] = React.useState(false);

  const [xato, setXato] = React.useState("");

  const load = React.useCallback(async () => {
    try {
      const [cfg, kb] = await Promise.all([
        api.get<{ systemPrompt: string }>("/api/bot/config"),
        api.get<{ bilimlar: Bilim[] }>("/api/bot/knowledge"),
      ]);
      setPrompt(cfg.systemPrompt);
      setBilimlar(kb.bilimlar);
    } catch (e) {
      setXato(e instanceof Error ? e.message : "Yuklab bo'lmadi");
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function savePrompt() {
    if (prompt === null || !prompt.trim()) return;
    setPromptSaqlanmoqda(true);
    setPromptSaqlandi(false);
    try {
      await api.post("/api/bot/config", { systemPrompt: prompt });
      setPromptSaqlandi(true);
      setTimeout(() => setPromptSaqlandi(false), 2500);
    } catch (e) {
      setXato(e instanceof Error ? e.message : "Saqlab bo'lmadi");
    } finally {
      setPromptSaqlanmoqda(false);
    }
  }

  async function addBilim(e: React.FormEvent) {
    e.preventDefault();
    if (!sarlavha.trim() || !matn.trim()) return;
    setQoshilmoqda(true);
    try {
      await api.post("/api/bot/knowledge", { sarlavha, matn });
      setSarlavha("");
      setMatn("");
      await load();
    } catch (e) {
      setXato(e instanceof Error ? e.message : "Qo'shib bo'lmadi");
    } finally {
      setQoshilmoqda(false);
    }
  }

  async function toggle(b: Bilim) {
    await api.patch(`/api/bot/knowledge/${b.id}`, { faol: !b.faol });
    load();
  }

  async function del(b: Bilim) {
    if (!confirm(`"${b.sarlavha}" yozuvi o'chirilsinmi?`)) return;
    await api.del(`/api/bot/knowledge/${b.id}`);
    load();
  }

  return (
    <>
      <div>
        <h1 style={{ margin: 0, fontSize: "var(--text-2xl)", fontWeight: "var(--weight-semibold)" }}>
          AI bot boshqaruvi
        </h1>
        <p style={{ margin: "var(--space-2) 0 0", color: "var(--color-text-muted)", fontSize: "var(--text-body)" }}>
          Telegramda botga yozilganda u shu yerdagi bilim bazasi va qoidalar asosida javob beradi.
        </p>
      </div>

      {xato && <EmptyState text={xato} />}

      {/* System prompt */}
      <Card style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>
            🧠 AI o&apos;zini tutishi (system prompt)
          </h2>
          <p style={{ margin: "var(--space-1) 0 0", color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
            AI qanday ohangda, qaysi tilda va qanday qoidalar bilan javob berishini belgilang.
          </p>
        </div>
        <Textarea
          rows={10}
          value={prompt ?? ""}
          disabled={prompt === null}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={prompt === null ? "Yuklanmoqda..." : "AI qanday tutishi kerakligini yozing..."}
          style={{ fontFamily: "var(--font-family-mono, monospace)" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <Button variant="primary" onClick={savePrompt} disabled={promptSaqlanmoqda || prompt === null}>
            {promptSaqlanmoqda ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
          {promptSaqlandi && (
            <span style={{ color: "var(--color-primary)", fontSize: "var(--text-sm)" }}>✓ Saqlandi</span>
          )}
        </div>
      </Card>

      {/* Bilim qo'shish */}
      <Card style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>
            📚 Bilim bazasiga yozuv qo&apos;shish
          </h2>
          <p style={{ margin: "var(--space-1) 0 0", color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
            Bot javob berishda tayanadigan ma&apos;lumotlar. Har bir yozuv — mavzu va uning matni.
          </p>
        </div>
        <form onSubmit={addBilim} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <Input
            label="Mavzu / sarlavha"
            placeholder="Masalan: Ish vaqti"
            value={sarlavha}
            onChange={(e) => setSarlavha(e.target.value)}
          />
          <Textarea
            label="Ma'lumot matni"
            rows={4}
            placeholder="Masalan: Biz dushanbadan jumagacha 9:00–18:00 ishlaymiz."
            value={matn}
            onChange={(e) => setMatn(e.target.value)}
          />
          <div>
            <Button type="submit" variant="primary" disabled={qoshilmoqda}>
              {qoshilmoqda ? "Qo'shilmoqda..." : "Qo'shish"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Mavjud yozuvlar */}
      <div>
        <h2 style={{ margin: "0 0 var(--space-3)", fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>
          Bilim bazasi{" "}
          <span style={{ fontWeight: "var(--weight-regular)", color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
            ({bilimlar?.length ?? 0} ta)
          </span>
        </h2>

        {bilimlar === null && !xato && <EmptyState text="Yuklanmoqda..." />}
        {bilimlar !== null && bilimlar.length === 0 && (
          <EmptyState text="Hali yozuv yo'q. Yuqorida birinchi ma'lumotni qo'shing." />
        )}

        {bilimlar !== null && bilimlar.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {bilimlar.map((b) => (
              <Card key={b.id} style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <h3 style={{ margin: 0, fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)" }}>
                      {b.sarlavha}
                    </h3>
                    {!b.faol && (
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", border: "1px solid var(--color-border-strong)", borderRadius: "var(--radius-sm)", padding: "1px 6px" }}>
                        nofaol
                      </span>
                    )}
                  </div>
                  <p style={{ margin: "var(--space-1) 0 0", color: "var(--color-text-muted)", fontSize: "var(--text-body)", whiteSpace: "pre-wrap" }}>
                    {b.matn}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", flexShrink: 0 }}>
                  <Button variant="secondary" onClick={() => toggle(b)}>
                    {b.faol ? "O'chirib qo'yish" : "Yoqish"}
                  </Button>
                  <Button variant="danger" onClick={() => del(b)}>
                    O&apos;chirish
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
