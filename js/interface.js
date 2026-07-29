import { listarTransacoes } from "./transacoes.js";
import { atualizarCards } from "./dashboard.js";
import { atualizarGrafico } from "./grafico.js";

export function atualizarInterface() {

    listarTransacoes();

    atualizarCards();

    atualizarGrafico();

}