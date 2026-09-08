'use strict';

/* ============================================================
   EVENTOS CESAR — script.js
   Organizado em: CONFIG/DADOS → utilitários → cada seção.
   Edite a seção "DADOS" abaixo para trocar eventos/fotos reais.
   ============================================================ */

/* ---------------------------------------------------------
   CONFIG — cole aqui a URL do seu Web App do Google Apps
   Script depois de publicá-lo (veja apps-script/Code.gs e
   o README.md para o passo a passo).
--------------------------------------------------------- */
const CONFIG = {
  APPS_SCRIPT_URL: 'COLE_AQUI_A_URL_DO_SEU_APPS_SCRIPT',
  MAX_FILE_MB: 5,
};

/* ---------------------------------------------------------
   DADOS — troque pelos eventos e fotos reais da empresa.
   Datas no formato 'AAAA-MM-DD'.
--------------------------------------------------------- */
const EVENTS_DATA = [
  { id: 'e1', date: '2026-09-10', time: '14:00', title: 'Workshop de Liderança', category: 'Treinamento', location: 'Sala Multiuso 2', description: 'Sessão prática sobre gestão de times e feedback contínuo.' },
  { id: 'e2', date: '2026-09-25', time: '17:30', title: 'Tech Talk: IA aplicada ao dia a dia', category: 'Palestra', location: 'Auditório Principal', description: 'Bate-papo aberto sobre uso prático de IA nos projetos internos.' },
  { id: 'e3', date: '2026-10-08', time: '09:00', title: 'Hackathon CESAR', category: 'Hackathon', location: 'Espaço Inovação', description: '48h de criação em equipe, com mentoria e premiação.' },
  { id: 'e4', date: '2026-10-08', time: '19:00', title: 'Happy Hour de Encerramento', category: 'Confraternização', location: 'Terraço', description: 'Celebração de encerramento do Hackathon CESAR.' },
  { id: 'e5', date: '2026-11-14', time: '07:00', title: 'Corrida CESAR', category: 'Integração', location: 'Parque da Jaqueira', description: 'Corrida de 5km aberta a todos os colaboradores e familiares.' },
  { id: 'e6', date: '2026-11-27', time: '10:00', title: 'Onboarding de Novos Times', category: 'Treinamento', location: 'Sala Multiuso 1', description: 'Apresentação institucional para colaboradores recém-chegados.' },
  { id: 'e7', date: '2026-12-15', time: '19:00', title: 'Confraternização de Fim de Ano', category: 'Confraternização', location: 'Auditório Principal', description: 'Jantar, música ao vivo e premiações para fechar o ano.' },
  { id: 'e8', date: '2027-01-22', time: '15:00', title: 'Planejamento Estratégico 2027', category: 'Reunião', location: 'Sala Multiuso 2', description: 'Kickoff das metas e prioridades do novo ano.' },
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
  { year: 2025, title: 'Confraternização de Fim de Ano', month: 'Dezembro', icon: 'confetti' },
  { year: 2025, title: 'Hackathon CESAR', month: 'Outubro', icon: 'trophy' },
  { year: 2025, title: 'Corrida CESAR', month: 'Novembro', icon: 'runner' },
  { year: 2025, title: 'Tech Talk: IA Generativa', month: 'Agosto', icon: 'mic' },
  { year: 2025, title: 'Onboarding Coletivo', month: 'Abril', icon: 'badge' },
  { year: 2025, title: 'Semana da Inovação', month: 'Setembro', icon: 'bulb' },
  { year: 2026, title: 'Workshop de Liderança', month: 'Setembro', icon: 'users' },
  { year: 2026, title: 'Tech Talk: IA aplicada', month: 'Setembro', icon: 'mic' },
];

/* ---------------------------------------------------------
   PAINEL DE INDICADORES — dados de exemplo (fallback).
   Usados só enquanto CONFIG.APPS_SCRIPT_URL não está configurada,
   ou se a leitura em tempo real falhar. Formato idêntico ao que o
   Code.gs devolve no GET (uma linha por solicitação recebida).
--------------------------------------------------------- */
const DASHBOARD_DEMO_DATA = [
  { departamento: 'Recursos Humanos', dataDesejada: '2026-01-14', enviadoEm: '2025-12-10T09:00:00.000Z', local: 'Auditório Principal', convidados: 80, orcamento: 4200, coffeeBreak: true },
  { departamento: 'Tecnologia', dataDesejada: '2026-01-22', enviadoEm: '2026-01-02T09:00:00.000Z', local: 'Sala Multiuso 1', convidados: 25, orcamento: 1200, coffeeBreak: false },
  { departamento: 'Comercial', dataDesejada: '2026-02-05', enviadoEm: '2026-01-11T09:00:00.000Z', local: 'Sala Multiuso 2', convidados: 40, orcamento: 2800, coffeeBreak: true },
  { departamento: 'Marketing', dataDesejada: '2026-02-19', enviadoEm: '2026-01-10T09:00:00.000Z', local: 'Auditório Principal', convidados: 60, orcamento: 3500, coffeeBreak: true },
  { departamento: 'Tecnologia', dataDesejada: '2026-03-04', enviadoEm: '2026-02-17T09:00:00.000Z', local: 'Espaço Inovação', convidados: 30, orcamento: 1800, coffeeBreak: false },
  { departamento: 'Operações', dataDesejada: '2026-03-11', enviadoEm: '2026-03-01T09:00:00.000Z', local: 'Sala Multiuso 1', convidados: 20, orcamento: 900, coffeeBreak: false },
  { departamento: 'Diretoria', dataDesejada: '2026-03-26', enviadoEm: '2026-02-04T09:00:00.000Z', local: 'Auditório Principal', convidados: 45, orcamento: 6000, coffeeBreak: true },
  { departamento: 'Recursos Humanos', dataDesejada: '2026-04-08', enviadoEm: '2026-03-17T09:00:00.000Z', local: 'Sala Multiuso 2', convidados: 35, orcamento: 2000, coffeeBreak: true },
  { departamento: 'Tecnologia', dataDesejada: '2026-04-23', enviadoEm: '2026-03-24T09:00:00.000Z', local: 'Espaço Inovação', convidados: 50, orcamento: 3000, coffeeBreak: true },
  { departamento: 'Comercial', dataDesejada: '2026-05-06', enviadoEm: '2026-04-18T09:00:00.000Z', local: 'Terraço', convidados: 28, orcamento: 1600, coffeeBreak: false },
  { departamento: 'Marketing', dataDesejada: '2026-05-15', enviadoEm: '2026-03-31T09:00:00.000Z', local: 'Auditório Principal', convidados: 90, orcamento: 5200, coffeeBreak: true },
  { departamento: 'Tecnologia', dataDesejada: '2026-05-27', enviadoEm: '2026-05-15T09:00:00.000Z', local: 'Sala Multiuso 1', convidados: 18, orcamento: 800, coffeeBreak: false },
  { departamento: 'Recursos Humanos', dataDesejada: '2026-06-10', enviadoEm: '2026-05-03T09:00:00.000Z', local: 'Auditório Principal', convidados: 100, orcamento: 7000, coffeeBreak: true },
  { departamento: 'Operações', dataDesejada: '2026-06-18', enviadoEm: '2026-06-04T09:00:00.000Z', local: 'Sala Multiuso 2', convidados: 22, orcamento: 1100, coffeeBreak: false },
  { departamento: 'Diretoria', dataDesejada: '2026-06-29', enviadoEm: '2026-05-18T09:00:00.000Z', local: 'Espaço Inovação', convidados: 35, orcamento: 5000, coffeeBreak: true },
  { departamento: 'Tecnologia', dataDesejada: '2026-07-09', enviadoEm: '2026-06-19T09:00:00.000Z', local: 'Espaço Inovação', convidados: 40, orcamento: 2200, coffeeBreak: true },
  { departamento: 'Comercial', dataDesejada: '2026-07-17', enviadoEm: '2026-07-01T09:00:00.000Z', local: 'Sala Multiuso 1', convidados: 26, orcamento: 1400, coffeeBreak: false },
  { departamento: 'Marketing', dataDesejada: '2026-07-30', enviadoEm: '2026-07-02T09:00:00.000Z', local: 'Terraço', convidados: 55, orcamento: 3200, coffeeBreak: true },
  { departamento: 'Recursos Humanos', dataDesejada: '2026-08-06', enviadoEm: '2026-07-04T09:00:00.000Z', local: 'Auditório Principal', convidados: 70, orcamento: 4000, coffeeBreak: true },
  { departamento: 'Tecnologia', dataDesejada: '2026-08-14', enviadoEm: '2026-07-26T09:00:00.000Z', local: 'Sala Multiuso 2', convidados: 32, orcamento: 1700, coffeeBreak: false },
  { departamento: 'Operações', dataDesejada: '2026-08-25', enviadoEm: '2026-08-01T09:00:00.000Z', local: 'Auditório Principal', convidados: 48, orcamento: 2600, coffeeBreak: true },
  { departamento: 'Tecnologia', dataDesejada: '2026-09-10', enviadoEm: '2026-08-26T09:00:00.000Z', local: 'Sala Multiuso 2', convidados: 24, orcamento: 1300, coffeeBreak: false },
  { departamento: 'Comercial', dataDesejada: '2026-09-18', enviadoEm: '2026-08-28T09:00:00.000Z', local: 'Espaço Inovação', convidados: 33, orcamento: 1900, coffeeBreak: true },
  { departamento: 'Diretoria', dataDesejada: '2026-09-27', enviadoEm: '2026-08-10T09:00:00.000Z', local: 'Auditório Principal', convidados: 60, orcamento: 6500, coffeeBreak: true },
  { departamento: 'Tecnologia', dataDesejada: '2026-10-08', enviadoEm: '2026-08-14T09:00:00.000Z', local: 'Espaço Inovação', convidados: 120, orcamento: 9000, coffeeBreak: true },
  { departamento: 'Marketing', dataDesejada: '2026-10-21', enviadoEm: '2026-10-01T09:00:00.000Z', local: 'Terraço', convidados: 42, orcamento: 2400, coffeeBreak: false },
  { departamento: 'Recursos Humanos', dataDesejada: '2026-11-05', enviadoEm: '2026-10-25T09:00:00.000Z', local: 'Sala Multiuso 1', convidados: 20, orcamento: 950, coffeeBreak: false },
  { departamento: 'Operações', dataDesejada: '2026-11-19', enviadoEm: '2026-10-20T09:00:00.000Z', local: 'Espaço externo', convidados: 65, orcamento: 3800, coffeeBreak: true },
  { departamento: 'Recursos Humanos', dataDesejada: '2026-12-15', enviadoEm: '2026-10-16T09:00:00.000Z', local: 'Auditório Principal', convidados: 150, orcamento: 8500, coffeeBreak: true },
  { departamento: 'Tecnologia', dataDesejada: '2026-12-22', enviadoEm: '2026-12-13T09:00:00.000Z', local: 'Sala Multiuso 1', convidados: 16, orcamento: 700, coffeeBreak: false },
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
   ============================================================ */
(function initCalendar() {
  const monthLabel = document.getElementById('calMonthLabel');
  const grid = document.getElementById('calDayGrid');
  const prevBtn = document.getElementById('calPrev');
  const nextBtn = document.getElementById('calNext');
  const listWrap = document.getElementById('eventList');
  const listHeading = document.getElementById('eventListHeading');
  const clearBtn = document.getElementById('eventListClear');
  if (!grid) return;

  const eventsByDate = new Map();
  EVENTS_DATA.forEach((ev) => {
    if (!eventsByDate.has(ev.date)) eventsByDate.set(ev.date, []);
    eventsByDate.get(ev.date).push(ev);
  });

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = null;

  function isoOf(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
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
    return EVENTS_DATA
      .filter((e) => parseISODate(e.date) >= now)
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
      const card = document.createElement('article');
      card.className = 'event-card';
      card.innerHTML = `
        <div class="event-date-block" aria-hidden="true">
          <span class="day">${date.getDate()}</span>
          <span class="month">${MONTHS_SHORT_PT[date.getMonth()]}</span>
        </div>
        <div class="event-card-body">
          <span class="event-tag">${ev.category}</span>
          <h4>${ev.title}</h4>
          <p class="event-card-meta">
            <span>${ICONS.clock}${ev.time}</span>
            <span>${ICONS.pin}${ev.location}</span>
          </p>
        </div>`;
      listWrap.appendChild(card);
    });
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

  renderCalendar();
  renderEventList();
})();

/* ============================================================
   PAINEL DE INDICADORES
   Lê as solicitações reais via Google Apps Script (GET) e calcula
   tudo no navegador. Sem URL configurada — ou se a leitura falhar —
   usa DASHBOARD_DEMO_DATA e avisa isso claramente na tela.
   ============================================================ */
(function initDashboardPanel() {
  const notice = document.getElementById('panelNotice');
  if (!notice) return;

  const refreshBtn = document.getElementById('panelRefresh');
  const updatedEl = document.getElementById('panelUpdated');
  const AUTO_REFRESH_MS = 5 * 60 * 1000;

  const currencyFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const numberFmt = new Intl.NumberFormat('pt-BR');
  const dayFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

  let lastUpdated = null;
  let tickTimer = null;

  function toDateSafe(value) {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    const str = String(value);
    const isoDateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
    if (isoDateOnly) {
      return new Date(Number(isoDateOnly[1]), Number(isoDateOnly[2]) - 1, Number(isoDateOnly[3]));
    }
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }
  function daysBetween(a, b) {
    return Math.round((b.getTime() - a.getTime()) / 86400000);
  }

  async function fetchRequests() {
    if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL.startsWith('COLE_AQUI')) {
      return { records: DASHBOARD_DEMO_DATA, notice: 'not-configured' };
    }
    try {
      const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?t=${Date.now()}`, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.ok || !Array.isArray(json.data)) throw new Error('Resposta inesperada');
      if (json.data.length === 0) return { records: [], notice: 'empty' };
      return { records: json.data, notice: null };
    } catch (err) {
      return { records: DASHBOARD_DEMO_DATA, notice: 'fetch-failed' };
    }
  }

  function computeMetrics(records) {
    const total = records.length;
    const monthMap = new Map();
    const roomMap = new Map();
    const deptMap = new Map();
    let guestsSum = 0, guestsCount = 0;
    let budgetSum = 0, budgetCount = 0;
    let leadSum = 0, leadCount = 0;
    let coffeeCount = 0;
    let diretoriaCount = 0;

    records.forEach((r) => {
      const dd = toDateSafe(r.dataDesejada);
      if (dd) {
        const key = `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}`;
        monthMap.set(key, (monthMap.get(key) || 0) + 1);
      }

      const local = String(r.local || '').trim();
      if (local) roomMap.set(local, (roomMap.get(local) || 0) + 1);

      const dept = String(r.departamento || '').trim();
      if (dept) {
        deptMap.set(dept, (deptMap.get(dept) || 0) + 1);
        if (dept === 'Diretoria') diretoriaCount++;
      }

      const guests = Number(r.convidados);
      if (Number.isFinite(guests) && guests > 0) { guestsSum += guests; guestsCount++; }

      const budget = Number(r.orcamento);
      if (Number.isFinite(budget) && budget > 0) { budgetSum += budget; budgetCount++; }

      const sentDate = toDateSafe(r.enviadoEm);
      if (dd && sentDate) {
        const lead = daysBetween(sentDate, dd);
        if (Number.isFinite(lead) && lead >= 0) { leadSum += lead; leadCount++; }
      }

      if (r.coffeeBreak === true || r.coffeeBreak === 'Sim' || r.coffeeBreak === 'sim') coffeeCount++;
    });

    return {
      total,
      monthEntries: Array.from(monthMap.entries()).sort((a, b) => a[0].localeCompare(b[0])),
      roomEntries: Array.from(roomMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5),
      deptEntries: Array.from(deptMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5),
      avgGuests: guestsCount ? guestsSum / guestsCount : null,
      avgBudget: budgetCount ? budgetSum / budgetCount : null,
      avgLeadDays: leadCount ? leadSum / leadCount : null,
      coffeeCount,
      coffeePct: total ? (coffeeCount / total) * 100 : 0,
      diretoriaCount,
      diretoriaPct: total ? (diretoriaCount / total) * 100 : 0,
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

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderMonthChart(entries) {
    const wrap = document.getElementById('monthBarChart');
    wrap.innerHTML = '';
    if (!entries.length) {
      const p = document.createElement('p');
      p.className = 'empty-note';
      p.textContent = 'Sem solicitações suficientes ainda.';
      wrap.appendChild(p);
      return;
    }
    const max = Math.max(...entries.map(([, v]) => v));
    entries.forEach(([key, value]) => {
      const col = document.createElement('div');
      col.className = 'bar-col';
      col.tabIndex = 0;
      const fullLabel = `${monthLabelFull(key)}: ${value} solicitaç${value > 1 ? 'ões' : 'ão'}`;
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
    setText('statAvgGuests', m.avgGuests != null ? numberFmt.format(Math.round(m.avgGuests)) : '—');
    setText('statAvgGuestsCaption', m.avgGuests != null ? `em ${numberFmt.format(m.total)} solicitações` : 'sem dados ainda');

    setText('statLeadTime', m.avgLeadDays != null ? dayFmt.format(m.avgLeadDays) : '—');
    setText('statLeadTimeCaption', m.avgLeadDays != null ? 'dias entre pedido e evento' : 'sem dados ainda');

    setText('statCoffee', m.total ? numberFmt.format(m.coffeeCount) : '—');
    setText('statCoffeeCaption', m.total ? `${dayFmt.format(m.coffeePct)}% das solicitações` : 'sem dados ainda');

    setText('statDiretoria', m.total ? numberFmt.format(m.diretoriaCount) : '—');
    setText('statDiretoriaCaption', m.total ? `${dayFmt.format(m.diretoriaPct)}% das solicitações` : 'sem dados ainda');

    setText('statBudget', m.avgBudget != null ? currencyFmt.format(m.avgBudget) : '—');
    setText('statBudgetCaption', m.avgBudget != null ? 'por evento, em média' : 'sem dados ainda');
  }

  function renderNotice(kind) {
    const messages = {
      'not-configured': `${ICONS.alert}<span><strong>Mostrando dados de exemplo.</strong> Configure <code>CONFIG.APPS_SCRIPT_URL</code> em script.js pra ver os números reais das solicitações (veja o README.md).</span>`,
      'fetch-failed': `${ICONS.alert}<span><strong>Não foi possível ler os dados agora.</strong> Mostrando dados de exemplo enquanto isso — tente atualizar em instantes.</span>`,
      'empty': `${ICONS.alert}<span><strong>Ainda não há solicitações registradas.</strong> Assim que o formulário receber os primeiros pedidos, os indicadores aparecem aqui automaticamente.</span>`,
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

  async function loadAndRender() {
    refreshBtn.classList.add('is-loading');
    refreshBtn.disabled = true;

    const { records, notice: noticeKind } = await fetchRequests();
    const metrics = computeMetrics(records);

    renderStats(metrics);
    renderMonthChart(metrics.monthEntries);
    renderRankList('roomsRankList', metrics.roomEntries, 'solicitações');
    renderRankList('deptsRankList', metrics.deptEntries, 'solicitações');
    renderNotice(noticeKind);

    lastUpdated = new Date();
    updateTimestampLabel();

    refreshBtn.classList.remove('is-loading');
    refreshBtn.disabled = false;
  }

  refreshBtn.addEventListener('click', loadAndRender);
  loadAndRender();

  clearInterval(tickTimer);
  tickTimer = setInterval(updateTimestampLabel, 30 * 1000);
  setInterval(loadAndRender, AUTO_REFRESH_MS);
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
      // PLACEHOLDER visual — troque por <img src="fotos/2026/arquivo.jpg" alt="..."> quando tiver as fotos reais.
      tile.innerHTML = `
        <div class="tile-bg" style="background:${tileGradient(photo.title)}">${ICONS[photo.icon] || ICONS.camera}</div>
        <div class="tile-caption"><strong>${photo.title}</strong><span>${photo.month} · ${photo.year}</span></div>`;
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
  const lbVisual = document.getElementById('lightboxVisual');
  const lbTitle = document.getElementById('lightboxTitle');
  const lbMeta = document.getElementById('lightboxMeta');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');
  const lbClose = document.getElementById('lightboxClose');

  function renderLightbox() {
    const photo = activeItems[lightboxIndex];
    lbVisual.style.background = tileGradient(photo.title);
    lbVisual.innerHTML = ICONS[photo.icon] || ICONS.camera;
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
   MODAL — FORMULÁRIO DE SOLICITAÇÃO DE EVENTO
   ============================================================ */
(function initRequestForm() {
  const dialog = document.getElementById('requestDialog');
  const openBtns = document.querySelectorAll('[data-open-request-form]');
  const closeBtn = document.getElementById('requestClose');
  const form = document.getElementById('requestForm');
  const formBody = document.getElementById('formBody');
  const successView = document.getElementById('formSuccessView');
  const submitBtn = document.getElementById('requestSubmit');
  const statusBox = document.getElementById('formStatus');
  const fileInput = document.getElementById('fieldAttachment');
  const fileChip = document.getElementById('fileNameChip');
  const fileRemove = document.getElementById('fileRemove');
  const dropZone = document.getElementById('fileDropZone');
  const successCloseBtn = document.getElementById('formSuccessClose');
  if (!dialog) return;

  let isDirty = false;

  function resetForm() {
    form.reset();
    isDirty = false;
    fileChip.style.display = 'none';
    statusBox.classList.remove('is-visible', 'success', 'error');
    form.querySelectorAll('.field').forEach((f) => f.classList.remove('has-error'));
    formBody.classList.remove('is-hidden');
    successView.classList.remove('is-visible');
  }

  openBtns.forEach((btn) => btn.addEventListener('click', () => {
    resetForm();
    dialog.showModal();
    document.getElementById('fieldName').focus();
  }));

  form.addEventListener('input', () => { isDirty = true; });

  function requestClose() {
    if (isDirty && !successView.classList.contains('is-visible')) {
      const ok = window.confirm('Você preencheu informações que ainda não foram enviadas. Deseja realmente fechar e descartá-las?');
      if (!ok) return;
    }
    dialog.close();
  }
  closeBtn.addEventListener('click', requestClose);
  successCloseBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('cancel', (e) => {
    // tecla Esc dispara 'cancel' antes de fechar — intercepta se precisar confirmar
    if (isDirty && !successView.classList.contains('is-visible')) {
      e.preventDefault();
      requestClose();
    }
  });

  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) { fileChip.style.display = 'none'; return; }
    const maxBytes = CONFIG.MAX_FILE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      window.alert(`O arquivo escolhido tem mais de ${CONFIG.MAX_FILE_MB}MB. Escolha um arquivo menor.`);
      fileInput.value = '';
      fileChip.style.display = 'none';
      return;
    }
    fileChip.querySelector('span').textContent = file.name;
    fileChip.style.display = 'inline-flex';
    isDirty = true;
  });
  fileRemove.addEventListener('click', () => {
    fileInput.value = '';
    fileChip.style.display = 'none';
  });

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function showFieldError(field, message) {
    const wrap = field.closest('.field');
    wrap.classList.add('has-error');
    wrap.querySelector('.field-error').textContent = message;
  }
  function clearFieldError(field) {
    field.closest('.field').classList.remove('has-error');
  }

  function validateForm() {
    let firstInvalid = null;
    form.querySelectorAll('[data-required]').forEach((field) => {
      field.setAttribute('data-touched', 'true');
      const valid = field.checkValidity() && field.value.trim() !== '';
      if (!valid) {
        showFieldError(field, field.dataset.errorMessage || 'Preencha este campo.');
        if (!firstInvalid) firstInvalid = field;
      } else {
        clearFieldError(field);
      }
    });
    return firstInvalid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstInvalid = validateForm();
    if (firstInvalid) { firstInvalid.focus(); return; }

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    statusBox.classList.remove('is-visible', 'success', 'error');

    const payload = {
      nome: form.fieldName.value.trim(),
      email: form.fieldEmail.value.trim(),
      departamento: form.fieldDept.value,
      tipoEvento: form.fieldType.value,
      dataDesejada: form.fieldDate.value,
      local: form.fieldLocation.value,
      convidados: form.fieldGuests.value,
      descricao: form.fieldDescription.value.trim(),
      orcamento: form.fieldBudget.value,
      coffeeBreak: form.fieldCoffeeBreak.checked,
      enviadoEm: new Date().toISOString(),
      anexo: null,
    };

    try {
      const file = fileInput.files[0];
      if (file) {
        payload.anexo = { nome: file.name, tipo: file.type, dados: await fileToBase64(file) };
      }

      if (CONFIG.APPS_SCRIPT_URL.startsWith('COLE_AQUI')) {
        throw new Error('CONFIG_MISSING');
      }

      // 'text/plain' evita o preflight CORS que o Apps Script não responde por padrão.
      await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      // modo 'no-cors' sempre retorna uma resposta opaca: não dá pra ler o
      // status real do servidor, então tratamos "sem erro de rede" como sucesso.
      formBody.classList.add('is-hidden');
      successView.classList.add('is-visible');
      isDirty = false;
    } catch (err) {
      statusBox.classList.add('is-visible', 'error');
      statusBox.innerHTML = CONFIG.APPS_SCRIPT_URL.startsWith('COLE_AQUI')
        ? `${ICONS.alert}<span><strong>Formulário ainda não conectado.</strong> Configure a URL do Apps Script em <code>CONFIG.APPS_SCRIPT_URL</code> no script.js (veja o README.md).</span>`
        : `${ICONS.alert}<span><strong>Não foi possível enviar agora.</strong> Verifique sua conexão e tente novamente.</span>`;
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });
})();
