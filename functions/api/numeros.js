// endpoint do proprio dominio que conta repositorio privado
// o token fica como secret no painel da cloudflare, nunca no site

const ANO_INICIAL = 2024;
const CACHE_SEGUNDOS = 3600;

function montarConsulta(anoFinal) {
  const trechos = [];

  for (let ano = ANO_INICIAL; ano <= anoFinal; ano += 1) {
    trechos.push(
      'a' + ano + ': contributionsCollection(' +
      'from: "' + ano + '-01-01T00:00:00Z", ' +
      'to: "' + ano + '-12-31T23:59:59Z"' +
      ') { totalCommitContributions }'
    );
  }

  return '{ viewer { repositories(ownerAffiliations: [OWNER], first: 1) { totalCount } ' + trechos.join(' ') + ' } }';
}

function somarCommits(viewer) {
  const chaves = Object.keys(viewer);
  let total = 0;

  chaves.forEach(function (chave) {
    if (chave.indexOf('a') === 0 && viewer[chave] && viewer[chave].totalCommitContributions) {
      total += viewer[chave].totalCommitContributions;
    }
  });

  return total;
}

function responder(corpo, estado, segundos) {
  return new Response(JSON.stringify(corpo), {
    status: estado,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=' + segundos
    }
  });
}

export async function onRequestGet(contexto) {
  const cache = caches.default;
  const guardado = await cache.match(contexto.request);

  if (guardado) {
    return guardado;
  }

  if (!contexto.env.GITHUB_TOKEN) {
    return responder({ erro: 'token ausente' }, 503, 0);
  }

  const resposta = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + contexto.env.GITHUB_TOKEN,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-thales-alves'
    },
    body: JSON.stringify({ query: montarConsulta(new Date().getUTCFullYear()) })
  });

  const dados = await resposta.json();

  if (!resposta.ok || !dados.data || !dados.data.viewer) {
    return responder({ erro: 'github recusou a consulta' }, 502, 0);
  }

  const saida = responder({
    repos: dados.data.viewer.repositories.totalCount,
    commits: somarCommits(dados.data.viewer)
  }, 200, CACHE_SEGUNDOS);

  contexto.waitUntil(cache.put(contexto.request, saida.clone()));

  return saida;
}
