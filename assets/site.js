(function () {
  // Link ativo no menu
  var page = location.pathname.split('/').pop() || 'index.html';
  if (page.indexOf('.') === -1) page += '.html';
  document.querySelectorAll('.nav a:not(.btn), .site-footer nav a').forEach(function (a) {
    if (a.getAttribute('href') === page) a.setAttribute('aria-current', 'page');
  });

  // Borda do cabeçalho ao rolar
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Revelar conteúdo ao rolar
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Formulário de contato -> WhatsApp
  var form = document.getElementById('contact-form');
  if (form) {
    // Serviço vindo da página de serviços (?servico=site|pagina|instagram|sistemas)
    var key = new URLSearchParams(location.search).get('servico');
    var pre = key && form.querySelector('input[data-key="' + key + '"]');
    if (pre) pre.checked = true;

    // Máscara simples de telefone: (92) 99999-9999
    var tel = document.getElementById('whatsapp');
    tel.addEventListener('input', function () {
      var d = tel.value.replace(/\D/g, '').slice(0, 11);
      var out = d;
      if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length > 7) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
      tel.value = out;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var v = function (id) { return (document.getElementById(id) || {}).value || ''; };
      var tipo = (form.querySelector('input[name="service_type"]:checked') || {}).value || '';
      var linhas = [
        'Olá, Emelin Tech! Vim pelo site.',
        'Nome: ' + v('name'),
        v('company') ? 'Empresa: ' + v('company') : '',
        v('whatsapp') ? 'WhatsApp: ' + v('whatsapp') : '',
        tipo ? 'Preciso de: ' + tipo : '',
        v('message') ? 'Mensagem: ' + v('message') : ''
      ].filter(Boolean);
      var status = document.getElementById('form-status');
      status.textContent = 'Abrindo o WhatsApp com a sua mensagem…';
      window.open('https://wa.me/5592986123780?text=' + encodeURIComponent(linhas.join('\n')), '_blank', 'noopener');
      setTimeout(function () { status.textContent = ''; }, 6000);
    });
  }
})();
