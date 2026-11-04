/* Non-AI chemical formula lookup, loaded AFTER existing app.js. */
(() => {
  "use strict";
  const name = document.getElementById("reagentName");
  const formula = document.getElementById("formula");
  if (!name || !formula) return;
  const normalize = s => String(s || "").normalize("NFKC").toLowerCase().replace(/[\s_·\-()（）]/g, "");
  const table = new Map();
  const rows = [
    [["질산은", "질산 은", "silver nitrate"], "AgNO₃"],
    [["염화나트륨", "염화 나트륨", "sodium chloride", "소금"], "NaCl"],
    [["황산", "sulfuric acid", "sulphuric acid"], "H₂SO₄"],
    [["수산화나트륨", "가성소다", "sodium hydroxide"], "NaOH"],
    [["염산", "hydrochloric acid"], "HCl"],
    [["과산화수소", "hydrogen peroxide"], "H₂O₂"],
    [["에탄올", "ethanol", "ethyl alcohol"], "C₂H₅OH"],
    [["아세트산", "초산", "acetic acid", "ethanoic acid"], "CH₃COOH"],
    [["황산구리", "황산 구리", "황산구리(ii)", "copper(ii) sulfate", "copper sulfate"], "CuSO₄"],
    [["질산칼륨", "potassium nitrate"], "KNO₃"],
    [["염화칼슘", "calcium chloride"], "CaCl₂"],
    [["탄산수소나트륨", "베이킹소다", "sodium bicarbonate", "sodium hydrogen carbonate"], "NaHCO₃"],
    [["포도당", "glucose", "dextrose"], "C₆H₁₂O₆"],
    [["암모니아", "ammonia"], "NH₃"],
    [["증류수", "물", "water", "distilled water"], "H₂O"],
    [["질산", "nitric acid"], "HNO₃"],
    [["탄산나트륨", "sodium carbonate"], "Na₂CO₃"],
    [["염화칼륨", "potassium chloride"], "KCl"]
  ];
  rows.forEach(([names, value]) => names.forEach(alias => table.set(normalize(alias), value)));
  const originalHint = name.parentElement.querySelector(".field-hint");
  const status = document.createElement("small");
  status.className = "field-hint";
  status.id = "formulaLookupStatus";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.style.display = "block";
  status.style.marginTop = "5px";
  if (originalHint) originalHint.after(status); else name.after(status);
  let sequence = 0, manual = false, requestController = null;
  const source = { mode: "", formula: "" };
  const setStatus = message => { status.textContent = message; };
  const subscript = s => String(s).replace(/[0-9]/g, d => "₀₁₂₃₄₅₆₇₈₉"[Number(d)]);
  formula.addEventListener("input", () => { manual = true; source.mode = "manual"; });
  name.addEventListener("input", () => {
    const current = name.value.trim();
    const token = ++sequence;
    manual = false;
    if (requestController) requestController.abort();
    requestController = null;
    // The original app.js listener runs for this same event. Update once it completes.
    queueMicrotask(() => {
      if (token !== sequence) return;
      const local = table.get(normalize(current));
      if (local) {
        formula.value = local;
        formula.dataset.autofilled = "true";
        source.mode = "local";
        source.formula = local;
        setStatus("검토된 일반 시약 목록에서 확인했습니다. 수화물·제품 형태는 라벨을 확인하세요.");
        return;
      }
      // If the name no longer corresponds to the previous automatic choice, clear only that choice.
      if (source.mode === "local" || source.mode === "remote") {
        if (formula.value === source.formula) formula.value = "";
      }
      source.mode = ""; source.formula = "";
      if (!current) { setStatus(""); return; }
      if (!/^[a-z0-9 ,()'\-]+$/i.test(current)) {
        setStatus("확인된 항목이 없습니다. 자동 추측하지 않으며 화학식을 직접 입력할 수 있습니다.");
        return;
      }
      setStatus("공개 화학 정보 데이터베이스에서 이름을 확인하고 있습니다…");
      const controller = new AbortController();
      requestController = controller;
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(current)}/property/MolecularFormula/JSON`;
      const timeout = setTimeout(() => controller.abort(), 6500);
      fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } })
        .then(r => { if (!r.ok) throw new Error("No confirmed match"); return r.json(); })
        .then(data => {
          if (token !== sequence || manual || name.value.trim() !== current) return;
          const entries = data?.PropertyTable?.Properties;
          // Ambiguous results or suspicious formats must never be auto-selected.
          if (!Array.isArray(entries) || entries.length !== 1 || !/^[A-Za-z0-9().+\-·]+$/.test(entries[0].MolecularFormula || "")) {
            setStatus("여러 화학종이 조회되거나 결과가 불명확합니다. 정확한 제품 화학식을 직접 확인해 주세요.");
            return;
          }
          const found = subscript(entries[0].MolecularFormula);
          formula.value = found;
          formula.dataset.autofilled = "true";
          source.mode = "remote"; source.formula = found;
          setStatus(`PubChem 분자식 조회 결과입니다 (CID ${entries[0].CID || "미표시"}). 시약 라벨과 일치하는지 확인하세요.`);
        })
        .catch(() => { if (token === sequence && !manual) setStatus("외부 조회에 실패했거나 이름이 일치하지 않습니다. 화학식을 직접 입력해 주세요."); })
        .finally(() => clearTimeout(timeout));
    });
  });
  const form = document.getElementById("reagentForm");
  if (form) form.addEventListener("reset", () => { sequence++; manual = false; source.mode = ""; source.formula = ""; setStatus(""); });
})();
