#!/usr/bin/env bash
# PreToolUse hook — Bash tool uchun.
# Agar buyruq `git push` bo'lsa, push'dan oldin `hisobotchi` agentini ishga
# tushirishni eslatadi. Bu hook push'ni BLOKLAMAYDI — faqat kontekst qo'shadi.
#
# Sabab: Claude Code hook'lari shell buyruq ishga tushiradi, subagent'ni
# to'g'ridan-to'g'ri chaqira olmaydi. Shuning uchun bu hook asosiy agentga
# eslatma yuboradi, u esa hisobotchi agentini chaqiradi.

input=$(cat)

# Buyruqni ajratib olamiz (jq bo'lsa jq, bo'lmasa python3)
if command -v jq >/dev/null 2>&1; then
  cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""' 2>/dev/null)
else
  cmd=$(printf '%s' "$input" | python3 -c 'import sys,json;
try:
    d=json.load(sys.stdin); print(d.get("tool_input",{}).get("command",""))
except Exception:
    print("")' 2>/dev/null)
fi

case "$cmd" in
  *"git push"*)
    cat <<'JSON'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"ESLATMA (hisobotchi workflow): git push aniqlandi. Agar sprint ishlari o'zgargan bo'lsa, push'dan OLDIN `hisobotchi` agentini ishga tushiring — Agent tool, subagent_type: \"hisobotchi\". U sprint fayllarini hisobot bilan to'ldiradi, bajarilgan ishlarni belgilaydi, qarorlarni CLAUDE.md ga yozadi va dashboard.html ni sinxronlaydi. Agar hozirgina hisobotchi ishlagan va hujjatlar allaqachon yangilangan bo'lsa, bu eslatmani e'tiborsiz qoldirib push'ni davom ettiring."}}
JSON
    ;;
esac

exit 0
