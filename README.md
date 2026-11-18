# Portfólio — Thales Alves

Site pessoal com meu currículo, projetos e formas de contato. Feito com HTML, CSS e JavaScript, sem frameworks.

A página inicial não rola: é um painel com uma pasta para cada seção. Passando o mouse, a capa da pasta tomba para a frente e as folhas saltam de dentro. Clicando, abre a página. Ela não tem menu, porque as pastas já são a navegação.

## Páginas

| Arquivo | Seção |
| --- | --- |
| `index.html` | Início (as pastas) |
| `pages/sobre.html` | Sobre mim |
| `pages/experiencia.html` | Experiência |
| `pages/competencias.html` | Competências |
| `pages/projetos.html` | Projetos |
| `pages/formacao.html` | Formação e cursos |
| `pages/contato.html` | Contato |

O currículo em PDF fica em `assets/cv-thales-alves.pdf`.

## Tecnologias

- HTML
- CSS
- JavaScript

Nenhuma biblioteca externa. As únicas requisições para fora são as fontes no Google Fonts e o GitHub, que preenche o número de repositórios e de commits na página Sobre.

## Contador do GitHub

A página Sobre já vem com os números públicos escritos no HTML, então ela está certa mesmo sem JavaScript. Com o JavaScript, o site tenta `/api/numeros` e, se o endpoint responder, troca pelos números que incluem repositório privado. Se não responder, cai na API pública do GitHub, que só conhece a branch principal dos repositórios públicos.

O endpoint é uma Pages Function da Cloudflare (`functions/api/numeros.js`), que roda no mesmo domínio do site. Ela consulta a GraphQL do GitHub com um token guardado como variável de ambiente `GITHUB_TOKEN`, marcada como secret no painel da Cloudflare. O token fica só no servidor: não vai para o navegador em nenhum momento. A resposta é cacheada por uma hora.

## Estrutura

```
index.html        # bancada: a capa do site
pages/            # uma página por seção
css/style.css     # tokens de cor, tipografia e todos os componentes
js/main.js        # abertura, transição de página e formulário
functions/api/    # endpoint do contador, com o token fora do navegador
assets/           # currículo em PDF
```

Os links de navegação ficam escritos no HTML de cada página, então mudar um item significa mudar os sete arquivos. É o preço de não ter build.

## Como rodar

É um site estático: basta abrir o `index.html` no navegador.
