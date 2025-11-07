const textIntro = "Olá, eu sou";
const elementIntro = document.getElementById("texto"); 
const tempoIntro = 90;

const textNome = "Thales Alves!";
const elementNome = document.getElementById("texto-nome");
const tempoNome = 130;

const textosParaLoop = [
    "Desenvolvedor Front-end",
    "Designer Gráfico",
    "Técnico em Informática",
];
let indiceTextoAtual = 0;

const elementCargo = document.getElementById("texto-cargo"); 
const tempoCargo = 100;


function digitar(texto, elemento, tempo) {
    let i = 0;
    
    function typeWriter() {
        if (i < texto.length) {
            elemento.textContent += texto.charAt(i);
            i++;
            setTimeout(typeWriter, tempo); 
        }
    }

    typeWriter();
}

let intervaloApagar = null;

function apagar(elemento, tempoApagar) {
    let textoAtual = elemento.textContent;
    let i = textoAtual.length;

    if (intervaloApagar) clearInterval(intervaloApagar);

    intervaloApagar = setInterval(() => {
        if (document.hidden) return;

        if (i > 0) {
            textoAtual = textoAtual.slice(0, -1);
            elemento.textContent = textoAtual;
            i--;
        } else {
            clearInterval(intervaloApagar);
            intervaloApagar = null;
            indiceTextoAtual = (indiceTextoAtual + 1) % textosParaLoop.length;
            const proximoTexto = textosParaLoop[indiceTextoAtual];
            loopCargo(proximoTexto, elemento, tempoCargo);
        }
    }, tempoApagar);
}

function loopCargo(texto, elemento, tempo) {
    digitar(texto, elemento, tempo);

    const atrasoParaApagar = (texto.length * tempo) + 2500;

    setTimeout(() => {
        apagar(elemento, tempo / 2);
    }, atrasoParaApagar);
}


digitar(textIntro, elementIntro, tempoIntro); 


const atrasoParaNome = (textIntro.length * tempoIntro) + 500; 


setTimeout(() => {
    
    digitar(textNome, elementNome, tempoNome); 

    
    const atrasoParaCargo = (textNome.length * tempoNome); 
    
    const primeiroTexto = textosParaLoop[indiceTextoAtual];
    setTimeout(() => {
        
        loopCargo(primeiroTexto, elementCargo, tempoCargo);
    }, atrasoParaCargo);

}, atrasoParaNome);