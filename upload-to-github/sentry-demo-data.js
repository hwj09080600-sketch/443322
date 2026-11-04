/* Initialise only a genuinely empty browser. Never reset or re-add deleted saved items. */
(() => {
  "use strict";
  const examples = [
    {id:"demo-1",name:"염화 나트륨",formula:"NaCl",formType:"solid",concentration:"고체",storage:"실온 · 건조 보관",location:"시약장 A-01",notes:"예시 보관 정보",temp:22.1,humidity:45,open:false,review:false,light:"일반광",cabinetStatus:"stored",tiltStatus:"upright",stateSource:"simulation"},
    {id:"demo-2",name:"과산화수소",formula:"H₂O₂",formType:"liquid",concentration:"예시 용액",storage:"차광 보관 조건 확인",location:"시약장 B-03",notes:"제품 라벨과 해당 제품의 SDS를 확인하세요.",temp:23.8,humidity:48,open:true,review:true,light:"차광 조건 확인",cabinetStatus:"stored",tiltStatus:"tilted",stateSource:"simulation"},
    {id:"demo-3",name:"에탄올",formula:"C₂H₅OH",formType:"liquid",concentration:"예시 용액",storage:"인화성 물질 보관장",location:"인화성 물질 보관장",notes:"실제 농도별 제품 라벨과 SDS 확인",temp:21.6,humidity:43,open:false,review:false,light:"일반광",cabinetStatus:"stored",tiltStatus:"upright",stateSource:"simulation"},
    {id:"demo-4",name:"질산 은",formula:"AgNO₃",formType:"solid",concentration:"고체",storage:"차광 및 보관 이력 확인",location:"시약장 B-05",notes:"보관 이력과 차광 조건을 함께 검토하세요.",temp:22.9,humidity:52,open:false,review:true,light:"차광 조건 확인",cabinetStatus:"check",tiltStatus:"upright",stateSource:"simulation"},
    {id:"demo-5",name:"황산 구리(II)",formula:"CuSO₄",formType:"solid",concentration:"고체",storage:"제품 라벨 기준 확인",location:"시약장 A-04",notes:"예시 보관 정보",temp:22.4,humidity:46,open:false,review:false,light:"일반광",cabinetStatus:"stored",tiltStatus:"upright",stateSource:"simulation"},
    {id:"demo-6",name:"염산",formula:"HCl",formType:"liquid",concentration:"예시 용액",storage:"부식성 물질 보관 절차 확인",location:"부식성 물질 보관장",notes:"농도별 SDS 확인 필요",temp:22.7,humidity:49,open:false,review:false,light:"일반광",cabinetStatus:"stored",tiltStatus:"upright",stateSource:"simulation"},
    {id:"demo-7",name:"질산 칼륨",formula:"KNO₃",formType:"solid",concentration:"고체",storage:"제품 라벨 기준 확인",location:"시약장 C-02",notes:"예시 보관 정보",temp:21.9,humidity:44,open:false,review:false,light:"일반광",cabinetStatus:"stored",tiltStatus:"upright",stateSource:"simulation"},
    {id:"demo-8",name:"아세트산",formula:"CH₃COOH",formType:"liquid",concentration:"예시 용액",storage:"농도와 제품 라벨 확인",location:"시약장 C-04",notes:"농도별 취급 기준 확인",temp:22.5,humidity:47,open:false,review:false,light:"일반광",cabinetStatus:"stored",tiltStatus:"upright",stateSource:"simulation"},
    {id:"demo-humidity",name:"염화 칼슘",formula:"CaCl₂",formType:"solid",concentration:"고체",storage:"건조 상태 유지 · 습기 주의",location:"시약장 C-05",notes:"흡습성 물질의 습도 확인을 보여주는 시연용 예시입니다. 실제 기준은 제품 라벨과 SDS를 확인하세요.",temp:22.6,humidity:88,open:false,review:true,light:"일반광",cabinetStatus:"stored",tiltStatus:"upright",stateSource:"simulation"}
  ];
  window.SENTRY_DEMOS = examples;
  try {
    if (localStorage.getItem("sentry-reagents-v1") === null) {
      localStorage.setItem("sentry-reagents-v1", JSON.stringify(examples));
      localStorage.setItem("sentry-humidity-example-seeded-v1", "1");
    }
  } catch (_) { /* Restricted storage: work with in-memory defaults on dashboard. */ }
})();
