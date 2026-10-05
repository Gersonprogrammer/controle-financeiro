import { transacoes, metas } from "./state.js";

export function salvarTransacoes() {
localStorage.setItem("transacoes", JSON.stringify(transacoes));
}
export function carregarTransacoes() {

    transacoes.length = 0;

    const dadosSalvos = localStorage.getItem("transacoes");

    if (dadosSalvos) {
        transacoes.push(...JSON.parse(dadosSalvos));
    }
}

export function salvarMetas() {
localStorage.setItem("metas", JSON.stringify(metas));
}

export function carregarMetas() {

    metas.length = 0;

    const dadosSalvos = localStorage.getItem("metas");

    if (dadosSalvos) {
        metas.push(...JSON.parse(dadosSalvos));
    }
}