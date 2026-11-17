# Portfólio — Thales Alves

Site pessoal com meu currículo, projetos e formas de contato. Feito com HTML, CSS e JavaScript, sem frameworks.

O site é um terminal. Ele abre com um `neofetch` com meu nome e um resumo, e cada seção é um comando: `sobre`, `experiencia`, `competencias`, `projetos`, `formacao` e `contato`. Quem não quiser digitar clica nos atalhos da abertura ou nas abas da barra de baixo, no estilo do tmux. A saída de cada comando vai se empilhando na tela, como num terminal de verdade.

## Comandos

| Comando | O que faz |
| --- | --- |
| `help` | lista os comandos |
| `sobre` | quem eu sou e o que eu faço |
| `experiencia` | experiência, no formato de um `git log` |
| `competencias` | o que eu sei, com uma barra de nível |
| `projetos` | os projetos, com link para o código |
| `formacao` | curso técnico e certificações, no formato de um `tree` |
| `contato` | e-mail, telefone e formulário |
| `cv` | abre o currículo em PDF |
| `github` | abre o meu GitHub |
| `ls`, `cat <arquivo>` | lista os "arquivos" e abre um deles |
| `inicio` | mostra a abertura de novo |
| `tema` | troca entre tema claro e escuro |
| `clear` | limpa a tela |

Também funcionam `↑` e `↓` para o histórico, `Tab` para completar e `Ctrl+L` para limpar. Tem alguns comandos escondidos.

Cada seção tem um endereço próprio (`/#projetos`, por exemplo), então dá para mandar o link direto para uma parte.

## Como o conteúdo está organizado

Todo o texto fica escrito no `index.html`, dentro de `#conteudos`, uma `<section>` por comando. O JavaScript só copia a seção certa para a tela quando o comando é digitado. Sem JavaScript, as seções aparecem uma embaixo da outra e o site continua legível.

Para mudar um texto, basta editar a seção dele no `index.html`. Para criar um comando novo de seção, é preciso uma `<section>` com o `id` do comando, o nome dele em `SECOES` e `COMANDOS` no `js/main.js` e, se quiser, uma aba no tmux.

As páginas antigas (`/pages/sobre.html` e as outras) foram removidas. O arquivo `_redirects` manda quem chegar por esses links para o comando equivalente (`/?cmd=sobre`).

## Contador do GitHub

A abertura e o `sobre` já vêm com os números escritos no HTML, então estão certos mesmo sem JavaScript. Com o JavaScript, o site tenta dois endpoints:

- `/api/numeros` devolve o número de repositórios, incluindo os privados. Se não responder, o site cai na API pública do GitHub, que só conta os públicos.
- `/api/contribuicoes` devolve o total de contribuições de todos os anos.

Os dois são Pages Functions da Cloudflare (`functions/api/`), que rodam no mesmo domínio do site. Eles consultam a GraphQL do GitHub com tokens guardados como secret no painel da Cloudflare (`GITHUB_TOKEN` e `GH_TOKEN`). Os tokens ficam só no servidor e não vão para o navegador em nenhum momento.

## Estrutura

```
index.html        # o terminal e todo o conteúdo das seções
css/style.css     # tokens de cor (tema escuro e claro) e todos os componentes
js/main.js        # comandos, histórico, autocompletar, formulário e contador
functions/api/    # endpoints do contador, com o token fora do navegador
assets/           # currículo em PDF
_redirects        # links antigos de /pages/ para os comandos novos
```

## Como rodar

É um site estático: basta abrir o `index.html` no navegador. Os contadores do GitHub só respondem com o site publicado na Cloudflare; abrindo localmente, ficam os números escritos no HTML.
