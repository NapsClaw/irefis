/* ══════════════════════════════════════════════════
   IREFIS — script.js | Sparkz Agency
   ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Navbar scroll ── */
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── Mobile menu toggle ── */
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close menu when any link is clicked
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    // Close on backdrop click (outside nav)
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Smooth active nav highlight ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-menu a[href^="#"]');
  function setActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'white'
        : '';
      link.style.background = link.getAttribute('href') === '#' + current
        ? 'rgba(255,255,255,0.12)'
        : '';
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ── Cartão 3D tilt on mouse move ── */
  const card = document.querySelector('.cartao-front');
  if (card) {
    const wrap = document.querySelector('.cartao-mockup');
    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 12}deg) scale(1.03)`;
    });
    wrap.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  }

  /* ── Stats counter animation ── */
  function animateCounter(el, target, suffix, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const isPlus = suffix.includes('+');
    const cleanSuffix = suffix.replace('+','');
    function update() {
      start = Math.min(start + step, target);
      if (typeof target === 'number' && Number.isInteger(target)) {
        el.textContent = (isPlus ? '+' : '') + Math.floor(start) + cleanSuffix;
      }
      if (start < target) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsBar = document.querySelector('.stats-bar');
  let statsAnimated = false;
  if (statsBar && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateCounter(document.querySelectorAll('.stat-num')[0], 500, '+', 1500);
        animateCounter(document.querySelectorAll('.stat-num')[1], 8,   '',  800);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(statsBar);
  }

  /* ── Entrance animation for cards ── */
  const animTargets = document.querySelectorAll(
    '.trat-card, .socio-card, .mvv-card, .doc-card, .pillar, .cartao-ben'
  );

  if ('IntersectionObserver' in window) {
    // Pre-style: visible by default, just add a subtle entrance
    animTargets.forEach((el, i) => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    const cardObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('entered');
          cardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animTargets.forEach(el => cardObs.observe(el));
  }

  /* ── Hero parallax (subtle) ── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.3;
      heroBg.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  /* ── Copy WhatsApp number on click (contact card) ── */
  // No action needed; all WA links go directly to WhatsApp

  /* ── Calculadora de Frete — Camiseta Branca ── */
  (function initFreteCalc() {
    const cepInput  = document.getElementById('freteCep');
    const qtdInput  = document.getElementById('freteQtd');
    const btnCalc   = document.getElementById('btnCalcularFrete');
    const btnLabel  = document.getElementById('btnFreteLabel');
    const resultado = document.getElementById('freteResultado');
    const ctaWa     = document.getElementById('freteCtaWa');

    if (!cepInput || !btnCalc) return;

    /* Máscara CEP: 00000-000 */
    cepInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').substring(0, 8);
      if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5);
      this.value = v;
    });

    /* Pressionar Enter no campo CEP dispara cálculo */
    cepInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') btnCalc.click();
    });

    const WA_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

    function setLoading(on) {
      btnCalc.disabled = on;
      btnLabel.textContent = on ? 'Buscando...' : 'Calcular Frete';
    }

    function showErro(msg) {
      resultado.innerHTML = `<p class="frete-erro">${msg}</p>`;
      ctaWa.innerHTML = '';
    }

    btnCalc.addEventListener('click', async function () {
      const cepRaw = cepInput.value.replace(/\D/g, '');
      const qtd    = Math.max(1, parseInt(qtdInput.value, 10) || 1);

      if (cepRaw.length !== 8) {
        showErro('⚠️ Digite um CEP válido com 8 dígitos.');
        return;
      }

      setLoading(true);
      resultado.innerHTML = '';
      ctaWa.innerHTML    = '';

      try {
        const resp = await fetch(`https://viacep.com.br/ws/${cepRaw}/json/`, { signal: AbortSignal.timeout ? AbortSignal.timeout(6000) : undefined });
        if (!resp.ok) throw new Error('Erro HTTP ' + resp.status);
        const data = await resp.json();

        if (data.erro) {
          showErro('⚠️ CEP não encontrado. Verifique o número e tente novamente.');
          return;
        }

        const cidade       = data.localidade || '';
        const uf           = data.uf || '';
        const cepFormatado = cepRaw.substring(0, 5) + '-' + cepRaw.substring(5);
        const totalCents   = (40 * qtd * 100) | 0;
        const totalStr     = 'R$ ' + (totalCents / 100).toFixed(2).replace('.', ',');
        const camisStr     = `${qtd} camiseta${qtd > 1 ? 's' : ''}`;
        const isLagoaSanta = cidade.toLowerCase().trim() === 'lagoa santa' && uf === 'MG';

        let resHtml, msgWa, ctaLabel;

        if (isLagoaSanta) {
          resHtml = `
            <div class="frete-ok local">
              <span class="frete-ok-icon">📍</span>
              <div class="frete-ok-body">
                <strong>Lagoa Santa / MG — Entrega local!</strong>
                <p>${camisStr} — <em>${totalStr}</em> — Retirada ou entrega local a combinar diretamente com a equipe. Sem custo adicional de frete!</p>
              </div>
            </div>`;
          msgWa    = `Olá! Quero comprar ${camisStr} branca${qtd > 1 ? 's' : ''} do IREFIS (R$ 40,00 cada, total ${totalStr}). Moro em Lagoa Santa/MG — CEP: ${cepFormatado}. Gostaria de combinar a retirada ou entrega local. Como proceder?`;
          ctaLabel = 'Combinar Entrega pelo WhatsApp';
        } else {
          resHtml = `
            <div class="frete-ok correios">
              <span class="frete-ok-icon">📦</span>
              <div class="frete-ok-body">
                <strong>${cidade} / ${uf} — Frete pelos Correios</strong>
                <p>${camisStr} — <em>${totalStr} + frete</em> — A taxa dos Correios para seu CEP (${cepFormatado}) será confirmada pela equipe pelo WhatsApp antes de finalizar o pedido.</p>
              </div>
            </div>`;
          msgWa    = `Olá! Quero comprar ${camisStr} branca${qtd > 1 ? 's' : ''} do IREFIS (R$ 40,00 cada). Meu CEP é ${cepFormatado} (${cidade}/${uf}). Podem confirmar o valor do frete pelos Correios?`;
          ctaLabel = 'Confirmar Frete pelo WhatsApp';
        }

        resultado.innerHTML = resHtml;
        const waUrl = `https://wa.me/5531992594953?text=${encodeURIComponent(msgWa)}`;
        ctaWa.innerHTML = `
          <a href="${waUrl}" target="_blank" rel="noopener" class="btn-frete-wa">
            ${WA_SVG}
            ${ctaLabel}
          </a>
          <p class="frete-wa-obs">A equipe do IREFIS responderá com todos os detalhes para finalizar seu pedido.</p>`;

      } catch (err) {
        showErro('⚠️ Não foi possível consultar o CEP. Verifique sua conexão ou fale pelo WhatsApp: <a href="https://wa.me/5531992594953" target="_blank" style="color:#FFD54F">(31) 99259-4953</a>.');
      } finally {
        setLoading(false);
      }
    });
  })();

  /* ─── Copiar chave PIX ─── */
  (function () {
    const btn = document.getElementById('btnCopiarPix');
    if (!btn) return;
    const chave = btn.getAttribute('data-pix') || '';
    const txt = btn.querySelector('.btn-copiar-txt');
    const original = txt ? txt.textContent : 'Copiar chave';

    btn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(chave);
        } else {
          const tmp = document.createElement('textarea');
          tmp.value = chave;
          tmp.style.position = 'fixed';
          tmp.style.opacity = '0';
          document.body.appendChild(tmp);
          tmp.focus();
          tmp.select();
          document.execCommand('copy');
          document.body.removeChild(tmp);
        }
        btn.classList.add('copiado');
        if (txt) txt.textContent = 'Chave copiada!';
        setTimeout(() => {
          btn.classList.remove('copiado');
          if (txt) txt.textContent = original;
        }, 2200);
      } catch (e) {
        if (txt) txt.textContent = 'Copie manualmente';
        setTimeout(() => { if (txt) txt.textContent = original; }, 2200);
      }
    });
  })();

  console.log('%cIREFIS — Site institucional | Desenvolvido por Sparkz Agency',
    'color:#00ACC1;font-weight:bold;font-size:13px;');
})();
