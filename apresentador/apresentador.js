(() => {
  "use strict";

  // Controle da apresentação pelo celular: lê o slide atual (ao-vivo) e manda comandos (comando),
  // ambos no Firebase Realtime Database, por HTTP e streaming, sem biblioteca.
  const $ = selector => document.querySelector(selector);
  const DB = typeof WORKSHOP_LINKS === "object" ? WORKSHOP_LINKS.firebase : "";
  const pad = number => String(number).padStart(2, "0");
  const escapeHtml = text => String(text ?? "").replace(/[&<>"']/g, char =>
    ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[char]);
  const parser = new DOMParser();
  const revealTexts = SLIDES.map(slide => [...parser.parseFromString(slide.html.replace(/<br\s*\/?>/g, " ").replace(/></g, "> <"), "text/html")
    .querySelectorAll(".reveal")].map(element => element.textContent.replace(/\s+/g, " ").trim()));
  let state = null;

  /* ---------- Notas ---------- */

  // **termo** vira destaque; [indicação] vira marcação de palco; "[Sugestão]" no início marca fala que não é do roteiro.
  function renderNotes(text) {
    const suggestion = text.startsWith("[Sugestão]");
    const body = escapeHtml(suggestion ? text.replace(/^\[Sugestão\]\s*/, "") : text)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]/g, '<em class="a-cue">$1</em>');
    return (suggestion ? '<span class="a-suggestion">Sugestão, não está no roteiro</span>' : "") + body;
  }

  function show(next) {
    state = {...state, ...next};
    const position = typeof state.indice === "number" ? state.indice : SLIDES.findIndex(slide => slide.id === state.slide);
    const slide = SLIDES[position];
    if (!slide) return;
    const reveal = state.revelacao || 0;
    const reveals = state.revelacoes || 0;
    $("#counter").textContent = `${pad(position + 1)} / ${SLIDES.length}`;
    $("#chapter").textContent = slide.chapter;
    $("#title").textContent = slide.title;
    $("#step").textContent = reveals ? `Revelações: ${reveal} de ${reveals}` : "";
    const notes = $("#notes");
    if (notes.dataset.slide !== slide.id) {
      notes.innerHTML = renderNotes(slide.notes || "");
      notes.dataset.slide = slide.id;
      window.scrollTo({top: 0});
    }
    $("#check").textContent = slide.check || "";
    $("#check-box").hidden = !slide.check;
    const pending = revealTexts[position][reveal];
    const following = SLIDES[position + 1];
    $("#next-label").textContent = reveal < reveals && pending
      ? `Revelar: ${pending}`
      : following ? `${pad(position + 2)} · ${following.title}` : "Fim da apresentação";
    $("#jump").value = slide.id;
    $("#prev").disabled = position === 0 && reveal === 0;
    $("#forward").disabled = !following && reveal >= reveals;
    document.title = `${pad(position + 1)} · ${slide.title} · Apresentador`;
    document.querySelectorAll(".a-buttons button").forEach(button => button.classList.remove("sending"));
  }

  /* ---------- Conexão ---------- */

  function setStatus(text, ok) {
    $("#status").textContent = text;
    $("#status").classList.toggle("ok", ok);
  }

  // Streaming do slide atual: put "/" traz o estado inteiro; put/patch em campos atualizam parte dele.
  function listen() {
    if (!DB || typeof EventSource !== "function") return setStatus("Sem conexão configurada", false);
    const source = new EventSource(`${DB}/ao-vivo.json`);
    const handle = type => event => {
      let payload;
      try {
        payload = JSON.parse(event.data);
      } catch {
        return;
      }
      if (!payload || typeof payload.path !== "string") return;
      const field = payload.path.split("/").filter(Boolean)[0];
      if (!field) {
        if (payload.data) show(type === "put" ? {...payload.data, revelacao: payload.data.revelacao || 0, revelacoes: payload.data.revelacoes || 0} : payload.data);
      } else {
        show({[field]: payload.data});
      }
      setStatus("Ao vivo", true);
    };
    source.addEventListener("put", handle("put"));
    source.addEventListener("patch", handle("patch"));
    source.addEventListener("open", () => setStatus("Ao vivo", true));
    source.addEventListener("error", () => setStatus("Reconectando…", false));
  }

  const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

  // Cada comando tem um id novo: a projeção executa cada um uma vez só.
  async function send(acao, extra = {}, button = null) {
    if (!DB) return;
    button?.classList.add("sending");
    navigator.vibrate?.(12);
    try {
      const response = await fetch(`${DB}/comando.json`, {method: "PUT", body: JSON.stringify({acao, id: newId(), ...extra})});
      if (!response.ok) throw new Error(String(response.status));
    } catch {
      button?.classList.remove("sending");
      setStatus("Comando não enviado", false);
    }
  }

  /* ---------- Controles ---------- */

  const jump = $("#jump");
  SLIDES.forEach((slide, position) => {
    const option = document.createElement("option");
    option.value = slide.id;
    option.textContent = `${pad(position + 1)} · ${slide.title}`;
    jump.append(option);
  });
  jump.addEventListener("change", () => send("ir", {slide: jump.value}));
  $("#forward").addEventListener("click", event => send("avancar", {}, event.currentTarget));
  $("#prev").addEventListener("click", event => send("voltar", {}, event.currentTarget));
  document.addEventListener("keydown", event => {
    if (event.ctrlKey || event.altKey || event.metaKey || event.target.closest("select")) return;
    if ([" ", "Enter"].includes(event.key) && event.target.closest("button")) return;
    if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); send("avancar", {}, $("#forward")); }
    if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); send("voltar", {}, $("#prev")); }
  });

  // Cronômetro: começa ao abrir; dois toques seguidos zeram.
  let started = Date.now();
  let armed = 0;
  const tick = () => {
    const seconds = Math.floor((Date.now() - started) / 1000);
    $("#timer").textContent = `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
  };
  $("#timer").addEventListener("click", () => {
    if (Date.now() - armed < 2000) {
      started = Date.now();
      armed = 0;
      $("#timer").classList.remove("armed");
      tick();
    } else {
      armed = Date.now();
      $("#timer").classList.add("armed");
      setTimeout(() => $("#timer").classList.remove("armed"), 2000);
    }
  });
  setInterval(tick, 1000);

  // Mantém a tela do celular acesa enquanto a página estiver aberta.
  let wakeLock = null;
  async function keepAwake() {
    try {
      if (document.visibilityState === "visible" && "wakeLock" in navigator) wakeLock = await navigator.wakeLock.request("screen");
    } catch {
      wakeLock = null;
    }
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && !wakeLock) keepAwake();
  });
  keepAwake();
  listen();
})();
