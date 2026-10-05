import { seletorTema } from "./dom.js";

const CHAVE_TEMA = "caltrackTema";

export function aplicarTema(tema) {
    document.body.classList.remove("tema-claro", "tema-escuro");
    document.body.classList.add(`tema-${tema}`);
}

export function carregarConfiguracoes() {
    const temaSalvo = localStorage.getItem(CHAVE_TEMA);

    if (temaSalvo) {
        seletorTema.value = temaSalvo;
        aplicarTema(temaSalvo);
    } else {
        aplicarTema("claro");
    }
}

export function salvarTema() {
    const tema = seletorTema.value;

    localStorage.setItem(CHAVE_TEMA, tema);
    aplicarTema(tema);
}