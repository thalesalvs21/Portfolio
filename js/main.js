/* ===========================================================
   Portfólio — Thales Alves

   O mesmo arquivo roda nas sete páginas. Cada função confere se
   os elementos de que precisa existem antes de fazer qualquer
   coisa, então nada quebra numa página que não tem aquela parte.

   01. Preferência de movimento
   02. Ano do rodapé
   03. Tela de abertura
   04. Transição entre páginas
   05. Revelação no scroll
   06. Texto digitado (início)
   07. Botão de voltar ao topo
   08. Formulário de contato
   09. Números do GitHub
   =========================================================== */

(function () {
  'use strict';

  /* ============ 01. Preferência de movimento ============ */
  /* Quem liga "reduzir movimento" no sistema recebe o site sem
     animação nenhuma. Isso é respeitado também no CSS. */

  var semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ================= 02. Ano do rodapé ================= */

  function iniciarAno() {
    var campos = document.querySelectorAll('#ano');
    var ano = String(new Date().getFullYear());

    for (var i = 0; i < campos.length; i++) {
      campos[i].textContent = ano;
    }
  }


  /* ============== 03. Tela de abertura ============== */
  /* O <head> já mostrou a tela e ligou um timer de segurança de 4s.
     Aqui ela é fechada do jeito certo: espera a página carregar e
     garante um tempo mínimo na tela para a animação não piscar.
     Ela aparece em toda página, como no site que serviu de
     referência — por isso é curta. */

  function iniciarAbertura() {
    var raiz = document.documentElement;
    if (!raiz.classList.contains('carregando')) return;

    var MINIMO = 700;
    var FADE = 500;
    var comeco = Date.now();

    function fechar() {
      var falta = Math.max(0, MINIMO - (Date.now() - comeco));

      window.setTimeout(function () {
        raiz.classList.remove('carregando');
        raiz.classList.add('abertura-saindo');

        window.setTimeout(function () {
          raiz.classList.remove('abertura-saindo');
        }, FADE);
      }, falta);
    }

    if (document.readyState === 'complete') {
      fechar();
    } else {
      window.addEventListener('load', fechar);
    }
  }


  /* ============ 04. Transição entre páginas ============ */
  /* Antes de sair, a cortina cobre a tela. Como todas as páginas
     têm o mesmo fundo, a troca fica contínua em vez de piscar. */

  function iniciarTransicao() {
    if (semAnimacao) return;

    /* a cortina leva 0.18s para acender; os 220ms dão a folga
       antes de trocar de página, igual ao site de referência */
    var ESPERA = 220;

    document.addEventListener('click', function (evento) {
      /* clique com Ctrl, Cmd, Shift ou botão do meio abre em outra
         aba — não é para interceptar */
      if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
      if (evento.button !== 0) return;
      /* já está saindo: ignora o segundo clique */
      if (document.body.classList.contains('saindo')) return;

      var link = evento.target.closest('a');
      if (!link) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;

      var destino;
      try {
        destino = new URL(link.href, window.location.href);
      } catch (erro) {
        return;
      }

      /* mailto:, tel: e links para fora do site passam direto */
      if (destino.origin !== window.location.origin) return;
      /* âncora na mesma página também */
      if (destino.pathname === window.location.pathname) return;
      /* só intercepta página; PDF e afins seguem o caminho normal */
      if (!/\.html?$|\/$/.test(destino.pathname)) return;

      evento.preventDefault();
      document.body.classList.add('saindo');

      window.setTimeout(function () {
        window.location.href = link.href;
      }, ESPERA);
    });

    /* Ao voltar pelo botão do navegador a página pode vir do cache
       com a cortina ainda levantada. Isso derruba ela. */
    window.addEventListener('pageshow', function () {
      document.body.classList.remove('saindo');
    });
  }


  /* ============= 05. Revelação no scroll ============= */
  /* IntersectionObserver avisa quando o elemento entra na tela.
     É mais barato que ouvir o evento de scroll, porque o próprio
     navegador faz a conta. */

  function iniciarRevelacao() {
    var alvos = document.querySelectorAll('.revelar');
    if (!alvos.length) return;

    function mostrarTodos() {
      for (var i = 0; i < alvos.length; i++) {
        alvos[i].classList.add('visivel');
      }
    }

    if (semAnimacao || !('IntersectionObserver' in window)) {
      mostrarTodos();
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;

        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.08
    });

    for (var i = 0; i < alvos.length; i++) {
      /* o atraso escalonado faz os cards entrarem em sequência */
      alvos[i].style.transitionDelay = (Math.min(i, 6) * 70) + 'ms';
      observador.observe(alvos[i]);
    }
  }


  /* =========== 06. Texto digitado (início) =========== */

  function iniciarDigitacao() {
    var campo = document.getElementById('texto-digitado');
    if (!campo) return;

    var frases = [
      'Estagiário de suporte técnico',
      'Desenvolvedor em formação',
      'Procurando estágio em desenvolvimento'
    ];

    if (semAnimacao) {
      campo.textContent = frases[0];
      return;
    }

    var indice = 0;
    var letras = 0;
    var apagando = false;

    function digitar() {
      var frase = frases[indice];

      letras = apagando ? letras - 1 : letras + 1;
      campo.textContent = frase.slice(0, letras);

      var espera = apagando ? 35 : 65;

      if (!apagando && letras === frase.length) {
        apagando = true;
        espera = 2000;
      } else if (apagando && letras === 0) {
        apagando = false;
        indice = (indice + 1) % frases.length;
        espera = 300;
      }

      window.setTimeout(digitar, espera);
    }

    window.setTimeout(digitar, 600);
  }


  /* ========= 07. Botão de voltar ao topo ========= */

  function iniciarBotaoTopo() {
    var botao = document.getElementById('botao-topo');
    if (!botao) return;

    function conferir() {
      botao.classList.toggle('visivel', window.scrollY > 600);
    }

    window.addEventListener('scroll', conferir, { passive: true });
    conferir();

    botao.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: semAnimacao ? 'auto' : 'smooth'
      });
    });
  }


  /* =========== 08. Formulário de contato =========== */
  /* O site é estático, não tem servidor para receber o envio.
     Então o formulário valida os campos e monta um mailto já
     preenchido, que abre no programa de e-mail de quem escreveu. */

  function iniciarFormulario() {
    var formulario = document.getElementById('formulario');
    if (!formulario) return;

    var aviso = document.getElementById('formulario-aviso');
    var nome = document.getElementById('nome');
    var email = document.getElementById('email');
    var assunto = document.getElementById('assunto');
    var mensagem = document.getElementById('mensagem');

    var FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function mostrarErro(campo, texto) {
      var bloco = campo.closest('.campo');
      bloco.classList.toggle('campo-com-erro', texto !== '');
      bloco.querySelector('.campo-erro').textContent = texto;
    }

    function validar() {
      var tudoCerto = true;

      if (nome.value.trim() === '') {
        mostrarErro(nome, 'Digite seu nome.');
        tudoCerto = false;
      } else {
        mostrarErro(nome, '');
      }

      if (!FORMATO_EMAIL.test(email.value.trim())) {
        mostrarErro(email, 'Digite um e-mail válido.');
        tudoCerto = false;
      } else {
        mostrarErro(email, '');
      }

      if (mensagem.value.trim().length < 10) {
        mostrarErro(mensagem, 'Escreva um pouco mais, com pelo menos 10 caracteres.');
        tudoCerto = false;
      } else {
        mostrarErro(mensagem, '');
      }

      return tudoCerto;
    }

    /* o erro sai assim que a pessoa começa a corrigir o campo */
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
        aviso.textContent = 'Verifique os campos marcados acima.';
        aviso.className = 'aviso-form erro';
        return;
      }

      var titulo = assunto.value.trim() || 'Contato pelo portfólio';

      var corpo =
        'Nome: ' + nome.value.trim() + '\n' +
        'E-mail: ' + email.value.trim() + '\n\n' +
        mensagem.value.trim();

      window.location.href =
        'mailto:thalesalvs21@gmail.com' +
        '?subject=' + encodeURIComponent(titulo) +
        '&body=' + encodeURIComponent(corpo);

      aviso.textContent = 'Abrindo seu aplicativo de e-mail com a mensagem preenchida...';
      aviso.className = 'aviso-form ok';
    });
  }


  /* ============= 09. Números do GitHub ============= */
  /* Busca os números na API pública do GitHub. Se a chamada falhar
     o site continua mostrando o valor que já está no HTML. */

  function iniciarNumerosGithub() {
    var campoRepos = document.getElementById('repos-github');
    var campoCommits = document.getElementById('commits-github');
    if (!campoRepos && !campoCommits) return;

    if (campoRepos) {
      fetch('https://api.github.com/users/thalesalvs21')
        .then(function (resposta) {
          return resposta.ok ? resposta.json() : Promise.reject();
        })
        .then(function (dados) {
          if (typeof dados.public_repos === 'number') {
            campoRepos.textContent = dados.public_repos;
          }
        })
        .catch(function () {});
    }

    if (campoCommits) {
      fetch('https://api.github.com/search/commits?q=author:thalesalvs21&per_page=1')
        .then(function (resposta) {
          return resposta.ok ? resposta.json() : Promise.reject();
        })
        .then(function (dados) {
          if (typeof dados.total_count === 'number') {
            campoCommits.textContent = dados.total_count;
          }
        })
        .catch(function () {});
    }
  }


  /* ==================== partida ==================== */

  iniciarAno();
  iniciarAbertura();
  iniciarTransicao();
  iniciarRevelacao();
  iniciarDigitacao();
  iniciarBotaoTopo();
  iniciarFormulario();
  iniciarNumerosGithub();

})();
