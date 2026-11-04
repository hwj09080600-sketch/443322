/* SENTRY home-only controller. Existing site structure, image and slide content are unchanged. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const menu = $("mobileMenu");
  const nav = $("topNav");
  if (menu && nav) {
    menu.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }
  const slides = [
    { title: '시약의 보관 환경을<br><span>더 체계적으로</span> 관리하다', description: '시약별 보관 조건과 센서 정보를 한곳에서 확인하고, 필요한 관리 항목을 놓치지 않도록 도와줍니다.' },
    { title: '시약마다 다른 조건을<br><span>맞춤형으로</span> 확인하다', description: '입력한 시약 정보를 바탕으로 확인해야 할 항목과 추가 센서 후보를 살펴보세요.' },
    { title: '센서 정보를 연결해<br><span>더 안전한 관리로</span>', description: '시약의 특성과 보관 환경에 필요한 측정 정보를 확인할 수 있도록 설계했습니다.' }
  ];
  const title = $("heroTitle"), description = $("heroDescription"), prev = $("prevSlide"), next = $("nextSlide");
  if (!title || !description || !prev || !next) return;
  const copy = document.querySelector(".hero-copy");
  const visual = document.querySelector(".hero-visual");
  const dots = [...document.querySelectorAll(".dot")];
  let active = 0, timer = null, touchX = null, transition = null;
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => show(active + 1), 5000);
  }
  function show(index) {
    active = (index + slides.length) % slides.length;
    clearTimeout(transition);
    if (copy) { copy.classList.remove("show"); copy.classList.add("slide-transition"); }
    transition = setTimeout(() => {
      // The three titles are hardcoded trusted markup, never user input.
      title.innerHTML = slides[active].title;
      description.textContent = slides[active].description;
      if (copy) { copy.classList.remove("slide-transition"); copy.classList.add("show"); }
    }, 120);
    dots.forEach((dot, i) => dot.classList.toggle("active", i === active));
    const foot = document.querySelector(".visual-foot span:last-child");
    if (foot) foot.textContent = `0${active + 1} / 0${slides.length}`;
    restart();
  }
  prev.addEventListener("click", () => show(active - 1));
  next.addEventListener("click", () => show(active + 1));
  dots.forEach(dot => dot.addEventListener("click", () => show(Number(dot.dataset.slide) || 0)));
  if (visual) {
    visual.addEventListener("touchstart", e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
    visual.addEventListener("touchend", e => {
      if (touchX === null) return;
      const delta = e.changedTouches[0].clientX - touchX;
      if (Math.abs(delta) > 45) show(active + (delta < 0 ? 1 : -1));
      touchX = null;
    }, { passive: true });
  }
  restart();
})();
