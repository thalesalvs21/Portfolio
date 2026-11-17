/* ==========================================================
   O terminal do portfólio.
   O conteúdo de cada comando está escrito no index.html, dentro de
   #conteudos. Aqui só se copia a seção certa para a saída.
   ========================================================== */

const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ponteiroFino = window.matchMedia('(pointer: fine)').matches;

const terminal = document.getElementById('terminal');
const saida = document.getElementById('saida');
const prompt = document.getElementById('prompt');
const entrada = document.getElementById('entrada');
const conteudos = document.getElementById('conteudos');

const CAMINHO_CV = 'assets/cv-thales-alves.pdf';
const URL_GITHUB = 'https://github.com/thalesalvs21';

const SECOES = ['sobre', 'experiencia', 'competencias', 'projetos', 'formacao', 'contato'];

/* a intro original, guardada antes de qualquer clear */
const introOriginal = document.getElementById('inicio').cloneNode(true);

let contadorDeIds = 0;
const historico = [];
let posicaoNoHistorico = 0;


/* ---------- ajudantes de saída ---------- */

function criar(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function novoBloco(comandoDigitado) {
  const bloco = criar('div', 'bloco bloco-saida');
  const eco = criar('p', 'eco');
  const ps1 = criar('span', 'ps1');

  ps1.append('thales@bh:', criar('span', 'cor-caminho', '~'), '$');
  eco.append(ps1, ' ', comandoDigitado);
  bloco.append(eco);
  saida.append(bloco);

  return bloco;
}

function linha(bloco, conteudo, classe) {
  const p = criar('p', classe || '');
  if (typeof conteudo === 'string') {
    p.textContent = conteudo;
  } else {
    p.append.apply(p, conteudo);
  }
  bloco.append(p);
  return p;
}

function botaoComando(nome, rotulo) {
  const botao = criar('button', '', rotulo || nome);
  botao.type = 'button';
  botao.dataset.comando = nome;
  return botao;
}

function linkExterno(href, texto) {
  const link = criar('a', '', texto);
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener';
  return link;
}

/* cada cópia de uma seção ganha ids novos, senão o label do formulário aponta para a cópia errada */
function unificarIds(raiz) {
  contadorDeIds += 1;
  const sufixo = '-' + contadorDeIds;
  const atributos = ['for', 'aria-labelledby', 'aria-describedby'];

  const comId = Array.from(raiz.querySelectorAll('[id]'));
  if (raiz.id) comId.push(raiz);

  comId.forEach(function (el) {
    el.id = el.id + sufixo;
  });

  atributos.forEach(function (atributo) {
    const comAtributo = Array.from(raiz.querySelectorAll('[' + atributo + ']'));
    if (raiz.hasAttribute(atributo)) comAtributo.push(raiz);

    comAtributo.forEach(function (el) {
      el.setAttribute(atributo, el.getAttribute(atributo).split(' ').map(function (id) {
        return id + sufixo;
      }).join(' '));
    });
  });
}


/* ---------- navegação ---------- */

function marcarJanela(nome) {
  document.querySelectorAll('.tmux-janelas a').forEach(function (link) {
    if (link.dataset.comando === nome) {
      link.setAttribute('aria-current', 'true');
      link.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function atualizarEndereco(nome) {
  const ancora = nome && nome !== 'inicio' ? '#' + nome : '';
  history.replaceState(null, '', window.location.pathname + ancora);
}

function rolarPara(bloco) {
  bloco.scrollIntoView({ block: 'start', behavior: semAnimacao ? 'auto' : 'smooth' });
}


/* ---------- comandos ---------- */

function mostrarSecao(nome, bloco) {
  const copia = document.getElementById(nome).cloneNode(true);

  copia.classList.remove('bloco');
  copia.removeAttribute('data-eco');
  unificarIds(copia);
  bloco.append(copia);

  marcarJanela(nome);
  atualizarEndereco(nome);
}

function mostrarIntro(bloco) {
  const copia = introOriginal.cloneNode(true);

  copia.querySelector('.eco').remove();
  copia.querySelector('h1').remove();
  copia.classList.remove('bloco', 'bloco-inicio');
  copia.removeAttribute('aria-labelledby');
  unificarIds(copia);
  aplicarNumeros(copia);
  bloco.append(copia);

  marcarJanela('inicio');
  atualizarEndereco('inicio');
}

function abrir(bloco, href, nomeArquivo) {
  const janela = window.open(href, '_blank');
  if (janela) janela.opener = null;
  linha(bloco, [janela === null ? 'o navegador bloqueou a janela. abra por aqui: ' : 'abrindo ', linkExterno(href, nomeArquivo)]);
}

function trocarTema(bloco, pedido) {
  const atual = document.documentElement.dataset.tema === 'claro' ? 'claro' : 'escuro';
  let novo = atual === 'claro' ? 'escuro' : 'claro';

  if (pedido === 'claro' || pedido === 'escuro') novo = pedido;

  document.documentElement.dataset.tema = novo;
  document.querySelector('meta[name="theme-color"]').content = novo === 'claro' ? '#f7f2e9' : '#151311';

  try {
    localStorage.setItem('tema', novo);
  } catch (erro) {}

  linha(bloco, 'tema: ' + novo, 'cor-dim');
}

const ARQUIVOS = [
  { nome: 'sobre.txt', comando: 'sobre' },
  { nome: 'experiencia.log', comando: 'experiencia' },
  { nome: 'competencias.md', comando: 'competencias' },
  { nome: 'projetos/', comando: 'projetos', pasta: true },
  { nome: 'formacao/', comando: 'formacao', pasta: true },
  { nome: 'contato.sh', comando: 'contato' },
  { nome: 'cv.pdf', comando: 'cv' }
];

function listarArquivos(bloco) {
  const lista = criar('div', 'ls');

  ARQUIVOS.forEach(function (arquivo) {
    const botao = botaoComando(arquivo.comando, arquivo.nome);
    if (arquivo.pasta) botao.style.color = 'var(--caminho)';
    lista.append(botao);
  });

  bloco.append(lista);
}

function acharArquivo(nome) {
  const limpo = nome.replace(/^\.\//, '').replace(/\/$/, '');

  return ARQUIVOS.find(function (arquivo) {
    return arquivo.nome.replace(/\/$/, '') === limpo || arquivo.comando === limpo;
  });
}

/* os comandos que aparecem no help, na ordem em que aparecem */
const COMANDOS = {
  help: { desc: 'mostra esta lista' },
  sobre: { desc: 'quem eu sou e o que eu faço' },
  experiencia: { desc: 'onde eu trabalho e já trabalhei' },
  competencias: { desc: 'o que eu sei, e em que nível' },
  projetos: { desc: 'o que eu já construí' },
  formacao: { desc: 'curso técnico e certificações' },
  contato: { desc: 'e-mail, telefone e formulário' },
  cv: { desc: 'abre o currículo em PDF' },
  github: { desc: 'abre o meu GitHub' },
  ls: { desc: 'lista os arquivos daqui' },
  inicio: { desc: 'mostra a tela de abertura de novo' },
  tema: { desc: 'troca entre tema claro e escuro' },
  clear: { desc: 'limpa a tela' }
};

const APELIDOS = {
  ajuda: 'help', '?': 'help', comandos: 'help', man: 'help',
  neofetch: 'inicio', home: 'inicio', start: 'inicio',
  exp: 'experiencia', xp: 'experiencia', trabalho: 'experiencia',
  skills: 'competencias', stack: 'competencias', habilidades: 'competencias',
  proj: 'projetos', portfolio: 'projetos',
  cursos: 'formacao', certificacoes: 'formacao', estudos: 'formacao',
  email: 'contato', mail: 'contato', contact: 'contato',
  curriculo: 'cv', resume: 'cv',
  cls: 'clear', limpar: 'clear',
  theme: 'tema', about: 'sobre', projects: 'projetos'
};

function mostrarAjuda(bloco) {
  const lista = criar('dl', 'ajuda');

  Object.keys(COMANDOS).forEach(function (nome) {
    const item = criar('div');
    const termo = criar('dt');
    termo.append(botaoComando(nome));
    item.append(termo, criar('dd', '', COMANDOS[nome].desc));
    lista.append(item);
  });

  bloco.append(lista);
  linha(bloco, '↑ ↓ navegam no histórico · Tab completa o comando · Ctrl+L limpa a tela', 'cor-dim').style.marginTop = '12px';
}

function semAcento(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function executar(textoDigitado, origem) {
  const texto = textoDigitado.trim();

  if (texto === '') {
    novoBloco('');
    return null;
  }

  if (historico[historico.length - 1] !== texto) historico.push(texto);
  posicaoNoHistorico = historico.length;

  const partes = texto.split(/\s+/);
  let nome = semAcento(partes[0].toLowerCase());
  const argumentos = partes.slice(1);

  nome = APELIDOS[nome] || nome;

  if (nome === 'clear') {
    saida.replaceChildren();
    marcarJanela(null);
    atualizarEndereco('inicio');
    return null;
  }

  const bloco = novoBloco(texto);

  if (SECOES.indexOf(nome) !== -1) {
    mostrarSecao(nome, bloco);
  } else if (nome === 'help') {
    mostrarAjuda(bloco);
  } else if (nome === 'inicio') {
    mostrarIntro(bloco);
  } else if (nome === 'cv') {
    abrir(bloco, CAMINHO_CV, 'cv-thales-alves.pdf');
  } else if (nome === 'github') {
    abrir(bloco, URL_GITHUB, 'github.com/thalesalvs21');
  } else if (nome === 'ls' || nome === 'dir' || nome === 'll') {
    listarArquivos(bloco);
  } else if (nome === 'cat' || nome === 'open' || nome === 'cd' || nome === 'tree' || nome === 'less') {
    const alvo = argumentos[0] ? acharArquivo(semAcento(argumentos[0].toLowerCase())) : null;

    if (alvo) {
      if (alvo.comando === 'cv') abrir(bloco, CAMINHO_CV, 'cv-thales-alves.pdf');
      else mostrarSecao(alvo.comando, bloco);
    } else if (nome === 'cd' && (!argumentos[0] || argumentos[0] === '~' || argumentos[0] === '..')) {
      linha(bloco, 'você já está em ~/portfolio. não tem para onde fugir.', 'cor-dim');
    } else {
      linha(bloco, [nome + ': ' + (argumentos[0] || '') + ': arquivo não encontrado. veja o que tem com ', botaoComando('ls')], 'erro');
    }
  } else if (nome === 'tema') {
    trocarTema(bloco, argumentos[0]);
  } else if (nome === 'whoami') {
    linha(bloco, ['Thales Alves, estagiário de TI e desenvolvedor em formação. a versão longa está em ', botaoComando('sobre')]);
  } else if (nome === 'pwd') {
    linha(bloco, '/home/thales/portfolio');
  } else if (nome === 'date') {
    linha(bloco, new Date().toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }));
  } else if (nome === 'echo') {
    linha(bloco, argumentos.join(' '));
  } else if (nome === 'history') {
    historico.forEach(function (comando, i) {
      linha(bloco, String(i + 1).padStart(4, ' ') + '  ' + comando).style.whiteSpace = 'pre';
    });
  } else if (nome === 'sudo') {
    linha(bloco, ['permissão negada. mas se quiser me dar acesso a uma vaga, é por aqui: ', botaoComando('contato')], 'erro');
  } else if (nome === 'rm') {
    linha(bloco, 'rm: operação não permitida. o portfólio agradece.', 'erro');
  } else if (nome === 'exit' || nome === 'logout' || nome === 'quit') {
    linha(bloco, ['não dá para sair daqui. mas dá para falar comigo: ', botaoComando('contato')]);
  } else {
    linha(bloco, ['comando não encontrado: ' + partes[0] + '. digite ', botaoComando('help'), ' para ver a lista.'], 'erro');
  }

  aplicarNumeros(bloco);

  if (origem !== 'silencioso') rolarPara(bloco);

  /* quem clicou continua navegando pelo teclado a partir da seção nova */
  if (origem === 'clique') {
    const titulo = bloco.querySelector('h2');
    if (titulo) {
      titulo.tabIndex = -1;
      titulo.focus({ preventScroll: true });
    }
  }

  return bloco;
}


/* ---------- prompt ---------- */

prompt.addEventListener('submit', function (evento) {
  evento.preventDefault();
  const texto = entrada.value;
  entrada.value = '';
  executar(texto, 'digitado');
});

function completar() {
  const parcial = semAcento(entrada.value.trim().toLowerCase());
  if (parcial === '' || parcial.indexOf(' ') !== -1) return false;

  const opcoes = Object.keys(COMANDOS).filter(function (nome) {
    return nome.indexOf(parcial) === 0;
  });

  if (opcoes.length === 1) {
    entrada.value = opcoes[0];
  } else if (opcoes.length > 1) {
    const bloco = novoBloco(entrada.value);
    const lista = criar('div', 'ls');
    opcoes.forEach(function (nome) {
      lista.append(botaoComando(nome));
    });
    bloco.append(lista);
    rolarPara(prompt);
  }

  return true;
}

entrada.addEventListener('keydown', function (evento) {
  if (evento.key === 'ArrowUp') {
    if (posicaoNoHistorico > 0) {
      posicaoNoHistorico -= 1;
      entrada.value = historico[posicaoNoHistorico];
    }
    evento.preventDefault();
  } else if (evento.key === 'ArrowDown') {
    if (posicaoNoHistorico < historico.length - 1) {
      posicaoNoHistorico += 1;
      entrada.value = historico[posicaoNoHistorico];
    } else {
      posicaoNoHistorico = historico.length;
      entrada.value = '';
    }
    evento.preventDefault();
  } else if (evento.key === 'Tab' && !evento.shiftKey) {
    /* com o campo vazio, o Tab continua levando ao próximo elemento */
    if (completar()) evento.preventDefault();
  } else if (evento.key === 'l' && evento.ctrlKey) {
    evento.preventDefault();
    executar('clear', 'digitado');
  } else if (evento.key === 'c' && evento.ctrlKey && entrada.selectionStart === entrada.selectionEnd) {
    evento.preventDefault();
    novoBloco(entrada.value + '^C');
    entrada.value = '';
  }
});

/* clicar num espaço vazio do terminal devolve o foco ao prompt, como num terminal de verdade */
terminal.addEventListener('click', function (evento) {
  if (!ponteiroFino) return;
  if (evento.target.closest('a, button, input, textarea, label, select, pre, .codigo')) return;
  if (window.getSelection().toString() !== '') return;
  entrada.focus({ preventScroll: true });
});


/* ---------- cliques em comandos (links, atalhos, tmux, help) ---------- */

document.addEventListener('click', function (evento) {
  const alvo = evento.target.closest('[data-comando]');
  if (!alvo) return;
  if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey || evento.button !== 0) return;

  evento.preventDefault();
  executar(alvo.dataset.comando, 'clique');
});


/* ---------- formulário de contato ---------- */

const formatoDeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function mostrarErro(campo, mensagem) {
  const bloco = campo.closest('.campo');
  bloco.classList.toggle('campo-com-erro', mensagem !== '');
  bloco.querySelector('.campo-erro').textContent = mensagem;
}

function validar(formulario) {
  const nome = formulario.elements.nome;
  const email = formulario.elements.email;
  const mensagem = formulario.elements.mensagem;
  let tudoCerto = true;

  if (nome.value.trim() === '') {
    mostrarErro(nome, 'digite seu nome.');
    tudoCerto = false;
  } else {
    mostrarErro(nome, '');
  }

  if (!formatoDeEmail.test(email.value.trim())) {
    mostrarErro(email, 'digite um e-mail válido.');
    tudoCerto = false;
  } else {
    mostrarErro(email, '');
  }

  if (mensagem.value.trim().length < 10) {
    mostrarErro(mensagem, 'escreva um pouco mais, com pelo menos 10 caracteres.');
    tudoCerto = false;
  } else {
    mostrarErro(mensagem, '');
  }

  return tudoCerto;
}

document.addEventListener('input', function (evento) {
  const campo = evento.target.closest('.campo-com-erro');
  if (campo) mostrarErro(evento.target, '');
});

/* site estático, sem servidor: monta um mailto já preenchido */
document.addEventListener('submit', function (evento) {
  const formulario = evento.target;
  if (!formulario.classList.contains('formulario')) return;

  evento.preventDefault();
  const aviso = formulario.querySelector('.aviso-form');

  if (!validar(formulario)) {
    aviso.textContent = 'erro: verifique os campos marcados acima.';
    aviso.className = 'aviso-form erro';
    return;
  }

  const assunto = formulario.elements.assunto.value.trim() || 'Contato pelo portfólio';
  const corpo =
    'Nome: ' + formulario.elements.nome.value.trim() + '\n' +
    'E-mail: ' + formulario.elements.email.value.trim() + '\n\n' +
    formulario.elements.mensagem.value.trim();

  window.location.href =
    'mailto:thalesalvs21@gmail.com' +
    '?subject=' + encodeURIComponent(assunto) +
    '&body=' + encodeURIComponent(corpo);

  aviso.textContent = 'ok: abrindo seu aplicativo de e-mail com a mensagem preenchida...';
  aviso.className = 'aviso-form ok';
});


/* ---------- números do GitHub ---------- */

/* o endpoint /api/numeros conta repositório privado; sem ele fica o número público */
const numeros = { repos: null, contribuicoes: null, rotuloRepos: null };

function aplicarNumeros(raiz) {
  if (numeros.repos !== null) {
    raiz.querySelectorAll('[data-numero="repos"]').forEach(function (el) {
      el.textContent = numeros.repos;
    });
  }
  if (numeros.contribuicoes !== null) {
    raiz.querySelectorAll('[data-numero="contribuicoes"]').forEach(function (el) {
      el.textContent = numeros.contribuicoes;
    });
  }
  if (numeros.rotuloRepos) {
    raiz.querySelectorAll('[data-rotulo-repos]').forEach(function (el) {
      el.textContent = numeros.rotuloRepos;
    });
  }
}

function guardarNumero(chave, valor) {
  if (typeof valor !== 'number') return;
  numeros[chave] = valor;
  aplicarNumeros(document);
}

fetch('/api/numeros')
  .then(function (resposta) {
    if (!resposta.ok) throw new Error('endpoint indisponivel');
    return resposta.json();
  })
  .then(function (dados) {
    numeros.rotuloRepos = 'repositórios no GitHub';
    guardarNumero('repos', dados.repos);
  })
  .catch(function () {
    fetch('https://api.github.com/users/thalesalvs21')
      .then(function (resposta) {
        return resposta.json();
      })
      .then(function (dados) {
        guardarNumero('repos', dados.public_repos);
      })
      .catch(function () {});
  });

fetch('/api/contribuicoes')
  .then(function (resposta) {
    if (!resposta.ok) throw new Error('endpoint indisponivel');
    return resposta.json();
  })
  .then(function (dados) {
    guardarNumero('contribuicoes', dados.total);
  })
  .catch(function () {});


/* ---------- relógio do tmux ---------- */

const relogio = document.getElementById('relogio');

function atualizarRelogio() {
  relogio.textContent = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  });
}

atualizarRelogio();
setInterval(atualizarRelogio, 20000);


/* ---------- início ---------- */

/* links antigos (/pages/sobre.html) chegam como ?cmd=sobre; links novos, como #sobre */
function comandoDoEndereco() {
  const pedido = new URLSearchParams(window.location.search).get('cmd') || window.location.hash.slice(1);
  return SECOES.indexOf(pedido) !== -1 ? pedido : null;
}

const comandoInicial = comandoDoEndereco();

if (comandoInicial) {
  executar(comandoInicial, 'digitado');
} else {
  marcarJanela('inicio');
  if (ponteiroFino) entrada.focus({ preventScroll: true });
}

window.addEventListener('hashchange', function () {
  const pedido = comandoDoEndereco();
  if (pedido) executar(pedido, 'digitado');
});
