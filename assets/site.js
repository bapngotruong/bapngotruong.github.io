/* Header + footer dùng chung, menu mobile, nhãn Đăng nhập/Tài khoản.
   Dùng: <div id="site-header" data-cta-text="..." data-cta-href="..."></div><script src="assets/site.js"></script> */
(function () {
  const host = document.getElementById('site-header');
  if (!host) return;
  const P = location.pathname.split('/').pop() || 'index.html';
  const cur = h => (h === P ? ' aria-current="page"' : '');
  const a = (h, t) => `<a href="${h}"${cur(h)}>${t}</a>`;
  const ext = (h, t) => `<a href="${h}" target="_blank" rel="noopener noreferrer">${t}</a>`;
  const dd = (t, items) => `<li class="dropdown"><button type="button" class="dropbtn" aria-expanded="false" aria-haspopup="true">${t} ▾</button><div class="dropdown-content">${items}</div></li>`;
  const ctaText = host.dataset.ctaText || 'Xem hành trình →';
  const ctaHref = host.dataset.ctaHref || 'index.html#journey';

  host.outerHTML = `<header>
    <div class="logo"><a href="index.html" aria-label="Về trang chủ"><img src="png/2160px/logo-ch-original.png" alt="Ngô Văn Trường Logo" width="140" height="70"></a></div>
    <button class="menu-toggle" id="menuToggle" aria-label="Mở menu" aria-expanded="false" aria-controls="navContainer"><span></span><span></span><span></span></button>
    <div class="nav-container" id="navContainer"><nav aria-label="Menu chính"><ul>
      <li>${a('index.html#about', 'Về')}</li>
      ${dd('Hành trình', a('index.html#journey-badminton', 'Cầu Lông') + a('index.html#journey-running', 'Chạy Bộ') + a('index.html#journey-ironman', 'Ironman') + a('index.html#journey-psychology', 'Phân Tích Tâm Lý'))}
      ${dd('Dịch vụ', a('thiet-ke.html', 'Thiết Kế Theo Yêu Cầu') + a('tu-van.html', 'Tư Vấn Tình Cảm') + a('ao-dau.html', 'Áo Đấu') + a('font.html', 'Bộ Font Độc Quyền'))}
      ${dd('Liên hệ', ext('https://web.facebook.com/truong.bapngo.2k6', 'Facebook') + ext('https://zalo.me/0337439799', 'Zalo') + ext('https://www.tiktok.com/@ngotruong2406', 'TikTok') + '<a href="mailto:truonglofi006@gmail.com">Gmail</a>')}
      <li><a href="tai-khoan.html" id="navAuth"${cur('tai-khoan.html')}>Đăng nhập</a></li>
    </ul></nav><a href="${ctaHref}" class="btn-start">${ctaText}</a></div></header>`;

  const H = document.querySelector('header'), T = H.querySelector('.menu-toggle'), N = H.querySelector('.nav-container');
  const needsClick = () => matchMedia('(hover: none), (max-width: 1024px)').matches;
  window.closeDropdowns = ex => H.querySelectorAll('.dropdown').forEach(d => {
    if (d === ex) return;
    d.querySelector('.dropdown-content').classList.remove('show');
    d.querySelector('.dropbtn').setAttribute('aria-expanded', 'false');
  });
  window.closeMenu = () => {
    N.classList.remove('open');
    T.setAttribute('aria-expanded', 'false');
    T.setAttribute('aria-label', 'Mở menu');
    closeDropdowns();
  };
  T.addEventListener('click', () => {
    const o = N.classList.toggle('open');
    T.setAttribute('aria-expanded', o);
    T.setAttribute('aria-label', o ? 'Đóng menu' : 'Mở menu');
  });
  H.querySelectorAll('.dropbtn').forEach(b => b.addEventListener('click', () => {
    if (!needsClick()) return;
    const d = b.closest('.dropdown');
    closeDropdowns(d);
    b.setAttribute('aria-expanded', d.querySelector('.dropdown-content').classList.toggle('show'));
  }));
  H.querySelectorAll('nav a, .btn-start').forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown')) closeDropdowns();
    if (!e.target.closest('header')) closeMenu();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  addEventListener('resize', () => { if (innerWidth > 1024) closeMenu(); });
  // Đang ở trang chủ mà bấm "Hành trình > ..." thì mở đúng mục accordion
  addEventListener('hashchange', () => {
    if (window.openAndScrollJourney && location.hash.startsWith('#journey-')) openAndScrollJourney(location.hash.slice(1));
  });

  // Đã đăng nhập (token Supabase còn trong localStorage) thì đổi nhãn nút
  try {
    const k = Object.keys(localStorage).find(k => /^sb-.+-auth-token$/.test(k));
    if (k && JSON.parse(localStorage.getItem(k)).access_token) document.getElementById('navAuth').textContent = 'Tài khoản';
  } catch (e) {}

  // Footer dùng chung: <div id="site-footer" data-note="(tuỳ chọn) dòng lưu ý"></div>
  document.addEventListener('DOMContentLoaded', () => {
    const f = document.getElementById('site-footer');
    if (!f) return;
    f.outerHTML = `<footer><p class="footer-quote">"Sự tự tin dám thể hiện bản thân không phải là khao khát sự chú ý, mà là quyền được cất lên tiếng nói của riêng mình."<br>— Ngô Văn Trường —</p>
      <div class="footer-contact">${['https://web.facebook.com/truong.bapngo.2k6|Facebook', 'https://zalo.me/0337439799|Zalo', 'https://www.tiktok.com/@ngotruong2406|TikTok'].map(s => { const [h, t] = s.split('|'); return `<a class="social-btn" href="${h}" target="_blank" rel="noopener noreferrer">${t}</a>`; }).join('')}<a class="social-btn" href="mailto:truonglofi006@gmail.com">Gmail</a></div>
      ${f.dataset.note ? `<p class="disclaimer">${f.dataset.note}</p>` : ''}</footer>`;
  });
})();