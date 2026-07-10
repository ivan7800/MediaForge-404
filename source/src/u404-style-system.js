/* Universo 404 — Style System JS v2.0 */
(function(){
  "use strict";
  const KEY = "u404.style.v2";
  const SKINS = [
    ["midnight","Midnight",["#050A12","#2EE6D6","#5AA7FF"]],
    ["oled","OLED",["#000000","#00FFD5","#4F8CFF"]],
    ["broadcast","Broadcast",["#080D18","#FF315F","#00E5FF"]],
    ["retro","Retro TV",["#171109","#FFB347","#70D67F"]],
    ["violet","Violet",["#0D0718","#C089FF","#62E6FF"]],
    ["redalert","Red Alert",["#140609","#FF5B6E","#FFB05B"]],
    ["santuario","Santuario",["#0F141F","#D8A85F","#8FA68E"]],
    ["bosque","Bosque",["#0E1512","#A4C89A","#D8C08A"]],
    ["oceano","Océano",["#0A131C","#8FC3D9","#C9B98A"]],
    ["luna","Luna",["#111318","#C7CCDE","#9BA6C4"]],
    ["aurora","Aurora",["#0D1220","#8FD9C0","#B79BE0"]],
    ["niebla","Niebla",["#171A1D","#B9C4CC","#8FA0A8"]],
    ["piedra","Piedra",["#15130F","#C7B79A","#8FA68E"]],
    ["ambar","Ámbar",["#171009","#E4B36A","#C88A5A"]],
    ["obsidiana","Obsidiana",["#0A0B0E","#A8B0CE","#7C849E"]],
    ["oro","Oro",["#131108","#E8CB78","#B9A25E"]],
    ["neoncyan","Neon Cyan",["#02070B","#00F5FF","#168BFF"]],
    ["cyberpurple","Cyber Purple",["#090313","#E05CFF","#6D5CFF"]],
    ["matrix","Matrix",["#020703","#48FF72","#15A43B"]],
    ["titanium","Titanium",["#101318","#D7DEE9","#738197"]],
    ["sunset","Sunset",["#18080D","#FF775E","#FFBE68"]],
    ["arctic","Arctic",["#08131B","#A8ECFF","#78A8FF"]],
    ["nocturne","Nocturne 404",["#07050D","#AE79FF","#E5C878"]],
    ["plasma","Plasma TV",["#0C0808","#FF4C4C","#56B8FF"]]
  ];
  const VALID = SKINS.map(s => s[0]);
  const DEFAULTS = {skin:"midnight", motion:"auto", contrast:"normal", fontScale:1, customTheme:null};
  let state = load();

  function load(){
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch(e){ return Object.assign({}, DEFAULTS); }
  }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} }
  function getSkinData(id){ return SKINS.find(s => s[0] === id) || SKINS[0]; }
  function apply(){
    if (!VALID.includes(state.skin)) state.skin = DEFAULTS.skin;
    if (!["auto","off"].includes(state.motion)) state.motion = DEFAULTS.motion;
    if (!["normal","high"].includes(state.contrast)) state.contrast = DEFAULTS.contrast;
    const fs = Number(state.fontScale);
    state.fontScale = Number.isFinite(fs) ? Math.min(1.4, Math.max(.85, fs)) : 1;
    document.documentElement.dataset.u404Skin = state.skin;
    document.documentElement.dataset.u404Motion = state.motion;
    document.documentElement.dataset.u404Contrast = state.contrast;
    document.documentElement.style.setProperty("--u404-fs", state.fontScale + "rem");
    applyCustomTheme();
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getSkinData(state.skin)[2][0];
    document.querySelectorAll("[data-u404-current-skin]").forEach(el => el.textContent = getSkinData(state.skin)[1]);
    document.querySelectorAll("[data-u404-set-skin]").forEach(el => {
      el.setAttribute("aria-pressed", String(el.getAttribute("data-u404-set-skin") === state.skin));
    });
  }

  function sanitizeColor(value, fallback){
    const v=String(value||"").trim();
    return /^#[0-9a-f]{6}$/i.test(v) ? v : fallback;
  }
  function applyCustomTheme(){
    const t=state.customTheme;
    const root=document.documentElement;
    const vars=["--u404-bg0","--u404-bg1","--u404-accent","--u404-accent2","--u404-ink","--u404-muted"];
    vars.forEach(v=>root.style.removeProperty(v));
    if(!t) return;
    root.style.setProperty("--u404-bg0",sanitizeColor(t.background,"#050A12"));
    root.style.setProperty("--u404-bg1",sanitizeColor(t.surface,"#07101D"));
    root.style.setProperty("--u404-accent",sanitizeColor(t.accent,"#2EE6D6"));
    root.style.setProperty("--u404-accent2",sanitizeColor(t.accent2,"#5AA7FF"));
    root.style.setProperty("--u404-ink",sanitizeColor(t.text,"#EEF7FF"));
    root.style.setProperty("--u404-muted",sanitizeColor(t.muted,"#8FA9BC"));
  }
  function exportTheme(){
    return {schema:"u404-theme-v1",name:getSkinData(state.skin)[1],skin:state.skin,customTheme:state.customTheme};
  }
  function importTheme(payload){
    if(!payload || payload.schema!=="u404-theme-v1") throw new Error("Formato de tema no válido");
    if(payload.customTheme){
      const c=payload.customTheme;
      state.customTheme={background:sanitizeColor(c.background,"#050A12"),surface:sanitizeColor(c.surface,"#07101D"),accent:sanitizeColor(c.accent,"#2EE6D6"),accent2:sanitizeColor(c.accent2,"#5AA7FF"),text:sanitizeColor(c.text,"#EEF7FF"),muted:sanitizeColor(c.muted,"#8FA9BC")};
    } else state.customTheme=null;
    state.skin=VALID.includes(payload.skin)?payload.skin:"midnight";
    save();apply();return exportTheme();
  }
  function setCustomTheme(theme){state.customTheme=theme||null;save();apply();}

  function setSkin(id){ state.skin = VALID.includes(id) ? id : DEFAULTS.skin; state.customTheme=null; save(); apply(); }
  function cycleSkin(){
    const idx = VALID.indexOf(state.skin);
    setSkin(VALID[(idx + 1) % VALID.length]);
  }
  function setMotion(value){ state.motion = value === "off" ? "off" : "auto"; save(); apply(); }
  function setContrast(value){ state.contrast = value === "high" ? "high" : "normal"; save(); apply(); }
  function setFontScale(value){ state.fontScale = Number(value) || 1; save(); apply(); }
  function injectSkinPicker(target){
    const root = typeof target === "string" ? document.querySelector(target) : target;
    if (!root) return;
    root.classList.add("u404-skin-grid");
    root.innerHTML = SKINS.map(([id,name,colors]) => `
      <button class="u404-skinbtn" type="button" data-u404-set-skin="${id}" aria-pressed="${id===state.skin}">
        <span class="u404-swatches" aria-hidden="true">${colors.map(c=>`<i style="background:${c}"></i>`).join("")}</span>
        <span>${name}</span>
      </button>`).join("");
  }
  function wire(){
    document.addEventListener("click", (ev) => {
      const skinBtn = ev.target.closest("[data-u404-set-skin]");
      if (skinBtn) setSkin(skinBtn.getAttribute("data-u404-set-skin"));
      const cycleBtn = ev.target.closest("[data-u404-cycle-skin]");
      if (cycleBtn) cycleSkin();
    });
  }
  function init(options){
    options = options || {};
    if (options.defaultSkin && !localStorage.getItem(KEY)) state.skin = options.defaultSkin;
    if (options.picker) injectSkinPicker(options.picker);
    apply();
    wire();
  }
  window.U404Style = {init, apply, setSkin, cycleSkin, setMotion, setContrast, setFontScale, setCustomTheme, exportTheme, importTheme, injectSkinPicker, skins:SKINS, get state(){return Object.assign({}, state);}};
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init());
  else init();
})();
