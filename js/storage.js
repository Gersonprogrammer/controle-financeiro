import { transacoes, metas } from "./state.js";

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

export function salvarMetas() {
localStorage.setItem("metas", JSON.stringify(metas));
}

export function carregarMetas() {
const dadosSalvos = localStorage.getItem("metas");


if (dadosSalvos) {
    metas.length = 0;
    metas.push(...JSON.parse(dadosSalvos));
}


}
