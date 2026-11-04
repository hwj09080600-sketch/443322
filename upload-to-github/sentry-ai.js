/* Secure endpoint-based chat client; deliberately does not fake AI results. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const form = $("aiForm"), question = $("aiQuestion"), messages = $("aiMessages"), connection = $("aiConnection"), send = $("aiSend");
  if (!form || !question || !messages || !connection || !send) return;
  const rawEndpoint = String(window.SENTRY_AI_ENDPOINT || "").trim();
  let endpoint = "";
  try {
    if (rawEndpoint && new URL(rawEndpoint).protocol === "https:") endpoint = rawEndpoint;
  } catch (_) { /* Invalid configuration. */ }
  const enabled = Boolean(endpoint);
  connection.textContent = enabled ? "AI 서버 주소 설정됨 · 실제 연결은 질문 전송 시 확인" : "AI 미연결 · 기존 계산기는 정상 이용 가능";
  connection.classList.toggle("ai-connected", enabled);
  const history = [];
  let busy = false;
  function append(text, role) {
    const el = document.createElement("div");
    el.className = `ai-message ai-${role}`;
    el.textContent = text;
    messages.append(el);
    messages.scrollTop = messages.scrollHeight;
  }
  document.querySelectorAll(".ai-example").forEach(button => button.addEventListener("click", () => {
    question.value = button.dataset.prompt || "";
    question.focus();
  }));
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const prompt = question.value.trim();
    if (!prompt || busy) return;
    if (!enabled) {
      append("AI 서버가 아직 연결되지 않았습니다. 실제 AI를 이용하려면 별도 서버에서 API 키를 안전하게 설정해야 합니다. 현재는 위의 검증 가능한 계산기를 이용할 수 있습니다.", "assistant");
      return;
    }
    busy = true; send.disabled = true; send.textContent = "답변 요청 중…";
    append(prompt, "user");
    question.value = "";
    const recent = history.slice(-8);
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 22000);
      let response;
      try {
        response = await fetch(endpoint, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...recent, { role: "user", content: prompt }] }), signal: ctrl.signal
        });
      } finally { clearTimeout(timeout); }
      const data = await response.json().catch(() => ({}));
      if (!response.ok || typeof data.answer !== "string" || !data.answer.trim()) {
        throw new Error(data.error || `서버 오류 (${response.status})`);
      }
      const answer = data.answer.slice(0, 6000);
      history.push({ role: "user", content: prompt }, { role: "assistant", content: answer });
      if (history.length > 12) history.splice(0, history.length - 12);
      append(answer, "assistant");
      connection.textContent = "AI 서버 연결됨 · 답변은 검증이 필요합니다";
      connection.classList.add("ai-connected");
    } catch (error) {
      append(`AI 연결 또는 응답에 문제가 발생했습니다: ${error?.name === "AbortError" ? "응답 시간 초과" : String(error?.message || "알 수 없는 오류")}. 요청이 완료되지 않았습니다.`, "assistant");
      connection.textContent = "AI 연결 확인 필요";
      connection.classList.remove("ai-connected");
      question.value = prompt;
    } finally {
      busy = false; send.disabled = false; send.textContent = "질문 전송 ↗";
    }
  });
})();
