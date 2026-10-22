# Portfólio — Thales Alves

Site pessoal com meu currículo, projetos e formas de contato. Feito do zero com HTML, CSS e JavaScript, sem frameworks e sem etapa de build.

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

Nenhuma biblioteca externa. As únicas requisições para fora são as fontes no Google Fonts e a API pública do GitHub, que preenche o número de repositórios e de commits na página Sobre.

## Estrutura

```
index.html        # bancada: a capa do site
pages/            # uma página por seção
css/style.css     # tokens de cor, tipografia e todos os componentes
js/main.js        # abertura, transição de página e formulário
assets/           # currículo em PDF
```

Os links de navegação ficam escritos no HTML de cada página, então mudar um item significa mudar os sete arquivos. É o preço de não ter build.

## Decisões

- **Carvão quente com vidro.** O fundo é carvão amarronzado e existe uma cor de destaque só no site inteiro, um verde-petróleo definido em `--acento`. Todo painel é o mesmo gradiente branco translúcido com `backdrop-filter`, sempre com a mesma borda e a mesma luz interna.
- **Funnel Display** no nome e nos títulos de página, **Instrument Sans** no corpo e **Spline Sans Mono** nos rótulos.
- **As pastas não têm caixa.** Elas flutuam direto sobre o fundo; o que responde ao mouse é a pasta, não um card.
- **As pastas cercam o texto.** Em tela larga a capa vira uma tela só, com o texto no meio e as seis pastas sobre uma elipse em volta, todas retas e à mesma distância do centro. A posição de cada uma é um par de variáveis em `vw` e `vh`, então o arranjo acompanha o tamanho da janela. Abaixo de 1240px elas voltam para duas colunas.
- **Menu lateral nas páginas internas.** Não há barra no topo: cada página tem, à esquerda, um link de voltar ao início e a lista de páginas, com a atual em negrito. O menu fica grudado enquanto a página rola.
- **Páginas internas em seções numeradas.** Cada seção abre com o número, o título e um parágrafo, separada por um fio, e o conteúdo vem numa grade de dois cartões.
- **Cartões de prosa.** Em vez de listas soltas, cada competência e cada curso é um cartão com ícone, nome, legenda e um parágrafo explicando.
- **Prévias dos projetos em CSS.** Os mockups de janela e o bloco de código são desenhados com CSS, sem nenhuma imagem.
- **Tela de abertura em toda página**, mostrando o nome da seção que está abrindo. É só CSS: uma animação com atraso faz a tela sair sozinha, sem script e sem timer, então não existe como ela travar na frente do site.
- **Transição entre páginas em dois tempos.** A entrada é uma animação CSS de 0.3s (funciona sem JavaScript); a saída acende a cortina em 0.18s antes de trocar de página.
- **Um easing só.** Todo movimento do site usa `cubic-bezier(.16, 1, .3, 1)`, o que dá a mesma sensação em qualquer interação.
- **Nada de animação de entrada no scroll.** O conteúdo já está lá quando a página abre.
- **Nenhum JavaScript escrito no HTML.** Os arquivos só carregam o `js/main.js`; não há `<script>` com código dentro nem atributo `on...` em nenhuma tag.
- **Respeita `prefers-reduced-motion`.** Quem desliga animação no sistema recebe o site parado.

## Como rodar

É um site estático: basta abrir o `index.html` no navegador.

Para navegar entre as páginas sem problema de caminho relativo, é melhor servir a pasta:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.
