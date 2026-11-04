/* Optional server-side AI proxy for Cloudflare Workers.
 * API keys belong in Cloudflare Secret storage, never on GitHub Pages.
 * Deploy separately from /upload-to-github. Requires additional rate limiting for production.
 */
const ALLOWED_ORIGIN = "https://jihunlux.github.io";
const SYSTEM_INSTRUCTIONS = `당신은 고등학생을 위한 SENTRY 화학 실험 준비 학습 도우미입니다.
수학적으로 검증 가능한 희석식(C1V1=C2V2), 몰농도/물질량/단위 변환을 설명하세요.
질량 백분율과 부피 백분율을 구분하고 조건이 없으면 먼저 질문하세요.
시약의 실제 안전성, 보관 적합성, 실험 결과를 확인했다고 주장하지 마세요.
학생에게 위험 물질의 제조·혼합·사용을 위한 구체적 절차나 양, 조달 방법은 제공하지 말고,
안전한 원리 설명과 교사/실험 책임자의 감독, 공식 SDS 확인을 권하세요.
보호구·폐기 정보는 시약별 SDS와 학교 지침이 우선이며 근거 없는 확정을 피하세요.
간결하고 이해하기 쉬운 한국어로 설명하세요. 알려지지 않은 수치를 꾸며내지 마세요.`;

const cors = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff"
};
function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8" } });
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    if (origin !== ALLOWED_ORIGIN) return json({ error: "허용된 사이트에서만 이용할 수 있습니다." }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "POST만 지원합니다." }, 405);
    if (!env.OPENAI_API_KEY) return json({ error: "서버 API 키가 설정되지 않았습니다." }, 503);
    if (Number(request.headers.get("content-length") || 0) > 12000) return json({ error: "요청 크기 제한을 초과했습니다." }, 413);
    let payload;
    try { payload = await request.json(); } catch (_) { return json({ error: "올바른 JSON 요청이 아닙니다." }, 400); }
    const incoming = Array.isArray(payload?.messages) ? payload.messages : [];
    if (!incoming.length || incoming.length > 9) return json({ error: "대화 길이를 확인해 주세요." }, 400);
    const clean = incoming.map(m => ({ role: m.role, content: m.content }));
    if (clean.some(m => !["user", "assistant"].includes(m.role) || typeof m.content !== "string" || m.content.length > 1200))
      return json({ error: "메시지 형식이 올바르지 않습니다." }, 400);
    if (clean[clean.length - 1].role !== "user") return json({ error: "마지막 항목은 질문이어야 합니다." }, 400);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 18000);
    let response;
    try {
      response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-5-mini",
          instructions: SYSTEM_INSTRUCTIONS,
          input: clean,
          max_output_tokens: 700,
          store: false
        }),
        signal: controller.signal
      });
    } catch (_) {
      return json({ error: "AI 제공자와 통신하지 못했습니다." }, 502);
    } finally { clearTimeout(timer); }
    if (!response.ok) return json({ error: `AI 제공자 응답 오류 (${response.status}). 서버 설정을 확인해 주세요.` }, 502);
    let data;
    try { data = await response.json(); } catch (_) { return json({ error: "응답 형식이 올바르지 않습니다." }, 502); }
    const answer = (data.output || []).flatMap(item => item.content || []).filter(item => item.type === "output_text").map(item => item.text).join("\n").trim();
    if (!answer) return json({ error: "AI가 텍스트 답변을 반환하지 않았습니다." }, 502);
    return json({ answer: answer.slice(0, 6000) });
  }
};
