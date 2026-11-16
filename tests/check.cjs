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
const context = vm.createContext({document, window, location, history,
  setInterval(callback, delay) { assert.equal(delay, 3000); timers.set(++timerId, callback); return timerId; },
  clearInterval(id) { timers.delete(id); },
  getComputedStyle() { return {paddingLeft: "24", paddingRight: "24", paddingTop: "24", paddingBottom: "24"}; },
  CustomEvent: class {constructor(type, options) {this.type = type; this.detail = options.detail;}}
});
vm.runInContext(fs.readFileSync(path.join(root, "slides.js"), "utf8"), context);
const slides = vm.runInContext("SLIDES", context);
assert.equal(slides.length, 35);
assert.equal(new Set(slides.map(slide => slide.id)).size, slides.length);
slides.forEach(slide => {
  assert.match(slide.id, /^[a-z0-9-]+$/);
  for (const key of ["title", "html", "notes"]) assert.ok(slide[key], `${slide.id}: ${key}`);
  // Toda etapa revelada de uma cena tem peças para montar, e vice-versa.
  const stages = [...slide.html.matchAll(/data-build="([^"]+)"/g)].map(match => match[1]);
  const parts = new Set([...slide.html.matchAll(/data-part="([^"]+)"/g)].map(match => match[1]));
  assert.deepEqual([...parts].sort(), [...new Set(stages)].sort(), `${slide.id}: etapas e peças`);
  assert.equal(typeof slide.chapter, "string");
  assert.ok(slide.terms.length);
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
assert.equal(getElement(".progress").getAttribute("aria-valuenow"), "35");
assert.equal(emitted.at(-1).detail.id, "encerramento");
assert.ok(emitted.at(-1).detail.terms.length);
navigate("skills"); assert.equal(getElement("#chapter").textContent, "");

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
for (const asset of ["styles.css", "slides.js", "app.js", "assets/open-sans-regular.ttf", "assets/open-sans-bold.ttf", "assets/OFL.txt"]) {
  assert.ok(fs.existsSync(path.join(root, asset)), asset);
}
assert.ok(animations.length > motionCount);
assert.ok(animations.slice(motionCount).every(animation => animation.frames.every(frame => !("translate" in frame))),
  "movimento reduzido mantém só opacidade");
console.log("OK: 35 slides; apresentador; navegação; revelações; timers de 3s; pausa; visibilidade; limpeza; geometria simulada; tema claro; eventos e assets.");
