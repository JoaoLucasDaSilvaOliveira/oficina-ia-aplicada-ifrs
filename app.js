(() => {
  "use strict";

  // A mesma página abre a janela do apresentador com ?presenter (inclusive no HTML único).
  if (/[?&]presenter(?:[=&]|$)/.test(location.search || "")) {
    runPresenter();
    return;
  }

  const slideElement = document.querySelector("#slide");
  const previous = document.querySelector("#previous");
  const next = document.querySelector("#next");
  const fullscreen = document.querySelector("#fullscreen");
  const autoplay = document.querySelector("#autoplay");
  const progress = document.querySelector(".progress");
  const DEMO_INTERVAL_MS = 3000;
  const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
  const ENTER_MS = 560;
  const STAGGER_MS = 70;
  const STAGGER_BUDGET_MS = 420;
  const REVEAL_MS = 420;
  const HIDE_MS = 160;
  const SWAP_MS = 260;
  const REDUCED_MS = 200;
  // Blocos cujos filhos entram um a um, em vez de entrar como uma peça só.
  const GROUPS = ".split, .rows, .flow, .stack, .list, .decision-prompts, .cover-bottom, .tool-names, .translation, .stairs, .facts";
  const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";
  // Etapas das cenas ilustradas (casa, prédio): cada peça declara data-anim e data-delay.
  const BUILDS = {
    draw: {frames: [{strokeDashoffset: 1, offset: 0}], duration: 1000, easing: EASE_IN_OUT},
    rise: {frames: [{transform: "scaleY(0)", offset: 0}], duration: 560, easing: EASE_OUT},
    // Sem opacidade nas peças 3D: opacity < 1 achataria o preserve-3d durante a animação.
    drop: {frames: [{transform: "translateY(-110px)", offset: 0}], duration: 720, easing: EASE_OUT},
    pop: {frames: [{transform: "scale(.4)"}, {transform: "scale(1.12)", offset: .65}, {transform: "scale(1)"}], duration: 480, easing: EASE_OUT},
    unfurl: {frames: [{transform: "scaleX(0)", offset: 0}], duration: 620, easing: EASE_OUT},
    fade: {frames: [{opacity: 0, offset: 0}], duration: 700, easing: "ease"}
  };
  const CHANNEL_NAME = "workshop-presenter";
  const demoModes = ["reference", "copy"];
  const requirementModes = Object.keys(REQUIREMENT_EXAMPLES);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let revealCount = 0;
  let demoStep = 0;
  let timer = null;
  let paused = false;
  let fitObserver = null;
  let settling = false;
  let motionToken = 0;
  let presenterWindow = null;
  let channel = null;
  try {
    channel = typeof BroadcastChannel === "function" ? new BroadcastChannel(CHANNEL_NAME) : null;
  } catch {
    channel = null;
  }

  function indexFromHash() {
    const found = SLIDES.findIndex(slide => slide.id === location.hash.slice(1));
    return found < 0 ? 0 : found;
  }

  function announce(message) {
    document.querySelector("#announcement").textContent = message;
  }

  function fitSlide() {
    // Os palcos 3D têm tamanho nominal; a escala acompanha a largura disponível.
    slideElement.querySelectorAll(".stage3d").forEach(stage => {
      stage.style.setProperty("--k", String(stage.clientWidth / Number(stage.dataset.width || stage.clientWidth || 1)));
    });
    const content = slideElement.querySelector(".slide-content");
    // Durante a entrada, o deslocamento das peças inflaria a medida do conteúdo.
    if (!content || settling) return;
    const style = getComputedStyle(slideElement);
    const width = slideElement.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const height = slideElement.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    const naturalWidth = Math.max(content.offsetWidth, content.scrollWidth);
    const naturalHeight = Math.max(content.offsetHeight, content.scrollHeight);
    if (width <= 0 || height <= 0 || naturalWidth <= 0 || naturalHeight <= 0) return;
    // A margem preserva contornos de foco e arredondamentos de subpixel.
    const scale = Math.min(1, (width - 12) / naturalWidth, (height - 12) / naturalHeight);
    content.style.transform = `scale(${Math.max(0, scale)})`;
  }

  function stopAutoplay() {
    if (timer !== null) clearInterval(timer);
    timer = null;
  }

  function isAutomaticSlide() {
    return ["go-tradeoff", "dor-requisito"].includes(SLIDES[index].id);
  }

  function updateAutoplay() {
    stopAutoplay();
    autoplay.hidden = !isAutomaticSlide();
    autoplay.setAttribute("aria-pressed", String(paused));
    const label = paused ? "Retomar demonstração" : "Pausar demonstração";
    autoplay.setAttribute("aria-label", label);
    autoplay.title = `${label} (P)`;
    document.querySelector("#autoplay-icon").setAttribute("d", paused ? "m8 5 11 7-11 7Z" : "M9 5v14M15 5v14");
    if (!isAutomaticSlide() || paused || document.hidden) return;
    timer = setInterval(() => {
      demoStep++;
      if (SLIDES[index].id === "go-tradeoff") {
        runPointerDemo(demoModes[demoStep % demoModes.length]);
        swapFeedback(".memory");
        swapFeedback("#demo-result");
      } else {
        selectRequirement(requirementModes[demoStep % requirementModes.length]);
        swapFeedback(".translation-output");
      }
      fitSlide();
    }, DEMO_INTERVAL_MS);
  }

  // Suspende o ajuste de escala até as entradas terminarem e mede de novo ao final.
  function settle(animations) {
    const finished = animations.map(animation => animation?.finished).filter(Boolean);
    if (!finished.length) {settling = false; return;}
    const token = ++motionToken;
    settling = true;
    Promise.allSettled(finished).then(() => {
      if (token !== motionToken) return;
      settling = false;
      fitSlide();
    });
  }

  // Um único quadro inicial: o destino é o estilo do próprio elemento.
  // translate é independente do transform usado para ajustar o slide à tela.
  // Movimento reduzido mantém só a opacidade, sem deslocamento nem escalonamento.
  function enter(element, from, delay = 0, duration = ENTER_MS) {
    if (!element?.animate) return null;
    element.getAnimations().forEach(animation => animation.cancel());
    if (reducedMotion.matches) {
      return element.animate([{opacity: 0, offset: 0}], {duration: REDUCED_MS, easing: "ease", fill: "backwards"});
    }
    return element.animate([{opacity: 0, translate: from, offset: 0}], {
      duration, delay, easing: EASE_OUT, fill: "backwards"
    });
  }

  function entrancePieces(content) {
    const pieces = [...content.children].flatMap(child =>
      child.matches(GROUPS) && !child.matches(".reveal") ? [...child.children] : [child]);
    const visible = pieces.filter(piece => !piece.matches(".reveal:not(.shown)"));
    return visible.length ? visible : [content];
  }

  // Avançar entra pela direita, voltar pela esquerda; saltos sobem no lugar.
  function animateSlide(direction) {
    const pieces = entrancePieces(slideElement.querySelector(".slide-content"));
    const from = direction > 0 ? "40px 0" : direction < 0 ? "-40px 0" : "0 24px";
    const step = Math.min(STAGGER_MS, STAGGER_BUDGET_MS / Math.max(1, pieces.length - 1));
    settle(pieces.map((piece, position) => enter(piece, from, position * step)));
  }

  // Mostra as peças das etapas já reveladas; sem animação (usado ao entrar e ao recolher).
  function syncBuild() {
    const stages = new Set([...slideElement.querySelectorAll(".reveal.shown[data-build]")].map(element => element.dataset.build));
    slideElement.querySelectorAll("[data-part]").forEach(part => part.classList.toggle("shown", stages.has(part.dataset.part)));
    // A câmera da cena acompanha a última etapa revelada (ver .stage3d[data-stage] no CSS).
    const order = [...slideElement.querySelectorAll(".reveal.shown[data-build]")].map(element => element.dataset.build);
    slideElement.querySelectorAll(".stage3d").forEach(stage => {
      stage.dataset.stage = order.filter(name => stage.querySelector(`[data-part="${name}"]`)).at(-1) || "";
    });
  }

  function build(stage) {
    slideElement.querySelectorAll(`[data-part="${stage}"]`).forEach((part, position) => {
      // Peças 3D animam o filho .anim; o pai guarda a posição no espaço.
      const target = part.querySelector(":scope > .anim") || part;
      if (!target.animate) return;
      target.getAnimations().forEach(animation => animation.cancel());
      if (reducedMotion.matches) {
        // Opacidade achataria as peças 3D: com movimento reduzido elas só aparecem.
        if (target === part) target.animate([{opacity: 0, offset: 0}], {duration: REDUCED_MS, easing: "ease", fill: "backwards"});
        return;
      }
      const {frames, duration, easing} = BUILDS[part.dataset.anim] || BUILDS.fade;
      const delay = Number(part.dataset.delay ?? position * 90);
      target.animate(frames, {duration, delay, easing, fill: "backwards"});
    });
  }

  function hideReveal(element) {
    if (!element.animate) return;
    element.getAnimations().forEach(animation => animation.cancel());
    // A classe já saiu: a animação segura a visibilidade enquanto apaga.
    element.animate([{opacity: 1, visibility: "visible"}, {opacity: 0, visibility: "visible"}], {
      duration: HIDE_MS, easing: "ease"
    });
  }

  // As trocas automáticas usam somente opacidade para manter a leitura estável.
  function swapFeedback(selector) {
    const target = slideElement.querySelector(selector);
    if (!target?.animate) return;
    target.getAnimations().forEach(animation => animation.cancel());
    target.animate([{opacity: 0, offset: 0}], {duration: SWAP_MS, easing: "ease"});
  }

  /* ---------- QR codes e links (dicionário, GitHub, LinkedIn) ---------- */

  const qrCache = new Map();
  // Gera o QR localmente (assets/qrcode.js), sem depender de internet.
  // level "L" deixa o QR pequeno do canto menos denso; os grandes usam "M".
  function qrSvg(text, level = "M") {
    if (typeof qrcode !== "function") return "";
    const key = `${level}:${text}`;
    if (!qrCache.has(key)) {
      const code = qrcode(0, level);
      code.addData(text);
      code.make();
      const size = code.getModuleCount();
      let path = "";
      for (let row = 0; row < size; row++) {
        for (let column = 0; column < size; column++) {
          if (code.isDark(row, column)) path += `M${column} ${row}h1v1h-1z`;
        }
      }
      qrCache.set(key, `<svg viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" aria-hidden="true"><path d="${path}"/></svg>`);
    }
    return qrCache.get(key);
  }

  const linkFor = key => (typeof WORKSHOP_LINKS === "object" ? WORKSHOP_LINKS[key] : undefined);

  function renderLinks() {
    slideElement.querySelectorAll("[data-qr]").forEach(element => {
      const url = linkFor(element.dataset.qr);
      if (url) element.innerHTML = qrSvg(url);
    });
    slideElement.querySelectorAll("[data-link]").forEach(element => {
      const url = linkFor(element.dataset.link);
      if (url) element.href = url;
    });
    slideElement.querySelectorAll("[data-link-text]").forEach(element => {
      const url = linkFor(element.dataset.linkText);
      if (url) element.textContent = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    });
    // QR do canto: abre o dicionário direto nos termos do slide atual.
    const corner = document.querySelector("#slide-qr");
    const base = linkFor("dicionario");
    const slide = SLIDES[index];
    corner.hidden = !base || slide.id === "dicionario" || typeof qrcode !== "function";
    if (!corner.hidden) {
      const url = `${base}#${slide.id}`;
      corner.href = url;
      corner.querySelector(".qr").innerHTML = qrSvg(url, "L");
    }
  }

  function updateNavigation() {
    const totalReveals = slideElement.querySelectorAll(".reveal").length;
    previous.disabled = index === 0 && revealCount === 0;
    next.disabled = index === SLIDES.length - 1 && revealCount === totalReveals;
    document.querySelector("#counter").textContent = `${String(index + 1).padStart(2, "0")} / ${SLIDES.length}`;
    next.setAttribute("aria-label", revealCount < totalReveals ? "Revelar próximo conteúdo" : "Próximo slide");
    progress.setAttribute("aria-valuemax", SLIDES.length);
    progress.setAttribute("aria-valuenow", index + 1);
    progress.querySelector("span").style.transform = `scaleX(${(index + 1) / SLIDES.length})`;
  }

  function render({revealAll = false, updateHash = true, direction = 0} = {}) {
    stopAutoplay();
    fitObserver?.disconnect();
    const slide = SLIDES[index];
    slideElement.className = `slide ${slide.className || ""}`;
    slideElement.innerHTML = `<div class="slide-content">${slide.html}</div>`;
    slideElement.dataset.slideId = slide.id;
    renderLinks();
    document.body.dataset.tone = slide.className === "statement" ? "green" : "white";
    slideElement.setAttribute("aria-label", `Slide ${index + 1} de ${SLIDES.length}: ${slide.title}`);
    slideElement.querySelectorAll(".reveal").forEach(element => {
      element.classList.toggle("shown", revealAll);
      element.setAttribute("aria-hidden", String(!revealAll));
    });
    revealCount = revealAll ? slideElement.querySelectorAll(".reveal").length : 0;
    document.querySelector("#chapter").textContent = slide.chapter;
    document.title = `${slide.title} · Além do Vibecoding`;
    if (updateHash && location.hash !== `#${slide.id}`) history.pushState(null, "", `#${slide.id}`);
    window.dispatchEvent(new CustomEvent("workshop:slidechange", {
      detail: {id: slide.id, index, title: slide.title, terms: [...slide.terms]}
    }));
    demoStep = 0;
    paused = false;
    if (slide.id === "go-tradeoff") runPointerDemo("reference");
    if (slide.id === "dor-requisito") selectRequirement("tracking");
    syncBuild();
    updateNavigation();
    updateAutoplay();
    settling = false;
    fitSlide();
    animateSlide(direction);
    if (typeof ResizeObserver !== "undefined") {
      fitObserver = new ResizeObserver(fitSlide);
      fitObserver.observe(slideElement);
      fitObserver.observe(slideElement.querySelector(".slide-content"));
    }
    announce(`Slide ${index + 1}: ${slide.title}`);
    publishState();
  }

  function advance() {
    const reveals = slideElement.querySelectorAll(".reveal");
    if (revealCount < reveals.length) {
      const element = reveals[revealCount++];
      element.classList.add("shown");
      element.setAttribute("aria-hidden", "false");
      syncBuild();
      // Uma cena ilustrada se monta pelas próprias peças; o texto sobe como as outras revelações.
      if (!element.querySelector?.(".stage3d")) settle([enter(element, "0 20px", 0, REVEAL_MS)]);
      if (element.dataset.build) build(element.dataset.build);
      updateNavigation();
      announce(element.textContent);
      publishState();
    } else if (index < SLIDES.length - 1) {
      index++;
      render({direction: 1});
    }
  }

  function goBack() {
    if (revealCount > 0) {
      const element = slideElement.querySelectorAll(".reveal")[--revealCount];
      element.classList.remove("shown");
      element.setAttribute("aria-hidden", "true");
      hideReveal(element);
      syncBuild();
      updateNavigation();
      announce("Último conteúdo recolhido.");
      publishState();
    } else if (index > 0) {
      index--;
      render({revealAll: true, direction: -1});
    }
  }

  function publishState() {
    const message = {workshop: true, type: "state", index, reveal: revealCount, reveals: slideElement.querySelectorAll(".reveal").length};
    try {
      if (presenterWindow && !presenterWindow.closed) presenterWindow.postMessage(message, "*");
    } catch {
      presenterWindow = null;
    }
    channel?.postMessage(message);
  }

  // Comandos da janela do apresentador: só navegação, nada além disso é aceito.
  function handlePresenter(data, source) {
    if (!data || data.workshop !== true) return;
    if (source && typeof source.postMessage === "function" && source !== window) presenterWindow = source;
    if (data.type === "hello") publishState();
    else if (data.type === "next") advance();
    else if (data.type === "prev") goBack();
  }

  function openPresenter() {
    const url = `${location.href.split("#")[0].split("?")[0]}?presenter`;
    presenterWindow = window.open(url, CHANNEL_NAME, "popup,width=1180,height=760");
    if (!presenterWindow) announce("O navegador bloqueou a janela do apresentador. Permita pop-ups para esta página.");
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else announce("Use a opção de tela cheia do seu navegador.");
    } catch {
      announce("O navegador não permitiu a tela cheia. Use a opção de tela cheia do navegador.");
    }
  }

  function runPointerDemo(mode) {
    const empresa = {cnpj: {valor: "Original"}};
    const entregue = mode === "reference" ? empresa.cnpj : {...empresa.cnpj};
    entregue.valor = "Alterado";
    const changed = empresa.cnpj.valor === "Alterado";
    document.querySelector("#original-value").textContent = empresa.cnpj.valor;
    document.querySelector("#consumer-value").textContent = entregue.valor;
    document.querySelector("#original-memory").dataset.changed = String(changed);
    slideElement.querySelectorAll("[data-demo]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.demo === mode));
    });
    document.querySelector("#demo-result").textContent = changed
      ? "A referência compartilha o estado: a empresa também foi alterada."
      : "A cópia deste valor isola a alteração: a empresa preserva o original.";
  }

  function selectRequirement(mode) {
    const example = REQUIREMENT_EXAMPLES[mode];
    if (!example) return;
    slideElement.querySelectorAll("[data-requirement]").forEach(choice => {
      choice.setAttribute("aria-pressed", String(choice.dataset.requirement === mode));
    });
    document.querySelector("#requirement-text").textContent = example.text;
    document.querySelector("#requirement-acceptance").textContent = example.acceptance;
  }

  function toggleAutoplay() {
    if (!isAutomaticSlide()) return;
    paused = !paused;
    updateAutoplay();
    announce(paused ? "Demonstração pausada." : "Demonstração retomada.");
  }

  previous.addEventListener("click", goBack);
  next.addEventListener("click", advance);
  fullscreen.addEventListener("click", toggleFullscreen);
  autoplay.addEventListener("click", toggleAutoplay);
  document.querySelector(".skip-link").addEventListener("click", event => {
    event.preventDefault();
    slideElement.focus({preventScroll: true});
  });
  document.addEventListener("fullscreenchange", () => {
    fullscreen.setAttribute("aria-label", document.fullscreenElement ? "Sair da tela cheia" : "Entrar em tela cheia");
    fitSlide();
  });
  document.addEventListener("visibilitychange", updateAutoplay);
  window.addEventListener("pagehide", stopAutoplay);
  window.addEventListener("pageshow", updateAutoplay);
  slideElement.addEventListener("click", event => {
    const demo = event.target.closest("[data-demo]");
    const requirement = event.target.closest("[data-requirement]");
    if (demo) {
      runPointerDemo(demo.dataset.demo);
      demoStep = demoModes.indexOf(demo.dataset.demo);
      announce(document.querySelector("#demo-result").textContent);
    }
    if (requirement) {
      selectRequirement(requirement.dataset.requirement);
      demoStep = requirementModes.indexOf(requirement.dataset.requirement);
      announce(document.querySelector("#requirement-text").textContent);
    }
    if (demo || requirement) {fitSlide(); updateAutoplay();}
  });
  document.addEventListener("keydown", event => {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.target.closest("input, textarea, select, [contenteditable='true']")) return;
    if ([" ", "Enter"].includes(event.key) && event.target.closest("button, a")) return;
    switch (event.key) {
      case "ArrowRight": case "PageDown": case " ":
        event.preventDefault(); advance(); break;
      case "ArrowLeft": case "PageUp": case "Backspace":
        event.preventDefault(); goBack(); break;
      case "Home": event.preventDefault(); index = 0; render(); break;
      case "End": event.preventDefault(); index = SLIDES.length - 1; render(); break;
      case "f": case "F": event.preventDefault(); toggleFullscreen(); break;
      case "p": case "P": event.preventDefault(); toggleAutoplay(); break;
      case "n": case "N": event.preventDefault(); openPresenter(); break;
    }
  });
  window.addEventListener("message", event => handlePresenter(event.data, event.source));
  channel?.addEventListener("message", event => handlePresenter(event.data, null));
  window.addEventListener("resize", fitSlide);
  window.visualViewport?.addEventListener("resize", fitSlide);
  document.fonts?.ready.then(fitSlide);
  window.addEventListener("hashchange", () => {index = indexFromHash(); render({updateHash: false});});
  index = indexFromHash();
  render({updateHash: false});

  /* ---------- Janela do apresentador ---------- */

  function runPresenter() {
    // Roda antes das constantes da apresentação: não use nada declarado acima.
    document.title = "Apresentador · Além do Vibecoding";
    document.documentElement.classList.add("presenter-view");
    document.body.innerHTML = `
      <header class="pv-head">
        <span id="pv-counter">--</span>
        <span id="pv-chapter"></span>
        <button id="pv-timer" class="pv-timer" title="Zerar cronômetro (T)" aria-label="Cronômetro. Clique para zerar.">00:00</button>
      </header>
      <main class="pv-main">
        <section class="pv-notes" aria-live="polite">
          <h1 id="pv-title">Aguardando a apresentação…</h1>
          <p id="pv-step" class="pv-step"></p>
          <div id="pv-speech" class="pv-speech"></div>
          <p id="pv-check" class="pv-check"></p>
        </section>
        <aside class="pv-side">
          <span class="pv-label">A seguir</span>
          <p id="pv-next" class="pv-next"></p>
          <p id="pv-status" class="pv-status" role="status"></p>
          <nav class="pv-nav" aria-label="Controlar a apresentação">
            <button id="pv-prev" title="Voltar (←)">Voltar</button>
            <button id="pv-forward" title="Avançar (→ ou Espaço)">Avançar</button>
          </nav>
        </aside>
      </main>`;
    const $ = selector => document.querySelector(selector);
    let presenterChannel = null;
    try {
      presenterChannel = typeof BroadcastChannel === "function" ? new BroadcastChannel("workshop-presenter") : null;
    } catch {
      presenterChannel = null;
    }
    const send = type => {
      const message = {workshop: true, type};
      if (window.opener && !window.opener.closed) window.opener.postMessage(message, "*");
      else presenterChannel?.postMessage(message);
    };
    const parser = new DOMParser();
    const revealTexts = SLIDES.map(slide => [...parser.parseFromString(slide.html.replace(/<br\s*\/?>/g, " "), "text/html").querySelectorAll(".reveal")]
      .map(element => element.textContent.replace(/\s+/g, " ").trim()));
    let synced = false;

    // Indicações entre colchetes aparecem como marcações de palco.
    function speech(text) {
      const target = $("#pv-speech");
      target.replaceChildren();
      text.split(/(\[[^\]]+\])/).filter(Boolean).forEach(part => {
        const cue = part.startsWith("[");
        const node = document.createElement(cue ? "em" : "span");
        if (cue) node.className = "pv-cue";
        node.textContent = cue ? part.slice(1, -1) : part;
        target.append(node);
      });
    }

    function show(state) {
      const slide = SLIDES[state.index];
      if (!slide) return;
      synced = true;
      $("#pv-status").textContent = "";
      $("#pv-counter").textContent = `${String(state.index + 1).padStart(2, "0")} / ${SLIDES.length}`;
      $("#pv-chapter").textContent = slide.chapter;
      $("#pv-title").textContent = slide.title;
      $("#pv-step").textContent = state.reveals ? `Revelações: ${state.reveal} de ${state.reveals}` : "";
      speech(slide.notes || "");
      $("#pv-check").textContent = slide.check ? `Atenção: ${slide.check}` : "";
      $("#pv-check").hidden = !slide.check;
      const pending = revealTexts[state.index][state.reveal];
      const following = SLIDES[state.index + 1];
      $("#pv-next").textContent = state.reveal < state.reveals && pending
        ? `Revelar: ${pending}`
        : following ? `Slide ${state.index + 2}: ${following.title}` : "Fim da apresentação.";
      $("#pv-prev").disabled = state.index === 0 && state.reveal === 0;
      $("#pv-forward").disabled = !following && state.reveal >= state.reveals;
    }

    const receive = data => {
      if (data?.workshop === true && data.type === "state") show(data);
    };
    window.addEventListener("message", event => receive(event.data));
    presenterChannel?.addEventListener("message", event => receive(event.data));

    let started = Date.now();
    const tick = () => {
      const seconds = Math.floor((Date.now() - started) / 1000);
      $("#pv-timer").textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    };
    const resetTimer = () => {started = Date.now(); tick();};
    setInterval(tick, 1000);
    $("#pv-timer").addEventListener("click", resetTimer);
    $("#pv-prev").addEventListener("click", () => send("prev"));
    $("#pv-forward").addEventListener("click", () => send("next"));
    document.addEventListener("keydown", event => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      if ([" ", "Enter"].includes(event.key) && event.target.closest("button")) return;
      if (["ArrowRight", "PageDown", " "].includes(event.key)) {event.preventDefault(); send("next");}
      if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {event.preventDefault(); send("prev");}
      if (event.key === "t" || event.key === "T") resetTimer();
    });
    send("hello");
    setTimeout(() => {
      if (!synced) $("#pv-status").textContent = "Sem conexão com a apresentação. Abra esta janela pela apresentação, com a tecla N.";
    }, 1500);
  }
})();
