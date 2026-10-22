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

## Como rodar

É um site estático: basta abrir o `index.html` no navegador.
