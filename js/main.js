/* ---------- menu acompanha a seção visível ---------- */

const topo = document.getElementById('topo');
const links = Array.from(document.querySelectorAll('.menu a'));
const indicador = document.querySelector('.menu-indicador');
const secoes = links.map(function (link) {
  return document.querySelector(link.getAttribute('href'));
});

function marcar(link) {
  links.forEach(function (l) {
    l.classList.toggle('ativo', l === link);
  });

  if (!link) {
    indicador.style.opacity = 0;
    return;
  }

  indicador.style.opacity = 1;
  indicador.style.width = link.offsetWidth + 'px';
  indicador.style.transform = 'translateX(' + link.offsetLeft + 'px)';
}

function aoRolar() {
  topo.classList.toggle('rolou', window.scrollY > 8);

  const meio = window.innerHeight * 0.35;
  let atual = null;

  secoes.forEach(function (secao, i) {
    if (secao.getBoundingClientRect().top < meio) atual = links[i];
  });

  /* no fim da página o contato pode não chegar ao meio da tela */
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
    atual = links[links.length - 1];
  }

  marcar(atual);
}

window.addEventListener('scroll', aoRolar, { passive: true });
window.addEventListener('resize', aoRolar);
aoRolar();


/* ---------- tema claro e escuro ---------- */

const raiz = document.documentElement;
const botaoTema = document.getElementById('botao-tema');
const corDaBarra = document.querySelector('meta[name="theme-color"]');
const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)');

function aplicarTema(tema) {
  raiz.dataset.tema = tema;
  botaoTema.setAttribute('aria-label', tema === 'escuro' ? 'Ativar tema claro' : 'Ativar tema escuro');
  corDaBarra.content = tema === 'escuro' ? '#171918' : '#f3f4f2';
}

aplicarTema(raiz.dataset.tema);

function trocarTema(tema) {
  if (reduzMovimento.matches) {
    aplicarTema(tema);
    return;
  }

  /* navegadores sem View Transitions: as cores só esmaecem */
  if (!document.startViewTransition) {
    raiz.classList.add('tema-em-transicao');
    aplicarTema(tema);
    setTimeout(function () {
      raiz.classList.remove('tema-em-transicao');
    }, 500);
    return;
  }

  /* o tema novo cresce num círculo a partir do botão */
  const caixa = botaoTema.getBoundingClientRect();
  const x = caixa.left + caixa.width / 2;
  const y = caixa.top + caixa.height / 2;
  const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  document.startViewTransition(function () {
    aplicarTema(tema);
  }).ready.then(function () {
    raiz.animate(
      { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + raio + 'px at ' + x + 'px ' + y + 'px)'] },
      { duration: 650, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' }
    );
  });
}

botaoTema.addEventListener('click', function () {
  const novo = raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro';
  try {
    localStorage.setItem('tema', novo);
  } catch (erro) {}
  trocarTema(novo);
});

/* quem nunca escolheu um tema acompanha o sistema */
sistemaEscuro.addEventListener('change', function (evento) {
  let salvo = null;
  try {
    salvo = localStorage.getItem('tema');
  } catch (erro) {}
  if (!salvo) trocarTema(evento.matches ? 'escuro' : 'claro');
});


/* ---------- links antigos (/pages/sobre.html chega como /?secao=sobre) ---------- */

const secaoPedida = new URLSearchParams(window.location.search).get('secao');

if (secaoPedida && document.getElementById(secaoPedida)) {
  history.replaceState(null, '', window.location.pathname + '#' + secaoPedida);
  document.getElementById(secaoPedida).scrollIntoView();
}


/* ---------- números do GitHub ---------- */

/* o HTML já traz os números; aqui só atualiza se os endpoints responderem */
function escreverNumero(chave, valor) {
  if (typeof valor !== 'number') return;
  document.querySelectorAll('[data-numero="' + chave + '"]').forEach(function (campo) {
    campo.textContent = valor;
  });
}

/* /api/numeros conta também os repositórios privados; sem ele, fica o número público */
fetch('/api/numeros')
  .then(function (resposta) {
    if (!resposta.ok) throw new Error('endpoint indisponivel');
    return resposta.json();
  })
  .then(function (dados) {
    escreverNumero('repos', dados.repos);
    document.querySelectorAll('[data-rotulo-repos]').forEach(function (rotulo) {
      rotulo.textContent = 'repositórios';
    });
  })
  .catch(function () {
    fetch('https://api.github.com/users/thalesalvs21')
      .then(function (resposta) {
        return resposta.json();
      })
      .then(function (dados) {
        escreverNumero('repos', dados.public_repos);
      })
      .catch(function () {});
  });

fetch('/api/contribuicoes')
  .then(function (resposta) {
    if (!resposta.ok) throw new Error('endpoint indisponivel');
    return resposta.json();
  })
  .then(function (dados) {
    escreverNumero('contribuicoes', dados.total);
  })
  .catch(function () {});
