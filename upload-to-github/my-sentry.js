/* SENTRY dashboard: retains original localStorage key, samples, search, delete and advice. */
(() => {
  "use strict";
  const K = "sentry-reagents-v1";
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const demos = window.SENTRY_DEMOS || [];
  let selected = null;

  function all() {
    try {
      const raw = localStorage.getItem(K);
      if (raw === null) return demos.map(d => ({ ...d }));
      const value = JSON.parse(raw);
      // A deliberately empty saved list must stay empty; never re-seed on every visit.
      return Array.isArray(value) ? value.filter(x => x && typeof x === "object") : [];
    } catch (_) {
      return demos.map(d => ({ ...d }));
    }
  }
  function needsReview(x) {
    return !!x.review || !x.formula || !x.formType || x.formType === "unknown" || !x.storage;
  }
  function sensorInfo(x) {
    const text = `${x.name || ""} ${x.formula || ""} ${x.notes || ""}`.toLowerCase();
    const advice = [];
    if (/과산화수소|질산\s?은|h₂o₂|agno₃|agno3/.test(text))
      advice.push(["광센서", "광학적 변화 확인 후보", "파장 및 측정 방식 검증이 필요하며 분해 여부를 단독 판정할 수 없습니다."]);
    if (/염산|황산|아세트산|인산|수산화나트륨|수산화칼륨|hcl|h₂so₄|naoh/.test(text))
      advice.push(["pH 센서", "용액의 산성도 변화 확인 후보", "대상 용액에 적합한 전극, 측정 범위와 보정이 필요합니다."]);
    if (/색|변색|염료|요오드|과망간산/.test(text))
      advice.push(["색상 센서", "색상 변화의 보조 지표", "조명·용기 색상에 영향을 받으며 색상만으로 분해를 확정할 수 없습니다."]);
    if (/빛|차광|감광|과산화수소|질산\s?은|agno₃/.test(text))
      advice.push(["조도 센서", "보관 장소의 주변 밝기", "광센서의 물질 광학적 특성 측정과 다르게 주변 밝기를 확인합니다."]);
    if (/에탄올|염산|아세트산|hcl|ch₃cooh|c₂h₅oh/.test(text))
      advice.push(["전용 가스 센서", "대상 기체 감지 가능성 검토", "가스 종류·센서 호환성과 정확한 검출 대상을 확인해야 합니다."]);
    if (!advice.length)
      advice.push(["추가 센서 정보", "현재 정보만으로 추천 어려움", "측정하려는 항목과 시약별 특성을 먼저 확인해야 합니다."]);
    return advice;
  }
  function statusLabel(value, type, isDemo) {
    if (!isDemo) return ["정보 없음", "unknown"];
    if (type === "cabinet") {
      return value === "stored" ? ["정상 보관", "good"] : value === "check" ? ["확인 필요", "bad"] : ["정보 없음", "unknown"];
    }
    return value === "upright" ? ["정상적으로 서 있음", "good"] : value === "tilted" ? ["기울어짐", "bad"] : ["정보 없음", "unknown"];
  }
  function numericDisplay(value, digits, unit, demo) {
    return demo && Number.isFinite(Number(value)) && value !== null && value !== undefined && value !== ""
      ? `${Number(value).toFixed(digits)}${unit}` : "측정 정보 없음";
  }
  function detail(x) {
    if (!x) return;
    const element = [...document.querySelectorAll("[data-detail]")].find(el => el.dataset.detail === String(x.id));
    if (!element) return;
    const demo = x.stateSource === "simulation" && (String(x.id || "").startsWith("demo-"));
    const review = needsReview(x);
    const cabinet = statusLabel(x.cabinetStatus, "cabinet", demo);
    const tilt = statusLabel(x.tiltStatus, "tilt", demo);
    const stateField = (label, state, note) => `<div><small>${label}</small><b class="state-${state[1]}">${state[0]}</b><em class="${state[1] === "good" ? "good-text" : state[1] === "bad" ? "bad-text" : "unknown-text"}">${note}</em></div>`;
    element.innerHTML = `<div class="inline-detail-inner">
      <div class="detail-top"><div><h3>${esc(x.name)} <small>${esc(x.formula || "화학식 미입력")}</small></h3><span class="status-pill ${review ? "status-bad" : "status-good"}">${review ? "정보 확인 필요" : "정보 입력됨"}</span></div>
        <span class="simulated-label">● ${demo ? "시뮬레이션 데이터 · 실측값 아님" : "센서 미연결 · 측정 정보 없음"}</span></div>
      <div class="detail-grid-inner">
        <div><small>현재 온도</small><b>${numericDisplay(x.temp, 1, "°C", demo)}</b><em class="unknown-text">${demo ? "시연용 임의값" : "센서 미연결"}</em></div>
        <div><small>현재 습도</small><b>${numericDisplay(x.humidity, 0, "%", demo)}</b><em class="unknown-text">${demo ? "시연용 임의값" : "센서 미연결"}</em></div>
        <div><small>용기 개폐 여부</small><b>${demo ? (x.open ? "열림(시뮬레이션)" : "닫힘(시뮬레이션)") : "정보 없음"}</b><em class="unknown-text">${demo ? "시연용 상태" : "센서 미연결"}</em></div>
        <div><small>보관 위치</small><b>${esc(x.location || "미입력")}</b><em>${x.location ? "사용자가 입력한 위치" : "위치 입력 필요"}</em></div>
        ${stateField("보관함 상태", cabinet, demo ? "시뮬레이션 상태" : "보관 위치 감지 장치 미연결")}
        ${stateField("용기 기울기", tilt, demo ? "시뮬레이션 상태 · 각도 미표시" : "기울기 감지 장치 미연결")}
        <div><small>보관 조건</small><b>${esc(x.storage || "확인 필요")}</b><em>${x.storage ? "입력된 보관 조건" : "라벨·SDS 검토 필요"}</em></div>
        <div><small>물질 형태 · 농도</small><b>${esc(x.formType === "solid" ? "고체" : x.formType === "liquid" ? "액체·용액" : x.formType === "gas" ? "기체" : "형태 미선택")} · ${esc(x.concentration || "미입력")}</b><em>${esc(x.light || "광 노출 정보 없음")}</em></div>
      </div>
      <p class="state-source-note">${demo ? "보관함·기울기·환경 수치는 시연용 예시입니다. 실제 측정과 안전 판정이 아닙니다." : "이 시약에는 확인된 센서 측정값이 없습니다. 지정 보관함과 기울기는 자동 판정하지 않습니다."}</p>
      <h4 class="detail-subtitle">추가 센서 정보</h4><div class="optional-detail-list">${sensorInfo(x).map(o => `<div class="optional-detail"><b>${esc(o[0])}</b><span>${esc(o[1])}</span><small>${esc(o[2])}</small></div>`).join("")}</div>
      <div class="notice-box"><span>ⓘ</span><p>${esc(x.notes || "추가 메모 없음")} 실제 보관·취급 전에 제품 라벨과 SDS를 확인하세요.</p></div>
      <div class="detail-actions"><button type="button" class="button danger small" data-delete>시약 삭제</button><span>삭제한 시약은 현재 브라우저에서 제거됩니다.</span></div>
      </div>`;
    element.classList.add("expanded");
    element.hidden = false;
    const del = element.querySelector("[data-delete]");
    if (del) del.onclick = () => {
      if (!confirm(`'${x.name}' 시약을 삭제할까요?`)) return;
      try {
        const updated = all().filter(item => String(item.id) !== String(x.id));
        localStorage.setItem(K, JSON.stringify(updated));
        selected = null;
        render();
        const toast = $("toast");
        if (toast) {
          toast.textContent = `${x.name} 시약을 삭제했습니다.`;
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 2400);
        }
      } catch (_) { alert("브라우저 저장에 실패했습니다. 삭제가 적용되지 않았습니다."); }
    };
  }
  function render() {
    const items = all();
    const q = $("searchReagents").value.toLowerCase().trim();
    const matching = items.filter(x => `${x.name || ""} ${x.formula || ""}`.toLowerCase().includes(q));
    $("totalReagents").textContent = items.length;
    $("needsReview").textContent = items.filter(needsReview).length;
    $("reagentList").innerHTML = matching.length ? matching.slice().reverse().map(x => {
      const opened = selected === String(x.id);
      const form = x.formType === "solid" ? "고체" : x.formType === "liquid" ? "액체·용액" : x.formType === "gas" ? "기체" : "형태 확인";
      return `<div class="reagent-wrap"><button class="reagent-item reagent-select ${opened ? "selected" : ""}" data-id="${esc(x.id)}" aria-expanded="${opened}" style="width:100%;text-align:left"><div><b>${esc(x.name)}</b><small>${esc(x.formula || "화학식 미입력")} · ${form} · ${esc(x.location || "보관 위치 미입력")}</small></div><span class="reagent-badge ${needsReview(x) ? "badge-bad" : "badge-good"}">${needsReview(x) ? "확인 필요" : "정보 입력됨"}</span><span class="expand-chevron">${opened ? "⌃" : "⌄"}</span></button><div class="inline-detail" data-detail="${esc(x.id)}" ${opened ? "" : "hidden"}></div></div>`;
    }).join("") : '<div class="empty-state"><b>검색 결과가 없습니다</b><p>검색어를 바꾸거나 시약 등록 메뉴에서 추가해 주세요.</p></div>';
    $("reviewList").innerHTML = items.filter(needsReview).map(x => `<div class="review-item"><span class="review-dot"></span><div><b>${esc(x.name)}</b><p>${esc(x.stateSource === "simulation" ? "시뮬레이션 예시 · 제품별 보관 조건 확인 필요" : "시약 정보 입력 및 SDS 검토 필요")}</p></div></div>`).join("") || '<div class="empty-state compact"><b>확인할 항목이 없습니다</b></div>';
    document.querySelectorAll(".reagent-select").forEach(button => button.addEventListener("click", () => {
      selected = selected === button.dataset.id ? null : button.dataset.id;
      render();
      if (selected) {
        const target = [...document.querySelectorAll("[data-detail]")].find(el => el.dataset.detail === selected);
        if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "nearest" }));
      }
    }));
    if (selected) detail(items.find(x => String(x.id) === selected));
  }
  $("searchReagents").addEventListener("input", () => { selected = null; render(); });
  $("clearSearch").addEventListener("click", () => { $("searchReagents").value = ""; selected = null; render(); });
  const menu = $("mobileMenu"), nav = $("topNav");
  if (menu && nav) menu.addEventListener("click", () => nav.classList.toggle("open"));
  render();
})();
