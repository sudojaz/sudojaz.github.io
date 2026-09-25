// ---------- EDIT ME: this is the content that powers each folder ----------
  const FOLDERS = [
    {
      id: 'projects', label: 'Projects', tone: 'sky',
      title: 'Projects',
      render: () => `
        <div class="item">
          <h3>HOG-SAFE</h3>
          <div class="meta">Capstone thesis · Backend developer</div>
          <p>A web platform for AI-assisted hog monitoring and booking, built with Django REST Framework. Replace this paragraph with a short description of your specific contribution — endpoints you built, the data model, or a problem you solved.</p>
          <div class="tags"><span class="tag">Django REST Framework</span><span class="tag">Python</span><span class="tag">REST API</span></div>
        </div>
        <div class="item placeholder-note">— Add another project here by duplicating this block in the FOLDERS array —</div>
      `
    },
    {
      id: 'experience', label: 'Experience', tone: 'periwinkle',
      title: 'Experience',
      render: () => `
        <div class="item">
          <h3>Backend Developer — HOG-SAFE Capstone</h3>
          <div class="meta">PUP Sta. Mesa, Manila</div>
          <p>Replace with a sentence or two on what you owned: API design, database structure, or collaboration with your frontend teammates.</p>
        </div>
        <div class="item placeholder-note">— Add internships, freelance work, or org roles here —</div>
      `
    },
    {
      id: 'skills', label: 'Skills', tone: 'powder',
      title: 'Skills',
      render: () => `
        <div class="item">
          <div class="tags">
            <span class="tag">Django REST Framework</span>
            <span class="tag">Python</span>
            <span class="tag">Postman</span>
            <span class="tag">Git</span>
          </div>
          <p class="placeholder-note" style="margin-top:14px;">— Add the rest of your stack (databases, frontend tools you collaborate in, etc.) —</p>
        </div>
      `
    },
    {
      id: 'contact', label: 'Contact', tone: 'blush',
      title: 'Contact',
      render: () => `
        <div class="item">
          <div class="meta">Email</div>
          <p>your.email@example.com</p>
        </div>
        <div class="item">
          <div class="meta">Elsewhere</div>
          <p>GitHub · LinkedIn — replace with your real links</p>
        </div>
      `
    },
    {
      id: 'resume', label: 'Resume.pdf', tone: 'rose',
      title: 'Resume',
      render: () => `
        <p>Your resume, ready to download.</p>
        <p class="placeholder-note">This button currently downloads a placeholder file — swap the code's download logic for a real link to your resume PDF.</p>
        <div style="margin-top:14px;"><button class="btn" id="downloadResume">⬇ Download résumé</button></div>
      `
    }
  ];

  const grid = document.getElementById('folderGrid');
  FOLDERS.forEach(f => {
    const btn = document.createElement('button');
    btn.className = 'folder';
    btn.dataset.tone = f.tone;
    btn.innerHTML = `<span class="icon"></span><span class="label">${f.label}</span>`;
    btn.addEventListener('click', () => openWindow(f));
    grid.appendChild(btn);
  });

  const scrim = document.getElementById('scrim');
  const winTitle = document.getElementById('winTitle');
  const winBody = document.getElementById('winBody');
  const winSwatch = document.getElementById('winSwatch');
  const toneColor = { sky: 'var(--blue)', powder: 'var(--powder)', blush: 'var(--pink)', rose: 'var(--pink-deep)', periwinkle: 'var(--periwinkle)' };

  function openWindow(f){
    winTitle.textContent = f.title;
    winSwatch.style.background = toneColor[f.tone];
    winBody.innerHTML = f.render();
    scrim.classList.add('is-visible');
    const dl = document.getElementById('downloadResume');
    if (dl) dl.addEventListener('click', downloadPlaceholderResume);
    document.getElementById('winClose').focus();
  }
  function closeWindow(){ scrim.classList.remove('is-visible'); }
  document.getElementById('winClose').addEventListener('click', closeWindow);
  scrim.addEventListener('click', e => { if (e.target === scrim) closeWindow(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeWindow(); });

  function downloadPlaceholderResume(){
    const text = 'Replace this file with your actual resume PDF.\nSee the "resume" folder entry in the code for where to swap this in.';
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Jazlyn-Fajutrao-Resume-PLACEHOLDER.txt';
    a.click();
  }

  // ---------- Clock (drives both the lockscreen and the desktop topbar) ----------
  function updateClock(){
    const now = new Date();
    const time = now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' });
    document.getElementById('clock').textContent = time;
    document.getElementById('lockTime').textContent = time;
    document.getElementById('lockDate').textContent = date;
  }
  updateClock();
  setInterval(updateClock, 15000);

  // ---------- View counter ----------
  // Client-side counter stored in this browser's localStorage, so it only
  // counts visits from this device. For a real counter across every visitor,
  // wire this up to a tiny Django REST Framework endpoint you increment on
  // each request and fetch here instead of reading localStorage.
  function bumpViews(){
    const VIEW_KEY = 'jjf_portfolio_views';
    let count = 1;
    try {
      count = parseInt(localStorage.getItem(VIEW_KEY) || '0', 10) + 1;
      localStorage.setItem(VIEW_KEY, count);
    } catch (e) { /* localStorage unavailable — fall back to 1 */ }
    document.getElementById('viewCount').textContent = `Views: ${count}`;
  }
  bumpViews();

  // ---------- Landing → lockscreen → desktop, and back again ----------
  const laptopBtn = document.getElementById('laptopBtn');
  const laptopStage = document.getElementById('laptopStage');
  const landing = document.getElementById('landing');
  const lockscreen = document.getElementById('lockscreen');
  const desktop = document.getElementById('desktop');
  const lockBtn = document.getElementById('lockBtn');
  const shutdownBtn = document.getElementById('shutdownBtn');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  laptopBtn.addEventListener('click', () => {
    if (laptopBtn.disabled) return;
    laptopBtn.disabled = true;

    if (reduceMotion) {
      laptopBtn.classList.add('is-open');
      laptopStage.classList.add('is-facing');
      landing.classList.add('is-hidden');
      lockscreen.classList.add('is-visible');
      return;
    }

    laptopBtn.classList.add('is-open');
    laptopStage.classList.add('is-facing');
    setTimeout(() => {
      laptopStage.classList.add('is-zooming');
      lockscreen.classList.add('is-visible');
      setTimeout(() => { landing.classList.add('is-hidden'); }, 900);
    }, 550);
  });

  lockBtn.addEventListener('click', () => {
    lockscreen.classList.remove('is-visible');
    desktop.classList.add('is-visible');
  });

  shutdownBtn.addEventListener('click', () => {
    closeWindow();
    desktop.classList.remove('is-visible');
    lockscreen.classList.remove('is-visible');
    landing.classList.remove('is-hidden');
    laptopStage.classList.remove('is-zooming');
    laptopStage.classList.remove('is-facing');
    setTimeout(() => {
      laptopBtn.classList.remove('is-open');
      laptopBtn.disabled = false;
    }, 250);
  });
