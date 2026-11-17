(() => {
  "use strict";

  const $ = selector => document.querySelector(selector);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
  const DB = typeof WORKSHOP_LINKS === "object" ? WORKSHOP_LINKS.firebase : "";
  const NAME_KEY = "oficina-ia.nome";
  // Consulta o slide atual a cada 1s: com ~100 celulares, ~100 leituras pequenas por segundo, dentro do plano gratuito.
  const POLL_MS = 1000;
  const pad = number => String(number).padStart(2, "0");
  const normalize = text => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

  // Em que slides cada termo aparece.
  const slidesByTerm = new Map();
  SLIDES.forEach((slide, position) => slide.terms.forEach(term => {
    if (!slidesByTerm.has(term)) slidesByTerm.set(term, []);
    slidesByTerm.get(term).push(position);
  }));
  // Só os slides com termos técnicos entram nas setas; a numeração continua a da apresentação.
  const withTerms = SLIDES.map((slide, position) => position).filter(position => SLIDES[position].terms.length);
  const allTerms = Object.keys(GLOSSARY).sort((a, b) => a.localeCompare(b, "pt-BR", {sensitivity: "base"}));
  let current = withTerms[0];
  let live = true;
  let liveSlide = null;
  let programmatic = false;

  /* ---------- Participante ---------- */

  const storage = {
    get(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch { /* sem armazenamento: vale só nesta visita */ }
    }
  };
  let participantName = (storage.get(NAME_KEY) || "").trim();
  let afterName = null;

  // O nome é obrigatório: o dialog não fecha com Esc até ser preenchido.
  function askName(then) {
    afterName = then || null;
    $("#name-error").textContent = "";
    $("#name-dialog").showModal();
    $("#name-input").focus();
  }
  $("#name-dialog").addEventListener("cancel", event => event.preventDefault());
  $("#name-form").addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#name-input").value.trim().replace(/\s+/g, " ");
    if (!name) {
      $("#name-error").textContent = "Escreva seu nome para continuar.";
      $("#name-input").focus();
      return;
    }
    participantName = name;
    storage.set(NAME_KEY, name);
    $("#name-dialog").close();
    const next = afterName;
    afterName = null;
    next?.();
  });

  /* ---------- Perguntas ---------- */

  let askTerm = null;

  function openAsk(term) {
    if (!participantName) return askName(() => openAsk(term));
    askTerm = term || null;
    $("#ask-title").textContent = askTerm ? `Perguntar sobre ${askTerm}` : "Fazer uma pergunta";
    $("#ask-as").textContent = `Como ${participantName}`;
    $("#ask-text").value = "";
    $("#ask-error").textContent = "";
    $("#ask-form").hidden = false;
    $("#ask-done").hidden = true;
    $("#ask-send").disabled = false;
    $("#ask-send").textContent = "Enviar";
    $("#ask-dialog").showModal();
    $("#ask-text").focus();
  }

  async function sendQuestion(event) {
    event.preventDefault();
    const texto = $("#ask-text").value.trim();
    if (!texto) {
      $("#ask-error").textContent = "Escreva sua pergunta antes de enviar.";
      $("#ask-text").focus();
      return;
    }
    if (!DB) {
      $("#ask-error").textContent = "As perguntas não estão disponíveis agora.";
      return;
    }
    const question = {nome: participantName, texto, criadaEm: {".sv": "timestamp"}, lida: false};
    if (askTerm) question.termo = askTerm;
    $("#ask-send").disabled = true;
    $("#ask-send").textContent = "Enviando…";
    $("#ask-error").textContent = "";
    try {
      const response = await fetch(`${DB}/perguntas.json`, {method: "POST", body: JSON.stringify(question)});
      if (!response.ok) throw new Error(String(response.status));
      $("#ask-form").hidden = true;
      $("#ask-done").hidden = false;
      $("#ask-close").focus();
    } catch {
      $("#ask-error").textContent = "Não deu para enviar. Confira a internet e tente de novo.";
      $("#ask-send").disabled = false;
      $("#ask-send").textContent = "Enviar";
    }
  }

  $("#ask").addEventListener("click", () => openAsk(null));
  $("#ask-form").addEventListener("submit", sendQuestion);
  $("#ask-cancel").addEventListener("click", () => $("#ask-dialog").close());
  $("#ask-close").addEventListener("click", () => $("#ask-dialog").close());
  // Tocar num termo abre a pergunta sobre ele.
  $("#main").addEventListener("click", event => {
    const button = event.target.closest("[data-ask-term]");
    if (button) openAsk(button.dataset.askTerm);
  });

  /* ---------- Termos ---------- */

  function termItem(term, {skipSlide = -1} = {}) {
    const item = document.createElement("li");
    item.className = "d-term";
    const title = document.createElement("h3");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "d-term-ask";
    button.dataset.askTerm = term;
    const label = document.createElement("span");
    label.textContent = term;
    const hint = document.createElement("span");
    hint.className = "d-term-hint";
    hint.textContent = "Perguntar";
    button.append(label, hint);
    title.append(button);
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
    $("#tab-slide").removeAttribute("aria-current");
    $("#tab-all").removeAttribute("aria-current");
    if (view === "slide") $("#tab-slide").setAttribute("aria-current", "page");
    if (view === "all") $("#tab-all").setAttribute("aria-current", "page");
  }

  function renderSlide(position) {
    current = Math.max(0, Math.min(SLIDES.length - 1, position));
    const slide = SLIDES[current];
    $("#slide-select").value = slide.id;
    $("#slide-heading").textContent = `Slide ${pad(current + 1)}: ${slide.title}`;
    $("#tab-slide").href = `#${slide.id}`;
    $("#prev").disabled = current <= withTerms[0];
    $("#next").disabled = current >= withTerms[withTerms.length - 1];
    const list = $("#slide-terms");
    if (slide.terms.length) {
      list.replaceChildren(...slide.terms.map(term => termItem(term, {skipSlide: current})));
    } else {
      const empty = document.createElement("li");
      empty.className = "d-empty";
      empty.textContent = "Este slide não tem termos técnicos.";
      list.replaceChildren(empty);
    }
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
    renderSlide(position < 0 ? current : position);
  }

  /* ---------- Modo ao vivo ---------- */

  function setLive(on) {
    live = on;
    $("#live").setAttribute("aria-pressed", String(on));
    $("#live-label").textContent = on ? "Ao vivo" : "Ir para o slide atual";
    if (on) poll();
  }

  // Leva ao slide atual da apresentação sem desligar o modo ao vivo.
  function follow() {
    const position = SLIDES.findIndex(slide => slide.id === liveSlide);
    if (position < 0) return;
    const onSlideView = !$("#view-slide").hidden;
    if (position === current && onSlideView && !$("#search").value) return;
    $("#search").value = "";
    if (location.hash === `#${SLIDES[position].id}`) {
      renderSlide(position);
    } else {
      programmatic = true;
      location.hash = SLIDES[position].id;
    }
  }

  let polling = false;
  async function poll() {
    if (!DB || polling || document.hidden) return;
    polling = true;
    try {
      const response = await fetch(`${DB}/ao-vivo.json`, {cache: "no-store"});
      const state = response.ok ? await response.json() : null;
      $("#live").classList.remove("offline");
      if (state && typeof state.slide === "string") {
        liveSlide = state.slide;
        if (live) follow();
      }
    } catch {
      $("#live").classList.add("offline");
    } finally {
      polling = false;
    }
  }

  // Navegar, buscar ou trocar de aba por conta própria desliga o modo ao vivo.
  const leaveLive = () => {
    if (live) setLive(false);
  };

  /* ---------- Navegação ---------- */

  const select = $("#slide-select");
  SLIDES.forEach((slide, position) => {
    const option = document.createElement("option");
    option.value = slide.id;
    option.textContent = `${pad(position + 1)} · ${slide.title}${slide.terms.length ? "" : " (sem termos)"}`;
    option.disabled = !slide.terms.length;
    select.append(option);
  });
  const go = position => {
    leaveLive();
    $("#search").value = "";
    location.hash = SLIDES[position].id;
  };
  select.addEventListener("change", () => go(SLIDES.findIndex(slide => slide.id === select.value)));
  $("#prev").addEventListener("click", () => {
    const target = [...withTerms].reverse().find(position => position < current);
    if (target !== undefined) go(target);
  });
  $("#next").addEventListener("click", () => {
    const target = withTerms.find(position => position > current);
    if (target !== undefined) go(target);
  });
  $("#search").addEventListener("input", event => {
    if (event.target.value.trim()) leaveLive();
    renderSearch(event.target.value);
  });
  $("#live").addEventListener("click", () => setLive(!live));
  window.addEventListener("hashchange", () => {
    if (!programmatic) leaveLive();
    programmatic = false;
    $("#search").value = "";
    route();
    window.scrollTo({top: 0, behavior: reducedMotion.matches ? "auto" : "smooth"});
  });
  document.querySelector(".skip-link").addEventListener("click", event => {
    event.preventDefault();
    $("#main").focus();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) poll();
  });

  route();
  if (!participantName) askName();
  if (DB) {
    poll();
    setInterval(poll, POLL_MS);
  } else {
    $("#live").hidden = true;
  }
})();
