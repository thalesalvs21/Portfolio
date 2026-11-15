// soma todas as contribuicoes do github (de todos os anos) na hora da visita
// o token fica como secret no painel da cloudflare, nunca no site

// 6 horas em segundos
const CACHE_SEGUNDOS = 21600;

// manda uma consulta para a api do github e devolve os dados
async function consultar(token, query, variables) {
  const resposta = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-thales-alves'
    },
    body: JSON.stringify({ query, variables })
  });

  // se o github recusar o pedido (ex: token errado ou vencido), mostra o motivo
  if (!resposta.ok) {
    throw new Error(`github respondeu com erro ${resposta.status}`);
  }

  const json = await resposta.json();

  // se a api devolver erro, para e mostra o motivo
  if (json.errors) {
    throw new Error(`github recusou a consulta: ${json.errors[0].message}`);
  }

  return json.data;
}

async function somarContribuicoes(token) {
  // pega a lista de anos em que teve contribuicao
  const dadosAnos = await consultar(token, `
    query {
      viewer {
        contributionsCollection {
          contributionYears
        }
      }
    }
  `);

  const anos = dadosAnos.viewer.contributionsCollection.contributionYears;

  let total = 0;

  // consulta ano por ano e vai somando
  for (const ano of anos) {
    const dadosAno = await consultar(token, `
      query($from: DateTime!, $to: DateTime!) {
        viewer {
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            totalRepositoryContributions
            totalPullRequestContributions
            totalIssueContributions
            totalPullRequestReviewContributions
            restrictedContributionsCount
          }
        }
      }
    `, {
      from: `${ano}-01-01T00:00:00Z`,
      to: `${ano}-12-31T23:59:59Z`
    });

    const c = dadosAno.viewer.contributionsCollection;

    const somaAno =
      c.totalCommitContributions +
      c.totalRepositoryContributions +
      c.totalPullRequestContributions +
      c.totalIssueContributions +
      c.totalPullRequestReviewContributions +
      c.restrictedContributionsCount;

    total += somaAno;
  }

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
  // se ja tem uma resposta guardada e ainda valida, devolve ela sem chamar o github
  const cache = caches.default;
  const guardado = await cache.match(contexto.request);

  if (guardado) {
    return guardado;
  }

  const token = contexto.env.GH_TOKEN;

  if (!token) {
    return responder({ erro: 'token do github nao configurado (variavel GH_TOKEN)' }, 503, 0);
  }

  let total;

  try {
    total = await somarContribuicoes(token);
  } catch (erro) {
    return responder({ erro: erro.message }, 502, 0);
  }

  // mesmo formato do antigo contribuicoes.json
  const saida = responder({
    total: total,
    atualizadoEm: new Date().toISOString()
  }, 200, CACHE_SEGUNDOS);

  contexto.waitUntil(cache.put(contexto.request, saida.clone()));

  return saida;
}
