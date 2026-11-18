# Portfólio — Thales Alves

Site pessoal com meu currículo, projetos e formas de contato. Feito com HTML, CSS e JavaScript, sem frameworks.

É uma página só, que rola. O menu do topo leva a cada seção e marca a seção que está na tela.

## Seções

Sobre, Experiência, Projetos, Competências, Formação e Contato, nessa ordem, todas no `index.html`. Antes delas vêm o nome, uma apresentação curta, os atalhos de contato e uma linha do tempo da minha trajetória.

O currículo em PDF fica em `assets/cv-thales-alves.pdf`.

## Tema claro e escuro

Na primeira visita, o site usa o tema do sistema de quem abre. O botão no topo troca o tema, e a escolha fica salva no navegador. Quem nunca clicou no botão acompanha o sistema, mesmo com a página aberta.

A troca usa a View Transitions API: o tema novo cresce num círculo a partir do botão. Nos navegadores sem essa API, as cores só esmaecem, e com "reduzir movimento" ligado a troca é instantânea.

As cores ficam nos tokens do começo do `css/style.css`: o claro em `:root` e o escuro em `:root[data-tema="escuro"]`. Um script pequeno no `<head>` decide o tema antes de a página aparecer, para não piscar.

## Contador do GitHub

A frase do Sobre já vem com os números escritos no HTML, então ela está certa mesmo sem JavaScript. Com o JavaScript, o site tenta dois endpoints:

- `/api/numeros` devolve o número de repositórios, incluindo os privados. Se não responder, o site cai na API pública do GitHub, que só conta os públicos.
- `/api/contribuicoes` devolve o total de contribuições de todos os anos.

Os dois são Pages Functions da Cloudflare (`functions/api/`), que rodam no mesmo domínio do site. Eles consultam a GraphQL do GitHub com tokens guardados como secret no painel da Cloudflare (`GITHUB_TOKEN` e `GH_TOKEN`). Os tokens ficam só no servidor e não vão para o navegador.

## Links antigos

O site tinha uma página para cada seção em `pages/`. O arquivo `_redirects` manda esses endereços para a página única (`/pages/sobre.html` vira `/?secao=sobre`), e o JavaScript rola até a seção.

## Estrutura

```
index.html        # a página inteira
css/style.css     # tokens de cor dos dois temas e todos os estilos
js/main.js        # menu, troca de tema, links antigos e contador do GitHub
functions/api/    # endpoints do contador, com o token fora do navegador
assets/           # currículo em PDF
_redirects        # endereços antigos de pages/ para as seções
```

## Como rodar

É um site estático: basta abrir o `index.html` no navegador. O contador e os redirecionamentos só funcionam com o site publicado na Cloudflare; abrindo localmente, ficam os números escritos no HTML.
