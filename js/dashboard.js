import { transacoes } from "./state.js";
import {
    cardSaldo,
    cardReceitas,
    cardDespesas
} from "./dom.js";

export function atualizarCards() {

    let totalReceitas = 0;
    let totalDespesas = 0;

    transacoes.forEach(transacao => {

        if (transacao.tipo === "receita") {
            totalReceitas += transacao.valor;
        } else {
            totalDespesas += transacao.valor;
        }

    });

    const saldo = totalReceitas - totalDespesas;

    cardReceitas.textContent =
        totalReceitas.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    cardDespesas.textContent =
        totalDespesas.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    cardSaldo.textContent =
        saldo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

}