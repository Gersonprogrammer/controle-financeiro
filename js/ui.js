import { limparIndiceEdicao } from "./state.js";

import {
    modal,
    campoDescricao,
    campoValor,
    campoCategoria,
    campoTipo,
    campoData
} from "./dom.js";

export function abrirFormulario() {
    modal.classList.remove("oculto");
}

export function fecharFormulario() {

    limparFormulario();

    limparIndiceEdicao();

    modal.classList.add("oculto");

}

export function limparFormulario() {
    campoDescricao.value = "";
    campoValor.value = "";
    campoCategoria.value = "";
    campoTipo.value = "Receita";
    campoData.value = "";
}