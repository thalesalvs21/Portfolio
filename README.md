# Portfólio — Thales Alves

Site pessoal com meu currículo, projetos e formas de contato. Feito do zero com HTML, CSS e JavaScript, sem frameworks e sem etapa de build.

A página inicial não rola: é um painel com uma pasta para cada seção. Passando o mouse, a capa da pasta tomba para a frente e as folhas saltam de dentro. Clicando, abre a página.

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
js/main.js        # abertura, transição de página, revelação e formulário
assets/           # currículo em PDF
```

Os links de navegação ficam escritos no HTML de cada página, então mudar um item significa mudar os sete arquivos. É o preço de não ter build.

## Decisões

- **Carvão quente com vidro.** O fundo é carvão amarronzado e o destaque é um verde-petróleo, usado sozinho: não há uma segunda cor de sinal no site. Todo painel é o mesmo gradiente branco translúcido com `backdrop-filter`, sempre com a mesma borda e a mesma luz interna.
- **Duas famílias só.** Archivo nos títulos e no corpo, Spline Sans Mono nos rótulos e nos números.
- **As pastas não têm caixa.** Elas flutuam direto sobre o fundo; o que responde ao mouse é a pasta, não um card.
- **Nada alinhado na capa.** Cada pasta assenta num ângulo e numa altura diferente, como se tivessem sido largadas na mesa; ao passar o mouse ela se endireita. A revelação no scroll usa a propriedade `translate`, separada do `transform`, justamente para não apagar essa inclinação.
- **Páginas internas em seções numeradas.** Cada seção abre com o número, o título e um parágrafo, separada por um fio, e o conteúdo vem numa grade de dois cartões.
- **Cartões de prosa.** Em vez de listas soltas, cada competência e cada curso é um cartão com ícone, nome, legenda e um parágrafo explicando.
- **Prévias dos projetos em CSS.** Os mockups de janela e o bloco de código são desenhados com CSS, sem nenhuma imagem.
- **Tela de abertura em toda página**, mostrando o nome da seção que está abrindo. O esqueleto dela mora num `<style>` no topo do `<head>` de cada arquivo, antes das fontes — um stylesheet pendente trava o script seguinte e a tela chegaria atrasada. Tem um timer de 4 segundos que mostra o site de qualquer jeito se algo falhar.
- **Transição entre páginas em dois tempos.** A entrada é uma animação CSS de 0.3s (funciona sem JavaScript); a saída acende a cortina em 0.18s antes de trocar de página.
- **Um easing só.** Todo movimento do site usa `cubic-bezier(.16, 1, .3, 1)`, o que dá a mesma sensação em qualquer interação.
- **Funciona sem JavaScript.** As animações de entrada só escondem o conteúdo quando há JS; sem ele, tudo aparece normalmente.
- **Respeita `prefers-reduced-motion`.** Quem desliga animação no sistema recebe o site parado.

## Como rodar

É um site estático: basta abrir o `index.html` no navegador.

Para navegar entre as páginas sem problema de caminho relativo, é melhor servir a pasta:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.
