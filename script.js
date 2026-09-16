'use strict';

/* ============================================================
   EVENTOS CESAR — script.js
   Organizado em: CONFIG/DADOS → utilitários → cada seção.
   Edite a seção "DADOS" abaixo para trocar eventos/fotos reais.
   ============================================================ */

/* ---------------------------------------------------------
   CONFIG
   - EVENTS_SHEET_URL: endpoint público (com CORS liberado) da planilha "EVENTOS
     CESAR" no Google Sheets — é a fonte real do Calendário e do
     Painel de Indicadores. Qualquer linha nova lá aparece aqui
     sozinha, sem precisar tocar em código (veja o README.md).
   - EVENT_REQUEST_URL: link do formulário de solicitação de evento
     (Zeev). O botão "Solicitar evento" abre esse link numa janela
     própria — não é mais um formulário deste site.
--------------------------------------------------------- */
const CONFIG = {
  EVENTS_SHEET_URL: 'https://docs.google.com/spreadsheets/d/1qxzUKS4H0tP7xTH0F5OLUwMTfJXBkupujzhf2n4j46I/gviz/tq?tqx=out:csv&gid=0',
  EVENT_REQUEST_URL: 'https://cesar.zeev.it//2.0/request?c=z34UUIKyt81F3TftVanANkiUcqQWLV46HyMvdEsOlstl8NMS7TfL7oNKHHs2LfR0zbRkB1bXwVbHHZaqh7OfYw%3d%3d#top',
  EVENTS_REFRESH_MS: 5 * 60 * 1000,
};

/* ---------------------------------------------------------
   DADOS DE EXEMPLO — usados só se a planilha não puder ser lida
   (sem internet, link mudou, planilha ficou privada etc.). O
   Calendário e o Painel avisam claramente na tela quando isso
   acontece. Formato de cada evento, igual ao que vem da planilha:
   { id, date (AAAA-MM-DD), endDate, time, title, category, status,
     cluster, esforco, estrategico, location, venue, description }
--------------------------------------------------------- */
const EVENTS_DEMO_DATA = [
  { id: 'demo1', date: '2026-09-24', endDate: '2026-09-24', time: '14:00', title: 'Workshop de Liderança', category: 'Evento', status: 'Confirmado', cluster: 'C4', esforco: 'Médio', estrategico: false, location: 'CESAR Moinho — Risoflora', venue: 'CESAR Moinho', description: 'Público: Colaboadores' },
  { id: 'demo2', date: '2026-10-01', endDate: '2026-10-01', time: '17:30', title: 'Tech Talk: IA aplicada ao dia a dia', category: 'Palestra', status: 'Confirmado', cluster: 'C4', esforco: 'Baixo', estrategico: false, location: 'CESAR School - Prédio Apolo', venue: 'CESAR School - Prédio Apolo', description: 'Público: Interno + Cliente' },
  { id: 'demo3', date: '2026-10-08', endDate: '2026-10-10', time: '09:00', title: 'Hackathon CESAR', category: 'Hackaton', status: 'Confirmado', cluster: 'C4', esforco: 'Alto', estrategico: true, location: 'CESAR School - Prédio Tiradentes', venue: 'CESAR School - Prédio Tiradentes', description: 'Público: Alunos' },
  { id: 'demo4', date: '2026-11-14', endDate: '2026-11-14', time: '07:00', title: 'Corrida CESAR', category: 'Evento', status: 'Previsto', cluster: 'Institucional', esforco: 'Médio', estrategico: true, location: 'CESAR Moinho', venue: 'CESAR Moinho', description: 'Público: Todos' },
  { id: 'demo5', date: '2026-11-27', endDate: '2026-11-27', time: '10:00', title: 'Onboarding de Novos Times', category: 'Evento', status: 'Previsto', cluster: '', esforco: 'Baixo', estrategico: false, location: 'CESAR Moinho — Cartola', venue: 'CESAR Moinho', description: 'Público: Colaboadores' },
  { id: 'demo6', date: '2026-12-15', endDate: '2026-12-15', time: '19:00', title: 'Confraternização de Fim de Ano', category: 'Evento', status: 'Previsto', cluster: 'Board', esforco: 'Alto', estrategico: true, location: 'CESAR Moinho', venue: 'CESAR Moinho', description: 'Público: Colaboadores' },
];

const GALLERY_DATA = [
  { year: 2023, title: 'Confraternização de Fim de Ano', month: 'Dezembro', icon: 'confetti' },
  { year: 2023, title: 'Corrida CESAR', month: 'Novembro', icon: 'runner' },
  { year: 2023, title: 'Semana da Inovação', month: 'Setembro', icon: 'bulb' },
  { year: 2023, title: 'Workshop de Times', month: 'Julho', icon: 'users' },
  { year: 2023, title: 'Tech Talk Aberta', month: 'Maio', icon: 'mic' },
  { year: 2023, title: 'Onboarding Coletivo', month: 'Março', icon: 'badge' },
  { year: 2024, title: 'Confraternização de Fim de Ano', month: 'Dezembro', icon: 'confetti' },
  { year: 2024, title: 'Hackathon CESAR', month: 'Outubro', icon: 'trophy' },
  { year: 2024, title: 'Corrida CESAR', month: 'Novembro', icon: 'runner' },
  { year: 2024, title: 'Tech Talk: Cloud', month: 'Agosto', icon: 'mic' },
  { year: 2024, title: 'Semana da Inovação', month: 'Setembro', icon: 'bulb' },
  { year: 2024, title: 'Workshop de Liderança', month: 'Junho', icon: 'users' },
  { year: 2025, title: 'Confraternização de Fim de Ano', month: 'Dezembro', icon: 'confetti', src:'https://img.mailinblue.com/8183049/images/content_library/original/6aa04a34202ac0a13ea31faa.jpg' },
  { year: 2025, title: 'Hackathon CESAR', month: 'Outubro', icon: 'trophy', src:'https://img.mailinblue.com/8183049/images/content_library/original/6aa0450e6e62f21c34cd490f.jpg' },
  { year: 2025, title: 'Corrida CESAR', month: 'Novembro', icon: 'runner', src:'https://img.mailinblue.com/8183049/images/content_library/original/6aa04ed3722d1772cec86f4b.jpg' },
  { year: 2025, title: 'Tech Talk: IA Generativa', month: 'Agosto', icon: 'mic', src:'https://img.mailinblue.com/8183049/images/content_library/original/6aa04f25722d1772cec86f52.jpg' },
  { year: 2025, title: 'Onboarding Coletivo', month: 'Abril', icon: 'badge', src:'https://img.mailinblue.com/8183049/images/content_library/original/6aa04f4eda5ffecab0488283.png' },
  { year: 2025, title: 'Semana da Inovação', month: 'Setembro', icon: 'bulb', src:'https://img.mailinblue.com/8183049/images/content_library/original/6aa04f99722d1772cec86f72.jpeg' },
  { year: 2026, title: 'Workshop de Liderança', month: 'Setembro', icon: 'users', src:'https://img.mailinblue.com/8183049/images/content_library/original/6aa04cc9722d1772cec86ef7.jpeg' },
  { year: 2026, title: 'A Fronteira não é da Microsoft', month: 'Julho', icon: 'mic', src:'https://img.mailinblue.com/8183049/images/content_library/original/6aa04dbdda5ffecab0488235.png' },
];

/* ---------------------------------------------------------
   Ícones inline (SVG) reutilizados no JS
--------------------------------------------------------- */
const ICONS = {
  confetti: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21l4-1 11-11-3-3L4 17l-1 4z"/><path d="M14 4l1.5 1.5M17 7l1.5 1.5M11 8l1.5 1.5" stroke-linecap="round"/></svg>',
  runner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="5" r="2"/><path d="M4 21l4-5 3 2 2-4-3-3 1-4"/><path d="M13 11l3 2 4-1"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3 11.2c.4.3.6.8.6 1.3v.5h4.8v-.5c0-.5.2-1 .6-1.3A6 6 0 0012 3z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><circle cx="17.5" cy="9.5" r="2.6"/><path d="M15 13.3A5.6 5.6 0 0121.5 20"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21M8.5 21h7"/></svg>',
  badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5.5"/><path d="M8.2 13.5L7 21l5-2.5 5 2.5-1.2-7.5"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v5a4 4 0 01-8 0V4z"/><path d="M8 5H4.5A2.5 2.5 0 007 9M16 5h3.5A2.5 2.5 0 0117 9"/><path d="M12 13v3M8.5 20h7M9.5 16.5h5l.5 3.5h-6l.5-3.5z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"/><circle cx="12" cy="14" r="3.5"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2a7 7 0 017 7.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0112 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9z"/><path d="M10 19a2 2 0 004 0"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M8 8l4-4 4 4"/><path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3"/></svg>',
};

const MONTHS_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const MONTHS_SHORT_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const WEEKDAYS_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

function parseISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatLongDate(date) {
  return `${date.getDate()} de ${MONTHS_PT[date.getMonth()]} de ${date.getFullYear()}`;
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   PLANILHA DE EVENTOS — leitura, parsing e normalização.
   Usado tanto pelo Calendário quanto pelo Painel de Indicadores
   (uma única leitura, os dois consomem o mesmo resultado).
   ============================================================ */

// Só essas situações aparecem no site — "Suspenso" (cancelado) e
// "Sem data" nunca são mostrados publicamente.
const VISIBLE_STATUSES = ['Concluído', 'Confirmado', 'Previsto'];

// Parser de CSV simples (RFC4180): lida com campos entre aspas,
// vírgula/quebra de linha dentro de campo, e aspas escapadas ("").
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\r') {
      // ignora — o \n logo em seguida fecha a linha
    } else if (c === '\n') {
      row.push(field); field = '';
      rows.push(row); row = [];
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// 'DD/MM/AAAA' -> 'AAAA-MM-DD'. Retorna null se não for uma data válida.
function parseBRDate(str) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((str || '').trim());
  if (!m) return null;
  const [, d, mo, y] = m;
  const iso = `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  return isNaN(parseISODate(iso).getTime()) ? null : iso;
}

// Remove valores-placeholder ("?", "Não definido"...) que aparecem
// na planilha quando o local/sala ainda não foi decidido.
function cleanLocationPart(v) {
  const s = (v || '').trim();
  if (!s || s === '?' || /^n(ã|a)o definid[oa]$/i.test(s) || /^indefinido$/i.test(s)) return '';
  return s;
}

// Acha a linha de cabeçalho mesmo se houver uma linha de título acima
// (comum em planilha com célula mesclada tipo "EVENTOS CESAR"), que o
// endpoint às vezes gruda no texto da primeira coluna do cabeçalho.
function findHeaderRowIndex(rows) {
  for (let i = 0; i < rows.length; i++) {
    const joined = rows[i].join('|').toLowerCase();
    if (joined.includes('status') && joined.includes('evento') && joined.includes('início')) return i;
  }
  return -1;
}

// Casa cada nome de coluna esperado pelo FIM do texto do cabeçalho
// (não por igualdade exata) — pela mesma razão acima.
function buildHeaderIndex(headerRow) {
  const wanted = ['Status', 'Nº Zeev', 'Categoria', 'Evento', 'Horário', 'Início', 'Fim', 'Local', 'Sala', 'Tipo', 'Estratégico', 'Cluster', 'Público', 'Esforço', 'Responsável'];
  const idx = {};
  headerRow.forEach((cell, i) => {
    const c = (cell || '').trim().toLowerCase();
    wanted.forEach((name) => {
      if (idx[name] == null && c.endsWith(name.toLowerCase())) idx[name] = i;
    });
  });
  return idx;
}

function mapRowToEvent(row, idx, rowIndex) {
  const get = (name) => (idx[name] == null ? '' : (row[idx[name]] || '').trim());
  const status = get('Status');
  if (!VISIBLE_STATUSES.includes(status)) return null;

  const title = get('Evento');
  const startISO = parseBRDate(get('Início'));
  if (!title || !startISO) return null;
  const endISO = parseBRDate(get('Fim')) || startISO;

  const local = cleanLocationPart(get('Local'));
  const sala = cleanLocationPart(get('Sala'));
  const location = [local, sala].filter(Boolean).join(' — ') || 'A definir';
  const venue = local; // só o prédio/local, sem a sala — usado pro ranking do painel

  const publico = get('Público');
  const responsavel = get('Responsável');
  const description = [
    publico ? `Público: ${publico}` : '',
    responsavel ? `Responsável: ${responsavel}` : '',
  ].filter(Boolean).join(' · ');

  return {
    id: get('Nº Zeev') || `sheet-${rowIndex}`,
    date: startISO,
    endDate: endISO,
    time: get('Horário'),
    title,
    category: get('Categoria') || 'Evento',
    status,
    cluster: get('Cluster'),
    esforco: get('Esforço'),
    estrategico: /^true$/i.test(get('Estratégico')),
    location,
    venue,
    description,
  };
}

// Busca e converte a planilha inteira numa lista de eventos, já
// filtrada (status visível, com título e data válidos) e ordenada.
async function fetchEventsFromSheet() {
  const res = await fetch(`${CONFIG.EVENTS_SHEET_URL}&t=${Date.now()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const rows = parseCSV(text).filter((r) => r.some((c) => c.trim() !== ''));
  const headerRow = findHeaderRowIndex(rows);
  if (headerRow === -1) throw new Error('Cabeçalho da planilha não encontrado');
  const idx = buildHeaderIndex(rows[headerRow]);

  const events = [];
  for (let i = headerRow + 1; i < rows.length; i++) {
    const ev = mapRowToEvent(rows[i], idx, i);
    if (ev) events.push(ev);
  }
  events.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  return events;
}

/* ============================================================
   HEADER — scroll shadow, menu mobile, scroll-spy
   ============================================================ */
(function initHeader() {
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMobile = document.querySelector('.mobile-menu-close');

  function openMobile() {
    mobileMenu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeMobile.focus();
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }
  toggle.addEventListener('click', openMobile);
  closeMobile.addEventListener('click', closeMobileMenu);
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileMenu));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMobileMenu();
  });

  // scroll-spy on nav pills
  const navLinks = document.querySelectorAll('.pill-nav a');
  const sections = Array.from(navLinks).map((a) => document.querySelector(a.getAttribute('href')));
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => s && spy.observe(s));
})();

/* ============================================================
   CARROSSEL DE BANNERS
   ============================================================ */
(function initCarousel() {
  const root = document.querySelector('.carousel');
  if (!root) return;
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(root.querySelectorAll('.slide'));
  const dotsWrap = root.querySelector('.carousel-dots');
  const prevBtn = root.querySelector('.carousel-arrows .prev');
  const nextBtn = root.querySelector('.carousel-arrows .next');
  const pauseBtn = root.querySelector('.carousel-pause');
  let index = 0;
  let timer = null;
  let userPaused = false;
  const AUTOPLAY_MS = 7000;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ir para o banner ${i + 1} de ${slides.length}`);
    dot.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    slides.forEach((s, i) => s.setAttribute('aria-hidden', i === index ? 'false' : 'true'));
  }
  function goTo(i, userTriggered) {
    index = (i + slides.length) % slides.length;
    render();
    if (userTriggered) restartAutoplay();
  }
  function next() { goTo(index + 1); }

  function startAutoplay() {
    if (prefersReducedMotion || userPaused || slides.length < 2) return;
    stopAutoplay();
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() { if (timer) clearInterval(timer); }
  function restartAutoplay() { stopAutoplay(); startAutoplay(); }

  nextBtn.addEventListener('click', () => goTo(index + 1, true));
  prevBtn.addEventListener('click', () => goTo(index - 1, true));
  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', startAutoplay);

  // controle persistente de pausa — cobre quem não passa o mouse por cima
  // (toque, navegação por teclado longe do carrossel, leitor de tela)
  if (pauseBtn) {
    if (prefersReducedMotion) {
      userPaused = true;
      pauseBtn.classList.add('is-paused');
      pauseBtn.setAttribute('aria-pressed', 'true');
      pauseBtn.setAttribute('aria-label', 'Retomar rotação automática dos banners');
    }
    pauseBtn.addEventListener('click', () => {
      userPaused = !userPaused;
      pauseBtn.classList.toggle('is-paused', userPaused);
      pauseBtn.setAttribute('aria-pressed', String(userPaused));
      pauseBtn.setAttribute('aria-label', userPaused ? 'Retomar rotação automática dos banners' : 'Pausar rotação automática dos banners');
      if (userPaused) stopAutoplay();
      else startAutoplay();
    });
  }

  // swipe
  let touchStartX = null;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? goTo(index + 1, true) : goTo(index - 1, true);
    touchStartX = null;
  }, { passive: true });

  render();
  startAutoplay();
})();

/* ============================================================
   CARROSSEL — largura do CTA acompanha a linha de chips
   O botão "Confira a agenda completa..." precisa ficar sempre
   com a MESMA largura da soma dos dois chips (data + local)
   acima dele, não importa quanto texto cada um tenha. Como
   isso depende do conteúdo real (não dá pra travar só em CSS
   sem arriscar um valor fixo errado noutro texto/idioma),
   medimos a linha de chips e aplicamos essa largura no CTA.
   ============================================================ */
(function initSlideActionWidth() {
  const slides = document.querySelectorAll('.hero .slide');
  if (!slides.length) return;

  function syncWidths() {
    slides.forEach((slide) => {
      const meta = slide.querySelector('.slide-meta');
      const actions = slide.querySelector('.slide-actions');
      if (!meta || !actions) return;
      const width = meta.getBoundingClientRect().width;
      if (width > 0) actions.style.width = `${Math.round(width)}px`;
    });
  }

  syncWidths();
  // recalcula quando a fonte "de verdade" carrega (o texto pode mudar de largura)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncWidths).catch(() => {});
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncWidths, 150);
  });
})();

/* ============================================================
   CALENDÁRIO
   Recebe a lista de eventos já pronta (ver bloco "PLANILHA DE
   EVENTOS" acima e o orquestrador no fim do arquivo) — não busca
   dado nenhum sozinho.
   ============================================================ */
function initCalendar() {
  const notice = document.getElementById('calendarNotice');
  const monthLabel = document.getElementById('calMonthLabel');
  const grid = document.getElementById('calDayGrid');
  const prevBtn = document.getElementById('calPrev');
  const nextBtn = document.getElementById('calNext');
  const listWrap = document.getElementById('eventList');
  const listHeading = document.getElementById('eventListHeading');
  const clearBtn = document.getElementById('eventListClear');
  if (!grid) return null;

  let events = [];
  const eventsByDate = new Map();
  let today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = null;

  function isoOf(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  // Um evento de vários dias marca todo o intervalo no calendário
  // (limitado a 60 dias, só como proteção contra dado inconsistente).
  function rebuildIndex() {
    eventsByDate.clear();
    events.forEach((ev) => {
      const start = parseISODate(ev.date);
      const end = parseISODate(ev.endDate || ev.date);
      const span = Math.min(60, Math.max(0, Math.round((end - start) / 86400000)));
      for (let i = 0; i <= span; i++) {
        const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        const iso = isoOf(d.getFullYear(), d.getMonth(), d.getDate());
        if (!eventsByDate.has(iso)) eventsByDate.set(iso, []);
        eventsByDate.get(iso).push(ev);
      }
    });
  }

  function renderCalendar() {
    monthLabel.textContent = `${MONTHS_PT[viewMonth]} de ${viewYear}`;
    grid.innerHTML = '';
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const pad = document.createElement('div');
      pad.className = 'day-cell is-pad';
      grid.appendChild(pad);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = isoOf(viewYear, viewMonth, d);
      const dayEvents = eventsByDate.get(iso);
      const isToday = iso === isoOf(today.getFullYear(), today.getMonth(), today.getDate());
      const cell = document.createElement(dayEvents ? 'button' : 'div');
      cell.className = 'day-cell';
      if (dayEvents) cell.classList.add('has-event');
      if (isToday) cell.classList.add('is-today');
      if (iso === selectedDate) cell.classList.add('is-selected');
      if (dayEvents) {
        cell.type = 'button';
        const count = dayEvents.length;
        cell.setAttribute('aria-label', `${d} de ${MONTHS_PT[viewMonth]}, ${count} evento${count > 1 ? 's' : ''}: ${dayEvents.map((e) => e.title).join(', ')}`);
        cell.addEventListener('click', () => {
          selectedDate = selectedDate === iso ? null : iso;
          renderCalendar();
          renderEventList();
        });
      }
      cell.innerHTML = `<span>${d}</span>${dayEvents ? '<span class="event-dot" aria-hidden="true"></span>' : ''}`;
      grid.appendChild(cell);
    }
  }

  function upcomingEvents() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return events
      .filter((e) => parseISODate(e.endDate || e.date) >= now)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }

  function renderEventList() {
    let items;
    if (selectedDate) {
      items = (eventsByDate.get(selectedDate) || []).slice().sort((a, b) => a.time.localeCompare(b.time));
      listHeading.textContent = `Eventos em ${formatLongDate(parseISODate(selectedDate))}`;
      clearBtn.hidden = false;
    } else {
      items = upcomingEvents().slice(0, 6);
      listHeading.textContent = 'Próximos eventos';
      clearBtn.hidden = true;
    }

    listWrap.innerHTML = '';
    if (items.length === 0) {
      listWrap.innerHTML = '<p class="empty-note">Nenhum evento encontrado para esta data.</p>';
      return;
    }
    items.forEach((ev) => {
      const date = parseISODate(ev.date);
      const isMultiDay = ev.endDate && ev.endDate !== ev.date;
      const card = document.createElement('article');
      card.className = 'event-card';

      const dateBlock = document.createElement('div');
      dateBlock.className = 'event-date-block';
      dateBlock.setAttribute('aria-hidden', 'true');
      dateBlock.innerHTML = `<span class="day">${date.getDate()}</span><span class="month">${MONTHS_SHORT_PT[date.getMonth()]}</span>`;

      const body = document.createElement('div');
      body.className = 'event-card-body';

      const tag = document.createElement('span');
      tag.className = 'event-tag';
      tag.textContent = ev.status === 'Previsto' ? `${ev.category} · previsto` : ev.category;

      const h4 = document.createElement('h4');
      h4.textContent = ev.title;

      const meta = document.createElement('p');
      meta.className = 'event-card-meta';
      const metaBits = [];
      if (isMultiDay) {
        const endDate = parseISODate(ev.endDate);
        metaBits.push(`${ICONS.clock}até ${endDate.getDate()} de ${MONTHS_PT[endDate.getMonth()]}`);
      } else if (ev.time) {
        metaBits.push(`${ICONS.clock}${ev.time}`);
      }
      metaBits.push(`${ICONS.pin}${ev.location}`);
      meta.innerHTML = metaBits.map((b) => `<span>${b}</span>`).join('');

      body.append(tag, h4, meta);
      card.append(dateBlock, body);
      listWrap.appendChild(card);
    });
  }

  function renderNotice(kind) {
    const messages = {
      'fetch-failed': `${ICONS.alert}<span><strong>Não foi possível ler a planilha de eventos agora.</strong> Mostrando dados de exemplo enquanto isso.</span>`,
      'empty': `${ICONS.alert}<span><strong>A planilha ainda não tem eventos visíveis.</strong> Assim que uma linha com status Confirmado, Previsto ou Concluído tiver uma data válida, ela aparece aqui.</span>`,
    };
    if (notice) {
      if (kind && messages[kind]) {
        notice.innerHTML = messages[kind];
        notice.classList.add('is-visible');
      } else {
        notice.classList.remove('is-visible');
        notice.innerHTML = '';
      }
    }
  }

  prevBtn.addEventListener('click', () => {
    viewMonth -= 1;
    if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    renderCalendar();
  });
  nextBtn.addEventListener('click', () => {
    viewMonth += 1;
    if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    renderCalendar();
  });
  clearBtn.addEventListener('click', () => {
    selectedDate = null;
    renderCalendar();
    renderEventList();
  });

  function setLoading() {
    monthLabel.textContent = 'Carregando…';
    grid.innerHTML = '';
    listWrap.innerHTML = '<p class="empty-note">Carregando agenda…</p>';
  }

  function render(newEvents, noticeKind) {
    events = newEvents;
    rebuildIndex();
    today = new Date();
    viewYear = today.getFullYear();
    viewMonth = today.getMonth();
    selectedDate = null;
    renderCalendar();
    renderEventList();
    renderNotice(noticeKind);
  }

  setLoading();
  return { render, setLoading };
}

/* ============================================================
   PAINEL DE INDICADORES
   Também recebe a lista de eventos pronta (mesma fonte do
   Calendário) — calcula tudo no navegador a partir dela.
   ============================================================ */
function initDashboardPanel() {
  const notice = document.getElementById('panelNotice');
  if (!notice) return null;

  const refreshBtn = document.getElementById('panelRefresh');
  const updatedEl = document.getElementById('panelUpdated');
  const numberFmt = new Intl.NumberFormat('pt-BR');
  const pctFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
  let lastUpdated = null;

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function computeMetrics(events) {
    const total = events.length;
    const monthMap = new Map();
    const venueMap = new Map();
    const categoryMap = new Map();
    let confirmadoCount = 0;
    let estrategicoCount = 0;
    let boardCount = 0;
    let altoEsforcoCount = 0;

    events.forEach((ev) => {
      const d = parseISODate(ev.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap.set(key, (monthMap.get(key) || 0) + 1);

      const venue = String(ev.venue || '').trim();
      if (venue) venueMap.set(venue, (venueMap.get(venue) || 0) + 1);

      const category = String(ev.category || '').trim();
      if (category) categoryMap.set(category, (categoryMap.get(category) || 0) + 1);

      if (ev.status === 'Confirmado') confirmadoCount++;
      if (ev.estrategico) estrategicoCount++;
      if (String(ev.cluster || '').trim() === 'Board') boardCount++;
      if (String(ev.esforco || '').trim() === 'Alto') altoEsforcoCount++;
    });

    const pct = (n) => (total ? (n / total) * 100 : 0);
    return {
      total,
      monthEntries: Array.from(monthMap.entries()).sort((a, b) => a[0].localeCompare(b[0])),
      venueEntries: Array.from(venueMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5),
      categoryEntries: Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5),
      confirmadoCount, confirmadoPct: pct(confirmadoCount),
      estrategicoCount, estrategicoPct: pct(estrategicoCount),
      boardCount, boardPct: pct(boardCount),
      altoEsforcoCount, altoEsforcoPct: pct(altoEsforcoCount),
    };
  }

  function monthLabelShort(key) {
    const [y, m] = key.split('-').map(Number);
    return `${MONTHS_SHORT_PT[m - 1]}/${String(y).slice(2)}`;
  }
  function monthLabelFull(key) {
    const [y, m] = key.split('-').map(Number);
    return `${MONTHS_PT[m - 1]} de ${y}`;
  }

  function renderMonthChart(entries) {
    const wrap = document.getElementById('monthBarChart');
    wrap.innerHTML = '';
    if (!entries.length) {
      const p = document.createElement('p');
      p.className = 'empty-note';
      p.textContent = 'Sem eventos suficientes ainda.';
      wrap.appendChild(p);
      return;
    }
    const max = Math.max(...entries.map(([, v]) => v));
    entries.forEach(([key, value]) => {
      const col = document.createElement('div');
      col.className = 'bar-col';
      col.tabIndex = 0;
      const fullLabel = `${monthLabelFull(key)}: ${value} evento${value > 1 ? 's' : ''}`;
      col.setAttribute('aria-label', fullLabel);
      col.title = fullLabel;

      const valueEl = document.createElement('span');
      valueEl.className = 'bar-value';
      valueEl.textContent = String(value);

      const track = document.createElement('span');
      track.className = 'bar-track';
      const fill = document.createElement('span');
      fill.className = 'bar-fill';
      fill.style.height = `${Math.max(6, Math.round((value / max) * 100))}%`;
      track.appendChild(fill);

      const labelEl = document.createElement('span');
      labelEl.className = 'bar-label';
      labelEl.textContent = monthLabelShort(key);

      col.append(valueEl, track, labelEl);
      wrap.appendChild(col);
    });
  }

  function renderRankList(elId, entries, unitLabel) {
    const wrap = document.getElementById(elId);
    wrap.innerHTML = '';
    if (!entries.length) {
      const p = document.createElement('p');
      p.className = 'empty-note';
      p.textContent = 'Sem dados suficientes ainda.';
      wrap.appendChild(p);
      return;
    }
    const max = entries[0][1];
    entries.forEach(([name, value]) => {
      const row = document.createElement('div');
      row.className = 'rank-row';
      row.setAttribute('role', 'listitem');
      row.tabIndex = 0;
      const label = `${name}: ${value} ${unitLabel}`;
      row.setAttribute('aria-label', label);
      row.title = label;

      const nameEl = document.createElement('span');
      nameEl.className = 'rank-name';
      nameEl.textContent = name;

      const track = document.createElement('span');
      track.className = 'rank-bar-track';
      const fill = document.createElement('span');
      fill.className = 'rank-bar-fill';
      fill.style.width = `${Math.max(6, Math.round((value / max) * 100))}%`;
      track.appendChild(fill);

      const valueEl = document.createElement('span');
      valueEl.className = 'rank-value';
      valueEl.textContent = String(value);

      row.append(nameEl, track, valueEl);
      wrap.appendChild(row);
    });
  }

  function renderStats(m) {
    setText('statTotal', m.total ? numberFmt.format(m.total) : '—');
    setText('statTotalCaption', m.total ? 'no calendário' : 'sem dados ainda');

    setText('statConfirmados', m.total ? numberFmt.format(m.confirmadoCount) : '—');
    setText('statConfirmadosCaption', m.total ? `${pctFmt.format(m.confirmadoPct)}% do total` : 'sem dados ainda');

    setText('statEstrategicos', m.total ? numberFmt.format(m.estrategicoCount) : '—');
    setText('statEstrategicosCaption', m.total ? `${pctFmt.format(m.estrategicoPct)}% do total` : 'sem dados ainda');

    setText('statDiretoria', m.total ? numberFmt.format(m.boardCount) : '—');
    setText('statDiretoriaCaption', m.total ? `${pctFmt.format(m.boardPct)}% do total` : 'sem dados ainda');

    setText('statEsforco', m.total ? numberFmt.format(m.altoEsforcoCount) : '—');
    setText('statEsforcoCaption', m.total ? `${pctFmt.format(m.altoEsforcoPct)}% do total` : 'sem dados ainda');
  }

  function renderNotice(kind) {
    const messages = {
      'fetch-failed': `${ICONS.alert}<span><strong>Não foi possível ler a planilha de eventos agora.</strong> Mostrando dados de exemplo enquanto isso — tente atualizar em instantes.</span>`,
      'empty': `${ICONS.alert}<span><strong>A planilha ainda não tem eventos visíveis.</strong> Os indicadores aparecem assim que houver linhas com status Confirmado, Previsto ou Concluído.</span>`,
    };
    if (kind && messages[kind]) {
      notice.innerHTML = messages[kind];
      notice.classList.add('is-visible');
    } else {
      notice.classList.remove('is-visible');
      notice.innerHTML = '';
    }
  }

  function updateTimestampLabel() {
    if (!lastUpdated) return;
    const seconds = Math.round((Date.now() - lastUpdated.getTime()) / 1000);
    let label;
    if (seconds < 45) label = 'Atualizado agora';
    else if (seconds < 3600) label = `Atualizado há ${Math.round(seconds / 60)} min`;
    else label = `Atualizado às ${lastUpdated.getHours()}:${String(lastUpdated.getMinutes()).padStart(2, '0')}`;
    updatedEl.textContent = label;
  }
  setInterval(updateTimestampLabel, 30 * 1000);

  function setLoading() {
    refreshBtn.classList.add('is-loading');
    refreshBtn.disabled = true;
  }

  function render(events, noticeKind) {
    const metrics = computeMetrics(events);
    renderStats(metrics);
    renderMonthChart(metrics.monthEntries);
    renderRankList('roomsRankList', metrics.venueEntries, 'eventos');
    renderRankList('deptsRankList', metrics.categoryEntries, 'eventos');
    renderNotice(noticeKind);
    lastUpdated = new Date();
    updateTimestampLabel();
    refreshBtn.classList.remove('is-loading');
    refreshBtn.disabled = false;
  }

  return { render, setLoading };
}

/* ============================================================
   PLANILHA → CALENDÁRIO + PAINEL
   Busca a planilha uma única vez e alimenta os dois com os
   mesmos dados. Atualiza sozinho a cada CONFIG.EVENTS_REFRESH_MS,
   mais o botão "Atualizar" do painel pra forçar na hora.
   ============================================================ */
(function initEventsFeed() {
  const calendar = initCalendar();
  const dashboard = initDashboardPanel();
  if (!calendar && !dashboard) return;

  const refreshBtn = document.getElementById('panelRefresh');

  async function load() {
    if (dashboard) dashboard.setLoading();
    let events;
    let noticeKind = null;
    try {
      events = await fetchEventsFromSheet();
      if (events.length === 0) { noticeKind = 'empty'; }
    } catch (err) {
      events = EVENTS_DEMO_DATA;
      noticeKind = 'fetch-failed';
    }
    if (calendar) calendar.render(events, noticeKind);
    if (dashboard) dashboard.render(events, noticeKind);
  }

  if (refreshBtn) refreshBtn.addEventListener('click', load);

  load();
  setInterval(load, CONFIG.EVENTS_REFRESH_MS);
})();

/* ============================================================
   GALERIA DE FOTOS POR ANO
   ============================================================ */
(function initGallery() {
  const tabsWrap = document.getElementById('yearTabs');
  const grid = document.getElementById('galleryGrid');
  if (!tabsWrap || !grid) return;

  const years = Array.from(new Set(GALLERY_DATA.map((p) => p.year))).sort((a, b) => b - a);
  let activeYear = years[0];
  let activeItems = [];
  let lightboxIndex = 0;

  years.forEach((year) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'year-tab';
    tab.textContent = year;
    tab.setAttribute('aria-pressed', String(year === activeYear));
    tab.addEventListener('click', () => {
      activeYear = year;
      Array.from(tabsWrap.children).forEach((t) => t.setAttribute('aria-pressed', String(t.textContent == year)));
      tabsWrap.querySelectorAll('.year-tab').forEach((t) => t.classList.toggle('is-active', Number(t.textContent) === year));
      renderGrid();
    });
    tabsWrap.appendChild(tab);
  });
  tabsWrap.firstElementChild.classList.add('is-active');

  function renderGrid() {
    activeItems = GALLERY_DATA.filter((p) => p.year === activeYear);
    grid.innerHTML = '';
    if (activeItems.length === 0) {
      grid.innerHTML = '<p class="empty-note">Ainda não há fotos cadastradas para este ano.</p>';
      return;
    }
    activeItems.forEach((photo, i) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'gallery-tile';
      tile.setAttribute('aria-label', `Ver foto: ${photo.title}, ${photo.month} de ${photo.year}`);

      // Com "src" preenchido em GALLERY_DATA, mostra a foto real; sem "src",
      // usa o placeholder ilustrado (gradiente + ícone) automaticamente.
      if (photo.src) {
        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.title;
        img.loading = 'lazy';
        tile.appendChild(img);
      } else {
        const bg = document.createElement('div');
        bg.className = 'tile-bg';
        bg.style.background = tileGradient(photo.title);
        bg.innerHTML = ICONS[photo.icon] || ICONS.camera; // ícones fixos do próprio site, não é dado externo
        tile.appendChild(bg);
      }

      const caption = document.createElement('div');
      caption.className = 'tile-caption';
      const strong = document.createElement('strong');
      strong.textContent = photo.title;
      const span = document.createElement('span');
      span.textContent = `${photo.month} · ${photo.year}`;
      caption.append(strong, span);
      tile.appendChild(caption);

      tile.addEventListener('click', () => openLightbox(i));
      grid.appendChild(tile);
    });
  }

  function tileGradient(seedStr) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 40; // varia perto do laranja da marca
    return `linear-gradient(155deg, hsl(${18 + hue} 70% 12%), hsl(${18 + hue} 90% 20%))`;
  }

  // Lightbox
  const lightbox = document.getElementById('galleryLightbox');
  const lbVisual = document.getElementById('lightboxVisualInner');
  const lbTitle = document.getElementById('lightboxTitle');
  const lbMeta = document.getElementById('lightboxMeta');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');
  const lbClose = document.getElementById('lightboxClose');

  function renderLightbox() {
    const photo = activeItems[lightboxIndex];
    lbVisual.innerHTML = '';
    if (photo.src) {
      lbVisual.style.background = 'none';
      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.title;
      lbVisual.appendChild(img);
    } else {
      lbVisual.style.background = tileGradient(photo.title);
      lbVisual.innerHTML = ICONS[photo.icon] || ICONS.camera; // ícones fixos do site, não é dado externo
    }
    lbTitle.textContent = photo.title;
    lbMeta.textContent = `${photo.month} de ${photo.year}`;
  }
  function openLightbox(i) {
    lightboxIndex = i;
    renderLightbox();
    lightbox.showModal();
  }
  lbPrev.addEventListener('click', () => { lightboxIndex = (lightboxIndex - 1 + activeItems.length) % activeItems.length; renderLightbox(); });
  lbNext.addEventListener('click', () => { lightboxIndex = (lightboxIndex + 1) % activeItems.length; renderLightbox(); });
  lbClose.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });

  renderGrid();
})();

/* ============================================================
   SOLICITAR EVENTO — abre o formulário do Zeev (CONFIG.EVENT_REQUEST_URL)
   numa janela própria, em vez de um formulário deste site. O
   fechamento automático da janela depois do envio é feito pela
   própria página do Zeev (ela decide isso, não este script) —
   quando aberta via window.open, plataformas assim costumam se
   fechar sozinhas ao concluir o fluxo.
   ============================================================ */
(function initRequestWindow() {
  const triggers = document.querySelectorAll('[data-open-request-form]');
  if (!triggers.length) return;

  function openRequestWindow() {
    const width = 900;
    const height = 820;
    const left = Math.max(0, Math.round((window.screen.width - width) / 2));
    const top = Math.max(0, Math.round((window.screen.height - height) / 2));
    const features = `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer,resizable=yes,scrollbars=yes`;
    const win = window.open(CONFIG.EVENT_REQUEST_URL, 'solicitarEventoCESAR', features);
    if (!win) {
      // pop-up bloqueado pelo navegador — abre em nova aba como alternativa
      window.open(CONFIG.EVENT_REQUEST_URL, '_blank', 'noopener,noreferrer');
    } else {
      win.focus();
    }
  }

  triggers.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openRequestWindow();
    });
  });
})();

