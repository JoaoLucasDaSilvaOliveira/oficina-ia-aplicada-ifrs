const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");

// DOM e relógio simulados: testa os eventos reais sem abrir um navegador.
class Element {
  constructor() {
    this.listeners = {}; this.attributes = {}; this.dataset = {}; this.style = {};
    this.clientWidth = 1200; this.clientHeight = 700;
    this.offsetWidth = this.scrollWidth = 1000;
    this.offsetHeight = this.scrollHeight = 600;
  }
  set innerHTML(value) {
    this.html = value;
    this.reveals = Array.from(value.matchAll(/class="[^"]*\breveal\b[^\"]*"/g), () => new Element());
  }
  get innerHTML() { return this.html; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name]; }
  addEventListener(name, handler) { this.listeners[name] = handler; }
  querySelectorAll(selector) {
    if (selector === ".reveal") return this.reveals || [];
    if (selector === "[data-requirement]") return choices;
    if (selector === "[data-demo]") return demoButtons;
    return [];
  }
  querySelector() { return this.child ||= new Element(); }
  get children() { return []; }
  matches() { return false; }
  closest() { return null; }
  focus() {}
  getAnimations() { return []; }
  animate(frames, options) { animations.push({frames, options}); }
  classList = {add() {}, remove() {}, toggle() {}};
}
const elements = new Map();
const animations = [];
const getElement = selector => {
  if (!elements.has(selector)) elements.set(selector, new Element());
  return elements.get(selector);
};
const document = new Element();
document.querySelector = getElement;
document.body = new Element();
document.documentElement = new Element();
const emitted = [];
const window = new Element();
window.dispatchEvent = event => emitted.push(event);
const motionPreference = {matches: false};
window.matchMedia = () => motionPreference;
const location = {hash: "#inexistente"};
const history = {pushState: (_, __, hash) => {location.hash = hash;}};
const timers = new Map();
let timerId = 0;
const choices = ["tracking", "history", "routing"].map(mode => {
  const button = new Element(); button.dataset.requirement = mode; return button;
});
const demoButtons = ["reference", "copy"].map(mode => {
  const button = new Element(); button.dataset.demo = mode; return button;
});
// Firebase simulado: registra as gravações (fetch) e permite emitir eventos do streaming.
const requests = [];
const streams = [];
class FakeEventSource {
  constructor(url) { this.url = url; this.listeners = {}; streams.push(this); }
  addEventListener(name, handler) { this.listeners[name] = handler; }
  emit(name, payload) { this.listeners[name]({data: JSON.stringify(payload)}); }
}
const context = vm.createContext({document, window, location, history, EventSource: FakeEventSource,
  fetch(url, options = {}) { requests.push({url, method: options.method || "GET", body: options.body && JSON.parse(options.body)}); return Promise.resolve({ok: true, json: () => Promise.resolve(null)}); },
  setInterval(callback, delay) { assert.equal(delay, 3000); timers.set(++timerId, callback); return timerId; },
  clearInterval(id) { timers.delete(id); },
  getComputedStyle() { return {paddingLeft: "24", paddingRight: "24", paddingTop: "24", paddingBottom: "24"}; },
  CustomEvent: class {constructor(type, options) {this.type = type; this.detail = options.detail;}}
});
vm.runInContext(fs.readFileSync(path.join(root, "slides.js"), "utf8"), context);
const slides = vm.runInContext("SLIDES", context);
assert.equal(slides.length, 36);
// Dicionário do público: todo termo de slide tem definição, e os termos marcados no roteiro estão presentes.
vm.runInContext(fs.readFileSync(path.join(root, "glossario.js"), "utf8") + ";this.G = GLOSSARY;", context);
const glossary = context.G;
slides.forEach(slide => slide.terms.forEach(term => assert.ok(glossary[term], `${slide.id}: termo sem definição: ${term}`)));
for (const term of Object.keys(glossary)) assert.ok(slides.some(slide => slide.terms.includes(term)), `definição sem slide: ${term}`);
for (const term of ["QR code", "Pensamento crítico", "LinkedIn"]) assert.ok(!glossary[term], `termo não técnico no dicionário: ${term}`);
for (const term of ["Desenvolvimento backend", "Ferramentas agênticas", "Atrofia cognitiva", "Vibe coding", "IA generativa", "Linguagem natural", "Bare metal", "Andrej Karpathy", "OpenAI", "Lovable", "Low-code e no-code", "Product Owner", "Product Manager", "Tech Lead", "Desenvolvedor sênior", "Desenvolvedor júnior", "Spec-Driven Development", "AGENTS.md", "Requisito funcional", "Requisito não funcional", "Diagrama de classes", "Diagrama de casos de uso", "História de usuário", "CRUD", "Trade-off", "Skill", "Matt Pocock", "grill-me", "grilling", "grill-with-docs", "Anthropic", "Contexto", "Google Apps Script", "Caso de borda", "Spring Boot", "Flutter", "Docker", "Git", "GitHub Issues e Projects"]) {
  assert.ok(glossary[term], `termo do roteiro sem definição: ${term}`);
  assert.ok(slides.some(slide => slide.terms.includes(term)), `termo do roteiro fora dos slides: ${term}`);
}
const links = vm.runInContext("WORKSHOP_LINKS", context);
for (const key of ["dicionario", "github", "linkedin"]) assert.match(links[key], /^https:\/\//);
assert.equal(new Set(slides.map(slide => slide.id)).size, slides.length);
slides.forEach(slide => {
  assert.match(slide.id, /^[a-z0-9-]+$/);
  for (const key of ["title", "html", "notes"]) assert.ok(slide[key], `${slide.id}: ${key}`);
  // Toda etapa revelada de uma cena tem peças para montar, e vice-versa.
  const stages = [...slide.html.matchAll(/data-build="([^"]+)"/g)].map(match => match[1]);
  const parts = new Set([...slide.html.matchAll(/data-part="([^"]+)"/g)].map(match => match[1]));
  assert.deepEqual([...parts].sort(), [...new Set(stages)].sort(), `${slide.id}: etapas e peças`);
  assert.equal(typeof slide.chapter, "string");
  assert.ok(Array.isArray(slide.terms));
});
vm.runInContext(fs.readFileSync(path.join(root, "app.js"), "utf8"), context);
const main = getElement("#slide");
const forward = () => getElement("#next").listeners.click();
const back = () => getElement("#previous").listeners.click();
const navigate = id => {location.hash = `#${id}`; window.listeners.hashchange();};
const key = (name, target = main) => {
  let prevented = false;
  document.listeners.keydown({key: name, target, preventDefault() {prevented = true;}});
  return prevented;
};
const tick = () => [...timers.values()].forEach(callback => callback());
assert.equal(main.dataset.slideId, "abertura");
assert.ok(animations.some(animation => animation.options.duration === 560 && "translate" in animation.frames[0]));
assert.equal(getElement("#previous").disabled, true);
forward(); assert.equal(main.dataset.slideId, "apresentacao");
back(); assert.equal(main.dataset.slideId, "abertura");
navigate("pensamento-critico");
forward(); assert.equal(main.dataset.slideId, "pensamento-critico");
assert.equal(main.reveals[0].getAttribute("aria-hidden"), "false");
back(); assert.equal(main.reveals[0].getAttribute("aria-hidden"), "true");
forward(); forward(); assert.equal(main.dataset.slideId, "terceirizar");
back(); assert.equal(main.reveals[0].getAttribute("aria-hidden"), "false");

navigate("go-tradeoff"); assert.equal(timers.size, 1);
assert.equal(getElement("#autoplay").hidden, false);
assert.equal(getElement("#original-value").textContent, "Alterado");
assert.equal(demoButtons[0].getAttribute("aria-pressed"), "true");
tick(); assert.equal(getElement("#original-value").textContent, "Original");
assert.equal(demoButtons[1].getAttribute("aria-pressed"), "true");
tick(); assert.equal(getElement("#original-value").textContent, "Alterado");
key("p"); assert.equal(timers.size, 0);
assert.equal(getElement("#autoplay").getAttribute("aria-pressed"), "true");
key("p"); assert.equal(timers.size, 1);
document.hidden = true; document.listeners.visibilitychange(); assert.equal(timers.size, 0);
document.hidden = false; document.listeners.visibilitychange(); assert.equal(timers.size, 1);
window.listeners.pagehide(); assert.equal(timers.size, 0);
window.listeners.pageshow(); assert.equal(timers.size, 1);

navigate("dor-requisito"); assert.equal(timers.size, 1);
assert.match(getElement("#requirement-text").textContent, /acompanhar/);
tick(); assert.match(getElement("#requirement-text").textContent, /histórico/);
assert.equal(choices[1].getAttribute("aria-pressed"), "true");
tick(); assert.match(getElement("#requirement-text").textContent, /corrigir/);
tick(); assert.match(getElement("#requirement-text").textContent, /acompanhar/);
motionPreference.matches = true;
const motionCount = animations.length;
tick(); assert.match(getElement("#requirement-text").textContent, /histórico/);
// A escolha manual permanece funcional e reinicia o ciclo a partir dela.
main.listeners.click({target: {closest: selector => selector === "[data-requirement]" ? choices[2] : null}});
assert.match(getElement("#requirement-text").textContent, /corrigir/);
tick(); assert.match(getElement("#requirement-text").textContent, /acompanhar/);
assert.equal(timers.size, 1);
navigate("abertura"); assert.equal(timers.size, 0);
assert.equal(getElement("#autoplay").hidden, true);
assert.equal(key(" ", {closest: selector => selector === "button, a" ? {} : null}), false);
key("End"); assert.equal(main.dataset.slideId, "encerramento");
forward(); assert.equal(main.dataset.slideId, "encerramento");
assert.equal(document.body.dataset.tone, "green");
key("Home"); assert.equal(main.dataset.slideId, "abertura");
assert.equal(document.body.dataset.tone, "white");
for (let step = 0; step < 60; step++) forward();
assert.equal(main.dataset.slideId, "encerramento");
assert.equal(getElement("#next").disabled, true);
assert.equal(getElement(".progress").getAttribute("aria-valuenow"), "36");
assert.equal(emitted.at(-1).detail.id, "encerramento");
assert.ok(Array.isArray(emitted.at(-1).detail.terms));

// Modo ao vivo: cada troca de slide grava o slide atual no banco, em ordem.
navigate("skills");
setImmediate(() => {
  const live = requests.filter(request => request.url.endsWith("/ao-vivo.json"));
  assert.ok(live.length > 10, "a apresentação publica o slide atual");
  // A última gravação corresponde ao slide que ficou na tela no fim do teste.
  const id = main.dataset.slideId;
  assert.deepEqual(live.at(-1), {url: "https://oficina-ia-aplicada-default-rtdb.firebaseio.com/ao-vivo.json", method: "PUT", body: {slide: id, indice: slides.findIndex(slide => slide.id === id)}});
  console.log("OK: ao vivo publica o slide atual em ordem.");
});

// Perguntas: o streaming carrega as existentes sem card, e o contador mostra as não lidas.
assert.equal(streams.length, 1);
assert.match(streams[0].url, /\/perguntas\.json$/);
const badge = getElement("#questions-badge");
streams[0].emit("put", {path: "/", data: {
  a1: {nome: "Ana", texto: "O que é SDD?", termo: "Spec-Driven Development", criadaEm: 1, lida: true},
  b2: {nome: "Bruno", texto: "<img src=x onerror=alert(1)>", criadaEm: 2, lida: false}
}});
assert.equal(badge.textContent, "1"); assert.equal(badge.hidden, false);
streams[0].emit("put", {path: "/c3", data: {nome: "Caio", texto: "E o Docker?", criadaEm: 3, lida: false}});
assert.equal(badge.textContent, "2");
streams[0].emit("patch", {path: "/b2", data: {lida: true}});
assert.equal(badge.textContent, "1");
streams[0].emit("put", {path: "/c3/lida", data: true});
assert.equal(badge.textContent, "0"); assert.equal(badge.hidden, true);
// A lista sai em ordem de chegada e com o texto do público escapado.
getElement("#questions").listeners.click();
const listHtml = getElement("#questions-list").innerHTML;
assert.ok(listHtml.indexOf("Ana") < listHtml.indexOf("Bruno") && listHtml.indexOf("Bruno") < listHtml.indexOf("Caio"));
assert.ok(!listHtml.includes("<img"), "texto do público é escapado");
// Abrir uma pergunta não lida a marca como lida no banco.
streams[0].emit("put", {path: "/d4", data: {nome: "Dani", texto: "Pergunta nova", criadaEm: 4, lida: false}});
assert.equal(badge.textContent, "1");
getElement("#questions-list").listeners.click({target: {closest: () => ({dataset: {question: "d4"}})}});
assert.equal(badge.textContent, "0");
assert.deepEqual(requests.at(-1), {url: "https://oficina-ia-aplicada-default-rtdb.firebaseio.com/perguntas/d4.json", method: "PATCH", body: {lida: true}});
streams[0].emit("put", {path: "/d4", data: null});

// Janela do apresentador: pede o estado, navega e recebe o estado de volta.
const posted = [];
const presenter = {postMessage(message) {posted.push(message);}};
navigate("abertura");
window.listeners.message({data: {workshop: true, type: "hello"}, source: presenter});
assert.equal(posted.at(-1).type, "state"); assert.equal(posted.at(-1).index, 0);
window.listeners.message({data: {workshop: true, type: "next"}, source: presenter});
assert.equal(main.dataset.slideId, "apresentacao"); assert.equal(posted.at(-1).index, 1);
window.listeners.message({data: {type: "next"}, source: presenter});
assert.equal(main.dataset.slideId, "apresentacao", "mensagens sem a marca são ignoradas");
window.listeners.message({data: {workshop: true, type: "prev"}, source: presenter});
assert.equal(main.dataset.slideId, "abertura");

// Geometria simulada: escala uniforme preserva o conteúdo nas duas dimensões.
const content = main.querySelector(".slide-content");
for (const [width, height] of [[320,450],[390,700],[844,270],[1024,600],[1280,580],[1920,900]]) {
  for (const [naturalWidth, naturalHeight] of [[300,400],[1000,900],[1800,1600]]) {
    main.clientWidth = width; main.clientHeight = height;
    content.offsetWidth = content.scrollWidth = naturalWidth;
    content.offsetHeight = content.scrollHeight = naturalHeight;
    window.listeners.resize();
    const scale = Number(content.style.transform.match(/scale\((.*?)\)/)[1]);
    assert.ok(scale <= 1 && scale > 0);
    assert.ok(naturalWidth * scale <= width - 60 + 0.001);
    assert.ok(naturalHeight * scale <= height - 60 + 0.001);
  }
}
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert.doesNotMatch(html, /id="(?:help|notes|step-hint|dialog)"/);
assert.match(html, /name="color-scheme" content="only light"/);
assert.ok(!slides.some(slide => slide.chapter === "Instruções reutilizáveis"));
for (const asset of ["styles.css", "slides.js", "app.js", "glossario.js", "assets/qrcode.js", "assets/joao-lucas.jpg", "dicionario/index.html", "dicionario/dicionario.js", "dicionario/dicionario.css", "assets/open-sans-regular.ttf", "assets/open-sans-bold.ttf", "assets/OFL.txt"]) {
  assert.ok(fs.existsSync(path.join(root, asset)), asset);
}
assert.ok(animations.length > motionCount);
assert.ok(animations.slice(motionCount).every(animation => animation.frames.every(frame => !("translate" in frame))),
  "movimento reduzido mantém só opacidade");
// As páginas carregam CSS e JS com ?v=<hash> atual (rode scripts/versionar.py antes de publicar).
const crypto = require("node:crypto");
for (const page of ["index.html", "dicionario/index.html"]) {
  const text = fs.readFileSync(path.join(root, page), "utf8");
  for (const [, ref, stamp] of text.matchAll(/(?:src|href)="([^"?#:]+\.(?:css|js))(?:\?v=([0-9a-f]+))?"/g)) {
    const file = path.join(root, path.dirname(page), ref);
    const expected = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 10);
    assert.equal(stamp, expected, `${page}: ${ref} com versão desatualizada; rode python3 scripts/versionar.py`);
  }
}
console.log("OK: 36 slides; dicionário; ao vivo; perguntas; apresentador; navegação; revelações; timers de 3s; pausa; visibilidade; limpeza; geometria simulada; tema claro; eventos e assets.");
