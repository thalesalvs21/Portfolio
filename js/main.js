const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('#ano').forEach(function (campo) {
  campo.textContent = new Date().getFullYear();
});


/* a cortina leva 0.18s; os 220ms dao a folga antes de trocar */
const esperaDaCortina = 220;

function ehLinkDeOutraPagina(link) {
  if (link.target === '_blank' || link.hasAttribute('download')) return false;

  const destino = new URL(link.href, window.location.href);

  if (destino.origin !== window.location.origin) return false;
  if (destino.pathname === window.location.pathname) return false;

  return /\.html?$|\/$/.test(destino.pathname);
}

document.addEventListener('click', function (evento) {
  if (semAnimacao) return;
  /* ctrl, cmd, shift ou botao do meio abrem em outra aba */
  if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
  if (evento.button !== 0) return;
  if (document.body.classList.contains('saindo')) return;

  const link = evento.target.closest('a');
  if (!link || !ehLinkDeOutraPagina(link)) return;

  evento.preventDefault();
  document.body.classList.add('saindo');

  setTimeout(function () {
    window.location.href = link.href;
  }, esperaDaCortina);
});

/* voltar pelo navegador pode trazer a cortina ainda levantada */
window.addEventListener('pageshow', function () {
  document.body.classList.remove('saindo');
});


const botaoTopo = document.getElementById('botao-topo');

if (botaoTopo) {
  window.addEventListener('scroll', function () {
    botaoTopo.classList.toggle('visivel', window.scrollY > 600);
  }, { passive: true });

  botaoTopo.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: semAnimacao ? 'auto' : 'smooth' });
  });
}


const formulario = document.getElementById('formulario');
const aviso = document.getElementById('formulario-aviso');

const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoAssunto = document.getElementById('assunto');
const campoMensagem = document.getElementById('mensagem');

const formatoDeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function mostrarErro(campo, mensagem) {
  const bloco = campo.closest('.campo');
  bloco.classList.toggle('campo-com-erro', mensagem !== '');
  bloco.querySelector('.campo-erro').textContent = mensagem;
}

function validar() {
  let tudoCerto = true;

  if (campoNome.value.trim() === '') {
    mostrarErro(campoNome, 'Digite seu nome.');
    tudoCerto = false;
  } else {
    mostrarErro(campoNome, '');
  }

  if (!formatoDeEmail.test(campoEmail.value.trim())) {
    mostrarErro(campoEmail, 'Digite um e-mail válido.');
    tudoCerto = false;
  } else {
    mostrarErro(campoEmail, '');
  }

  if (campoMensagem.value.trim().length < 10) {
    mostrarErro(campoMensagem, 'Escreva um pouco mais, com pelo menos 10 caracteres.');
    tudoCerto = false;
  } else {
    mostrarErro(campoMensagem, '');
  }

  return tudoCerto;
}

if (formulario) {
  formulario.querySelectorAll('input, textarea').forEach(function (campo) {
    campo.addEventListener('input', function () {
      if (campo.closest('.campo').classList.contains('campo-com-erro')) {
        mostrarErro(campo, '');
      }
    });
  });

  /* site estatico, sem servidor: monta um mailto ja preenchido */
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    if (!validar()) {
      aviso.textContent = 'Verifique os campos marcados acima.';
      aviso.className = 'aviso-form erro';
      return;
    }

    const assunto = campoAssunto.value.trim() || 'Contato pelo portfólio';

    const corpo =
      'Nome: ' + campoNome.value.trim() + '\n' +
      'E-mail: ' + campoEmail.value.trim() + '\n\n' +
      campoMensagem.value.trim();

    window.location.href =
      'mailto:thalesalvs21@gmail.com' +
      '?subject=' + encodeURIComponent(assunto) +
      '&body=' + encodeURIComponent(corpo);

    aviso.textContent = 'Abrindo seu aplicativo de e-mail com a mensagem preenchida...';
    aviso.className = 'aviso-form ok';
  });
}


/* se a api falhar fica o valor que ja esta escrito no html */
const campoRepos = document.getElementById('repos-github');
const campoCommits = document.getElementById('commits-github');

if (campoRepos) {
  fetch('https://api.github.com/users/thalesalvs21')
    .then(resposta => resposta.json())
    .then(dados => {
      campoRepos.textContent = dados.public_repos;
    })
    .catch(() => {});
}

if (campoCommits) {
  fetch('https://api.github.com/search/commits?q=author:thalesalvs21&per_page=1')
    .then(resposta => resposta.json())
    .then(dados => {
      campoCommits.textContent = dados.total_count;
    })
    .catch(() => {});
}
