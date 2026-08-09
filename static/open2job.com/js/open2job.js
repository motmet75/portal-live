(() => {
  const data = {
    timeline: {
      title: 'The journey', label: '2018 — Now', nav: ['Now · Nova Labs','2023 · Independent','2021 · Loomly','2018 · Beginning'],
      html: `<div class="timeline">
        <article class="timeline-item"><time>2024 — now</time><div class="timeline-card"><div><h4>Lead Product Designer · Nova Labs</h4><p>Leading a small design team building tools that help climate researchers understand complex field data.</p><span class="tag">Leadership</span><span class="tag">Climate tech</span><span class="tag">With Aisha, Tom + 4</span></div><img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=500&q=80" alt="Team working together"></div></article>
        <article class="timeline-item"><time>2023 — 24</time><div class="timeline-card"><div><h4>Independent designer</h4><p>Partnered with early-stage teams to turn ambiguous ideas into tested, launch-ready products.</p><span class="tag">7 launches</span><span class="tag">With Jun, Lena + 8</span></div><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80" alt="Workshop wall"></div></article>
        <article class="timeline-item"><time>2021 — 23</time><div class="timeline-card"><div><h4>Senior Product Designer · Loomly</h4><p>Rebuilt onboarding around real user intent, improving first-week activation by 31%.</p><span class="tag">Product strategy</span><span class="tag">+31% activation</span></div><img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=500&q=80" alt="Design collaboration"></div></article>
      </div>`
    },
    achievements: {
      title: 'Selected impact', label: 'Outcomes over titles', nav: ['31% activation','12 products','3 design awards','24 mentees'],
      html: `<div class="achievement-grid">
        <article class="achievement-card"><small>Product</small><b>+31%</b><h4>Activation, redesigned</h4><p>Mapped 42 onboarding journeys with Priya and Dan, then reduced the path to first value from nine steps to four.</p></article>
        <article class="achievement-card"><small>Delivery</small><b>12</b><h4>Products shipped</h4><p>From research prototypes to mature platforms used by teams across four continents.</p></article>
        <article class="achievement-card"><small>Recognition</small><b>03</b><h4>Design awards</h4><p>Recognition shared with the researchers, engineers, writers and clients behind the work.</p></article>
        <article class="achievement-card"><small>Community</small><b>24</b><h4>Designers mentored</h4><p>A monthly practice focused on portfolio storytelling, confidence, and finding a personal design voice.</p></article>
      </div>`
    },
    people: {
      title: 'People behind the work', label: 'Selected collaborators', nav: ['Nova Labs','Independent','Loomly'],
      html: `<div class="people-grid">
        <article class="person-card"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80" alt="Aisha Rahman"><h4>Aisha Rahman</h4><small>Research lead · Nova Labs</small><p>Worked together on the Field Atlas and research system.</p></article>
        <article class="person-card"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80" alt="Tom Becker"><h4>Tom Becker</h4><small>Engineer · Nova Labs</small><p>Built the data canvas and interaction engine together.</p></article>
        <article class="person-card"><img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80" alt="Jun Park"><h4>Jun Park</h4><small>Founder · Sora</small><p>Partnered from first sketch through the public launch.</p></article>
      </div>`
    }
  };

  const content = document.querySelector('#stageContent');
  const nav = document.querySelector('#stageNav');
  const progress = document.querySelector('#progressLine');
  function render(view) {
    const item = data[view];
    content.innerHTML = `<div class="stage-title"><h3>${item.title}</h3><span>${item.label}</span></div>${item.html}`;
    nav.innerHTML = item.nav.map((label,i) => `<button class="${i===0?'active':''}" data-index="${i}">${label}</button>`).join('');
    nav.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
      nav.querySelector('.active')?.classList.remove('active'); button.classList.add('active');
      progress.style.height = `${((Number(button.dataset.index)+1)/item.nav.length)*100}%`;
      content.animate([{opacity:.45,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:350});
    }));
    progress.style.height = `${100/item.nav.length}%`;
  }
  document.querySelectorAll('.view-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelector('.view-tab.active')?.classList.remove('active');
    document.querySelectorAll('.view-tab').forEach(t => t.setAttribute('aria-selected','false'));
    tab.classList.add('active'); tab.setAttribute('aria-selected','true'); render(tab.dataset.view);
  }));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')), {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  const privacyDialog = document.querySelector('#privacyDialog');
  const reelDialog = document.querySelector('#reelDialog');
  document.querySelector('#privacyButton').addEventListener('click', () => privacyDialog.showModal());
  document.querySelector('#reelButton').addEventListener('click', () => reelDialog.showModal());
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', e => { if(e.target === dialog) dialog.close(); }));
  render('timeline');
})();
