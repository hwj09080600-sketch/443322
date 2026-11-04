/* SENTRY 시약 한글/영문 이름 -> 화학식 자동 완성
 * 데이터: 제공된 <화학실 시약리스트_2025.08.pdf> 중 화학식이 확인 가능한 항목과
 *        원본 자료의 오탈자/누락을 점검한 일반 명칭.
 * 기존 register.html, app.js, 저장 데이터 및 CSS는 수정하지 않습니다.
 * 이 파일만 기존 sentry-formula.js에 덮어써도 작동합니다.
 */
(() => {
  "use strict";
  const input = document.getElementById('reagentName');
  const output = document.getElementById('formula');
  if (!input || !output) return;

  const reagentRows = [["비스무트","Bismuth","Bi"],["카드뮴","Cadmium","Cd"],["칼슘","Calcium","Ca"],["규소","Silicon","Si"],["적인","Phosphrous red","P"],["숯","Charcoal","C"],["탄소봉","Carbon rod","C"],["산화칼슘","Calcium oxide","CaO"],["이산화망가니즈","Manganese(IV) oxide","MnO2"],["산화아연","Zinc oxide","ZnO"],["일산화납","Lead(II) oxide","PbO"],["이산화납","Lead(IV) oxide","PbO2"],["과산화나트륨","Sodium peroxide","Na2O2"],["과산화바륨","Barium peroxide","BaO2"],["산화알루미늄","Aluminium oxide","Al2O3"],["산화타이타늄","Titanium dioxide","TiO2"],["산화규소","Silicon oxide","SiO2"],["산화은","silver(I) oxide","Ag2O"],["리튬 텅스텐 산화물","Lithium tungsten oxide","Li2WO4"],["염화나트륨","Sodium chloride","NaCl"],["염화암모늄","Ammonium chloride","NH4Cl"],["염화칼슘","Calcium chloride","CaCl2"],["염화아연","Zinc chloride","ZnCl2"],["염화칼륨","Potassium chloride","KCl"],["염화마그네슘","Magnesium chloride","MgCl2"],["염화스트론튬","Strontium chloride","SrCl2"],["염화바륨","Barium chloride","BaCl2"],["염화리튬","Lithium chloride","LiCl"],["차아염소산나트륨","Sodium hypochlorite","NaClO"],["염화구리","Copper(II) chloride","CuCl2"],["염화니켈","Nickel(II) chloride","NiCl2"],["과염수산칼륨","Potassium perchlorate","KClO4"],["리튬 과염소산","Lithium perchlorate","LiClO4"],["황산니켈","Nickel(II) sulfate","NiSO4"],["황산칼슘","Calcium sulfate","CaSO4"],["황산아연","Zinc sulfate","ZnSO4"],["황산알루미늄","Aluminum sulfate","Al2(SO4)3"],["황산암모늄","Ammonium sulfate","(NH4)2SO4"],["황산바륨","Barium sulfate","BaSO4"],["황산마그네슘","Magnesium sulfate","MgSO4"],["황산나트륨","Sodium sulfate","Na2SO4"],["아황산나트륨","Sodium sulfite","Na2SO3"],["아황산수소나트륨","Sodium hydrogen sulfite","NaHSO3"],["싸이오황산나트륨","Sodium thiosulfate","Na2S2O3"],["암모늄명반","Ammonium alum","(NH4)Al(SO4)2"],["황산은","Silver(I) sulfate","Ag2SO4"],["황산납","Lead sulfate","PbSO4"],["황산망가니즈","Manganese Sulfate","MnSO4"],["과황산암모늄","Ammonium Persulfate","(NH4)2S2O8"],["다이아황산나트륨","SODIUM METABISULFIT","Na2S2O5"],["황산칼륨","potassium sulfate","K2SO4"],["아황산수소칼륨","Potassium hydrogen sul","KHSO3"],["질산칼륨","Potassium nitrate","KNO3"],["질산스트론튬","Strontium nitrate","Sr(NO3)2"],["질산바륨","Barium nitrate","Ba(NO3)2"],["질산나트륨","Sodium nitrate","NaNO3"],["질산암모늄","Ammonium nitrate","NH4NO3"],["질산은","Silver nitrate","AgNO3"],["질산납","Lead nitrate","Pb(NO3)2"],["질산구리","Copper(II) nitrate","Cu(NO3)2"],["질산아연","Zinc nitrate","Zn(NO3)2"],["질산알루미늄","Aluminum nitrate","Al(NO3)3"],["질산니켈","Nickel(II) nitrate","Ni(NO3)2"],["질산마그네슘","Magnesium nitrate","Mg(NO3)2"],["질산크로뮴","Chromium(III) nitrate","Cr(NO3)3"],["질산세륨암모늄","Ceric ammonium nitrate","CeH8N8O18"],["질산코발트","Cobalt(II) Nitrate","Co(NO3)2"],["질산비스무스","Bismuth(III) nitrate","Bi(NO3)3"],["질산칼슘","Calcium nitrate","Ca(NO3)2"],["아질산 나트륨","Sodium nitrite","NaNO2"],["탄산나트륨","Sodium carbonate","Na2CO3"],["탄산수소나트륨","Sodium Bicarbonate","NaHCO3"],["탄산칼슘","Calcium carbonate","CaCO3"],["탄산칼륨","Potassium carbonate","K2CO3"],["탄산암모늄","Ammonium carbonate","(NH4)2CO3"],["탄산납","Lead(II) carbonate","PbCO3"],["탄산마그네슘","Magnesium carbonate","MgCO3"],["탄산리튬","Lithium carbonate","Li2CO3"],["탄산수소칼륨","Potassium bicarbonate","KHCO3"],["탄산구리","Copper (II) carbonate","CuCO3"],["황화나트륨","Sodium sulfide","Na2S"],["황화안티모니","Antimony trisulfide","Sb2S3"],["황화수은","Mercury sulfide","HgS"],["황화아연","Zinc sulfide","ZnS"],["붕산","Boric acid","H3BO3"],["과망가니즈산칼륨","Potassium permangana","KMnO4"],["싸이오시안산칼륨","Potassium thiocyanate","KSCN"],["브로민화칼륨","Potassium bromide","KBr"],["규산나트륨","Sodium silicate","Na2SiO3"],["아이오딘산칼륨","Potassium iodate","KIO3"],["수소화붕소나트륨","Sodium borohydride","NaBH4"],["아이오딘화칼륨","Potassium iodide","KI"],["아이오딘화나트륨","Sodium iodide","NaI"],["브로민화나트륨","Sodium bromide","NaBr"],["인산나트륨","Sodium Phosphate","Na3PO4"],["염소산칼륨","Potassium chlorate","KClO3"],["아자이드화나트륨","Sodium azide","NaN3"],["바나듐산암모늄","Ammonium vanadate(V)","NH4VO3"],["염소산나트륨","sodium chlorate","NaClO3"],["몰리브덴산나트륨","Sodium Molybdate","Na2MoO4"],["플루오린화 나트륨","Sodium Fluoride","NaF"],["크롬산칼륨","Potassium chromate","K2CrO4"],["티오시안산나트륨","Sodium thiocyanate","NaSCN"],["삼폴리인산나트륨","Sodium tripolyphosp","Na5P3O10"],["티오시안산칼륨","Potassium thiocyanate","KSCN"],["아이오딘화 구리","copper(I) iodide","CuI"],["포도당","Glucose","C6H12O6"],["설탕","Sucrose","C12H22O11"],["젖당","Lactose","C12H22O11"],["덱스트린","Dextrin","(C6H10O5)n"],["과당","Fructose","C6H12O6"],["셀룰로오스","Cellulose","(C6H10O5)n"],["덱스트로오스","Dextrose","C6H12O6"],["아드레날린","adrenaline","C9H13NO3"],["글리콜산","Glycolic acid","C2H4O3"],["타타르산","Tartaric acid","C4H6O6"],["폼산","Formic acid","HCOOH"],["옥살산","Oxalic acid","C2H2O4"],["구연산(시트르산)","Citric acid","C6H8O7"],["살리실산","Salicylic acid","C7H6O3"],["피크린산","Picric acid","C6H3N3O7"],["벤조산","Benzoic acid","C7H6O2"],["타타르산철암모늄","Ammonium iron tartrate","C8H12FeNO12"],["구연산나트륨","Sodium citrate","C6H5Na3O7"],["스테아르산","Stearic acid","C18H36O2"],["아세트산나트륨","Sodium acetate","C2H3NaO2"],["옥살산나트륨","Sodium oxalate","Na2C2O4"],["EDTA","Ethylenediaminetetraacetic acid","C10H16N2O8"],["스테아르산칼슘","Calcium stearate","C36H70CaO4"],["올레산","Oleic acid","C18H34O2"],["옥살산칼슘","Calcium oxalate","CaC2O4"],["아스코브산","Ascorbic acid","C6H8O6"],["아스파테임","Aspartame","C14H18N2O5"],["벤조산나트륨","Sodium benzoate","C7H5NaO2"],["말론산","Malonic acid","C3H4O4"],["키틴","Chitin","(C8H13O5N)n"],["설파닐산","Sulfanilic acid","C6H7NO3S"],["팔미트산","palmitic acid","C16H32O2"],["말레산","Maleic acid","C4H4O4"],["폴리아크릴산나트륨","Sodium Polyacrylate","(C3H3NaO2)n"],["젖산칼슘","Calcium Lactate","C6H10CaO6"],["아세트산칼슘","Calcium acetate","Ca(C2H3O2)2"],["프탈산수소칼륨","Potassium hydrogen phthalate","C8H5KO4"],["나이트로벤젠","Nitrobenzene","C6H5NO2"],["플루오레세인","Fluorescein","C20H12O5"],["리보플라빈","riboflavin","C17H20N4O6"],["나프탈렌","Naphthalene","C10H8"],["글리세롤(린)","Glycerol(Glycerin)","C3H8O3"],["요소","Urea","CO(NH2)2"],["알긴산나트륨","Sodium alginate","C6H9NaO7"],["캄파","Camphor","C10H16O"],["카보머(증점제)","Carbomer","(C3H4O2)n"],["카페인","Caffeine","C8H10N4O2"],["닌하이드린","Ninhydrin","C9H6O4"],["티모프탈레인","Thymolphthalein","C28H30O4"],["소비톨","Sorbitol","C6H14O6"],["레조시놀","Resorcinol(Benzene-1,3","C6H6O2"],["콜레스테롤","cholesterol","C27H46O"],["파라-니트로아닐린","p-Nitroaniline","C6H6N2O2"],["아세트아미노펜","Acetaminophen","C8H9NO2"],["안트라센","Anthracene","C14H10"],["메틸파라벤","Methylparaben","C8H8O3"],["알파-토코페롤","alpha-Tocopherol","C29H50O2"],["2-메틸이미다졸","2-Methylimidazole","C4H6N2"],["칼마지트","Calmagite","C17H14N2O5S"],["이부프로펜","Ibuprofen","C13H18O2"],["아세트아닐리드","acetanilide","C8H9NO"],["메틸렌블루","Methylene blue","C16H18ClN3S"],["샤프라닌","Safranin","C20H19ClN4"],["알리자린","Alizarin","C14H8O4"],["티오닌","Thionin","C12H10ClN3S"],["크리스탈 바이올렛","Crystal Violet","C25N3H30Cl"],["페놀프탈레인","Phenolphthalein","C20H14O4"],["다이페닐아민","Diphenylamine","C12H11N"],["PTC","Phenylthiocarbamide","C7H8N2S"],["루미놀","Luminol","C8H7N3O2"],["HEPES","2-[4-(2-hydroxyethyl)pi","C8H18N2O4S"],["벤조피렌","Benzopyrene","C20H12"],["메틸레드","Methyl red","C15H15N3O2"],["뮤렉사이드","Murexide","C8H8N6O6"],["티몰블루","Thymol blue","C27H30O5S"],["증류수","Distilled water","H2O"],["수산화나트륨","Sodium hydroxide","NaOH"],["수산화칼슘","Calcium hydroxide","Ca(OH)2"],["수산화칼륨","Potassium hydroxide","KOH"],["수산화바륨","Barium hydroxide","Ba(OH)2"],["수산화알루미늄","Aluminum hydroxide","Al(OH)3"],["염산","Hydrochloric acid","HCl"],["황산","Sulfuric acid","H2SO4"],["질산","Nitric acid","HNO3"],["인산","Phosphoric acid","H3PO4"],["플루오린화수소산","Hydrofluoric acid","HF"],["메타인산","Metaphosphoric acid","HPO3"],["설파민산","Sulfamic acid","H2NSO3H"],["메틸알코올","Methyl alcohol","CH3OH"],["에틸알코올","Ethyl alcohol","C2H5OH"],["다이에틸에터","Ethyl ether","C2H5OC2H5"],["뷰틸알코올","Butyl alcohol","C4H9OH"],["아이소펜틸알코올","Isopentyl alcohol","C5H11OH"],["옥틸알코올","Octyl alcohol","C8H17OH"],["프로필알코올","Propyl alcohol","C3H8O"],["벤젠","Benzene","C6H6"],["헥세인","Hexane","C6H14"],["아세톤","Acetone","(CH3)2CO"],["톨루엔","Toluene","C7H8"],["피리딘","Pyridine","C5H5N"],["사염화탄소","Carbon tetrachloride","CCl4"],["메틸피롤리돈","Methyl pyrrolidone","C5H9NO"],["무수아세트산","Acetic anhydride","C4H6O3"],["염화메틸렌","Dichloromethane","CH2Cl2"],["헥사메틸렌다이아민","Hexamethylenediamine","C6H16N2"],["클로로폼","Chloroform","CHCl3"],["다이메틸아닐린","N,N-Dimethylaniline","C8H11N"],["염화아디포일","Adipoyl chloride","C6H8Cl2O2"],["페놀","Phenol","C6H6O"],["크레졸","Cresol","C7H8O"],["트라이에탄올아민","Triethanolamine","C6H15NO3"],["아세트알데하이드","Acetaldehyde","C2H4O"],["에탈렌다이아민","Ethylenediamine","C2H8N2"],["아닐린","Aniline","C6H7N"],["아세트산에틸","Ethyl acetate","C4H8O2"],["사이클로헥산올","Cyclohexanol","C6H12O"],["아세트산뷰틸","Butyl acetate","C6H12O2"],["아이소프로판올","Isopropanol","(CH3)2CHOH"],["테트라하이드로퓨란","Tetrahydrofuran","C4H8O"],["아밀알코올","Amyl alcohol","C5H12O"],["벤질알코올","Benzyl alcohol","C7H8O"],["프로필렌글라이콜","Propylene glycol","C3H8O2"],["아세틸아세톤","Acetylacetone","C5H8O2"],["메틸에틸케톤","Methyl ethyl ketone","C4H8O"],["트라이메틸펜테인","Trimethylpentane","C8H18"],["아크릴산에틸","Ethyl acrylate","C5H8O2"],["아크릴산메틸","Methyl acrylate","C4H6O2"],["뷰틸아민","Butylamine","C4H11N"],["세탄올(세틸알코올)","Cetyl alcohol","C16H34O"],["벤즈알데하이드","Benzaldehyde","C7H6O"],["4-아미노페놀","4-aminophenol","C6H7NO"],["자일렌","xylene","C8H10"],["아세트아마이드","acetamide","CH3CONH2"],["다이메틸폼아마이드","Dimethylformamide","C3H7NO"],["과산화수소","Hydrogen peroxide","H2O2"],["폼알데하이드","Form aldehyde","CH2O"],["아이오딘","Iodine","I2"],["리튬","Lithium","Li"],["나트륨","Sodium","Na"],["칼륨","Potassium","K"],["수은","Mercury","Hg"],["비스무트산나트륨","Sodium bismuthate","NaBiO3"],["아세트산납","Lead(II) acetate","(CH3COO)2Pb"],["다이크로뮴산칼륨","Potassium dichromate","K2Cr2O7"],["다이크로뮴산암모늄","Ammonium dichoromat","(NH4)2Cr2O7"],["칼슘카바이드","Calcium carbide","CaC2"],["질산카드뮴","Cadmium nitrate","Cd(NO3)2"],["티타늄 테트라이소프로폭사이드","Titanium(IV) isopropoxide","Ti[OCH(CH3)2]4"],["다이아황산나트륨","SODIUM METABISULFITE","Na2S2O5"],["질산철","Iron(III) nitrate","Fe(NO3)3"],["붕사","Borax","B4O7Na2·10H2O"],["과망가니즈산칼륨","Potassium permanganate","KMnO4"],["제1인산칼륨","Potassium Phosphate Monobasic","KH2PO4"],["제2인산 나트륨","Disodium Hydrogen Phosphate (Sodium phosphate)","Na2HPO4"],["다이나이트로살리실산","3,5-Dinitrosalicylic acid","C7H4N2O7"],["6,8-노나데카다이노익산","6,8-Nonadecadiynoic acid","C19H30O2"],["석신산","succinic acid","(CH2)2(CO2H)2"],["아세틸살리실산 (아스피린)","acetylsalicylic acid","C9H8O4"],["하이드로퀴논","Hydroquinone(Benzene-1,4-diol)","C6H6O2"],["레조시놀","Resorcinol(Benzene-1,3-diol)","C6H6O2"],["인디고카민","Indigo carmine","C16H8N2Na2O8S2"],["메틸오렌지","Methyl orange","C14H14N3NaO3S"],["BTB","Bromothymol blue","C27H28Br2O5S"],["HEPES","2-[4-(2-hydroxyethyl)piperazin-1-yl]ethane-1-sulfonic a","C8H18N2O4S"],["메틸알코올 (메탄올)","Methyl alcohol","CH3OH"],["뷰틸알코올 (부탄올)","Butyl alcohol","C4H9OH"],["다이메틸아세트아마이드","Dimethylacetamide","C4H9NO"],["아이소뷰틸 메틸케톤","Methyl isobutyl ketone","C6H12O"],["마그네슘 리본","Magnesium ribbon","Mg"],["마그네슘 가루","Magnesium powder","Mg"],["알루미늄 판","Aluminum foil","Al"],["알루미늄 가루","Aluminum powder","Al"],["아연판","Zinc foil","Zn"],["아연 가루","Zinc powder","Zn"],["철판","Iron foil","Fe"],["철가루","Iron powder","Fe"],["니켈판","Nickel foil","Ni"],["주석판","Tin foil","Sn"],["납판","Lead foil","Pb"],["납가루","Lead powder","Pb"],["구리판","Copper foil","Cu"],["구리가루","Copper powder","Cu"],["은판","Silver foil","Ag"],["백금선","Platinum wire","Pt"],["황 분말","Sulfur powder","S"],["붕사","Borax","Na2B4O7·10H2O"],["에오신Y","Eosin Y","C20H6Br4Na2O5"],["에리오크롬 블랙T","Eriochrome Black T","C20H12N3NaO7S"],["아세틸살리실산","Acetylsalicylic acid","C9H8O4"],["염화코발트(Ⅱ) 육수화물","Cobalt(II) chloride hexahydrate","CoCl2·6H2O"],["황산구리(II)","Copper(II) sulfate","CuSO4"],["타타르산칼륨나트륨 사수화물","Potassium sodium tartrate tetrahydrate","KNaC4H4O6·4H2O"],["헥사시아노철(Ⅱ)산칼륨","Potassium hexacyanoferrate(II)","K4[Fe(CN)6]"],["헥사시아노철(Ⅲ)산칼륨","Potassium hexacyanoferrate(III)","K3[Fe(CN)6]"],["염화구리(II)","Copper(II) chloride","CuCl2"],["염화코발트(II) 육수화물","Cobalt(II) chloride hexahydrate","CoCl2·6H2O"],["브로민산칼륨","Potassium bromate","KBrO3"],["헥사시아노철(II)산칼륨","Potassium hexacyanoferrate(II)","K4[Fe(CN)6]"],["헥사시아노철(III)산칼륨","Potassium hexacyanoferrate(III)","K3[Fe(CN)6]"],["인산이수소칼륨","Potassium dihydrogen phosphate","KH2PO4"],["인산수소이칼륨","Dipotassium hydrogen phosphate","K2HPO4"],["황산철(II)암모늄","Ammonium iron(II) sulfate","(NH4)2Fe(SO4)2"],["탄산수소암모늄","Ammonium bicarbonate","NH4HCO3"],["부티르산","Butyric acid","C4H8O2"],["석신산","Succinic acid","C4H6O4"],["타타르산칼륨","Dipotassium tartrate","K2C4H4O6"],["아밀 아세테이트","Amyl acetate","CH3COOC5H11"],["아세트산프로필","Propyl acetate","C5H10O2"],["메탄올","Methanol","CH3OH"],["에탄올","Ethanol","C2H5OH"],["에터","Diethyl ether","C2H5OC2H5"],["글리세롤","Glycerol","C3H8O3"],["아스코르브산","Ascorbic acid","C6H8O6"],["시트르산","Citric acid","C6H8O7"],["암모니아","Ammonia","NH3"],["브로모타이몰블루","Bromothymol blue","C27H28Br2O5S"],["소르비톨","Sorbitol","C6H14O6"],["크리스탈바이올렛","Crystal violet","C25H30ClN3"],["활성탄","Activated carbon","C"],["명반","Potassium aluminum sulfate","KAl(SO4)2"],["크로뮴명반","Potassium chromium sulfate","KCr(SO4)2"],["몰리브덴산암모늄","Ammonium molybdate","(NH4)2MoO4"]];
  const aliases = {"소금":"NaCl","table salt":"NaCl","baking soda":"NaHCO3","베이킹소다":"NaHCO3","가성소다":"NaOH","caustic soda":"NaOH","초산":"CH3COOH","acetic acid":"CH3COOH","ethanoic acid":"CH3COOH","isopropyl alcohol":"(CH3)2CHOH","IPA":"(CH3)2CHOH","isopropanol":"(CH3)2CHOH","메틸알코올":"CH3OH","methyl alcohol":"CH3OH","에틸알코올":"C2H5OH","ethyl alcohol":"C2H5OH","구연산":"C6H8O7","비타민C":"C6H8O6","vitamin C":"C6H8O6","과망간산칼륨":"KMnO4","염화 소듐":"NaCl","sodium bicarbonate":"NaHCO3","황산구리":"CuSO4","황산구리(II)":"CuSO4","copper sulfate":"CuSO4","copper(II) sulfate":"CuSO4","silver nitrate":"AgNO3","ammonia":"NH3","물":"H2O","water":"H2O","염화코발트육수화물":"CoCl2·6H2O","potassium dihydrogen phosphate":"KH2PO4","monopotassium phosphate":"KH2PO4","dipotassium phosphate":"K2HPO4","ferric chloride":"FeCl3","ferrous chloride":"FeCl2","sodium hydroxide":"NaOH","질산은":"AgNO3"};
  const forced = {"질산은":"AgNO3","황산구리ii":"CuSO4","염화코발트ii육수화물":"CoCl2·6H2O","브로민산칼륨":"KBrO3","붕사":"Na2B4O7·10H2O","과망가니즈산칼륨":"KMnO4","타타르산칼륨나트륨사수화물":"KNaC4H4O6·4H2O","헥사시아노철ii산칼륨":"K4[Fe(CN)6]","헥사시아노철iii산칼륨":"K3[Fe(CN)6]","인산이수소칼륨":"KH2PO4","인산수소이칼륨":"K2HPO4","염화구리ii":"CuCl2","황산철ii암모늄":"(NH4)2Fe(SO4)2","탄산수소암모늄":"NH4HCO3","부티르산":"C4H8O2","석신산":"C4H6O4","타타르산칼륨":"K2C4H4O6","아밀아세테이트":"CH3COOC5H11","아세트산프로필":"C5H10O2","아세트산에틸":"C4H8O2","메탄올":"CH3OH","에탄올":"C2H5OH","에터":"C2H5OC2H5","다이에틸에터":"C2H5OC2H5","글리세롤":"C3H8O3","과산화수소":"H2O2","아스코르브산":"C6H8O6","시트르산":"C6H8O7","포도당":"C6H12O6","염화나트륨":"NaCl","염산":"HCl","황산":"H2SO4","수산화나트륨":"NaOH","암모니아":"NH3","증류수":"H2O","브로모타이몰블루":"C27H28Br2O5S","btb":"C27H28Br2O5S","메틸오렌지":"C14H14N3NaO3S","인디고카민":"C16H8N2Na2O8S2","에오신y":"C20H6Br4Na2O5","에리오크롬블랙t":"C20H12N3NaO7S","아세틸살리실산":"C9H8O4","소르비톨":"C6H14O6","메틸에틸케톤":"C4H8O","크리스탈바이올렛":"C25H30ClN3","활성탄":"C","명반":"KAl(SO4)2","크로뮴명반":"KCr(SO4)2","몰리브덴산암모늄":"(NH4)2MoO4","silvernitrate":"AgNO3","copperiisulfate":"CuSO4","cobaltiichloridehexahydrate":"CoCl2·6H2O","potassiumbromate":"KBrO3","borax":"Na2B4O7·10H2O","potassiumpermanganate":"KMnO4","potassiumsodiumtartratetetrahydrate":"KNaC4H4O6·4H2O","potassiumhexacyanoferrateii":"K4[Fe(CN)6]","potassiumhexacyanoferrateiii":"K3[Fe(CN)6]","potassiumdihydrogenphosphate":"KH2PO4","dipotassiumhydrogenphosphate":"K2HPO4","copperiichloride":"CuCl2","ammoniumironiisulfate":"(NH4)2Fe(SO4)2","ammoniumbicarbonate":"NH4HCO3","butyricacid":"C4H8O2","succinicacid":"C4H6O4","dipotassiumtartrate":"K2C4H4O6","amylacetate":"CH3COOC5H11","propylacetate":"C5H10O2","ethylacetate":"C4H8O2","methanol":"CH3OH","ethanol":"C2H5OH","diethylether":"C2H5OC2H5","ethylether":"C2H5OC2H5","glycerol":"C3H8O3","hydrogenperoxide":"H2O2","ascorbicacid":"C6H8O6","citricacid":"C6H8O7","glucose":"C6H12O6","sodiumchloride":"NaCl","hydrochloricacid":"HCl","sulfuricacid":"H2SO4","sodiumhydroxide":"NaOH","ammonia":"NH3","distilledwater":"H2O","bromothymolblue":"C27H28Br2O5S","methylorange":"C14H14N3NaO3S","indigocarmine":"C16H8N2Na2O8S2","eosiny":"C20H6Br4Na2O5","eriochromeblackt":"C20H12N3NaO7S","acetylsalicylicacid":"C9H8O4","sorbitol":"C6H14O6","methylethylketone":"C4H8O","crystalviolet":"C25H30ClN3","activatedcarbon":"C","potassiumaluminumsulfate":"KAl(SO4)2","potassiumchromiumsulfate":"KCr(SO4)2","ammoniummolybdate":"(NH4)2MoO4"};
  const normalize = s => String(s || '').normalize('NFKC').toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '');
  const lookup = new Map();
  const suggestions = new Map();
  const add = (rawName, rawFormula, override = false) => {
    const key = normalize(rawName);
    if (!key || !rawFormula) return;
    if (override) lookup.set(key, { formula: rawFormula, ambiguous: false });
    else if (!lookup.has(key)) lookup.set(key, { formula: rawFormula, ambiguous: false });
    else if (lookup.get(key).formula !== rawFormula) lookup.set(key, { formula: '', ambiguous: true });
    suggestions.set(key, rawName);
  };
  reagentRows.forEach(([ko, en, formula]) => { add(ko, formula); add(en, formula); });
  Object.entries(forced).forEach(([key, formula]) => lookup.set(key, { formula, ambiguous: false }));
  Object.entries(aliases).forEach(([name, formula]) => add(name, formula, true));

  // 사용자가 한/영 이름을 일부 입력할 때 기존 필드 아래 브라우저 고유 자동 제안을 표시.
  if (!input.hasAttribute('list')) {
    const list = document.createElement('datalist');
    list.id = 'sentry-chemical-name-suggestions';
    suggestions.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      list.appendChild(option);
    });
    input.setAttribute('list', list.id);
    input.parentElement?.appendChild(list);
  }

  const info = document.createElement('small');
  info.className = 'field-hint';
  info.id = 'formulaLookupStatus';
  info.setAttribute('role', 'status');
  info.setAttribute('aria-live', 'polite');
  info.style.display = 'block';
  info.style.marginTop = '5px';
  input.parentElement?.appendChild(info);
  const setStatus = text => { info.textContent = text; };

  // 수화물 점(·) 뒤 숫자는 물 분자 수를 나타내는 계수이므로 아래첨자로 바꾸지 않음.
  const sub = text => String(text).replace(/[0-9]/g, d => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]);
  const decorate = formula => String(formula).split('·').map((part, i) => {
    if (i===0) return sub(part);
    const matched = part.match(/^(\d+)(.*)$/);
    return matched ? matched[1] + sub(matched[2]) : sub(part);
  }).join('·');
  let reqNum = 0, timer = null, controller = null, editing = false;
  let autofilled = null;
  const changeFormula = value => {
    output.value = decorate(value);
    autofilled = output.value;
    output.dataset.autofilled = 'true';
  };
  output.addEventListener('input', () => {
    editing = true;
    autofilled = null;
    delete output.dataset.autofilled;
    setStatus('화학식을 직접 수정했습니다. 입력한 값이 우선 적용됩니다.');
  });

  const cancelPending = () => {
    if (timer !== null) { clearTimeout(timer); timer = null; }
    if (controller) { controller.abort(); controller = null; }
  };
  const processName = () => {
    const token = ++reqNum;
    cancelPending();
    const value = input.value.trim();
    const wasAuto = autofilled !== null;
    const prevAuto = autofilled;
    editing = false;
    // 기존 app.js가 동일 input 이벤트에 등록한 자동완성 코드보다 마지막에 반영.
    queueMicrotask(() => {
      if (token !== reqNum) return;
      const found = lookup.get(normalize(value));
      if (found && !found.ambiguous && found.formula) {
        changeFormula(found.formula);
        setStatus('시약명과 화학식이 확인되었습니다. 수화물·용액 농도·제품 표기는 시약병 라벨과 SDS를 확인하세요.');
        return;
      }
      if (wasAuto && output.value === prevAuto) {
        output.value = '';
        delete output.dataset.autofilled;
      }
      autofilled = null;
      if (!value) { setStatus(''); return; }
      if (found?.ambiguous) {
        setStatus('같은 시약명으로 서로 다른 화학식이 확인됩니다. 수화물/제품 라벨을 확인하고 직접 입력하세요.');
        return;
      }
      if (!/^[A-Za-z][A-Za-z\d ,()'\-.]{4,70}$/.test(value)) {
        setStatus('현재 시약 목록에서 일치하는 이름을 찾지 못했습니다. 화학식을 직접 입력할 수 있습니다.');
        return;
      }
      setStatus('기본 목록에 없는 영문 시약명입니다. PubChem 조회를 확인하고 있습니다…');
      timer = setTimeout(() => {
        if (token !== reqNum || editing) return;
        controller = new AbortController();
        const myController = controller;
        const timeout = setTimeout(() => myController.abort(), 6500);
        const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(value)}/property/MolecularFormula/JSON`;
        fetch(url, { signal: myController.signal, headers: { Accept: 'application/json' } })
          .then(r => { if (!r.ok) throw new Error('Not found'); return r.json(); })
          .then(data => {
            if (token !== reqNum || editing || input.value.trim() !== value) return;
            const arr = data?.PropertyTable?.Properties;
            if (!Array.isArray(arr) || arr.length !== 1 ||
                !/^[A-Za-z0-9()\[\].+·\-]+$/.test(arr[0]?.MolecularFormula || '')) {
              setStatus('PubChem에서 단일 분자식을 확인하지 못했습니다. 시약 라벨을 확인하고 직접 입력하세요.');
              return;
            }
            changeFormula(arr[0].MolecularFormula);
            setStatus('PubChem 분자식 조회 결과입니다. 실제 시약의 수화물·조성은 라벨에서 재확인하세요.');
          })
          .catch(() => {
            if (token === reqNum && !editing) setStatus('외부 데이터 조회에 실패했습니다. 직접 화학식을 입력할 수 있습니다.');
          })
          .finally(() => { clearTimeout(timeout); if (controller === myController) controller = null; });
      }, 650);
    });
  };
  input.addEventListener('input', processName);
  input.addEventListener('change', processName);
  const form = document.getElementById('reagentForm');
  if (form) form.addEventListener('reset', () => {
    ++reqNum; cancelPending(); editing = false; autofilled = null;
    delete output.dataset.autofilled; setStatus('');
  });
  // When a browser restores the form after navigation, fill the formula too.
  if (input.value.trim()) processName();
})();
