import './u404-style-system.css';
import './u404-style-system.js';
import './styles.css';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const uid = () => (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const icons = {
  play: '<path d="M8 5v14l11-7z"/>',
  pause: '<path d="M7 5h4v14H7zM15 5h4v14h-4z"/>',
  folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  media: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 9 5 3-5 3z"/>',
  library: '<path d="M4 19V5M9 19V5M14 19V5M19 19V5"/><path d="M3 5h18M3 19h18"/>',
  audio: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  convert: '<path d="m7 7 3-3 3 3M10 4v11a4 4 0 0 0 4 4h3"/><path d="m17 17 3 3-3 3"/>',
  inspect: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M11 8v6M8 11h6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>',
  previous: '<path d="M6 5v14M18 6l-9 6 9 6z"/>',
  next: '<path d="M18 5v14M6 6l9 6-9 6z"/>',
  back: '<path d="m11 7-5 5 5 5M6 12h12"/>',
  forward: '<path d="m13 7 5 5-5 5M18 12H6"/>',
  volume: '<path d="M11 5 6 9H3v6h3l5 4zM15 9a4 4 0 0 1 0 6M17.5 6.5a8 8 0 0 1 0 11"/>',
  mute: '<path d="M11 5 6 9H3v6h3l5 4zM16 9l5 6M21 9l-5 6"/>',
  fullscreen: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
  pip: '<rect x="3" y="5" width="18" height="14" rx="2"/><rect x="12" y="11" width="7" height="5" rx="1"/>',
  cast: '<path d="M4 18.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/><path d="M2.5 14.5a7 7 0 0 1 7 7M2.5 10a11.5 11.5 0 0 1 11.5 11.5"/><path d="M8 4h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-3"/>',
  subtitles: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 14h4M13 14h4M7 17h7"/>',
  repeat: '<path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
  camera: '<path d="M4 7h4l2-3h4l2 3h4v12H4z"/><circle cx="12" cy="13" r="4"/>',
  cinema: '<path d="M3 6h18v12H3zM7 3v3M17 3v3M7 18v3M17 18v3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
  file: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  shield: '<path d="M12 3 4 6v5c0 5.3 3.4 8.5 8 10 4.6-1.5 8-4.7 8-10V6z"/><path d="m9 12 2 2 4-5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v7M12 7h.01"/>',
  copy: '<rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"/>',
  reset: '<path d="M4 4v6h6M4.9 15a8 8 0 1 0 1-8.2L4 10"/>',
  waveform: '<path d="M3 12h3l2-6 4 12 3-9 2 6h4"/>',
  alert: '<path d="M12 3 2 21h20z"/><path d="M12 9v5M12 17h.01"/>',
  palette: '<path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h5a4 4 0 0 0 4-4c0-3.3-4-6-9-6z"/><circle cx="7.5" cy="10" r="1"/><circle cx="10" cy="6.8" r="1"/><circle cx="14.5" cy="6.8" r="1"/><circle cx="17" cy="10" r="1"/>',
  tv: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="m8 2 4 4 4-4M7 16h.01M10 16h.01M15 10h3v3h-3z"/>',
  magic: '<path d="m4 20 11-11M14 4l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7z"/>',
  check: '<path d="m5 12 4 4L19 6"/>'
};
const svg = (name, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.info}</svg>`;

const state = {
  view: 'player',
  playlist: [],
  currentIndex: -1,
  repeatMode: 'off',
  ab: { a: null, b: null },
  subtitleUrl: null,
  history: [],
  settings: {
    rememberProgress: true,
    reduceEffects: false,
    autoPlayNext: true,
    volume: .85,
    eqPreset: 'Plano',
    skin: 'midnight',
    playerMode: 'studio',
    universalEngine: true,
    compatibilityPrompts: true,
    highContrast: false,
    acceptedLegal: false
  },
  audio: { context: null, source: null, filters: [], analyser: null, gain: null, panner: null, compressor: null, enabled: true, compressorOn: true, frame: null },
  ffmpeg: null,
  ffmpegLoaded: false,
  ffmpegBusy: false,
  ffmpegLogs: [],
  converterFile: null,
  inspectorFile: null,
  inspectorMetadata: null,
  inspectorReport: null,
  installPrompt: null,
  pwaRegistration: null,
  reloadingForUpdate: false,
  saveTimer: 0,
  dragDepth: 0,
  universal: { busy: false, itemId: null, cancelled: false },
  tvClockTimer: 0,
  lastFocus: null,
  cast: { sdkReady: false, available: false, castState: 'NO_DEVICES_AVAILABLE', session: null, remotePlayer: null, remoteController: null, lastUrl: '', lastTitle: '', lastMime: 'video/mp4', airplayAvailable: false }
};

const viewMeta = {
  player: ['Reproductor', 'Vídeo, audio, subtítulos y controles avanzados'],
  library: ['Biblioteca', 'Recientes, favoritos y progreso guardado'],
  audio: ['Audio Lab', 'Ecualizador, normalización y visualización'],
  converter: ['Convertidor', 'Conversión local mediante FFmpeg WebAssembly'],
  inspector: ['Inspector multimedia', 'Información técnica y compatibilidad'],
  settings: ['Ajustes', 'Privacidad, datos locales y compatibilidad']
};

function appTemplate() {
  return `
  <div class="app-shell">
    <aside class="sidebar" id="sidebar" aria-label="Navegación principal">
      <div class="brand">
        <img class="brand-mark" src="./icons/icon.svg" alt="" />
        <div><h1>MediaForge 404</h1><span id="currentSkinLabel">U404 Midnight</span></div>
      </div>
      <nav class="nav-list">
        ${navButton('player','media','Reproductor')}
        ${navButton('library','library','Biblioteca','0')}
        ${navButton('audio','audio','Audio Lab')}
        ${navButton('converter','convert','Convertidor')}
        ${navButton('inspector','inspect','Inspector')}
        ${navButton('settings','settings','Ajustes')}
      </nav>
      <div class="sidebar-footer">
        <div class="privacy-chip"><span class="privacy-dot"></span><span>Procesamiento local<br>Sin subir tus archivos</span></div>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <button class="icon-btn mobile-menu" id="mobileMenu" aria-label="Abrir menú">${svg('menu')}</button>
        <div class="page-meta"><h2 id="pageTitle">Reproductor</h2><p id="pageSubtitle">Vídeo, audio, subtítulos y controles avanzados</p></div>
        <div class="top-actions">
          <div class="status-pill"><span class="dot"></span>Privado y local</div>
          <button class="soft-btn update-btn" id="updateAppBtn" hidden>${svg('download')}<span>Actualizar</span></button>
          <button class="soft-btn" id="installBtn" hidden>${svg('download')}<span>Instalar</span></button>
          <button class="soft-btn" id="globalOpenBtn">${svg('plus')}<span>Abrir archivos</span></button>
          <button class="icon-btn" id="appearanceBtn" aria-label="Personalizar aspecto" title="Skins y modos">${svg('palette')}</button>
          <button class="icon-btn" id="aboutBtn" aria-label="Privacidad y acerca de">${svg('shield')}</button>
        </div>
      </header>

      ${playerView()}
      ${libraryView()}
      ${audioView()}
      ${converterView()}
      ${inspectorView()}
      ${settingsView()}
    </main>
  </div>

  <input class="hidden" id="mediaInput" type="file" accept="audio/*,video/*,.mkv,.flac,.m4a,.opus,.avi,.mov" multiple />
  <input class="hidden" id="subtitleInput" type="file" accept=".srt,.vtt,text/vtt" />
  <input class="hidden" id="converterInput" type="file" accept="audio/*,video/*,.mkv,.flac,.m4a,.opus,.avi,.mov" />
  <input class="hidden" id="inspectorInput" type="file" accept="audio/*,video/*,.mkv,.flac,.m4a,.opus,.avi,.mov" />
  <input class="hidden" id="themeImportInput" type="file" accept="application/json,.json" />

  <div class="drop-overlay" id="dropOverlay"><div class="drop-box">${svg('folder')}<h3>Suelta tus archivos</h3><p>Se añadirán a la lista de reproducción sin salir de tu dispositivo.</p></div></div>
  <div class="modal-backdrop" id="modalBackdrop" role="presentation"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" id="modal"></div></div>
  <div class="toast-stack" id="toastStack" aria-live="polite"></div>`;
}

function navButton(view, icon, label, badge = '') {
  return `<button class="nav-btn ${view === 'player' ? 'active' : ''}" data-view="${view}">${svg(icon)}<span>${label}</span>${badge !== '' ? `<span class="nav-badge" id="libraryBadge">${badge}</span>` : ''}</button>`;
}

function playerView() {
  return `<section class="view active" data-view-panel="player">
    <div class="player-grid">
      <article class="card player-card">
        <div class="player-stage" id="playerStage">
          <video id="mediaElement" playsinline preload="metadata"></video>
          <div class="audio-art hidden" id="audioArt"><div class="audio-orb" id="audioOrb"></div></div>
          <div class="empty-stage" id="emptyStage"><div class="empty-content">
            <div class="empty-icon">${svg('media')}</div>
            <h3>Tu contenido, sin salir del navegador</h3>
            <p>Abre uno o varios archivos de vídeo o audio. También puedes arrastrarlos directamente a esta ventana.</p>
            <button class="primary-btn" id="emptyOpenBtn">${svg('folder')} Abrir archivos</button>
            <div class="drop-caption">MP4 · WEBM · MP3 · WAV · OGG · M4A y formatos compatibles</div>
          </div></div>
          <div class="stage-badge" id="mediaBadge"><span></span><b id="mediaBadgeText">LOCAL</b></div>
          <div class="tv-effects" aria-hidden="true"><div class="tv-scanlines"></div><div class="tv-vignette"></div></div>
          <div class="tv-osd" aria-hidden="true"><span class="tv-channel">CH 404</span><span id="tvNowPlaying">MEDIAFORGE</span><time id="tvClock">--:--</time></div>
        </div>
        <div class="engine-strip native" id="engineStrip"><span class="engine-signal"></span><div><strong id="engineStatusTitle">U404 Universal Media Engine</strong><p id="engineStatusText">Abre un archivo para comprobar su compatibilidad.</p></div><div class="engine-actions"><button class="soft-btn compact" id="prepareCompatibilityBtn" hidden>${svg('magic')} Preparar</button><button class="soft-btn compact" id="downloadCompatibilityBtn" hidden>${svg('download')} Guardar</button></div></div>
        <div class="cast-strip" id="castStrip" hidden>
          <span class="cast-live-dot"></span>
          <div class="cast-strip-copy"><strong id="castDeviceName">Transmitiendo</strong><p id="castMediaStatus">Conectado a Google Cast</p></div>
          <div class="cast-time"><span id="castCurrentTime">00:00</span><input id="castSeek" type="range" min="0" max="1000" value="0" aria-label="Posición remota"/><span id="castDuration">00:00</span></div>
          <div class="cast-actions"><button class="icon-btn" id="castPlayPauseBtn" aria-label="Pausar o reanudar en TV">${svg('pause')}</button><input id="castVolume" type="range" min="0" max="1" step="0.01" value="1" aria-label="Volumen del televisor"/><button class="soft-btn compact" id="castDisconnectBtn">Desconectar</button><button class="danger-btn compact" id="castStopBtn">Detener</button></div>
        </div>
        <div class="player-controls">
          <div class="seek-row"><span id="currentTime">00:00</span><input id="seek" type="range" min="0" max="1000" value="0" aria-label="Posición"/><span id="duration">00:00</span></div>
          <div class="control-row">
            <button class="icon-btn" id="previousBtn" aria-label="Anterior">${svg('previous')}</button>
            <button class="icon-btn hide-mobile" id="backBtn" aria-label="Retroceder 10 segundos">${svg('back')}</button>
            <button class="icon-btn play-main" id="playBtn" aria-label="Reproducir">${svg('play')}</button>
            <button class="icon-btn hide-mobile" id="forwardBtn" aria-label="Avanzar 10 segundos">${svg('forward')}</button>
            <button class="icon-btn" id="nextBtn" aria-label="Siguiente">${svg('next')}</button>
            <span class="ab-indicator" id="abIndicator">A–B</span>
            <div class="control-spacer"></div>
            <button class="icon-btn hide-mobile" id="repeatBtn" aria-label="Modo repetición">${svg('repeat')}</button>
            <button class="icon-btn hide-mobile" id="subtitleBtn" aria-label="Cargar subtítulos">${svg('subtitles')}</button>
            <button class="icon-btn hide-mobile" id="captureBtn" aria-label="Capturar fotograma">${svg('camera')}</button>
            <div class="volume-wrap"><button class="icon-btn" id="muteBtn" aria-label="Silenciar">${svg('volume')}</button><input id="volume" type="range" min="0" max="1" step="0.01" value=".85" aria-label="Volumen" /></div>
            <select class="speed-select" id="speed" aria-label="Velocidad"><option>.5×</option><option>.75×</option><option selected>1×</option><option>1.25×</option><option>1.5×</option><option>2×</option><option>3×</option></select>
            <button class="icon-btn hide-mobile" id="pipBtn" aria-label="Picture in Picture">${svg('pip')}</button>
            <button class="icon-btn cast-btn" id="castBtn" aria-label="Transmitir a una pantalla" aria-haspopup="dialog" title="Google Cast, Chromecast y AirPlay">${svg('cast')}<span class="cast-availability-dot" id="castAvailabilityDot"></span></button>
            <button class="icon-btn hide-mobile" id="tvModeBtn" aria-label="Cambiar modo de pantalla" title="Modo de pantalla">${svg('tv')}</button>
            <button class="icon-btn hide-mobile" id="cinemaBtn" aria-label="Modo cine inmersivo">${svg('cinema')}</button>
            <button class="icon-btn" id="fullscreenBtn" aria-label="Pantalla completa">${svg('fullscreen')}</button>
          </div>
        </div>
      </article>

      <aside class="card queue-card">
        <div class="card-header"><div><h3>Lista de reproducción</h3><p id="queueSummary">Sin archivos</p></div><div class="header-actions"><button class="icon-btn" id="queueAddBtn" aria-label="Añadir archivos">${svg('plus')}</button><button class="icon-btn" id="queueClearBtn" aria-label="Vaciar lista">${svg('trash')}</button></div></div>
        <div class="playlist" id="playlist"><div class="playlist-empty">Añade varios archivos para crear una cola local.</div></div>
      </aside>
    </div>
  </section>`;
}

function libraryView() {
  return `<section class="view" data-view-panel="library">
    <article class="card section-card">
      <div class="section-title"><div class="glyph">${svg('library')}</div><div><h3>Biblioteca inteligente</h3><p>Progreso, favoritos, etiquetas y colecciones guardados solo en este navegador.</p></div><div class="right"><button class="soft-btn" id="libraryExportBtn">${svg('download')} Exportar</button><button class="soft-btn" id="libraryAddBtn">${svg('plus')} Añadir</button></div></div>
      <div class="library-insights" id="libraryInsights" aria-live="polite"></div>
      <div class="library-toolbar">
        <label class="search-box">${svg('search')}<input id="librarySearch" placeholder="Buscar nombre, etiqueta o colección…" /></label>
        <select class="filter-select" id="libraryFilter" aria-label="Filtrar biblioteca"><option value="all">Todo</option><option value="favorite">Favoritos</option><option value="video">Vídeo</option><option value="audio">Audio</option><option value="unfinished">En progreso</option></select>
        <select class="filter-select" id="libraryCollectionFilter" aria-label="Filtrar por colección"><option value="all">Todas las colecciones</option></select>
        <select class="filter-select" id="librarySort" aria-label="Ordenar biblioteca"><option value="recent">Más recientes</option><option value="name">Nombre A–Z</option><option value="progress">Mayor progreso</option><option value="size">Mayor tamaño</option></select>
      </div>
      <div class="library-list" id="libraryList"><div class="empty-panel library-empty-state"><div class="empty-library-icon">${svg('library')}</div><h4>Tu biblioteca local está vacía</h4><p>Abre audio o vídeo para guardar el progreso, organizarlo con etiquetas y continuar donde lo dejaste.</p><button class="primary-btn" id="libraryEmptyOpenBtn">${svg('folder')} Abrir primeros archivos</button></div></div>
    </article>
  </section>`;
}

function audioView() {
  const freqs = ['60','170','350','1k','3.5k','10k'];
  return `<section class="view" data-view-panel="audio">
    <div class="audio-layout">
      <article class="card visualizer-card"><canvas id="visualizer"></canvas><div class="visualizer-overlay"><strong>Espectro en tiempo real</strong><span id="visualizerState">Esperando reproducción</span></div></article>
      <article class="card eq-card">
        <div class="section-title"><div class="glyph">${svg('audio')}</div><div><h3>Ecualizador</h3><p>Procesamiento Web Audio en tiempo real.</p></div></div>
        <div class="preset-row" id="presetRow">${['Plano','Música','Cine','Voz','Noche','Graves'].map((p,i)=>`<button class="preset-chip ${i===0?'active':''}" data-preset="${p}">${p}</button>`).join('')}</div>
        <div class="eq-bands">${freqs.map((f,i)=>`<label class="eq-band"><output id="eqOut${i}">0 dB</output><input class="eq-slider" data-index="${i}" type="range" min="-12" max="12" value="0" step="1" aria-label="Banda ${f} Hz"/><span>${f}</span></label>`).join('')}</div>
        <div class="audio-controls">
          <div class="range-field"><label>Ganancia</label><input id="gainRange" type="range" min="0" max="2" value="1" step=".01"/><output id="gainOut">100%</output></div>
          <div class="range-field"><label>Balance</label><input id="panRange" type="range" min="-1" max="1" value="0" step=".01"/><output id="panOut">Centro</output></div>
          <div class="switch-row"><span>Compresor / normalización suave</span><button class="toggle on" id="compressorToggle" role="switch" aria-checked="true" aria-label="Activar compresor"></button></div>
          <div class="switch-row"><span>Procesamiento Audio Lab</span><button class="toggle on" id="audioToggle" role="switch" aria-checked="true" aria-label="Activar Audio Lab"></button></div>
        </div>
      </article>
    </div>
  </section>`;
}

function converterView() {
  return `<section class="view" data-view-panel="converter">
    <div class="converter-grid">
      <article class="card section-card">
        <div class="section-title"><div class="glyph">${svg('file')}</div><div><h3>Archivo de origen</h3><p>La conversión se realiza dentro de este dispositivo.</p></div></div>
        <div class="file-well" id="converterWell"><div><div class="well-icon">${svg('folder')}</div><h4>Selecciona un vídeo o audio</h4><p>FFmpeg se cargará únicamente cuando inicies una conversión.</p><button class="soft-btn" id="selectConverterBtn">Elegir archivo</button></div></div>
        <div class="ffmpeg-status" id="ffmpegStatus"><strong>Motor en espera.</strong> FFmpeg Core se descarga bajo demanda y después procesa los archivos localmente.</div>
      </article>
      <article class="card section-card">
        <div class="section-title"><div class="glyph">${svg('convert')}</div><div><h3>Operación</h3><p>Presets seguros para conversión, extracción y compresión.</p></div></div>
        <div class="form-grid">
          <div class="field full"><label>Preset</label><select class="field-select" id="convertPreset"><option value="mp4">MP4 compatible · H.264 + AAC</option><option value="compress">Comprimir MP4 · 720/1080p</option><option value="webm">WebM · VP9 + Opus</option><option value="mp3">Extraer audio · MP3</option><option value="wav">Extraer audio · WAV</option><option value="gif">Crear GIF</option><option value="remux">Cambiar contenedor sin recodificar</option></select></div>
          <div class="field"><label>Inicio opcional</label><input class="text-input" id="trimStart" type="number" min="0" step=".1" placeholder="0 segundos"/></div>
          <div class="field"><label>Final opcional</label><input class="text-input" id="trimEnd" type="number" min="0" step=".1" placeholder="Ej. 45"/></div>
          <div class="field full"><small>Los archivos grandes y la recodificación 4K pueden consumir mucha memoria. Empieza con clips cortos para comprobar la compatibilidad de tu dispositivo.</small></div>
        </div>
        <div class="convert-actions"><button class="primary-btn" id="convertBtn" disabled>${svg('convert')} Iniciar conversión</button><button class="danger-btn" id="cancelConvertBtn" disabled>Cancelar</button></div>
        <div class="progress-box" id="convertProgress"><div class="progress-head"><span id="progressLabel">Preparando…</span><span id="progressPercent">0%</span></div><div class="progress-bar"><span id="progressBar"></span></div><div class="log-box" id="convertLog">Sin actividad.</div></div>
      </article>
    </div>
  </section>`;
}

function inspectorView() {
  return `<section class="view" data-view-panel="inspector">
    <div class="inspector-layout">
      <article class="card inspect-summary"><div class="inspect-orb">${svg('inspect')}</div><h3 id="inspectName">Ningún archivo seleccionado</h3><p id="inspectSubtitle">Abre un archivo para analizar, validar o reparar su contenedor.</p><div class="inspect-actions"><button class="primary-btn" id="selectInspectorBtn">${svg('folder')} Seleccionar archivo</button><button class="soft-btn" id="useCurrentInspectBtn">Usar archivo actual</button><button class="soft-btn" id="checksumBtn" disabled>${svg('shield')} SHA-256</button><button class="soft-btn" id="deepInspectBtn" disabled>${svg('waveform')} Análisis profundo</button><button class="soft-btn" id="validateMediaBtn" disabled>${svg('check')} Validar archivo</button><button class="soft-btn" id="repairMediaBtn" disabled>${svg('magic')} Reparar contenedor</button><div class="inspect-export-row"><button class="soft-btn" id="exportInspectBtn" disabled>${svg('download')} JSON</button><button class="soft-btn" id="exportInspectTxtBtn" disabled>${svg('file')} TXT</button></div></div></article>
      <article class="card section-card">
        <div class="section-title"><div class="glyph">${svg('info')}</div><div><h3>Inspector multimedia profesional</h3><p>Metadatos, pistas, códecs, huella digital e integridad mediante APIs locales y FFmpeg.</p></div></div>
        <div class="diagnostic-cards" id="diagnosticCards"><div class="diagnostic-card neutral"><span>Estado</span><strong>Esperando archivo</strong><small>Selecciona un vídeo o audio.</small></div></div>
        <div class="metadata-grid" id="metadataGrid"></div>
        <div class="compat-banner" id="compatBanner"><span class="signal"></span><div><strong>Esperando archivo</strong><p>La compatibilidad exacta depende del contenedor, del códec interno y del navegador.</p></div></div>
        <div class="analysis-block"><div class="analysis-heading"><strong>Análisis FFmpeg</strong><span>Contenedor, pistas, bitrate, FPS y subtítulos.</span></div><pre class="deep-output" id="deepOutput">El análisis profundo todavía no se ha ejecutado.</pre></div>
        <div class="analysis-block"><div class="analysis-heading"><strong>Validación y reparación</strong><span>Detecta errores de lectura y puede reconstruir índices o metadatos sin modificar el original.</span></div><pre class="deep-output validation-output" id="validationOutput">Sin validación.</pre></div>
      </article>
    </div>
  </section>`;
}
function settingsView() {
  return `<section class="view" data-view-panel="settings">
    <div class="section-grid">
      <article class="card section-card">
        <div class="section-title"><div class="glyph">${svg('palette')}</div><div><h3>Skins U404</h3><p>Paletas del Style Kit aplicadas a toda la interfaz.</p></div><div class="right"><span class="appearance-current" id="appearanceCurrent">Midnight · Studio</span></div></div>
        <div class="skin-picker" id="skinPicker" aria-label="Selector de skin"></div>
        <div class="theme-tools">
          <button class="soft-btn" id="exportThemeBtn" type="button">${svg('download')} Exportar tema</button>
          <button class="soft-btn" id="importThemeBtn" type="button">${svg('folder')} Importar tema JSON</button>
          <button class="soft-btn" id="randomThemeBtn" type="button">${svg('magic')} Tema aleatorio</button>
        </div>
        <div class="subsection-heading"><strong>Modos de pantalla</strong><span>Transforman el marco y los efectos del reproductor.</span></div>
        <div class="mode-grid" id="modePicker">
          ${[['studio','Studio','Interfaz limpia y profesional'],['television','Televisión','Marco, OSD y presencia de televisor'],['crt','CRT 404','Scanlines, curvatura y señal analógica'],['vhs','VHS 404','Ruido de cinta, tracking y color analógico'],['cinema','Cine','Formato panorámico y sala oscura'],['oled','OLED','Negros puros y contraste alto'],['cyberpunk','Cyberpunk','Neón, contraste y HUD futurista'],['retro','Retro TV','Televisor cálido de estética setentera'],['minimal','Minimal','Controles limpios y distracciones mínimas']].map(([id,name,desc])=>`<button class="mode-card" type="button" data-player-mode="${id}" aria-pressed="false"><span class="mode-preview mode-${id}"></span><strong>${name}</strong><small>${desc}</small></button>`).join('')}
        </div>
      </article>
      <article class="card section-card half">
        <div class="section-title"><div class="glyph">${svg('magic')}</div><div><h3>U404 Universal Media Engine</h3><p>Capa de compatibilidad local para formatos difíciles.</p></div></div>
        <div class="engine-explainer"><span>${svg('shield')}</span><div><strong>Detectar → probar → remultiplexar → transcodificar</strong><p>Primero usa el decodificador nativo del navegador. Si falla, puede preparar temporalmente una copia MP4 H.264/AAC o MP3 sin tocar el original.</p></div></div>
        <div class="settings-grid single">
          ${settingToggle('universalEngine','Motor universal','Activa la reparación y preparación de formatos no compatibles.',true)}
          ${settingToggle('compatibilityPrompts','Ofrecer solución al fallar','Muestra una acción clara cuando el navegador no puede decodificar.',true)}
        </div>
        <div class="engine-offline-row"><button class="soft-btn" id="cacheEngineBtn" disabled>${svg('cloud')} Motor online bajo demanda</button><span id="engineOfflineStatus">El motor se descarga bajo demanda al usar conversión o análisis profundo.</span></div><p class="honest-limit">No puede saltarse DRM ni garantizar todos los códecs existentes. WebAssembly tiene límites de memoria y es más lento que una aplicación nativa.</p>
      </article>
      <article class="card section-card half">
        <div class="section-title"><div class="glyph">${svg('settings')}</div><div><h3>Comportamiento y accesibilidad</h3><p>Preferencias guardadas únicamente en este navegador.</p></div></div>
        <div class="settings-grid single">
          ${settingToggle('rememberProgress','Recordar progreso','Guarda el minuto donde dejaste cada archivo.',true)}
          ${settingToggle('autoPlayNext','Reproducir siguiente','Avanza automáticamente al terminar.',true)}
          ${settingToggle('reduceEffects','Reducir efectos','Minimiza desenfoques, scanlines y animaciones.',false)}
          ${settingToggle('highContrast','Contraste reforzado','Aumenta bordes y contraste de textos secundarios.',false)}
        </div>
      </article>
      <article class="card section-card half">
        <div class="section-title"><div class="glyph">${svg('shield')}</div><div><h3>Privacidad y datos</h3><p>MediaForge 404 no incorpora cuentas ni telemetría.</p></div></div>
        <p class="settings-copy">Los metadatos, favoritos y puntos de reproducción se guardan en IndexedDB. Los archivos se procesan localmente. Las copias compatibles viven en memoria hasta cerrar o quitar el archivo.</p>
        <div class="settings-actions"><button class="soft-btn" id="privacyBtn">Ver aviso de privacidad</button><button class="danger-btn" id="clearDataBtn">${svg('trash')} Borrar datos locales</button></div>
      </article>
      <article class="card section-card half">
        <div class="section-title"><div class="glyph">${svg('inspect')}</div><div><h3>Compatibilidad del navegador</h3><p>Diagnóstico de las funciones utilizadas por la aplicación.</p></div></div>
        <div class="compat-list" id="compatList"></div>
      </article>
    </div>
  </section>`;
}

function settingToggle(key, title, desc, on) {
  return `<div class="setting-row"><div class="setting-info"><strong>${title}</strong><p>${desc}</p></div><button class="toggle ${on?'on':''}" role="switch" aria-checked="${on?'true':'false'}" data-setting-toggle="${key}" aria-label="${title}"></button></div>`;
}

class LocalDB {
  constructor() { this.db = null; }
  async open() {
    if (this.db) return this.db;
    this.db = await new Promise((resolve, reject) => {
      const req = indexedDB.open('mediaforge404', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('history')) db.createObjectStore('history', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('handles')) db.createObjectStore('handles', { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return this.db;
  }
  async put(store, value) { const db = await this.open(); return txPromise(db.transaction(store,'readwrite').objectStore(store).put(value)); }
  async get(store, key) { const db = await this.open(); return txPromise(db.transaction(store).objectStore(store).get(key)); }
  async getAll(store) { const db = await this.open(); return txPromise(db.transaction(store).objectStore(store).getAll()); }
  async delete(store,key) { const db = await this.open(); return txPromise(db.transaction(store,'readwrite').objectStore(store).delete(key)); }
  async clear(store) { const db = await this.open(); return txPromise(db.transaction(store,'readwrite').objectStore(store).clear()); }
}
function txPromise(request) { return new Promise((resolve,reject)=>{ request.onsuccess=()=>resolve(request.result); request.onerror=()=>reject(request.error); }); }
const db = new LocalDB();

function loadSettings() {
  try { state.settings = { ...state.settings, ...JSON.parse(localStorage.getItem('mediaforge-settings') || '{}') }; } catch {}
}
function saveSettings() {
  try { localStorage.setItem('mediaforge-settings', JSON.stringify(state.settings)); }
  catch { toast('No se pudieron guardar los ajustes','El almacenamiento local está bloqueado o lleno.','warning'); }
}

async function init() {
  loadSettings();
  $('#app').innerHTML = appTemplate();
  bindUI();
  const initialView=location.hash.replace('#','');
  if(viewMeta[initialView])switchView(initialView,false);
  await loadHistory();
  renderPlaylist();
  renderLibrary();
  renderCompatibility();
  renderAppearanceSettings();
  applySettings();
  startTvClock();
  setupVisualizer();
  registerPWA();
  initCastIntegration();
  if (!state.settings.acceptedLegal) showPrivacyModal(true);
}

function bindUI() {
  $$('.nav-btn').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.view)));
  $('#mobileMenu').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  document.addEventListener('click', e => { if (innerWidth <= 860 && !e.target.closest('#sidebar') && !e.target.closest('#mobileMenu')) $('#sidebar').classList.remove('open'); });

  ['globalOpenBtn','emptyOpenBtn','queueAddBtn','libraryAddBtn'].forEach(id => $(`#${id}`).addEventListener('click', openMediaPicker));
  $('#mediaInput').addEventListener('change', e => addFiles([...e.target.files]));
  $('#queueClearBtn').addEventListener('click', clearPlaylist);

  const media = $('#mediaElement');
  $('#playBtn').addEventListener('click', togglePlay);
  $('#previousBtn').addEventListener('click', previousTrack);
  $('#nextBtn').addEventListener('click', nextTrack);
  $('#backBtn').addEventListener('click', () => media.currentTime = Math.max(0, media.currentTime - 10));
  $('#forwardBtn').addEventListener('click', () => media.currentTime = Math.min(media.duration || 0, media.currentTime + 10));
  $('#seek').addEventListener('input', e => { if (media.duration) media.currentTime = (Number(e.target.value) / 1000) * media.duration; });
  $('#volume').value = state.settings.volume;
  $('#volume').addEventListener('input', e => { media.volume = Number(e.target.value); state.settings.volume = media.volume; saveSettings(); updateRange(e.target, media.volume * 100); });
  $('#muteBtn').addEventListener('click', () => { media.muted = !media.muted; updateMuteIcon(); });
  $('#speed').addEventListener('change', e => media.playbackRate = Number(e.target.value.replace('×','')));
  $('#fullscreenBtn').addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', syncFullscreenState);
  document.addEventListener('webkitfullscreenchange', syncFullscreenState);
  $('#mediaElement').addEventListener('webkitbeginfullscreen', () => document.documentElement.classList.add('is-native-video-fullscreen'));
  $('#mediaElement').addEventListener('webkitendfullscreen', () => document.documentElement.classList.remove('is-native-video-fullscreen'));
  $('#pipBtn').addEventListener('click', togglePip);
  $('#castBtn').addEventListener('click', showCastModal);
  $('#castPlayPauseBtn').addEventListener('click', toggleRemotePlayback);
  $('#castSeek').addEventListener('change', seekRemotePlayback);
  $('#castVolume').addEventListener('input', setRemoteVolume);
  $('#castDisconnectBtn').addEventListener('click', () => endCastSession(false));
  $('#castStopBtn').addEventListener('click', () => endCastSession(true));
  $('#subtitleBtn').addEventListener('click', () => $('#subtitleInput').click());
  $('#subtitleInput').addEventListener('change', e => loadSubtitle(e.target.files[0]));
  $('#captureBtn').addEventListener('click', captureFrame);
  $('#cinemaBtn').addEventListener('click', () => document.body.classList.toggle('cinema'));
  $('#repeatBtn').addEventListener('click', cycleRepeat);

  media.addEventListener('play', onPlay);
  media.addEventListener('pause', updatePlayIcon);
  media.addEventListener('loadedmetadata', onLoadedMetadata);
  media.addEventListener('durationchange', updateTimeline);
  media.addEventListener('timeupdate', onTimeUpdate);
  media.addEventListener('ended', onEnded);
  media.addEventListener('error', onMediaError);
  media.addEventListener('volumechange', updateMuteIcon);
  media.addEventListener('dblclick', toggleFullscreen);

  $('#librarySearch').addEventListener('input', renderLibrary);
  $('#libraryFilter').addEventListener('change', renderLibrary);
  $('#libraryCollectionFilter').addEventListener('change', renderLibrary);
  $('#librarySort').addEventListener('change', renderLibrary);
  $('#libraryExportBtn').addEventListener('click', openLibraryExportModal);

  $$('.preset-chip').forEach(btn => btn.addEventListener('click', () => applyEqPreset(btn.dataset.preset)));
  $$('.eq-slider').forEach(input => input.addEventListener('input', updateEq));
  $('#gainRange').addEventListener('input', updateAudioControls);
  $('#panRange').addEventListener('input', updateAudioControls);
  $('#compressorToggle').addEventListener('click', toggleCompressor);
  $('#audioToggle').addEventListener('click', toggleAudioLab);

  $('#selectConverterBtn').addEventListener('click', () => $('#converterInput').click());
  $('#converterWell').addEventListener('dblclick', () => $('#converterInput').click());
  $('#converterInput').addEventListener('change', e => setConverterFile(e.target.files[0]));
  $('#convertBtn').addEventListener('click', runConversion);
  $('#cancelConvertBtn').addEventListener('click', cancelConversion);

  $('#selectInspectorBtn').addEventListener('click', () => $('#inspectorInput').click());
  $('#inspectorInput').addEventListener('change', e => inspectFile(e.target.files[0]));
  $('#useCurrentInspectBtn').addEventListener('click', useCurrentForInspector);
  $('#checksumBtn').addEventListener('click', calculateChecksum);
  $('#deepInspectBtn').addEventListener('click', deepInspect);
  $('#validateMediaBtn').addEventListener('click', validateMedia);
  $('#repairMediaBtn').addEventListener('click', confirmRepairMedia);
  $('#exportInspectBtn').addEventListener('click', () => exportInspector('json'));
  $('#exportInspectTxtBtn').addEventListener('click', () => exportInspector('txt'));

  $('#appearanceBtn').addEventListener('click', () => { switchView('settings'); setTimeout(() => $('#skinPicker')?.scrollIntoView({behavior: state.settings.reduceEffects ? 'auto' : 'smooth', block: 'center'}), 60); });
  $('#tvModeBtn').addEventListener('click', cyclePlayerMode);
  $('#prepareCompatibilityBtn').addEventListener('click', () => { const item=state.playlist[state.currentIndex]; if(item) showUniversalPrompt(item,'Preparación manual'); });
  $('#downloadCompatibilityBtn').addEventListener('click', downloadCompatibleVersion);
  $('#skinPicker').addEventListener('click', e => { const btn=e.target.closest('[data-skin]'); if(btn) applySkin(btn.dataset.skin,true); });
  $('#modePicker').addEventListener('click', e => { const btn=e.target.closest('[data-player-mode]'); if(btn) applyPlayerMode(btn.dataset.playerMode,true); });
  $('#exportThemeBtn').addEventListener('click', exportCurrentTheme);
  $('#importThemeBtn').addEventListener('click', () => $('#themeImportInput').click());
  $('#themeImportInput').addEventListener('change', importThemeFile);
  $('#randomThemeBtn').addEventListener('click', randomizeTheme);
  $('#cacheEngineBtn').addEventListener('click', cacheFfmpegOffline);
  $('#updateAppBtn').addEventListener('click', activateWaitingServiceWorker);
  $('#aboutBtn').addEventListener('click', () => showPrivacyModal(false));
  $('#privacyBtn').addEventListener('click', () => showPrivacyModal(false));
  $('#clearDataBtn').addEventListener('click', confirmClearData);
  $$('[data-setting-toggle]').forEach(btn => btn.addEventListener('click', () => toggleSetting(btn)));
  $('#modalBackdrop').addEventListener('click', e => { if (e.target === $('#modalBackdrop')) closeModal(); });
  document.addEventListener('keydown', handleShortcuts);
  bindDragDrop();
  $$('.eq-slider, #gainRange, #panRange, #volume, #seek').forEach(input => updateRange(input));
}

function switchView(view, updateHash = true) {
  state.view = view;
  $$('.view').forEach(v => v.classList.toggle('active', v.dataset.viewPanel === view));
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  $('#pageTitle').textContent = viewMeta[view][0];
  $('#pageSubtitle').textContent = viewMeta[view][1];
  $('#sidebar').classList.remove('open');
  if (view === 'audio') resizeVisualizer();
  if(updateHash && history.replaceState)history.replaceState(null,'',`#${view}`);
}

async function openMediaPicker() {
  if ('showOpenFilePicker' in window) {
    try {
      const handles = await window.showOpenFilePicker({ multiple: true, types: [{ description: 'Multimedia', accept: {'video/*':['.mp4','.webm','.mkv','.avi','.mov','.m4v','.ts','.mts','.m2ts','.wmv','.3gp'], 'audio/*':['.mp3','.wav','.ogg','.m4a','.flac','.opus','.aac']}}] });
      const pairs = await Promise.all(handles.map(async handle => ({ file: await handle.getFile(), handle })));
      await addFiles(pairs.map(p => p.file), pairs.map(p => p.handle));
      return;
    } catch (err) { if (err.name === 'AbortError') return; toast('Selector avanzado no disponible', 'Se utilizará el selector de archivos estándar.', 'warning'); }
  }
  $('#mediaInput').click();
}

async function addFiles(files, handles = []) {
  const accepted = files.map((file,index)=>({file,handle:handles[index]||null})).filter(({file}) => file.type.startsWith('audio/') || file.type.startsWith('video/') || /\.(mkv|avi|mov|m4v|flac|m4a|opus|aac|ts|mts|m2ts|wmv|wma|3gp|ogv)$/i.test(file.name));
  if (!accepted.length) { toast('Archivo no reconocido', 'Selecciona archivos de audio o vídeo.', 'warning'); return; }
  for (let i = 0; i < accepted.length; i++) {
    const {file,handle} = accepted[i];
    const id = `${file.name}|${file.size}|${file.lastModified}`;
    const existing = state.playlist.findIndex(t => t.id === id);
    if (existing >= 0) continue;
    const item = { id, file, handle, url: URL.createObjectURL(file), name: file.name, size: file.size, type: file.type || mimeFromName(file.name), kind: getKind(file), duration: 0, width: 0, height: 0, progress: 0, favorite: false, lastPlayed: Date.now() };
    const old = state.history.find(h => h.id === id);
    if (old) Object.assign(item, { progress: old.progress || 0, favorite: !!old.favorite, duration: old.duration || 0, width: old.width || 0, height: old.height || 0, tags: Array.isArray(old.tags)?old.tags:[], collection: old.collection||'', checksum: old.checksum||'' });
    else Object.assign(item,{tags:[],collection:'',checksum:''});
    state.playlist.push(item);
    await saveHistoryItem(item);
    if (item.handle) { try { await db.put('handles', { id, handle: item.handle }); } catch {} }
  }
  renderPlaylist(); renderLibrary();
  if (state.currentIndex < 0 && state.playlist.length) loadTrack(0, true);
  toast('Archivos añadidos', `${accepted.length} elemento${accepted.length === 1 ? '' : 's'} en la lista.`, 'success');
}

function loadTrack(index, autoplay = false) {
  if (index < 0 || index >= state.playlist.length) return;
  const current = state.playlist[index];
  state.currentIndex = index;
  const media = $('#mediaElement');
  media.pause();
  clearSubtitle();
  media.src = current.compatUrl || current.url;
  media.volume = state.settings.volume;
  media.playbackRate = Number($('#speed').value.replace('×',''));
  $('#emptyStage').classList.add('hidden');
  $('#mediaBadge').classList.add('visible');
  $('#mediaBadgeText').textContent = current.compatUrl ? 'U404 COMPATIBLE' : (current.kind === 'audio' ? 'AUDIO LOCAL' : 'VÍDEO LOCAL');
  $('#tvNowPlaying').textContent = current.name.slice(0,42).toUpperCase();
  updateEngineStrip(current);
  $('#audioArt').classList.toggle('hidden', current.kind !== 'audio');
  media.classList.toggle('hidden', current.kind === 'audio');
  media.load();
  renderPlaylist();
  updateMediaSession(current);
  if (autoplay) media.play().catch(() => {});
}

function togglePlay() {
  const media = $('#mediaElement');
  if (!media.src && state.playlist.length) loadTrack(0, false);
  if (!media.src) { openMediaPicker(); return; }
  if (media.paused) media.play().catch(err => toast('No se pudo reproducir', friendlyMediaError(err), 'error')); else media.pause();
}
function previousTrack() { if (!state.playlist.length) return; loadTrack((state.currentIndex - 1 + state.playlist.length) % state.playlist.length, true); }
function nextTrack() { if (!state.playlist.length) return; loadTrack((state.currentIndex + 1) % state.playlist.length, true); }

async function onPlay() {
  updatePlayIcon();
  $('#audioOrb').classList.add('playing');
  $('#visualizerState').textContent = 'Procesando señal';
  await ensureAudioGraph();
  state.audio.context?.resume();
}
function updatePlayIcon() {
  const paused = $('#mediaElement').paused;
  $('#playBtn').innerHTML = svg(paused ? 'play' : 'pause');
  $('#playBtn').setAttribute('aria-label', paused ? 'Reproducir' : 'Pausar');
  if (paused) { $('#audioOrb').classList.remove('playing'); $('#visualizerState').textContent = 'Reproducción pausada'; }
}
function onLoadedMetadata() {
  const media = $('#mediaElement');
  const item = state.playlist[state.currentIndex];
  if (!item) return;
  item.duration = Number.isFinite(media.duration) ? media.duration : item.duration;
  item.width = media.videoWidth || 0; item.height = media.videoHeight || 0;
  const saved = state.history.find(h => h.id === item.id);
  const savedTime = saved?.progress || item.progress || 0;
  if (state.settings.rememberProgress && savedTime > 2 && savedTime < (media.duration - 4)) media.currentTime = savedTime;
  updateTimeline(); saveHistoryItem(item); renderPlaylist(); renderLibrary();
}
function onTimeUpdate() {
  const media = $('#mediaElement');
  updateTimeline();
  if (state.ab.a != null && state.ab.b != null && media.currentTime >= state.ab.b) media.currentTime = state.ab.a;
  const item = state.playlist[state.currentIndex];
  if (!item || !state.settings.rememberProgress) return;
  item.progress = media.currentTime;
  clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(() => { saveHistoryItem(item); renderPlaylist(); }, 1200);
}
function updateTimeline() {
  const media = $('#mediaElement');
  $('#currentTime').textContent = formatTime(media.currentTime);
  $('#duration').textContent = formatTime(media.duration);
  const value = media.duration ? (media.currentTime / media.duration) * 1000 : 0;
  $('#seek').value = value; updateRange($('#seek'), value / 10);
}
function onEnded() {
  const item = state.playlist[state.currentIndex];
  if (item) { item.progress = 0; saveHistoryItem(item); }
  if (state.repeatMode === 'one') { $('#mediaElement').currentTime = 0; $('#mediaElement').play(); }
  else if (state.settings.autoPlayNext && state.playlist.length > 1) nextTrack();
  else updatePlayIcon();
}
function onMediaError() {
  const media = $('#mediaElement');
  const item = state.playlist[state.currentIndex];
  const codecError = media.error?.code === 4;
  const message = codecError ? 'El navegador no puede decodificar directamente este contenedor o códec.' : 'El archivo no pudo reproducirse.';
  toast('Error de reproducción', message, 'error');
  if (item) updateEngineStrip(item, true);
  if (codecError && item && state.settings.universalEngine && state.settings.compatibilityPrompts && !item.compatUrl) showUniversalPrompt(item,'El navegador ha rechazado el formato.');
}

function cycleRepeat() {
  if (state.ab.a == null) { state.ab.a = $('#mediaElement').currentTime || 0; $('#abIndicator').classList.add('visible'); $('#abIndicator').textContent = `A ${formatTime(state.ab.a)}`; toast('Punto A marcado','Pulsa de nuevo para marcar el punto B.'); return; }
  if (state.ab.b == null) { state.ab.b = $('#mediaElement').currentTime; if (state.ab.b <= state.ab.a) { state.ab = {a:null,b:null}; $('#abIndicator').classList.remove('visible'); toast('Tramo no válido','El punto B debe estar después del punto A.','warning'); return; } $('#abIndicator').textContent = 'A–B ACTIVO'; toast('Repetición A–B activa',`${formatTime(state.ab.a)} → ${formatTime(state.ab.b)}`,'success'); return; }
  state.ab = {a:null,b:null}; $('#abIndicator').classList.remove('visible');
  state.repeatMode = state.repeatMode === 'off' ? 'one' : 'off';
  $('#repeatBtn').style.color = state.repeatMode === 'one' ? 'var(--accent)' : '';
  toast('Repetición', state.repeatMode === 'one' ? 'Repetir archivo activado.' : 'Repetición desactivada.');
}

function getFullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

function syncFullscreenState() {
  const active = Boolean(getFullscreenElement());
  document.documentElement.classList.toggle('is-player-fullscreen', active);
  document.body.classList.toggle('is-player-fullscreen', active);
  const button = $('#fullscreenBtn');
  if (button) {
    button.classList.toggle('active', active);
    button.setAttribute('aria-label', active ? 'Salir de pantalla completa' : 'Pantalla completa');
    button.setAttribute('aria-pressed', String(active));
  }
}

async function toggleFullscreen() {
  const stage = $('#playerStage');
  const media = $('#mediaElement');
  if (!stage || !media) return;

  try {
    if (getFullscreenElement()) {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      return;
    }

    if (stage.requestFullscreen) {
      await stage.requestFullscreen({ navigationUI: 'hide' });
      return;
    }
    if (stage.webkitRequestFullscreen) {
      stage.webkitRequestFullscreen();
      return;
    }
    // Safari en iPhone solo permite fullscreen nativo sobre el elemento <video>.
    if (media.webkitEnterFullscreen && state.playlist[state.currentIndex]?.kind !== 'audio') {
      media.webkitEnterFullscreen();
      return;
    }

    toast('Pantalla completa no disponible','Tu navegador no permite ampliar este contenido. Prueba Safari/Chrome actualizado o el modo cine.','warning');
  } catch (error) {
    console.warn('Fullscreen error:', error);
    toast('Pantalla completa no disponible','El navegador ha bloqueado esta función o el archivo todavía no está listo.','warning');
  }
}

function initCastIntegration() {
  window.addEventListener('mediaforge-cast-api', event => configureCast(Boolean(event.detail?.isAvailable), event.detail?.errorInfo));
  window.__onGCastApiAvailable = function (isAvailable, errorInfo) {
    window.__mediaforgeCastAvailability = { isAvailable: Boolean(isAvailable), errorInfo: errorInfo || null };
    window.dispatchEvent(new CustomEvent('mediaforge-cast-api', { detail: window.__mediaforgeCastAvailability }));
  };
  if (!document.querySelector('script[data-mediaforge-cast-sdk]')) {
    const sdk = document.createElement('script');
    sdk.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    sdk.async = true;
    sdk.dataset.mediaforgeCastSdk = 'true';
    sdk.onerror = () => { state.cast.sdkReady = false; updateCastButton(); };
    document.head.appendChild(sdk);
  }
  if (window.__mediaforgeCastAvailability) {
    configureCast(Boolean(window.__mediaforgeCastAvailability.isAvailable), window.__mediaforgeCastAvailability.errorInfo);
  }
  const media = $('#mediaElement');
  state.cast.airplayAvailable = typeof media?.webkitShowPlaybackTargetPicker === 'function';
  media?.addEventListener?.('webkitplaybacktargetavailabilitychanged', event => {
    state.cast.airplayAvailable = event.availability === 'available' || typeof media.webkitShowPlaybackTargetPicker === 'function';
    updateCastButton();
  });
  updateCastButton();
}

function configureCast(isAvailable, errorInfo = null) {
  if (!isAvailable || !window.cast?.framework || !window.chrome?.cast) {
    state.cast.sdkReady = false;
    if (errorInfo) console.warn('Google Cast SDK no disponible:', errorInfo);
    updateCastButton();
    return;
  }
  try {
    const context = cast.framework.CastContext.getInstance();
    context.setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
      resumeSavedSession: true
    });
    context.addEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED, event => {
      state.cast.castState = event.castState;
      state.cast.available = event.castState !== cast.framework.CastState.NO_DEVICES_AVAILABLE;
      updateCastButton();
      syncCastSession();
    });
    context.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, syncCastSession);
    state.cast.sdkReady = true;
    state.cast.castState = context.getCastState?.() || cast.framework.CastState.NOT_CONNECTED;
    state.cast.available = state.cast.castState !== cast.framework.CastState.NO_DEVICES_AVAILABLE;
    syncCastSession();
    updateCastButton();
  } catch (error) {
    console.warn('No se pudo inicializar Google Cast:', error);
    state.cast.sdkReady = false;
    updateCastButton();
  }
}

function updateCastButton() {
  const button = $('#castBtn');
  const dot = $('#castAvailabilityDot');
  if (!button || !dot) return;
  const connected = Boolean(state.cast.session);
  button.classList.toggle('active', connected);
  button.classList.toggle('cast-unavailable', !state.cast.available && !state.cast.airplayAvailable);
  button.setAttribute('aria-pressed', String(connected));
  const label = connected ? 'Controlar transmisión actual' : 'Transmitir a Chromecast, Google TV o AirPlay';
  button.setAttribute('aria-label', label);
  button.title = label;
  dot.dataset.state = connected ? 'connected' : state.cast.available ? 'available' : state.cast.airplayAvailable ? 'airplay' : 'unavailable';
}

function syncCastSession() {
  if (!state.cast.sdkReady || !window.cast?.framework) return;
  const context = cast.framework.CastContext.getInstance();
  const session = context.getCurrentSession();
  state.cast.session = session || null;
  if (session && !state.cast.remotePlayer) {
    state.cast.remotePlayer = new cast.framework.RemotePlayer();
    state.cast.remoteController = new cast.framework.RemotePlayerController(state.cast.remotePlayer);
    const events = cast.framework.RemotePlayerEventType;
    [events.IS_CONNECTED_CHANGED, events.IS_PAUSED_CHANGED, events.CURRENT_TIME_CHANGED, events.DURATION_CHANGED, events.VOLUME_LEVEL_CHANGED, events.PLAYER_STATE_CHANGED, events.MEDIA_INFO_CHANGED].filter(Boolean).forEach(type => {
      state.cast.remoteController.addEventListener(type, updateCastController);
    });
  }
  if (!session) {
    state.cast.remotePlayer = null;
    state.cast.remoteController = null;
  }
  updateCastController();
  updateCastButton();
}

function updateCastController() {
  const strip = $('#castStrip');
  if (!strip) return;
  const session = state.cast.session;
  const player = state.cast.remotePlayer;
  strip.hidden = !session;
  if (!session || !player) return;
  const deviceName = session.getCastDevice?.().friendlyName || 'Pantalla Cast';
  $('#castDeviceName').textContent = deviceName;
  const title = player.mediaInfo?.metadata?.title || state.cast.lastTitle || 'Contenido remoto';
  $('#castMediaStatus').textContent = `${title} · ${player.playerState || 'Conectado'}`;
  $('#castCurrentTime').textContent = formatTime(player.currentTime || 0);
  $('#castDuration').textContent = formatTime(player.duration || 0);
  $('#castSeek').value = player.duration ? String(clamp((player.currentTime / player.duration) * 1000, 0, 1000)) : '0';
  $('#castSeek').disabled = !player.canSeek;
  $('#castVolume').value = String(Number.isFinite(player.volumeLevel) ? player.volumeLevel : 1);
  $('#castPlayPauseBtn').innerHTML = svg(player.isPaused ? 'play' : 'pause');
  $('#castPlayPauseBtn').setAttribute('aria-label', player.isPaused ? 'Reanudar en TV' : 'Pausar en TV');
}

function inferCastMime(url, selected = '') {
  if (selected && selected !== 'auto') return selected;
  const clean = url.split(/[?#]/)[0].toLowerCase();
  if (clean.endsWith('.m3u8')) return 'application/x-mpegURL';
  if (clean.endsWith('.mpd')) return 'application/dash+xml';
  if (clean.endsWith('.webm')) return 'video/webm';
  if (clean.endsWith('.mp3')) return 'audio/mpeg';
  if (clean.endsWith('.m4a') || clean.endsWith('.aac')) return 'audio/mp4';
  if (clean.endsWith('.ogg') || clean.endsWith('.opus')) return 'audio/ogg';
  if (clean.endsWith('.wav')) return 'audio/wav';
  return 'video/mp4';
}

function validCastUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function showCastModal() {
  const connected = Boolean(state.cast.session);
  const castSupport = state.cast.sdkReady
    ? (state.cast.available ? 'Hay dispositivos Google Cast disponibles.' : 'Google Cast está cargado, pero no se detectan dispositivos compatibles en esta red.')
    : 'Google Cast requiere Chrome, Edge u otro navegador compatible y conexión a Internet para cargar el SDK oficial.';
  const airplaySupport = state.cast.airplayAvailable ? 'AirPlay está disponible para el archivo cargado en este dispositivo.' : 'AirPlay no está disponible en este navegador.';
  openModal(`<div class="modal-header"><div class="modal-icon">${svg('cast')}</div><div><h3 id="modalTitle">Transmitir a una pantalla</h3><p>Google Cast · Chromecast · Google TV · AirPlay</p></div><button class="icon-btn" data-close-modal aria-label="Cerrar">${svg('close')}</button></div>
    <div class="modal-body cast-modal-body">
      <div class="cast-capability-grid"><div class="cast-capability ${state.cast.available || connected ? 'ready' : ''}"><strong>Google Cast</strong><p>${escapeHtml(castSupport)}</p></div><div class="cast-capability ${state.cast.airplayAvailable ? 'ready' : ''}"><strong>AirPlay</strong><p>${escapeHtml(airplaySupport)}</p></div></div>
      <div class="warning-box"><strong>Archivos locales:</strong> Chromecast no puede abrir una URL temporal <code>blob:</code>. Usa MediaForge Cast Bridge para crear una dirección privada dentro de tu Wi‑Fi y pégala abajo. AirPlay sí puede aceptar el vídeo local en Safari cuando el sistema lo permite.</div>
      <div class="field full"><label for="castUrlInput">URL del vídeo, audio o stream</label><input class="text-input" id="castUrlInput" inputmode="url" autocomplete="url" value="${escapeAttr(state.cast.lastUrl)}" placeholder="https://…/pelicula.mp4 o http://192.168.1.x:8787/media/…" /></div>
      <div class="form-grid cast-form-grid"><div class="field"><label for="castTitleInput">Título</label><input class="text-input" id="castTitleInput" maxlength="120" value="${escapeAttr(state.cast.lastTitle)}" placeholder="MediaForge 404" /></div><div class="field"><label for="castMimeInput">Formato</label><select class="filter-select" id="castMimeInput"><option value="auto">Detectar automáticamente</option><option value="video/mp4">MP4 / H.264</option><option value="video/webm">WebM</option><option value="application/x-mpegURL">HLS (.m3u8)</option><option value="application/dash+xml">MPEG-DASH (.mpd)</option><option value="audio/mpeg">MP3</option><option value="audio/mp4">M4A / AAC</option><option value="audio/ogg">Ogg / Opus</option></select></div></div>
      <div class="cast-privacy-note">MediaForge solo entrega la URL al dispositivo receptor. No sube el archivo ni actúa como intermediario.</div>
    </div>
    <div class="modal-footer cast-modal-footer"><button class="soft-btn" id="castBridgeGuideBtn">${svg('info')} Cast Bridge</button>${state.cast.airplayAvailable ? `<button class="soft-btn" id="airplayBtn">${svg('cast')} AirPlay</button>` : ''}<button class="primary-btn" id="startCastBtn">${svg('cast')} ${connected ? 'Enviar a TV conectada' : 'Elegir pantalla y enviar'}</button></div>`);
  $('#castMimeInput').value = state.cast.lastMime || 'auto';
  $('#castBridgeGuideBtn').addEventListener('click', openCastBridgeGuide);
  $('#airplayBtn')?.addEventListener('click', showAirPlayPicker);
  $('#startCastBtn').addEventListener('click', castFromModal);
}

function openCastBridgeGuide() {
  openModal(`<div class="modal-header"><div class="modal-icon">${svg('cast')}</div><div><h3 id="modalTitle">MediaForge Cast Bridge</h3><p>Archivos locales por tu red doméstica</p></div><button class="icon-btn" data-close-modal aria-label="Cerrar">${svg('close')}</button></div><div class="modal-body"><ol class="engine-steps"><li>Descarga o abre la carpeta <code>cast-bridge</code> incluida con MediaForge.</li><li>Arrastra el vídeo sobre <code>START_CAST_BRIDGE.bat</code>.</li><li>Windows mostrará una URL temporal y la copiará al portapapeles.</li><li>Pega esa URL en “Transmitir a una pantalla”.</li><li>Mantén la ventana del Bridge abierta mientras ves el contenido.</li></ol><div class="warning-box">El archivo solo se sirve en tu red local mediante una ruta aleatoria. Cierra el Bridge al terminar y no lo uses en redes públicas.</div></div><div class="modal-footer"><a class="soft-btn link-btn" href="./cast-bridge/README.html" target="_blank" rel="noopener">Abrir guía</a><a class="primary-btn link-btn" href="./cast-bridge/MediaForgeCastBridge.py" download>Descargar Bridge</a></div>`);
}

async function castFromModal() {
  const rawUrl = $('#castUrlInput').value.trim();
  const url = validCastUrl(rawUrl);
  if (!url) { toast('URL no válida','Utiliza una dirección HTTP o HTTPS accesible desde el Chromecast.','warning'); $('#castUrlInput').focus(); return; }
  const title = $('#castTitleInput').value.trim() || url.split('/').pop()?.split(/[?#]/)[0] || 'MediaForge 404';
  const mime = inferCastMime(url, $('#castMimeInput').value);
  state.cast.lastUrl = url;
  state.cast.lastTitle = title;
  state.cast.lastMime = $('#castMimeInput').value;
  if (!state.cast.sdkReady) { toast('Google Cast no disponible','Abre MediaForge en Chrome o Edge y comprueba que Internet y la red local estén disponibles.','warning'); return; }
  try {
    const context = cast.framework.CastContext.getInstance();
    if (!context.getCurrentSession()) await context.requestSession();
    const session = context.getCurrentSession();
    if (!session) throw new Error('No se seleccionó ningún dispositivo.');
    const mediaInfo = new chrome.cast.media.MediaInfo(url, mime);
    const metadata = new chrome.cast.media.GenericMediaMetadata();
    metadata.title = title;
    metadata.subtitle = 'MediaForge 404';
    mediaInfo.metadata = metadata;
    mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;
    const localMedia = $('#mediaElement');
    if (Number.isFinite(localMedia.currentTime) && localMedia.currentTime > 0) request.currentTime = localMedia.currentTime;
    await session.loadMedia(request);
    localMedia.pause();
    closeModal();
    syncCastSession();
    toast('Transmitiendo en la TV', `${title} · ${session.getCastDevice?.().friendlyName || 'Google Cast'}`, 'success');
  } catch (error) {
    if (/cancel|cancelled/i.test(error?.message || String(error))) return;
    console.warn('Cast error:', error);
    toast('No se pudo iniciar la transmisión', error?.message || 'Comprueba la URL, el formato y que ambos dispositivos estén en la misma red.', 'error');
  }
}

function showAirPlayPicker() {
  const media = $('#mediaElement');
  if (!state.playlist[state.currentIndex]) { toast('Carga primero un archivo','AirPlay necesita que haya un vídeo o audio abierto en MediaForge.','warning'); return; }
  if (typeof media.webkitShowPlaybackTargetPicker !== 'function') { toast('AirPlay no disponible','Esta función requiere Safari y un dispositivo AirPlay compatible.','warning'); return; }
  closeModal();
  try { media.webkitShowPlaybackTargetPicker(); }
  catch (error) { toast('No se pudo abrir AirPlay', error?.message || 'El navegador bloqueó el selector.','warning'); }
}

function toggleRemotePlayback() {
  const controller = state.cast.remoteController;
  if (!controller) return;
  try { controller.playOrPause(); } catch (error) { toast('Control remoto no disponible', error?.message || 'No se pudo cambiar la reproducción.','warning'); }
}

function seekRemotePlayback() {
  const player = state.cast.remotePlayer;
  const controller = state.cast.remoteController;
  if (!player || !controller || !player.duration) return;
  player.currentTime = (Number($('#castSeek').value) / 1000) * player.duration;
  try { controller.seek(); } catch {}
}

function setRemoteVolume() {
  const player = state.cast.remotePlayer;
  const controller = state.cast.remoteController;
  if (!player || !controller) return;
  player.volumeLevel = Number($('#castVolume').value);
  try { controller.setVolumeLevel(); } catch {}
}

function endCastSession(stopCasting) {
  if (!state.cast.sdkReady) return;
  try {
    cast.framework.CastContext.getInstance().endCurrentSession(Boolean(stopCasting));
    toast(stopCasting ? 'Transmisión detenida' : 'MediaForge desconectado', stopCasting ? 'La reproducción en la TV ha finalizado.' : 'La TV puede continuar reproduciendo de forma independiente.');
  } catch (error) { toast('No se pudo cerrar la sesión', error?.message || 'Inténtalo de nuevo.','warning'); }
}

async function togglePip() {
  const media = $('#mediaElement');
  if (state.playlist[state.currentIndex]?.kind === 'audio') { toast('Picture in Picture','Solo está disponible para vídeo.','warning'); return; }
  try { if (document.pictureInPictureElement) await document.exitPictureInPicture(); else await media.requestPictureInPicture(); } catch { toast('Picture in Picture no disponible','Tu navegador o este archivo no lo permiten.','warning'); }
}
function captureFrame() {
  const media = $('#mediaElement');
  if (!media.videoWidth) { toast('Captura no disponible','Reproduce un vídeo antes de capturar un fotograma.','warning'); return; }
  const canvas = document.createElement('canvas'); canvas.width = media.videoWidth; canvas.height = media.videoHeight;
  canvas.getContext('2d').drawImage(media,0,0);
  canvas.toBlob(blob => downloadBlob(blob, `mediaforge-captura-${Date.now()}.png`), 'image/png');
  toast('Fotograma capturado','La imagen se ha preparado para descargar.','success');
}

async function loadSubtitle(file) {
  if (!file) return;
  try {
    const text = await file.text();
    const vtt = file.name.toLowerCase().endsWith('.srt') ? srtToVtt(text) : text;
    clearSubtitle();
    state.subtitleUrl = URL.createObjectURL(new Blob([vtt], {type:'text/vtt'}));
    const track = document.createElement('track'); track.kind='subtitles'; track.label=file.name; track.srclang='es'; track.src=state.subtitleUrl; track.default=true;
    $('#mediaElement').appendChild(track);
    track.addEventListener('load', () => { track.track.mode='showing'; });
    toast('Subtítulos cargados', file.name, 'success');
  } catch (err) { toast('No se pudieron cargar los subtítulos', err.message, 'error'); }
}
function clearSubtitle() { $$('#mediaElement track').forEach(t=>t.remove()); if (state.subtitleUrl) URL.revokeObjectURL(state.subtitleUrl); state.subtitleUrl=null; }
function srtToVtt(srt) { return 'WEBVTT\n\n' + srt.replace(/\r+/g,'').replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,'$1.$2'); }

function renderPlaylist() {
  const root = $('#playlist');
  $('#queueSummary').textContent = state.playlist.length ? `${state.playlist.length} archivo${state.playlist.length===1?'':'s'}` : 'Sin archivos';
  if (!state.playlist.length) { root.innerHTML='<div class="playlist-empty">Añade varios archivos para crear una cola local.</div>'; return; }
  root.innerHTML = state.playlist.map((item,i) => {
    const pct = item.duration ? clamp((item.progress/item.duration)*100,0,100) : 0;
    return `<div class="track ${i===state.currentIndex?'active':''}" data-track="${i}" tabindex="0"><div class="track-index">${item.kind==='audio'?svg('audio'):svg('media')}</div><div class="track-info"><div class="track-title" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div><div class="track-meta">${formatBytes(item.size)} · ${item.duration?formatTime(item.duration):item.kind.toUpperCase()}</div></div><button class="track-remove" data-remove-track="${i}" aria-label="Quitar">×</button><div class="track-progress"><span style="width:${pct}%"></span></div></div>`;
  }).join('');
  $$('[data-track]',root).forEach(el => { el.addEventListener('click',e=>{ if (!e.target.closest('[data-remove-track]')) loadTrack(Number(el.dataset.track),true); }); el.addEventListener('keydown',e=>{if(e.key==='Enter')loadTrack(Number(el.dataset.track),true);}); });
  $$('[data-remove-track]',root).forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();removeTrack(Number(btn.dataset.removeTrack));}));
}
function removeTrack(index) {
  const item = state.playlist[index]; if (!item) return; URL.revokeObjectURL(item.url); if(item.compatUrl)URL.revokeObjectURL(item.compatUrl);
  state.playlist.splice(index,1);
  if (!state.playlist.length) { state.currentIndex=-1; resetPlayer(); }
  else if (index === state.currentIndex) loadTrack(Math.min(index,state.playlist.length-1),false);
  else if (index < state.currentIndex) state.currentIndex--;
  renderPlaylist();
}
function clearPlaylist() { state.playlist.forEach(i=>{URL.revokeObjectURL(i.url);if(i.compatUrl)URL.revokeObjectURL(i.compatUrl);}); state.playlist=[]; state.currentIndex=-1; resetPlayer(); renderPlaylist(); }
function resetPlayer() { const m=$('#mediaElement');m.pause();m.removeAttribute('src');m.load();$('#emptyStage').classList.remove('hidden');$('#mediaBadge').classList.remove('visible');$('#audioArt').classList.add('hidden');m.classList.remove('hidden');updateTimeline();updatePlayIcon();updateEngineStrip(null);$('#tvNowPlaying').textContent='MEDIAFORGE'; }

async function loadHistory() {
  try { state.history = (await db.getAll('history')).map(normalizeHistoryRecord).sort((a,b)=>(b.lastPlayed||0)-(a.lastPlayed||0)); }
  catch { state.history = []; toast('Biblioteca limitada','No se pudo abrir el almacenamiento local.','warning'); }
}
function normalizeHistoryRecord(record){return {...record,tags:Array.isArray(record?.tags)?record.tags.filter(Boolean):[],collection:record?.collection||'',checksum:record?.checksum||''};}
async function saveHistoryItem(item) {
  const previous=state.history.find(h=>h.id===item.id)||{};
  const record = { id:item.id,name:item.name,size:item.size,type:item.type,kind:item.kind,duration:item.duration||0,width:item.width||0,height:item.height||0,progress:item.progress||0,favorite:!!item.favorite,lastPlayed:Date.now(),tags:Array.isArray(item.tags)?item.tags:(previous.tags||[]),collection:item.collection??previous.collection??'',checksum:item.checksum??previous.checksum??'' };
  const idx=state.history.findIndex(h=>h.id===item.id); if(idx>=0)state.history[idx]=record;else state.history.unshift(record);
  try { await db.put('history',record); } catch {}
  updateLibraryBadge();
}
function updateLibraryBadge(){ if($('#libraryBadge'))$('#libraryBadge').textContent=state.history.length; }
function updateCollectionFilter(){
  const select=$('#libraryCollectionFilter');if(!select)return;
  const current=select.value||'all';const collections=[...new Set(state.history.map(h=>h.collection).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
  select.innerHTML='<option value="all">Todas las colecciones</option>'+collections.map(c=>`<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join('');
  select.value=collections.includes(current)?current:'all';
}
function renderLibrary() {
  const root=$('#libraryList'); if(!root)return;
  updateCollectionFilter();
  const q=($('#librarySearch')?.value||'').trim().toLowerCase();
  const filter=$('#libraryFilter')?.value||'all';
  const collection=$('#libraryCollectionFilter')?.value||'all';
  const sort=$('#librarySort')?.value||'recent';
  let items=state.history.filter(h=>{
    const haystack=[h.name,h.collection,...(h.tags||[])].join(' ').toLowerCase();
    const pct=h.duration?h.progress/h.duration:0;
    const matchesType=filter==='all'||filter==='favorite'&&h.favorite||filter==='unfinished'&&pct>.01&&pct<.97||filter===h.kind;
    return (!q||haystack.includes(q))&&matchesType&&(collection==='all'||h.collection===collection);
  });
  items.sort((a,b)=>sort==='name'?a.name.localeCompare(b.name,'es'):sort==='progress'?((b.duration?b.progress/b.duration:0)-(a.duration?a.progress/a.duration:0)):sort==='size'?(b.size-a.size):((b.lastPlayed||0)-(a.lastPlayed||0)));
  updateLibraryBadge();
  const total=state.history.length,favorites=state.history.filter(h=>h.favorite).length,inProgress=state.history.filter(h=>h.duration&&h.progress>2&&h.progress<h.duration-4).length,collections=new Set(state.history.map(h=>h.collection).filter(Boolean)).size;
  $('#libraryInsights').innerHTML=[['Elementos',total],['En progreso',inProgress],['Favoritos',favorites],['Colecciones',collections]].map(([label,value])=>`<div><strong>${value}</strong><span>${label}</span></div>`).join('');
  if(!items.length){
    const empty=!state.history.length;
    root.innerHTML=empty
      ? `<div class="empty-panel library-empty-state"><div class="empty-library-icon">${svg('library')}</div><h4>Tu biblioteca local está vacía</h4><p>Abre audio o vídeo para guardar el progreso, organizarlo con etiquetas y continuar donde lo dejaste.</p><button class="primary-btn" id="libraryEmptyOpenBtn">${svg('folder')} Abrir primeros archivos</button></div>`
      : `<div class="empty-panel library-empty-state compact"><div class="empty-library-icon">${svg('search')}</div><h4>No hay coincidencias</h4><p>Prueba con otro texto, colección o tipo de contenido.</p><button class="soft-btn" id="libraryResetFiltersBtn">Restablecer filtros</button></div>`;
    $('#libraryEmptyOpenBtn')?.addEventListener('click',openMediaPicker);
    $('#libraryResetFiltersBtn')?.addEventListener('click',()=>{$('#librarySearch').value='';$('#libraryFilter').value='all';$('#libraryCollectionFilter').value='all';$('#librarySort').value='recent';renderLibrary();});
    return;
  }
  root.innerHTML=items.map(h=>{const pct=h.duration?clamp(h.progress/h.duration*100,0,100):0;const tags=(h.tags||[]).slice(0,3);return `<article class="library-item"><div class="library-item-top"><div class="library-icon">${h.kind==='audio'?svg('audio'):svg('media')}</div><div class="library-title"><strong title="${escapeAttr(h.name)}">${escapeHtml(h.name)}</strong><span>${formatBytes(h.size)} · ${h.duration?formatTime(h.duration):'Sin duración'}</span></div><button class="star-btn ${h.favorite?'active':''}" data-favorite="${escapeAttr(h.id)}" aria-label="${h.favorite?'Quitar de favoritos':'Añadir a favoritos'}">${svg('star')}</button></div>${h.collection||tags.length?`<div class="library-badges">${h.collection?`<span class="collection-badge">${escapeHtml(h.collection)}</span>`:''}${tags.map(t=>`<span>#${escapeHtml(t)}</span>`).join('')}</div>`:''}<div class="library-progress"><span style="width:${pct}%"></span></div><div class="library-progress-label"><span>${pct>1?`${Math.round(pct)}% visto`:'Sin empezar'}</span>${h.progress>2?`<span>Reanudar en ${formatTime(h.progress)}</span>`:''}</div><div class="library-actions"><button class="soft-btn" data-library-open="${escapeAttr(h.id)}">${h.progress>2?'Reanudar':'Abrir'}</button><button class="soft-btn" data-library-edit="${escapeAttr(h.id)}">Organizar</button><button class="danger-btn" data-history-delete="${escapeAttr(h.id)}">Eliminar</button></div></article>`;}).join('');
  $$('[data-favorite]',root).forEach(b=>b.addEventListener('click',()=>toggleFavorite(b.dataset.favorite)));
  $$('[data-library-open]',root).forEach(b=>b.addEventListener('click',()=>openHistoryItem(b.dataset.libraryOpen)));
  $$('[data-library-edit]',root).forEach(b=>b.addEventListener('click',()=>editLibraryItem(b.dataset.libraryEdit)));
  $$('[data-history-delete]',root).forEach(b=>b.addEventListener('click',()=>deleteHistoryItem(b.dataset.historyDelete)));
}
async function toggleFavorite(id){const h=state.history.find(x=>x.id===id);if(!h)return;const previous=h.favorite;h.favorite=!h.favorite;try{await db.put('history',h);const p=state.playlist.find(x=>x.id===id);if(p)p.favorite=h.favorite;renderLibrary();}catch{h.favorite=previous;toast('No se pudo guardar el favorito','El almacenamiento local no está disponible.','warning');}}
function editLibraryItem(id){
  const item=state.history.find(x=>x.id===id);if(!item)return;
  openModal(`<div class="modal-header"><div class="modal-icon">${svg('library')}</div><div><h3 id="modalTitle">Organizar elemento</h3><p>${escapeHtml(item.name)}</p></div><button class="icon-btn" data-close-modal aria-label="Cerrar">${svg('close')}</button></div><div class="modal-body"><div class="form-grid"><div class="field full"><label for="editCollection">Colección</label><input class="text-input" id="editCollection" maxlength="60" value="${escapeAttr(item.collection||'')}" placeholder="Ej. Películas, Música, Proyectos" /></div><div class="field full"><label for="editTags">Etiquetas</label><input class="text-input" id="editTags" maxlength="180" value="${escapeAttr((item.tags||[]).join(', '))}" placeholder="acción, 4K, trabajo…" /><small>Separa las etiquetas con comas. Máximo 12.</small></div></div></div><div class="modal-footer"><button class="soft-btn" data-close-modal>Cancelar</button><button class="primary-btn" id="saveLibraryMetaBtn">Guardar</button></div>`);
  $('#saveLibraryMetaBtn').addEventListener('click',async()=>{const collection=$('#editCollection').value.trim().slice(0,60);const tags=[...new Set($('#editTags').value.split(',').map(t=>t.trim()).filter(Boolean))].slice(0,12);item.collection=collection;item.tags=tags;const playlistItem=state.playlist.find(x=>x.id===id);if(playlistItem){playlistItem.collection=collection;playlistItem.tags=tags;}try{await db.put('history',item);closeModal();renderLibrary();toast('Biblioteca actualizada','Colección y etiquetas guardadas.','success');}catch{toast('No se pudo guardar','El almacenamiento local no está disponible.','error');}});
}
function openLibraryExportModal(){
  if(!state.history.length){toast('Biblioteca vacía','No hay datos que exportar.','warning');return;}
  openModal(`<div class="modal-header"><div class="modal-icon">${svg('download')}</div><div><h3 id="modalTitle">Exportar biblioteca</h3><p>Copia de seguridad de metadatos, sin incluir archivos multimedia</p></div><button class="icon-btn" data-close-modal>${svg('close')}</button></div><div class="modal-body"><p>Elige JSON para conservar todos los campos o CSV para abrir la lista en Excel y otras herramientas.</p></div><div class="modal-footer"><button class="soft-btn" id="exportLibraryCsvBtn">CSV</button><button class="primary-btn" id="exportLibraryJsonBtn">JSON</button></div>`);
  $('#exportLibraryJsonBtn').addEventListener('click',()=>exportLibrary('json'));$('#exportLibraryCsvBtn').addEventListener('click',()=>exportLibrary('csv'));
}
function exportLibrary(format){
  const records=state.history.map(({id,...h})=>({...h,progressPercent:h.duration?Math.round(h.progress/h.duration*100):0}));
  if(format==='csv'){
    const columns=['name','kind','size','duration','progress','progressPercent','favorite','collection','tags','lastPlayed'];
    const quote=v=>`"${String(v??'').replace(/"/g,'""')}"`;const rows=[columns.join(','),...records.map(r=>columns.map(c=>quote(c==='tags'?(r.tags||[]).join('|'):r[c])).join(','))];
    downloadBlob(new Blob(['\ufeff'+rows.join('\n')],{type:'text/csv;charset=utf-8'}),'mediaforge404-biblioteca.csv');
  }else downloadBlob(new Blob([JSON.stringify({schema:'mediaforge-library-v1',exportedAt:new Date().toISOString(),records},null,2)],{type:'application/json'}),'mediaforge404-biblioteca.json');
  closeModal();toast('Biblioteca exportada',format.toUpperCase()+' preparado.','success');
}
async function deleteHistoryItem(id){const previous=[...state.history];state.history=state.history.filter(h=>h.id!==id);try{await db.delete('history',id);await db.delete('handles',id);renderLibrary();}catch{state.history=previous;renderLibrary();toast('No se pudo eliminar','El almacenamiento local no está disponible.','warning');}}
async function openHistoryItem(id){
  const existing=state.playlist.findIndex(x=>x.id===id);if(existing>=0){switchView('player');loadTrack(existing,true);return;}
  try{
    const stored=await db.get('handles',id);if(stored?.handle){let permission=await stored.handle.queryPermission?.({mode:'read'});if(permission!=='granted')permission=await stored.handle.requestPermission?.({mode:'read'});if(permission==='granted'){const file=await stored.handle.getFile();await addFiles([file],[stored.handle]);switchView('player');return;}}
  }catch{}
  toast('Necesita volver a abrirse','Por privacidad, selecciona de nuevo el archivo original.','warning');openMediaPicker();
}

async function ensureAudioGraph(){
  if(state.audio.context)return;
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  try{
    const ctx=new AC();const source=ctx.createMediaElementSource($('#mediaElement'));const frequencies=[60,170,350,1000,3500,10000];
    const filters=frequencies.map((frequency,i)=>{const f=ctx.createBiquadFilter();f.type=i===0?'lowshelf':i===frequencies.length-1?'highshelf':'peaking';f.frequency.value=frequency;f.Q.value=1;f.gain.value=0;return f;});
    const analyser=ctx.createAnalyser();analyser.fftSize=256;analyser.smoothingTimeConstant=.82;
    const gain=ctx.createGain();gain.gain.value=1;
    const panner=ctx.createStereoPanner?ctx.createStereoPanner():null;
    const compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-18;compressor.knee.value=20;compressor.ratio.value=3;compressor.attack.value=.02;compressor.release.value=.25;
    let node=source;filters.forEach(f=>{node.connect(f);node=f;});node.connect(analyser);analyser.connect(gain);node=gain;if(panner){node.connect(panner);node=panner;}node.connect(compressor);compressor.connect(ctx.destination);
    Object.assign(state.audio,{context:ctx,source,filters,analyser,gain,panner,compressor});applyEqPreset(state.settings.eqPreset||'Plano',false);updateAudioControls();
  }catch(err){toast('Audio Lab no disponible',err.message,'warning');}
}
const eqPresets={Plano:[0,0,0,0,0,0],Música:[4,2,0,1,3,4],Cine:[5,2,-1,1,4,3],Voz:[-4,-2,1,5,4,-1],Noche:[-2,-1,0,2,1,-2],Graves:[8,6,3,0,-1,-2]};
async function applyEqPreset(name,notify=true){await ensureAudioGraph();const values=eqPresets[name]||eqPresets.Plano;$$('.eq-slider').forEach((input,i)=>{input.value=values[i];updateRange(input,(Number(input.value)+12)/24*100);$(`#eqOut${i}`).textContent=`${values[i]>0?'+':''}${values[i]} dB`;if(state.audio.filters[i])state.audio.filters[i].gain.setTargetAtTime(state.audio.enabled?values[i]:0,state.audio.context.currentTime,.03);});$$('.preset-chip').forEach(b=>b.classList.toggle('active',b.dataset.preset===name));state.settings.eqPreset=name;saveSettings();if(notify)toast('Preset aplicado',name,'success');}
async function updateEq(e){await ensureAudioGraph();const i=Number(e.target.dataset.index);const value=Number(e.target.value);$(`#eqOut${i}`).textContent=`${value>0?'+':''}${value} dB`;updateRange(e.target,(value+12)/24*100);state.audio.filters[i]?.gain.setTargetAtTime(state.audio.enabled?value:0,state.audio.context.currentTime,.02);$$('.preset-chip').forEach(b=>b.classList.remove('active'));}
async function updateAudioControls(){await ensureAudioGraph();const gain=Number($('#gainRange').value);const pan=Number($('#panRange').value);$('#gainOut').textContent=`${Math.round(gain*100)}%`;$('#panOut').textContent=Math.abs(pan)<.05?'Centro':`${pan<0?'Izq.':'Der.'} ${Math.round(Math.abs(pan)*100)}%`;updateRange($('#gainRange'),gain/2*100);updateRange($('#panRange'),(pan+1)/2*100);if(state.audio.gain)state.audio.gain.gain.setTargetAtTime(state.audio.enabled?gain:1,state.audio.context.currentTime,.03);if(state.audio.panner)state.audio.panner.pan.setTargetAtTime(state.audio.enabled?pan:0,state.audio.context.currentTime,.03);}
function toggleCompressor(){state.audio.compressorOn=!state.audio.compressorOn;const btn=$('#compressorToggle');btn.classList.toggle('on',state.audio.compressorOn);btn.setAttribute('aria-checked',String(state.audio.compressorOn));if(state.audio.compressor){state.audio.compressor.threshold.setTargetAtTime(state.audio.compressorOn?-18:0,state.audio.context.currentTime,.03);state.audio.compressor.ratio.setTargetAtTime(state.audio.compressorOn?3:1,state.audio.context.currentTime,.03);}}
function toggleAudioLab(){state.audio.enabled=!state.audio.enabled;const btn=$('#audioToggle');btn.classList.toggle('on',state.audio.enabled);btn.setAttribute('aria-checked',String(state.audio.enabled));const now=state.audio.context?.currentTime||0;$$('.eq-slider').forEach((input,i)=>state.audio.filters[i]?.gain.setTargetAtTime(state.audio.enabled?Number(input.value):0,now,.03));if(!state.audio.enabled){state.audio.gain?.gain.setTargetAtTime(1,now,.03);state.audio.panner?.pan.setTargetAtTime(0,now,.03);}else updateAudioControls();}
function setupVisualizer(){const canvas=$('#visualizer');const ctx=canvas.getContext('2d');const draw=()=>{state.audio.frame=requestAnimationFrame(draw);resizeVisualizer();const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==w*dpr||canvas.height!==h*dpr){canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}ctx.clearRect(0,0,w,h);const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,'rgba(46,230,214,.72)');grad.addColorStop(1,'rgba(90,167,255,.05)');const data=new Uint8Array(state.audio.analyser?.frequencyBinCount||64);if(state.audio.analyser)state.audio.analyser.getByteFrequencyData(data);const gap=3;const bw=Math.max(2,(w-(data.length-1)*gap)/data.length);data.forEach((v,i)=>{const bh=state.audio.analyser?Math.max(3,(v/255)*(h*.72)):3+(Math.sin(Date.now()/900+i*.5)+1)*1.5;const x=i*(bw+gap),y=h-bh-18;ctx.fillStyle=grad;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,bw,bh,3);else ctx.rect(x,y,bw,bh);ctx.fill();});ctx.strokeStyle='rgba(127,189,224,.08)';ctx.beginPath();ctx.moveTo(0,h-17.5);ctx.lineTo(w,h-17.5);ctx.stroke();};draw();}
function resizeVisualizer(){/* canvas is resized in animation loop */}

function setConverterFile(file){if(!file)return;state.converterFile=file;$('#converterWell').classList.add('has-file');$('#converterWell').innerHTML=`<div class="selected-file"><div class="file-glyph">${svg('file')}</div><div class="file-data"><strong>${escapeHtml(file.name)}</strong><span>${formatBytes(file.size)} · ${escapeHtml(file.type||'tipo desconocido')}</span></div><button class="icon-btn" id="changeConverterBtn" aria-label="Cambiar">${svg('reset')}</button></div>`;$('#changeConverterBtn').addEventListener('click',()=>$('#converterInput').click());$('#convertBtn').disabled=false;if(file.size>800*1024*1024)toast('Archivo muy grande','La conversión en navegador podría agotar la memoria.','warning');}
async function ensureFFmpeg(){
  if(state.ffmpegLoaded)return state.ffmpeg;
  if(state.ffmpegBusy)throw new Error('El motor ya está ocupado.');
  state.ffmpegBusy=true;$('#ffmpegStatus').innerHTML='<strong>Cargando FFmpeg…</strong> Preparando el núcleo WebAssembly local.';
  const ffmpeg=new FFmpeg();state.ffmpegLogs=[];
  ffmpeg.on('log',({message})=>{state.ffmpegLogs.push(message);if(state.ffmpegLogs.length>120)state.ffmpegLogs.shift();const log=$('#convertLog');if(log){log.textContent=state.ffmpegLogs.slice(-18).join('\n');log.scrollTop=log.scrollHeight;}});
  ffmpeg.on('progress',({progress})=>{const pct=clamp(Math.round(progress*100),0,100);setConvertProgress(pct,'Procesando…');setUniversalProgress(pct,'Procesando localmente…');});
  const base='https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd/';
  try{await ffmpeg.load({coreURL:`${base}ffmpeg-core.js`,wasmURL:`${base}ffmpeg-core.wasm`});state.ffmpeg=ffmpeg;state.ffmpegLoaded=true;$('#ffmpegStatus').innerHTML='<strong>FFmpeg listo.</strong> El motor se descargó bajo demanda; tus archivos siguen procesándose localmente.';return ffmpeg;}
  catch(err){$('#ffmpegStatus').innerHTML='<strong>No se pudo cargar FFmpeg.</strong> Comprueba que la app se ejecuta por HTTPS o servidor local.';throw err;}
  finally{state.ffmpegBusy=false;}
}
async function runConversion(){
  const file=state.converterFile;if(!file||state.ffmpegBusy)return;
  $('#convertBtn').disabled=true;$('#cancelConvertBtn').disabled=false;$('#convertProgress').classList.add('visible');setConvertProgress(1,'Cargando motor…');
  let input='',output='';
  try{
    const ffmpeg=await ensureFFmpeg();if(state.ffmpegBusy)throw new Error('El motor ya está ocupado.');state.ffmpegBusy=true;state.ffmpegLogs=[];
    const ext=(file.name.split('.').pop()||'bin').replace(/[^a-z0-9]/gi,'');input=`input-${Date.now()}.${ext}`;
    const preset=$('#convertPreset').value;const config=conversionArgs(preset,input);output=config.output;const {args,mime}=config;
    const start=Number($('#trimStart').value);const end=Number($('#trimEnd').value);const trim=[];
    if(Number.isFinite(start)&&start>0)trim.push('-ss',String(start));trim.push('-i',input);
    if(Number.isFinite(end)&&end>0){const duration=start>0?end-start:end;if(duration<=0)throw new Error('El final debe ser mayor que el inicio.');trim.push('-t',String(duration));}
    await ffmpeg.writeFile(input,await fetchFile(file));setConvertProgress(5,'Convirtiendo…');
    const code=await ffmpeg.exec(['-y',...trim,...args,output]);if(code!==0)throw new Error(`FFmpeg terminó con código ${code}.`);
    const data=await ffmpeg.readFile(output);downloadBlob(new Blob([data],{type:mime}),output);setConvertProgress(100,'Completado');toast('Conversión completada',output,'success');
  }catch(err){toast('La conversión no pudo completarse',friendlyFfmpegError(err),'error');$('#progressLabel').textContent='Error';}
  finally{
    try{if(input)await state.ffmpeg?.deleteFile(input);if(output)await state.ffmpeg?.deleteFile(output);}catch{}
    state.ffmpegBusy=false;$('#convertBtn').disabled=false;$('#cancelConvertBtn').disabled=true;
  }
}

function conversionArgs(preset,input){const stem=safeStem(state.converterFile?.name||'media');switch(preset){case'compress':return{args:['-c:v','libx264','-preset','ultrafast','-crf','32','-vf','scale=1280:-2:force_original_aspect_ratio=decrease','-c:a','aac','-b:a','128k','-movflags','+faststart'],output:`${stem}-comprimido.mp4`,mime:'video/mp4'};case'webm':return{args:['-c:v','libvpx-vp9','-deadline','realtime','-cpu-used','8','-b:v','0','-crf','38','-c:a','libopus'],output:`${stem}.webm`,mime:'video/webm'};case'mp3':return{args:['-vn','-c:a','libmp3lame','-q:a','3'],output:`${stem}.mp3`,mime:'audio/mpeg'};case'wav':return{args:['-vn','-c:a','pcm_s16le'],output:`${stem}.wav`,mime:'audio/wav'};case'gif':return{args:['-vf','fps=12,scale=720:-1:flags=lanczos'],output:`${stem}.gif`,mime:'image/gif'};case'remux':return{args:['-c','copy'],output:`${stem}-remux.mp4`,mime:'video/mp4'};default:return{args:['-c:v','libx264','-preset','ultrafast','-crf','27','-c:a','aac','-movflags','+faststart'],output:`${stem}.mp4`,mime:'video/mp4'};}}
function setConvertProgress(pct,label){$('#progressBar').style.width=`${pct}%`;$('#progressPercent').textContent=`${pct}%`;$('#progressLabel').textContent=label;}
function cancelConversion(){if(!state.ffmpegBusy)return;try{state.ffmpeg?.terminate();}catch{}state.ffmpeg=null;state.ffmpegLoaded=false;state.ffmpegBusy=false;$('#cancelConvertBtn').disabled=true;$('#convertBtn').disabled=false;$('#ffmpegStatus').innerHTML='<strong>Motor detenido.</strong> Se volverá a cargar en la próxima operación.';toast('Conversión cancelada','El motor se ha detenido.','warning');}

async function inspectFile(file){
  if(!file)return;state.inspectorFile=file;
  $('#inspectName').textContent=file.name;$('#inspectSubtitle').textContent=`${formatBytes(file.size)} · ${file.type||'tipo no declarado'}`;
  ['deepInspectBtn','checksumBtn','validateMediaBtn','repairMediaBtn','exportInspectBtn','exportInspectTxtBtn'].forEach(id=>$('#'+id).disabled=false);
  $('#deepOutput').textContent='El análisis profundo todavía no se ha ejecutado.';$('#validationOutput').textContent='Sin validación.';
  const metadata=await basicMetadata(file);const profile=compatibilityProfile(file);metadata['Ruta U404']=profile.label;
  state.inspectorMetadata=metadata;state.inspectorReport={schema:'mediaforge-inspector-v2',appVersion:'4.1.0',generatedAt:new Date().toISOString(),file:{name:file.name,size:file.size,type:file.type||mimeFromName(file.name),lastModified:new Date(file.lastModified).toISOString(),kind:getKind(file)},basic:metadata,compatibility:profile,checksum:null,probe:null,validation:null,repair:null};
  renderMetadata(metadata);renderDiagnosticCards();
  const support=canPlay(file);const banner=$('#compatBanner');$('.signal',banner).style.background=support==='probably'?'var(--ok)':support==='maybe'?'var(--warning)':'var(--danger)';$('strong',banner).textContent=support==='probably'?'Compatible según el navegador':support==='maybe'?'Compatibilidad posible':'Compatibilidad no confirmada';$('p',banner).textContent=support==='no'?'El motor U404 puede intentar remultiplexar o crear una copia compatible. El análisis profundo identificará las pistas.':'El resultado depende también del códec interno del contenedor. U404 conserva el original intacto.';
}
async function basicMetadata(file){
  const kind=getKind(file);const meta={Nombre:file.name,Tamaño:formatBytes(file.size),'Tamaño exacto':`${file.size.toLocaleString('es-ES')} bytes`,Tipo:file.type||'No declarado',Extensión:(file.name.split('.').pop()||'—').toUpperCase(),'Última modificación':new Date(file.lastModified).toLocaleString('es-ES'),Categoría:kind==='audio'?'Audio':'Vídeo',Duración:'—',Resolución:'—','Relación de aspecto':'—','Bitrate estimado':'—','Compatibilidad declarada':canPlay(file)};
  let url='';try{const probe=document.createElement(kind==='audio'?'audio':'video');probe.preload='metadata';url=URL.createObjectURL(file);await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Tiempo agotado')),7000);probe.onloadedmetadata=()=>{clearTimeout(timer);resolve();};probe.onerror=()=>{clearTimeout(timer);reject(probe.error);};probe.src=url;});meta.Duración=formatTime(probe.duration);if(kind==='video'&&probe.videoWidth){meta.Resolución=`${probe.videoWidth} × ${probe.videoHeight}`;meta['Relación de aspecto']=aspectRatio(probe.videoWidth,probe.videoHeight);}if(probe.duration)meta['Bitrate estimado']=`${Math.round(file.size*8/probe.duration/1000).toLocaleString('es-ES')} kb/s`;}catch{}finally{if(url)URL.revokeObjectURL(url);}return meta;
}
function renderMetadata(meta){$('#metadataGrid').innerHTML=Object.entries(meta).map(([k,v])=>`<div class="meta-item"><label>${escapeHtml(k)}</label><strong title="${escapeAttr(String(v))}">${escapeHtml(String(v))}</strong></div>`).join('');}
function renderDiagnosticCards(){
  const r=state.inspectorReport;if(!r){$('#diagnosticCards').innerHTML='<div class="diagnostic-card neutral"><span>Estado</span><strong>Esperando archivo</strong><small>Selecciona un vídeo o audio.</small></div>';return;}
  const support=r.compatibility?.level||'maybe';const validation=r.validation;const streamCount=r.probe?.streams?.length||0;const cards=[
    ['Compatibilidad',support==='native'?'Nativa':support==='maybe'?'Probable':'Conversión recomendada',r.compatibility?.detail||'',support==='native'?'ok':support==='maybe'?'warn':'danger'],
    ['Pistas',streamCount||'—',streamCount?`${r.probe.streams.filter(x=>x.type==='Video').length} vídeo · ${r.probe.streams.filter(x=>x.type==='Audio').length} audio · ${r.probe.streams.filter(x=>x.type==='Subtitle').length} subtítulos`:'Ejecuta el análisis profundo','neutral'],
    ['Integridad',validation?validation.status:'Sin validar',validation?.summary||'Ejecuta la validación FFmpeg',validation?.status==='Correcto'?'ok':validation?'warn':'neutral'],
    ['Huella SHA-256',r.checksum?'Calculada':'Pendiente',r.checksum?r.checksum.slice(0,16)+'…':'Verifica que el archivo no cambie',r.checksum?'ok':'neutral']
  ];
  $('#diagnosticCards').innerHTML=cards.map(([label,value,desc,cls])=>`<div class="diagnostic-card ${cls}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong><small>${escapeHtml(desc)}</small></div>`).join('');
}
function useCurrentForInspector(){const item=state.playlist[state.currentIndex];if(!item){toast('No hay archivo actual','Abre o reproduce un archivo primero.','warning');return;}inspectFile(item.file);}
async function calculateChecksum(){
  const file=state.inspectorFile;if(!file)return;if(!crypto.subtle){toast('SHA-256 no disponible','Este navegador no ofrece Web Crypto.','error');return;}if(file.size>512*1024*1024){toast('Archivo demasiado grande','La huella SHA-256 en navegador está limitada a 512 MB para evitar agotar la memoria.','warning');return;}
  const btn=$('#checksumBtn');btn.disabled=true;btn.innerHTML=`${svg('shield')} Calculando…`;
  try{const hash=await crypto.subtle.digest('SHA-256',await file.arrayBuffer());const value=[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');state.inspectorReport.checksum=value;state.inspectorMetadata['SHA-256']=value;const h=state.history.find(x=>x.id===`${file.name}|${file.size}|${file.lastModified}`);if(h){h.checksum=value;db.put('history',h).catch(()=>{});}renderMetadata(state.inspectorMetadata);renderDiagnosticCards();toast('Huella calculada','SHA-256 añadido al informe.','success');}catch(err){toast('No se pudo calcular la huella',err.message||'Error de memoria.','error');}finally{btn.disabled=false;btn.innerHTML=`${svg('shield')} SHA-256`;}
}
async function deepInspect(){
  const file=state.inspectorFile;if(!file||state.ffmpegBusy)return;$('#deepInspectBtn').disabled=true;$('#deepOutput').textContent='Cargando FFmpeg y consultando ffprobe…';let input='',output='';
  try{
    const ffmpeg=await ensureFFmpeg();if(state.ffmpegBusy)throw new Error('El motor está ocupado.');state.ffmpegBusy=true;state.ffmpegLogs=[];
    const ext=(file.name.split('.').pop()||'bin').replace(/[^a-z0-9]/gi,'');input=`inspect-${Date.now()}.${ext}`;output=`probe-${Date.now()}.json`;
    await ffmpeg.writeFile(input,await fetchFile(file));let report=null;
    if(typeof ffmpeg.ffprobe==='function'){
      try{
        const code=await ffmpeg.ffprobe(['-v','error','-show_format','-show_streams','-of','json',input,'-o',output]);
        if(code===0){const json=await ffmpeg.readFile(output,'utf8');report=normalizeFfprobeJson(JSON.parse(json));}
      }catch(error){console.warn('ffprobe JSON no disponible; se usará el analizador FFmpeg.',error);}
    }
    if(!report){
      state.ffmpegLogs=[];
      await ffmpeg.exec(['-hide_banner','-i',input,'-t','0','-f','null','-']);
      report=parseFfmpegProbe(state.ffmpegLogs);
    }
    state.inspectorReport.probe=report;const readable=formatProbeReport(report);$('#deepOutput').textContent=readable;Object.assign(state.inspectorMetadata,probeMetadata(report));renderMetadata(state.inspectorMetadata);renderDiagnosticCards();toast('Análisis completado',`${report.streams.length} pista${report.streams.length===1?'':'s'} detectada${report.streams.length===1?'':'s'}.`,'success');
  }catch(err){const msg=friendlyFfmpegError(err);$('#deepOutput').textContent=`No se pudo completar el análisis profundo:\n${msg}`;toast('Análisis incompleto',msg,'error');}
  finally{try{if(input)await state.ffmpeg?.deleteFile(input);if(output)await state.ffmpeg?.deleteFile(output);}catch{}state.ffmpegBusy=false;$('#deepInspectBtn').disabled=false;}
}
function normalizeFfprobeJson(data){
  const format=data?.format||{};const streams=(data?.streams||[]).map(stream=>{
    const type=String(stream.codec_type||'data');const normalized=type[0].toUpperCase()+type.slice(1);
    const fps=parseFrameRate(stream.avg_frame_rate||stream.r_frame_rate);const resolution=stream.width&&stream.height?`${stream.width}x${stream.height}`:null;
    const codec=stream.codec_long_name||stream.codec_name||'Desconocido';const details=[stream.codec_name,stream.profile,resolution,fps?`${fps} fps`:null,stream.sample_rate?`${stream.sample_rate} Hz`:null,stream.channels?`${stream.channels} canales`:null,stream.bit_rate?`${Math.round(Number(stream.bit_rate)/1000)} kb/s`:null].filter(Boolean).join(' · ');
    return{index:stream.index,type:normalized,codec,codecName:stream.codec_name||null,profile:stream.profile||null,details,fps,resolution,language:stream.tags?.language||null,channels:stream.channels||null,sampleRate:stream.sample_rate||null,bitRate:stream.bit_rate||null,pixelFormat:stream.pix_fmt||null,colorSpace:stream.color_space||null,colorTransfer:stream.color_transfer||null,disposition:stream.disposition||{},tags:stream.tags||{}};
  });
  return{container:format.format_long_name||format.format_name||'No identificado',containerShort:format.format_name||null,duration:format.duration?formatTime(Number(format.duration)):'No disponible',durationSeconds:Number(format.duration)||null,bitrate:format.bit_rate?`${Math.round(Number(format.bit_rate)/1000).toLocaleString('es-ES')} kb/s`:'No disponible',size:Number(format.size)||null,startTime:Number(format.start_time)||0,streams,tags:format.tags||{},raw:data};
}
function parseFrameRate(value){if(!value||value==='0/0')return null;const [a,b]=String(value).split('/').map(Number);const n=b?a/b:a;if(!Number.isFinite(n)||n<=0)return null;return Number(n.toFixed(3));}
function parseFfmpegProbe(logs){
  const lines=[...logs];const text=lines.join('\n');const container=text.match(/Input #0,\s*([^,]+),\s*from/i)?.[1]?.trim()||'No identificado';const duration=text.match(/Duration:\s*([^,]+),/)?.[1]?.trim()||'No disponible';const bitrate=text.match(/bitrate:\s*([^\n,]+)/i)?.[1]?.trim()||'No disponible';const streams=[];
  for(const line of lines){const m=line.match(/Stream #\d+:\d+(?:\([^)]*\))?(?:\[[^\]]+\])?:\s*(Video|Audio|Subtitle|Data|Attachment):\s*(.+)/i);if(!m)continue;const type=m[1][0].toUpperCase()+m[1].slice(1).toLowerCase();const details=m[2].trim();const codec=details.split(/[,(]/)[0].trim();const fps=details.match(/(\d+(?:\.\d+)?)\s*fps/i)?.[1]||null;const resolution=details.match(/(\d{2,5}x\d{2,5})/)?.[1]||null;const language=line.match(/\(([^)]+)\)/)?.[1]||null;streams.push({type,codec,details,fps,resolution,language});}
  return{container,duration,bitrate,streams,raw:lines.slice(-80).join('\n')};
}

function probeMetadata(report){const video=report.streams.filter(s=>s.type==='Video'),audio=report.streams.filter(s=>s.type==='Audio'),subs=report.streams.filter(s=>s.type==='Subtitle');return{Contenedor:report.container,'Duración FFmpeg':report.duration,'Bitrate FFmpeg':report.bitrate,'Códec de vídeo':video.map(s=>s.codec).join(', ')||'—','Códec de audio':audio.map(s=>s.codec).join(', ')||'—',FPS:video.map(s=>s.fps).filter(Boolean).join(', ')||'—','Pistas de subtítulos':String(subs.length),'Total de pistas':String(report.streams.length)};}
function formatProbeReport(report){const lines=[`Contenedor: ${report.container}`,`Duración: ${report.duration}`,`Bitrate: ${report.bitrate}`,''];if(!report.streams.length)lines.push('No se detectaron pistas estructuradas.');else report.streams.forEach((s,i)=>lines.push(`${i+1}. ${s.type} · ${s.codec}${s.resolution?` · ${s.resolution}`:''}${s.fps?` · ${s.fps} fps`:''}${s.language?` · ${s.language}`:''}\n   ${s.details}`));return lines.join('\n');}
async function validateMedia(){
  const file=state.inspectorFile;if(!file||state.ffmpegBusy)return;$('#validateMediaBtn').disabled=true;$('#validationOutput').textContent='Validando todas las pistas…';let input='';
  try{const ffmpeg=await ensureFFmpeg();if(state.ffmpegBusy)throw new Error('El motor está ocupado.');state.ffmpegBusy=true;state.ffmpegLogs=[];const ext=(file.name.split('.').pop()||'bin').replace(/[^a-z0-9]/gi,'');input=`validate-${Date.now()}.${ext}`;await ffmpeg.writeFile(input,await fetchFile(file));const code=await ffmpeg.exec(['-v','error','-err_detect','careful','-i',input,'-map','0','-f','null','-']);const issues=state.ffmpegLogs.filter(l=>l.trim()&&!/size=|time=|speed=/.test(l));const ok=code===0&&!issues.length;const validation={status:ok?'Correcto':issues.length?'Advertencias':'No concluyente',summary:ok?'No se detectaron errores de lectura.':issues.length?`${issues.length} aviso${issues.length===1?'':'s'} detectado${issues.length===1?'':'s'}.`:`FFmpeg terminó con código ${code}.`,code,issues,checkedAt:new Date().toISOString()};state.inspectorReport.validation=validation;$('#validationOutput').textContent=ok?'VALIDACIÓN CORRECTA\nFFmpeg ha leído todas las pistas sin errores declarados.':`${validation.status.toUpperCase()}\n${issues.join('\n')||`Código de salida: ${code}`}`;renderDiagnosticCards();toast(ok?'Archivo validado':'Validación completada',validation.summary,ok?'success':'warning');}catch(err){const msg=friendlyFfmpegError(err);$('#validationOutput').textContent=`No se pudo validar:\n${msg}`;toast('Validación fallida',msg,'error');}finally{try{if(input)await state.ffmpeg?.deleteFile(input);}catch{}state.ffmpegBusy=false;$('#validateMediaBtn').disabled=false;}
}
function confirmRepairMedia(){
  const file=state.inspectorFile;if(!file)return;openModal(`<div class="modal-header"><div class="modal-icon">${svg('magic')}</div><div><h3 id="modalTitle">Reparar contenedor</h3><p>Reconstrucción local sin modificar el original</p></div><button class="icon-btn" data-close-modal>${svg('close')}</button></div><div class="modal-body"><p>MediaForge intentará regenerar marcas de tiempo, índice y metadatos mediante remultiplexado. Puede recuperar archivos con estructura dañada, pero no reconstruye fotogramas o audio perdidos.</p><div class="warning-box">El resultado será una copia nueva. Conserva siempre el archivo original.</div></div><div class="modal-footer"><button class="soft-btn" data-close-modal>Cancelar</button><button class="primary-btn" id="startRepairBtn">Iniciar reparación</button></div>`);$('#startRepairBtn').addEventListener('click',()=>{closeModal();repairMedia();});
}
async function repairMedia(){
  const file=state.inspectorFile;if(!file||state.ffmpegBusy)return;$('#repairMediaBtn').disabled=true;$('#validationOutput').textContent='Reconstruyendo el contenedor…';let input='',output='';
  try{const ffmpeg=await ensureFFmpeg();if(state.ffmpegBusy)throw new Error('El motor está ocupado.');state.ffmpegBusy=true;state.ffmpegLogs=[];const ext=(file.name.split('.').pop()||'bin').replace(/[^a-z0-9]/gi,'').toLowerCase();input=`repair-${Date.now()}.${ext||'bin'}`;await ffmpeg.writeFile(input,await fetchFile(file));const stem=safeStem(file.name);const isAudio=getKind(file)==='audio';const mp4Safe=/^(mp4|mov|m4v|3gp)$/.test(ext);output=isAudio?`${stem}-reparado.mka`:mp4Safe?`${stem}-reparado.mp4`:`${stem}-reparado.mkv`;let args=['-y','-fflags','+genpts+discardcorrupt','-err_detect','ignore_err','-i',input,'-map','0','-c','copy'];if(mp4Safe&&!isAudio)args.push('-movflags','+faststart');args.push(output);let code=await ffmpeg.exec(args);if(code!==0&&mp4Safe&&!isAudio){try{await ffmpeg.deleteFile(output);}catch{}output=`${stem}-reparado.mkv`;code=await ffmpeg.exec(['-y','-fflags','+genpts+discardcorrupt','-err_detect','ignore_err','-i',input,'-map','0','-c','copy',output]);}if(code!==0)throw new Error(`FFmpeg terminó con código ${code}.`);const data=await ffmpeg.readFile(output);const mime=output.endsWith('.mp4')?'video/mp4':output.endsWith('.mka')?'audio/x-matroska':'video/x-matroska';const blob=new Blob([data],{type:mime});downloadBlob(blob,output);state.inspectorReport.repair={status:'Generado',output,size:blob.size,createdAt:new Date().toISOString()};$('#validationOutput').textContent=`COPIA REPARADA GENERADA\n${output}\n${formatBytes(blob.size)}\n\nSe han regenerado el contenedor, las marcas de tiempo y el índice cuando ha sido posible.`;toast('Copia reparada preparada',output,'success');}catch(err){const msg=friendlyFfmpegError(err);$('#validationOutput').textContent=`No se pudo reparar el contenedor:\n${msg}`;toast('Reparación no completada',msg,'error');}finally{try{if(input)await state.ffmpeg?.deleteFile(input);if(output)await state.ffmpeg?.deleteFile(output);}catch{}state.ffmpegBusy=false;$('#repairMediaBtn').disabled=false;}
}
function exportInspector(format='json'){
  if(!state.inspectorReport)return;state.inspectorReport.generatedAt=new Date().toISOString();const stem=safeStem(state.inspectorFile?.name||'informe');
  if(format==='txt'){const r=state.inspectorReport;const text=[`MEDIAFORGE 404 · INFORME MULTIMEDIA`,`Generado: ${new Date(r.generatedAt).toLocaleString('es-ES')}`,'',...Object.entries(r.basic||{}).map(([k,v])=>`${k}: ${v}`),'',r.checksum?`SHA-256: ${r.checksum}`:'SHA-256: no calculado','',r.probe?formatProbeReport(r.probe):'Análisis FFmpeg: no ejecutado','',r.validation?`VALIDACIÓN: ${r.validation.status}\n${r.validation.summary}\n${(r.validation.issues||[]).join('\n')}`:'Validación: no ejecutada'].join('\n');downloadBlob(new Blob([text],{type:'text/plain;charset=utf-8'}),`${stem}-mediaforge.txt`);}else downloadBlob(new Blob([JSON.stringify(state.inspectorReport,null,2)],{type:'application/json'}),`${stem}-mediaforge.json`);toast('Informe exportado',format.toUpperCase()+' preparado.','success');
}

function showPrivacyModal(firstRun=false){
  openModal(`<div class="modal-header"><div class="modal-icon">${svg('shield')}</div><div><h3 id="modalTitle">Privacidad local por diseño</h3><p>MediaForge 404 · U404 Universal Media Engine</p></div>${firstRun?'':`<button class="icon-btn" data-close-modal aria-label="Cerrar">${svg('close')}</button>`}</div><div class="modal-body"><h4>Tus archivos permanecen en tu dispositivo</h4><p>MediaForge 404 reproduce y procesa archivos mediante las API del navegador. No incluye cuentas, anuncios, telemetría ni subida automática a servidores.</p><h4>Datos guardados</h4><p>La biblioteca conserva nombres, tamaños, favoritos, duración y progreso en el almacenamiento local del navegador. Cuando el navegador permite guardar referencias de archivos, puede volver a solicitar permiso antes de abrirlos.</p><h4>Conversión</h4><p>FFmpeg WebAssembly se descarga bajo demanda y después se ejecuta localmente. El motor universal puede remultiplexar o transcodificar una copia temporal; nunca modifica el archivo original. Los archivos grandes pueden consumir mucha memoria o tardar más que en una aplicación de escritorio.</p><h4>Transmisión</h4><p>Google Cast recibe únicamente la URL que decides enviar. Para archivos del PC, Cast Bridge sirve temporalmente un único archivo dentro de tu red privada. AirPlay utiliza el selector nativo de Safari cuando está disponible.</p><h4>Limitaciones</h4><p>La compatibilidad depende del navegador, del contenedor, del códec y de la memoria disponible. No se admite la elusión de DRM. WebAssembly tiene un límite práctico para archivos grandes y no sustituye totalmente a VLC de escritorio.</p></div><div class="modal-footer">${firstRun?'<button class="primary-btn" id="acceptLegalBtn">Entendido, entrar</button>':'<button class="primary-btn" data-close-modal>Cerrar</button>'}</div>`);
  if(firstRun)$('#acceptLegalBtn').addEventListener('click',()=>{state.settings.acceptedLegal=true;saveSettings();closeModal();});
}
function confirmClearData(){openModal(`<div class="modal-header"><div class="modal-icon">${svg('alert')}</div><div><h3 id="modalTitle">Borrar datos locales</h3><p>Esta acción no elimina tus archivos originales</p></div><button class="icon-btn" data-close-modal>${svg('close')}</button></div><div class="modal-body"><p>Se eliminarán el historial, favoritos, puntos de reproducción y permisos guardados por MediaForge 404 en este navegador.</p></div><div class="modal-footer"><button class="soft-btn" data-close-modal>Cancelar</button><button class="danger-btn" id="confirmClearBtn">Borrar definitivamente</button></div>`);$('#confirmClearBtn').addEventListener('click',clearAllData);}
async function clearAllData(){try{await db.clear('history');await db.clear('handles');state.history=[];renderLibrary();updateLibraryBadge();closeModal();toast('Datos locales borrados','Tus archivos originales no se han modificado.','success');}catch{toast('No se pudieron borrar los datos','El almacenamiento local está bloqueado.','error');}}
function openModal(html){state.lastFocus=document.activeElement;$('#modal').innerHTML=html;$('#modalBackdrop').classList.add('open');$$('[data-close-modal]').forEach(b=>b.addEventListener('click',closeModal));setTimeout(()=>$('#modal button:not([disabled])')?.focus(),30);}
function closeModal(){if(!state.settings.acceptedLegal&&$('#acceptLegalBtn'))return;$('#modalBackdrop').classList.remove('open');const focus=state.lastFocus;state.lastFocus=null;setTimeout(()=>{if(focus?.isConnected)focus.focus();},30);}
function toggleSetting(btn){const key=btn.dataset.settingToggle;state.settings[key]=!state.settings[key];btn.classList.toggle('on',state.settings[key]);saveSettings();applySettings();}
function applySettings(){
  document.documentElement.style.setProperty('--ease',state.settings.reduceEffects?'linear':'cubic-bezier(.2,.8,.2,1)');
  document.documentElement.dataset.u404Motion=state.settings.reduceEffects?'off':'auto';
  document.documentElement.dataset.u404Contrast=state.settings.highContrast?'high':'normal';
  document.body.classList.toggle('reduced-effects',!!state.settings.reduceEffects);
  $$('[data-setting-toggle]').forEach(btn=>{const on=!!state.settings[btn.dataset.settingToggle];btn.classList.toggle('on',on);btn.setAttribute('aria-pressed',String(on));btn.setAttribute('aria-checked',String(on));});
  applySkin(state.settings.skin,false);
  applyPlayerMode(state.settings.playerMode,false);
}

const PLAYER_MODES=[['studio','Studio'],['television','Televisión'],['crt','CRT 404'],['vhs','VHS 404'],['cinema','Cine'],['oled','OLED'],['cyberpunk','Cyberpunk'],['retro','Retro TV'],['minimal','Minimal']];
function renderAppearanceSettings(){
  const skins=window.U404Style?.skins||[['midnight','Midnight',['#050A12','#2EE6D6','#5AA7FF']]];
  $('#skinPicker').innerHTML=skins.map(([id,name,colors])=>`<button class="skin-card" type="button" data-skin="${id}" aria-pressed="false"><span class="skin-swatches" aria-hidden="true">${colors.map(c=>`<i style="background:${c}"></i>`).join('')}</span><strong>${name}</strong></button>`).join('');
}
function applySkin(id,notify=false){
  const skins=window.U404Style?.skins||[];
  const found=skins.find(s=>s[0]===id)||skins.find(s=>s[0]==='midnight')||['midnight','Midnight'];
  state.settings.skin=found[0];
  window.U404Style?.setSkin(found[0]);
  document.documentElement.dataset.u404Skin=found[0];
  $$('#skinPicker [data-skin]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.skin===found[0])));
  const label=`U404 ${found[1]}`;
  if($('#currentSkinLabel'))$('#currentSkinLabel').textContent=label;
  updateAppearanceLabel();saveSettings();
  if(notify)toast('Skin aplicada',found[1],'success');
}
function applyPlayerMode(mode,notify=false){
  const found=PLAYER_MODES.find(m=>m[0]===mode)||PLAYER_MODES[0];
  state.settings.playerMode=found[0];document.documentElement.dataset.playerMode=found[0];
  $$('#modePicker [data-player-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.playerMode===found[0])));
  if($('#tvModeBtn')){$('#tvModeBtn').setAttribute('aria-label',`Modo de pantalla: ${found[1]}`);$('#tvModeBtn').classList.toggle('active',found[0]!=='studio');}
  updateAppearanceLabel();saveSettings();
  if(notify)toast('Modo de pantalla',found[1],'success');
}

function exportCurrentTheme(){
  const payload=window.U404Style?.exportTheme?.()||{schema:'u404-theme-v1',skin:state.settings.skin};
  downloadBlob(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),`mediaforge404-theme-${payload.skin||'custom'}.json`);
  toast('Tema exportado','Archivo JSON preparado.','success');
}
async function importThemeFile(event){
  const file=event.target.files?.[0];event.target.value='';if(!file)return;
  try{const payload=JSON.parse(await file.text());const result=window.U404Style.importTheme(payload);state.settings.skin=result.skin||'midnight';document.documentElement.dataset.u404Skin=state.settings.skin;renderAppearanceSettings();applySkin(state.settings.skin,false);toast('Tema importado','La apariencia se ha aplicado y guardado.','success');}
  catch(err){toast('Tema no válido',err.message||'El JSON no cumple el formato U404.','error');}
}
function randomizeTheme(){
  const skins=window.U404Style?.skins||[];if(!skins.length)return;
  const current=skins.findIndex(s=>s[0]===state.settings.skin);let next=current;
  while(next===current&&skins.length>1)next=Math.floor(Math.random()*skins.length);
  applySkin(skins[next][0],true);
}

function cyclePlayerMode(){const i=PLAYER_MODES.findIndex(m=>m[0]===state.settings.playerMode);applyPlayerMode(PLAYER_MODES[(i+1)%PLAYER_MODES.length][0],true);}
function updateAppearanceLabel(){const skin=(window.U404Style?.skins||[]).find(s=>s[0]===state.settings.skin)?.[1]||'Midnight';const mode=PLAYER_MODES.find(m=>m[0]===state.settings.playerMode)?.[1]||'Studio';if($('#appearanceCurrent'))$('#appearanceCurrent').textContent=`${skin} · ${mode}`;}
function startTvClock(){const tick=()=>{if($('#tvClock'))$('#tvClock').textContent=new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});};tick();clearInterval(state.tvClockTimer);state.tvClockTimer=setInterval(tick,30000);}

function compatibilityProfile(file){
  const support=canPlay(file);const ext=(file?.name.split('.').pop()||'').toLowerCase();
  if(support==='probably')return{level:'native',label:'Reproducción nativa confirmada',detail:'El navegador declara compatibilidad directa.'};
  if(support==='maybe')return{level:'maybe',label:'Compatibilidad probable',detail:'El contenedor puede abrirse, pero el códec interno decidirá el resultado.'};
  const remuxable=['mkv','mov','m4v','ts','mts','m2ts','avi'].includes(ext);
  return{level:'fallback',label:remuxable?'Candidato a remultiplexado U404':'Requiere preparación compatible',detail:remuxable?'U404 probará primero un cambio de contenedor sin perder calidad.':'U404 puede crear una copia H.264/AAC o MP3 en memoria.'};
}
function updateEngineStrip(item,failed=false){
  const strip=$('#engineStrip');if(!strip)return;
  strip.className='engine-strip';
  const prep=$('#prepareCompatibilityBtn'),down=$('#downloadCompatibilityBtn');
  prep.hidden=true;down.hidden=true;
  if(!item){strip.classList.add('native');$('#engineStatusTitle').textContent='U404 Universal Media Engine';$('#engineStatusText').textContent='Abre un archivo para comprobar su compatibilidad.';return;}
  if(item.compatUrl){strip.classList.add('converted');$('#engineStatusTitle').textContent='Versión compatible activa';$('#engineStatusText').textContent=`${item.compatMethod||'Transcodificación local'} · el original permanece intacto.`;down.hidden=!item.compatBlob;return;}
  const profile=compatibilityProfile(item.file);const level=failed?'fallback':profile.level;strip.classList.add(level);$('#engineStatusTitle').textContent=failed?'Códec rechazado por el navegador':profile.label;$('#engineStatusText').textContent=failed?'El motor puede preparar una copia compatible local.':profile.detail;prep.hidden=!(state.settings.universalEngine&&(level==='fallback'||level==='maybe'||failed));
}
function showUniversalPrompt(item,reason='Compatibilidad no confirmada'){
  if(!item||state.universal.busy)return;
  const profile=compatibilityProfile(item.file);
  openModal(`<div class="modal-header"><div class="modal-icon">${svg('magic')}</div><div><h3 id="modalTitle">U404 Universal Media Engine</h3><p>${escapeHtml(profile.label)}</p></div><button class="icon-btn" data-close-modal aria-label="Cerrar">${svg('close')}</button></div><div class="modal-body"><div class="universal-summary"><span>${svg('file')}</span><div><strong>${escapeHtml(item.name)}</strong><p>${formatBytes(item.size)} · ${escapeHtml(reason)}</p></div></div><h4>Ruta inteligente de compatibilidad</h4><ol class="engine-steps"><li>Prueba nativa del navegador.</li><li>Remultiplexado rápido a MP4 cuando sea viable.</li><li>Transcodificación a H.264 + AAC o MP3 si sigue siendo incompatible.</li></ol><p>Todo ocurre en este dispositivo. La copia preparada vive en memoria y puede descargarse. El original no se modifica.</p>${item.size>750*1024*1024?'<div class="warning-box">Archivo grande: el navegador podría quedarse sin memoria. Para archivos muy pesados sigue siendo mejor una aplicación de escritorio.</div>':''}</div><div class="modal-footer"><button class="soft-btn" data-close-modal>Probar original</button><button class="primary-btn" id="startUniversalBtn">${svg('magic')} Preparar versión compatible</button></div>`);
  $('#startUniversalBtn').addEventListener('click',()=>prepareCompatibleVersion(item));
}
async function prepareCompatibleVersion(item){
  if(!item||state.universal.busy)return;
  if(item.file.size>=1900*1024*1024){toast('Archivo demasiado grande','WebAssembly no puede procesarlo con seguridad. Usa una aplicación de escritorio como VLC.','error');return;}
  state.universal={busy:true,itemId:item.id,cancelled:false};
  openModal(`<div class="modal-header"><div class="modal-icon">${svg('magic')}</div><div><h3 id="modalTitle">Preparando compatibilidad</h3><p>Procesamiento privado y local</p></div></div><div class="modal-body"><div class="universal-summary"><span>${svg('file')}</span><div><strong>${escapeHtml(item.name)}</strong><p id="universalPhase">Cargando el motor local…</p></div></div><div class="universal-progress"><div><span id="universalProgressLabel">Preparando…</span><b id="universalProgressPercent">0%</b></div><div class="progress-bar"><span id="universalProgressBar"></span></div></div><p class="modal-note">No cierres esta pestaña durante el proceso. El archivo original permanece intacto.</p></div><div class="modal-footer"><button class="danger-btn" id="cancelUniversalBtn">Cancelar</button></div>`);
  $('#cancelUniversalBtn').addEventListener('click',cancelUniversalPreparation);
  let input='',output='';
  try{
    const ffmpeg=await ensureFFmpeg();if(state.universal.cancelled)throw new Error('Operación cancelada.');
    if(state.ffmpegBusy)throw new Error('El motor está ocupado.');state.ffmpegBusy=true;state.ffmpegLogs=[];
    const ext=(item.name.split('.').pop()||'bin').replace(/[^a-z0-9]/gi,'');input=`universal-${Date.now()}.${ext}`;
    setUniversalProgress(3,'Leyendo el archivo…');await ffmpeg.writeFile(input,await fetchFile(item.file));
    let result=null;
    if(item.kind==='video'){
      output=`${safeStem(item.name)}-u404-remux.mp4`;setUniversalProgress(8,'Probando remultiplexado rápido…');
      try{const code=await ffmpeg.exec(['-y','-i',input,'-map','0:v:0?','-map','0:a:0?','-c','copy','-movflags','+faststart',output]);if(code===0){const data=await ffmpeg.readFile(output);const blob=new Blob([data],{type:'video/mp4'});if(await probePlayableBlob(blob,'video'))result={blob,name:output,mime:'video/mp4',method:'Remultiplexado sin recodificar'};} }catch{}
      if(!result){try{await ffmpeg.deleteFile(output);}catch{}output=`${safeStem(item.name)}-u404-compatible.mp4`;setUniversalProgress(12,'Transcodificando vídeo a H.264 + AAC…');const code=await ffmpeg.exec(['-y','-i',input,'-map','0:v:0?','-map','0:a:0?','-c:v','libx264','-preset','ultrafast','-crf','27','-pix_fmt','yuv420p','-profile:v','main','-c:a','aac','-b:a','160k','-movflags','+faststart','-max_muxing_queue_size','1024',output]);if(code!==0)throw new Error(`FFmpeg terminó con código ${code}.`);const data=await ffmpeg.readFile(output);result={blob:new Blob([data],{type:'video/mp4'}),name:output,mime:'video/mp4',method:'Transcodificación H.264 + AAC'};}
    }else{
      output=`${safeStem(item.name)}-u404-compatible.mp3`;setUniversalProgress(12,'Transcodificando audio a MP3…');const code=await ffmpeg.exec(['-y','-i',input,'-map','0:a:0?','-vn','-c:a','libmp3lame','-q:a','3',output]);if(code!==0)throw new Error(`FFmpeg terminó con código ${code}.`);const data=await ffmpeg.readFile(output);result={blob:new Blob([data],{type:'audio/mpeg'}),name:output,mime:'audio/mpeg',method:'Transcodificación MP3'};
    }
    if(state.universal.cancelled)throw new Error('Operación cancelada.');
    if(item.compatUrl)URL.revokeObjectURL(item.compatUrl);item.compatBlob=result.blob;item.compatUrl=URL.createObjectURL(result.blob);item.compatName=result.name;item.compatMime=result.mime;item.compatMethod=result.method;
    setUniversalProgress(100,'Versión compatible lista');closeModal();const index=state.playlist.findIndex(x=>x.id===item.id);if(index>=0)loadTrack(index,true);toast('Compatibilidad preparada',result.method,'success');
  }catch(err){if(!state.universal.cancelled){toast('No se pudo preparar el archivo',friendlyFfmpegError(err),'error');if($('#universalPhase'))$('#universalPhase').textContent=friendlyFfmpegError(err);} }
  finally{try{if(input)await state.ffmpeg?.deleteFile(input);if(output)await state.ffmpeg?.deleteFile(output);}catch{}state.ffmpegBusy=false;state.universal.busy=false;state.universal.itemId=null;}
}
function setUniversalProgress(pct,label){if($('#universalProgressBar'))$('#universalProgressBar').style.width=`${pct}%`;if($('#universalProgressPercent'))$('#universalProgressPercent').textContent=`${pct}%`;if($('#universalProgressLabel'))$('#universalProgressLabel').textContent=label;if($('#universalPhase'))$('#universalPhase').textContent=label;}
function cancelUniversalPreparation(){state.universal.cancelled=true;try{state.ffmpeg?.terminate();}catch{}state.ffmpeg=null;state.ffmpegLoaded=false;state.ffmpegBusy=false;state.universal.busy=false;closeModal();toast('Preparación cancelada','El motor se cargará de nuevo cuando lo necesites.','warning');}
function downloadCompatibleVersion(){const item=state.playlist[state.currentIndex];if(!item?.compatBlob)return;downloadBlob(item.compatBlob,item.compatName||`${safeStem(item.name)}-compatible`);}
async function probePlayableBlob(blob,kind){return new Promise(resolve=>{const el=document.createElement(kind==='audio'?'audio':'video');const url=URL.createObjectURL(blob);let done=false;const finish=v=>{if(done)return;done=true;clearTimeout(timer);URL.revokeObjectURL(url);el.removeAttribute('src');resolve(v);};const timer=setTimeout(()=>finish(false),4500);el.preload='metadata';el.onloadedmetadata=()=>finish(true);el.onerror=()=>finish(false);el.src=url;el.load();});}


function bindDragDrop() {
  ['dragenter','dragover','dragleave','drop'].forEach(type => window.addEventListener(type, event => {
    event.preventDefault();
    event.stopPropagation();
  }));
  window.addEventListener('dragenter', () => {
    state.dragDepth++;
    $('#dropOverlay')?.classList.add('visible');
  });
  window.addEventListener('dragleave', () => {
    state.dragDepth--;
    if (state.dragDepth <= 0) {
      state.dragDepth = 0;
      $('#dropOverlay')?.classList.remove('visible');
    }
  });
  window.addEventListener('drop', event => {
    state.dragDepth = 0;
    $('#dropOverlay')?.classList.remove('visible');
    const files = [...(event.dataTransfer?.files || [])];
    if (files.length) addFiles(files);
  });
}

function handleShortcuts(event) {
  const modalOpen = $('#modalBackdrop')?.classList.contains('open');
  if (modalOpen) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = $$('#modal button:not([disabled]), #modal [href], #modal input:not([disabled]), #modal select:not([disabled]), #modal textarea:not([disabled]), #modal [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    return;
  }

  const target = event.target;
  if (target instanceof Element && (target.matches('input,select,textarea,[contenteditable="true"]') || target.closest('[contenteditable="true"]'))) return;
  const media = $('#mediaElement');
  if (!media) return;
  if (event.code === 'Space') {
    event.preventDefault();
    togglePlay();
  } else if (event.key === 'ArrowRight') {
    media.currentTime = Math.min(media.duration || 0, media.currentTime + (event.shiftKey ? 30 : 5));
  } else if (event.key === 'ArrowLeft') {
    media.currentTime = Math.max(0, media.currentTime - (event.shiftKey ? 30 : 5));
  } else if (event.key.toLowerCase() === 'f') {
    toggleFullscreen();
  } else if (event.key.toLowerCase() === 'm') {
    media.muted = !media.muted;
    updateMuteIcon();
  } else if (event.key.toLowerCase() === 'o') {
    openMediaPicker();
  } else if (event.key === 'Escape' && document.body.classList.contains('cinema')) {
    document.body.classList.remove('cinema');
  }
}

function renderCompatibility(){const features=[['WebAssembly',typeof WebAssembly==='object','Motor universal y conversión'],['Media Capabilities','mediaCapabilities'in navigator,'Diagnóstico de decodificación'],['WebCodecs','VideoDecoder'in window||'AudioDecoder'in window,'Aceleración disponible según navegador'],['IndexedDB','indexedDB'in window,'Biblioteca y progreso'],['Web Audio API',!!(window.AudioContext||window.webkitAudioContext),'Ecualizador y visualizador'],['File System Access','showOpenFilePicker'in window,'Permisos persistentes de archivos'],['Picture in Picture','pictureInPictureEnabled'in document,'Vídeo flotante'],['Pantalla completa','fullscreenEnabled'in document,'Modo pantalla completa'],['Media Session','mediaSession'in navigator,'Controles del sistema'],['Service Worker','serviceWorker'in navigator,'Instalación y caché']];$('#compatList').innerHTML=features.map(([name,ok,desc])=>`<div class="compat-row"><span class="compat-dot ${ok?'ok':'warn'}"></span><strong>${name}</strong><span>${ok?'Disponible':'No disponible'} · ${desc}</span></div>`).join('');}
function registerPWA(){
  if('serviceWorker'in navigator&&location.protocol!=='file:'){
    const register=async()=>{try{const registration=await navigator.serviceWorker.register('./sw.js');if(!registration){console.warn('Service Worker no disponible en este contexto.');return;}state.pwaRegistration=registration;watchServiceWorker(registration);checkFfmpegCached();setInterval(()=>registration.update?.().catch(()=>{}),60*60*1000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')registration.update?.().catch(()=>{});});}catch(err){console.warn('Service Worker no disponible:',err);}};
    if(document.readyState==='complete')register();else window.addEventListener('load',register,{once:true});
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(state.reloadingForUpdate)return;state.reloadingForUpdate=true;location.reload();});
  }else if($('#engineOfflineStatus'))$('#engineOfflineStatus').textContent='Disponible al publicar por HTTPS o ejecutar mediante servidor local.';
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.installPrompt=e;$('#installBtn').hidden=false;});
  $('#installBtn').addEventListener('click',async()=>{if(!state.installPrompt)return;state.installPrompt.prompt();await state.installPrompt.userChoice;state.installPrompt=null;$('#installBtn').hidden=true;});
}
function watchServiceWorker(registration){
  if(registration.waiting)showAppUpdate();registration.addEventListener('updatefound',()=>{const worker=registration.installing;if(!worker)return;worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)showAppUpdate();});});
}
function showAppUpdate(){const btn=$('#updateAppBtn');if(btn)btn.hidden=false;toast('Actualización disponible','Pulsa “Actualizar” para cargar la nueva versión.','success');}
function activateWaitingServiceWorker(){const registration=state.pwaRegistration;if(registration?.waiting){registration.waiting.postMessage({type:'SKIP_WAITING'});$('#updateAppBtn').disabled=true;}else{registration?.update().catch(()=>{});toast('Buscando actualización','La aplicación comprobará si existe una versión nueva.');}}
async function cacheFfmpegOffline(){toast('Edición Web Light','FFmpeg se descarga bajo demanda y no se incluye offline para respetar el límite de 25 MB de GitHub.','info');}
async function checkFfmpegCached(){const status=$('#engineOfflineStatus');if(status)status.textContent='FFmpeg se descarga bajo demanda. La reproducción normal funciona sin cargarlo.';}

function updateRange(input,explicit){const min=Number(input.min||0),max=Number(input.max||100),v=explicit??((Number(input.value)-min)/(max-min)*100);input.style.setProperty('--value',`${clamp(v,0,100)}%`);}
function updateMuteIcon(){$('#muteBtn').innerHTML=svg($('#mediaElement').muted||$('#mediaElement').volume===0?'mute':'volume');}
function aspectRatio(width,height){if(!width||!height)return'—';const gcd=(a,b)=>b?gcd(b,a%b):a;const d=gcd(width,height);const rw=width/d,rh=height/d;if(rw>30||rh>30)return(width/height).toFixed(2)+':1';return`${rw}:${rh}`;}
function formatTime(seconds){if(!Number.isFinite(seconds)||seconds<0)return'00:00';const s=Math.floor(seconds%60).toString().padStart(2,'0'),m=Math.floor(seconds/60)%60,h=Math.floor(seconds/3600);return h?`${h}:${m.toString().padStart(2,'0')}:${s}`:`${m.toString().padStart(2,'0')}:${s}`;}
function formatBytes(bytes){if(!Number.isFinite(bytes))return'—';const units=['B','KB','MB','GB','TB'];let value=bytes,i=0;while(value>=1024&&i<units.length-1){value/=1024;i++;}return`${value.toFixed(i?1:0)} ${units[i]}`;}
function getKind(file){return file.type.startsWith('audio/')||/\.(mp3|wav|ogg|m4a|flac|opus|aac)$/i.test(file.name)?'audio':'video';}
function mimeFromName(name){const ext=name.split('.').pop()?.toLowerCase();return({mp4:'video/mp4',webm:'video/webm',mp3:'audio/mpeg',wav:'audio/wav',ogg:'audio/ogg',m4a:'audio/mp4',mov:'video/quicktime',mkv:'video/x-matroska',avi:'video/x-msvideo',wmv:'video/x-ms-wmv',ts:'video/mp2t',mts:'video/mp2t',m2ts:'video/mp2t',ogv:'video/ogg',flac:'audio/flac',aac:'audio/aac',opus:'audio/ogg',wma:'audio/x-ms-wma','3gp':'video/3gpp'})[ext]||'application/octet-stream';}
function canPlay(file){const el=document.createElement(getKind(file)==='audio'?'audio':'video');const result=el.canPlayType(file.type||mimeFromName(file.name));return result||'no';}
function safeStem(name){return name.replace(/\.[^.]+$/,'').replace(/[^a-z0-9áéíóúüñ_-]+/gi,'-').replace(/^-+|-+$/g,'').slice(0,80)||'mediaforge';}
function escapeHtml(v){return String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function escapeAttr(v){return escapeHtml(v).replace(/'/g,'&#39;');}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function friendlyMediaError(err){return err?.name==='NotAllowedError'?'El navegador requiere una interacción antes de reproducir.':err?.message||'Formato o códec no compatible.';}
function friendlyFfmpegError(err){const m=err?.message||String(err);if(/memory|abort|out of bounds/i.test(m))return'El dispositivo se ha quedado sin memoria para esta operación. Prueba un archivo menor.';if(/fetch|load|network/i.test(m))return'No se pudo descargar el núcleo FFmpeg. Comprueba Internet y ejecuta la app mediante HTTPS o un servidor local.';return m;}
function toast(title,message,type='info'){const root=$('#toastStack');const el=document.createElement('div');el.className=`toast ${type}`;el.innerHTML=`<span class="toast-dot"></span><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p></div>`;root.appendChild(el);setTimeout(()=>{el.style.opacity='0';el.style.transform='translateY(8px)';setTimeout(()=>el.remove(),250);},4200);}

init();
