// soma todas as contribuicoes do github (de todos os anos) e salva em um arquivo json

const fs = require('fs');

// le o token da variavel de ambiente
const token = process.env.GH_TOKEN;

// manda uma consulta para a api do github e devolve os dados
async function consultar(query, variables) {
  const resposta = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });

  const json = await resposta.json();
  
  // se o github recusar o pedido (ex: token errado ou faltando), mostra o motivo
  if (!resposta.ok) {
    throw new Error(`erro ${resposta.status}: ${JSON.stringify(json)}`);
  }

  // se a api devolver erro, para o script e mostra o motivo
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }

  return json.data;
}

async function main() {
  // pega a lista de anos em que teve contribuicao
  const dadosAnos = await consultar(`
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
    const dadosAno = await consultar(`
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

    console.log(`${ano}: ${somaAno}`);
    total += somaAno;
  }

  console.log(`total: ${total}`);

  // salva o total e a data da atualizacao no arquivo que o site vai ler
  const resultado = {
    total: total,
    atualizadoEm: new Date().toISOString()
  };

  fs.writeFileSync('contribuicoes.json', JSON.stringify(resultado, null, 2));
}

main();
