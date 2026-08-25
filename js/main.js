const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('ano').textContent = new Date().getFullYear();


const menu = document.getElementById('menu');
const menuLinks = document.getElementById('menu-links');
const menuBotao = document.getElementById('menu-botao');
const botaoTopo = document.getElementById('botao-topo');

const secoes = document.querySelectorAll('main section[id]');
const linksDoMenu = document.querySelectorAll('#menu-links a[href^="#"]');


function marcarLinkAtivo(posicao) {
  let secaoAtual = '';


  secoes.forEach(function (secao) {
    if (posicao >= secao.offsetTop - 200) {
      secaoAtual = secao.id;
    }
  });

  linksDoMenu.forEach(function (link) {
    const ativo = link.getAttribute('href') === '#' + secaoAtual;
    link.classList.toggle('link-ativo', ativo);
  });
}

function aoRolar() {
  const posicao = window.scrollY;

  menu.classList.toggle('menu-com-fundo', posicao > 20);
  botaoTopo.classList.toggle('visivel', posicao > 600);

  marcarLinkAtivo(posicao);
}

window.addEventListener('scroll', aoRolar);
aoRolar();

function fecharMenu() {
  menuLinks.classList.remove('menu-aberto');
  menuBotao.setAttribute('aria-expanded', 'false');
  menuBotao.setAttribute('aria-label', 'Abrir menu');
}

menuBotao.addEventListener('click', function () {
  const aberto = menuLinks.classList.toggle('menu-aberto');
  menuBotao.setAttribute('aria-expanded', aberto);
  menuBotao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});


menuLinks.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', fecharMenu);
});

document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape') fecharMenu();
});


window.addEventListener('resize', function () {
  if (window.innerWidth > 900) fecharMenu();
});


botaoTopo.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});



const campoDigitado = document.getElementById('texto-digitado');

const frases = [
  'Desenvolvedor em formação',
  'Técnico em Informática — Cotemig',
  'Estagiário de suporte técnico',
  'Python, Flask, C# e front-end'
];

let fraseAtual = 0;
let letrasNaTela = 0;
let apagando = false;

function digitar() {
  const frase = frases[fraseAtual];

  letrasNaTela = apagando ? letrasNaTela - 1 : letrasNaTela + 1;
  campoDigitado.textContent = frase.slice(0, letrasNaTela);

  let espera = apagando ? 35 : 65;

  if (!apagando && letrasNaTela === frase.length) {
    apagando = true;
    espera = 2000; 
  } else if (apagando && letrasNaTela === 0) {
    apagando = false;
    fraseAtual = (fraseAtual + 1) % frases.length; 
    espera = 300;
  }

  setTimeout(digitar, espera);
}

if (semAnimacao) {
  campoDigitado.textContent = frases[0];
} else {
  setTimeout(digitar, 600);
}



const botoesFiltro = document.querySelectorAll('.filtro');
const cardsDeProjeto = document.querySelectorAll('.card-projeto');
const avisoVazio = document.getElementById('projetos-vazio');

botoesFiltro.forEach(function (botao) {
  botao.addEventListener('click', function () {
    const categoria = botao.getAttribute('data-filtro');

    
    botoesFiltro.forEach(function (outro) {
      const ativo = outro === botao;
      outro.classList.toggle('link-ativo', ativo);
      outro.setAttribute('aria-selected', ativo);
    });

    let visiveis = 0;

    cardsDeProjeto.forEach(function (card) {
      const categorias = card.getAttribute('data-categorias');
      const mostrar = categoria === 'todos' || categorias.includes(categoria);

      card.classList.toggle('escondido', !mostrar);
      if (mostrar) visiveis = visiveis + 1;
    });

    avisoVazio.hidden = visiveis > 0;
  });
});



const formulario = document.getElementById('formulario');
const avisoDoFormulario = document.getElementById('formulario-aviso');

const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoAssunto = document.getElementById('assunto');
const campoMensagem = document.getElementById('mensagem');


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


  const formatoDeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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


formulario.querySelectorAll('input, textarea').forEach(function (campo) {
  campo.addEventListener('input', function () {
    if (campo.closest('.campo').classList.contains('campo-com-erro')) {
      mostrarErro(campo, '');
    }
  });
});

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();

  if (!validar()) {
    avisoDoFormulario.textContent = 'Verifique os campos marcados acima.';
    avisoDoFormulario.className = 'formulario-aviso aviso-erro';
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

  avisoDoFormulario.textContent = 'Abrindo seu aplicativo de e-mail com a mensagem preenchida...';
  avisoDoFormulario.className = 'formulario-aviso aviso-sucesso';
});
