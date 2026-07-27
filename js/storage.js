import { transacoes } from "./state.js";

export function salvarTransacoes() {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

export function carregarTransacoes() {
    const dadosSalvos = localStorage.getItem("transacoes");

    if (dadosSalvos) {
        transacoes.length = 0;
        transacoes.push(...JSON.parse(dadosSalvos));
    }
}