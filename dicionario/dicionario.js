(() => {
  "use strict";

  const $ = selector => document.querySelector(selector);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
  const pad = number => String(number).padStart(2, "0");
  const normalize = text => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

  // Em que slides cada termo aparece.
  const slidesByTerm = new Map();
  SLIDES.forEach((slide, position) => slide.terms.forEach(term => {
    if (!slidesByTerm.has(term)) slidesByTerm.set(term, []);
    slidesByTerm.get(term).push(position);
  }));
  // Só os slides com termos técnicos entram na navegação; a numeração continua a da apresentação.
  const withTerms = SLIDES.map((slide, position) => position).filter(position => SLIDES[position].terms.length);
  const allTerms = Object.keys(GLOSSARY).sort((a, b) => a.localeCompare(b, "pt-BR", {sensitivity: "base"}));
  let current = 0;

  function termItem(term, {skipSlide = -1} = {}) {
    const item = document.createElement("li");
    item.className = "d-term";
    const title = document.createElement("h3");
    title.textContent = term;
    const definition = document.createElement("p");
    definition.textContent = GLOSSARY[term] || "Definição em preparação.";
    item.append(title, definition);
    const others = (slidesByTerm.get(term) || []).filter(position => position !== skipSlide);
    if (others.length) {
      const refs = document.createElement("p");
      refs.className = "d-refs";
      refs.append(skipSlide >= 0 ? "Também no slide " : "Nos slides ");
      others.forEach((position, order) => {
        const link = document.createElement("a");
        link.href = `#${SLIDES[position].id}`;
        link.textContent = String(position + 1);
        link.title = SLIDES[position].title;
        if (order) refs.append(order === others.length - 1 ? " e " : ", ");
        refs.append(link);
      });
      item.append(refs);
    }
    return item;
  }

  // Os termos entram em sequência; com movimento reduzido, só aparecem.
  function enter(list) {
    if (reducedMotion.matches || !list.animate) return;
    [...list.children].forEach((child, order) => {
      child.animate([{opacity: 0, translate: "0 10px"}, {opacity: 1, translate: "0 0"}], {
        duration: 280, delay: Math.min(order * 45, 300), easing: EASE_OUT, fill: "backwards"
      });
    });
  }

  function show(view) {
    for (const name of ["slide", "all", "search"]) $(`#view-${name}`).hidden = name !== view;
    $("#tab-slide").toggleAttribute("aria-current", view === "slide");
    $("#tab-all").toggleAttribute("aria-current", view === "all");
    if (view === "slide") $("#tab-slide").setAttribute("aria-current", "page");
    if (view === "all") $("#tab-all").setAttribute("aria-current", "page");
  }

  function renderSlide(position) {
    // Um slide sem termos leva ao próximo que tenha (ou ao último).
    current = withTerms.find(candidate => candidate >= position) ?? withTerms[withTerms.length - 1];
    const slide = SLIDES[current];
    $("#slide-select").value = slide.id;
    $("#slide-heading").textContent = `Slide ${pad(current + 1)}: ${slide.title}`;
    $("#tab-slide").href = `#${slide.id}`;
    $("#prev").disabled = current === withTerms[0];
    $("#next").disabled = current === withTerms[withTerms.length - 1];
    const list = $("#slide-terms");
    list.replaceChildren(...slide.terms.map(term => termItem(term, {skipSlide: current})));
    document.title = `${slide.title} · Dicionário`;
    show("slide");
    enter(list);
  }

  function renderAll() {
    const list = $("#all-terms");
    if (!list.children.length) list.replaceChildren(...allTerms.map(term => termItem(term)));
    document.title = "Todos os termos · Dicionário";
    show("all");
  }

  function renderSearch(query) {
    const needle = normalize(query.trim());
    if (!needle) {
      route();
      return;
    }
    const hits = allTerms.filter(term => [term, ...(GLOSSARY_ALIASES[term] || [])].some(name => normalize(name).includes(needle)));
    const inText = allTerms.filter(term => !hits.includes(term) && normalize(GLOSSARY[term]).includes(needle));
    const results = [...hits, ...inText];
    $("#search-heading").textContent = results.length
      ? `${results.length} ${results.length === 1 ? "termo encontrado" : "termos encontrados"}`
      : `Nenhum termo com “${query.trim()}”`;
    $("#search-terms").replaceChildren(...results.map(term => termItem(term)));
    show("search");
  }

  // O endereço guarda a consulta: #<id-do-slide> ou #termos. Os QR codes dos slides usam isso.
  function route() {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash === "termos") return renderAll();
    const position = SLIDES.findIndex(slide => slide.id === hash);
    renderSlide(position < 0 ? (current || withTerms[0]) : position);
  }

  const select = $("#slide-select");
  withTerms.forEach(position => {
    const slide = SLIDES[position];
    const option = document.createElement("option");
    option.value = slide.id;
    option.textContent = `${pad(position + 1)} · ${slide.title}`;
    select.append(option);
  });
  const go = position => {
    $("#search").value = "";
    location.hash = SLIDES[position].id;
  };
  const step = direction => {
    const order = withTerms.indexOf(current) + direction;
    if (order >= 0 && order < withTerms.length) go(withTerms[order]);
  };
  select.addEventListener("change", () => go(SLIDES.findIndex(slide => slide.id === select.value)));
  $("#prev").addEventListener("click", () => step(-1));
  $("#next").addEventListener("click", () => step(1));
  $("#search").addEventListener("input", event => renderSearch(event.target.value));
  window.addEventListener("hashchange", () => {
    $("#search").value = "";
    route();
    window.scrollTo({top: 0, behavior: reducedMotion.matches ? "auto" : "smooth"});
  });
  document.querySelector(".skip-link").addEventListener("click", event => {
    event.preventDefault();
    $("#main").focus();
  });
  route();
})();
