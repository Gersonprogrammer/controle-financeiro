
import { atualizarInterface } from "./interface.js";
import {
    transacoes,
    indiceEdicao,
    definirIndiceEdicao,
    limparIndiceEdicao
} from "./state.js";

import { salvarTransacoes } from "./storage.js";
import { atualizarCards } from "./dashboard.js";
import {
    corpoTabela,
    campoDescricao,
    campoValor,
    campoCategoria,
    campoTipo,
    campoData
} from "./dom.js";

import {
    abrirFormulario,
    limparFormulario,
    fecharFormulario
} from "./ui.js";

export function listarTransacoes(lista = transacoes) {


    corpoTabela.innerHTML = "";

    lista.forEach((transacao, index) => {

        const indiceOriginal = transacoes.indexOf(transacao);

        corpoTabela.innerHTML += `
            <tr>
                <td>${transacao.data || "-"}</td>
                <td>${transacao.descricao}</td>
                <td>${transacao.categoria || "-"}</td>
                <td>${transacao.tipo}</td>
                <td>R$ ${transacao.valor.toFixed(2)}</td>

             <td>
    <i
        data-lucide="square-pen"
        class="icone-editar"
        onclick="editarTransacao(${indiceOriginal})"
    </i>

    <i
        data-lucide="trash-2"
        class="icone-excluir"
        onclick="excluirTransacao(${indiceOriginal})"
    </i>
</td>
            </tr>
        `;

    });

    // Atualiza os ícones adicionados dinamicamente
    lucide.createIcons();
}

export function excluirTransacao(index) {

     transacoes.splice(index, 1);

    salvarTransacoes();

    atualizarInterface();

}

export function editarTransacao(index) {

    definirIndiceEdicao(index);

    const transacao = transacoes[index];

    campoDescricao.value = transacao.descricao;
    campoValor.value = transacao.valor;
    campoCategoria.value = transacao.categoria;
    campoTipo.value =
        transacao.tipo.charAt(0).toUpperCase() + transacao.tipo.slice(1);

    const partes = transacao.data.split("/");

    campoData.value = `${partes[2]}-${partes[1]}-${partes[0]}`;

    abrirFormulario();

}

export function salvarTransacao() {

    if (campoDescricao.value.trim() === "") {
        alert("Informe a descrição da transação.");
        campoDescricao.focus();
        return;
    }

    if (Number(campoValor.value) <= 0) {
        alert("Informe um valor maior que zero.");
        campoValor.focus();
        return;
    }

    if (campoCategoria.value === "") {
        alert("Selecione uma categoria.");
        campoCategoria.focus();
        return;
    }

    if (campoData.value === "") {
        alert("Selecione uma data.");
        campoData.focus();
        return;
    }
const [ano, mes, dia] = campoData.value.split("-");

const dataFormatada = `${dia}/${mes}/${ano}`;

    const novaTransacao = {
        descricao: campoDescricao.value,
        valor: Number(campoValor.value),
        categoria: campoCategoria.value,
        tipo: campoTipo.value.toLowerCase(),
        data: dataFormatada
    };

    if (indiceEdicao === null) {

    transacoes.push(novaTransacao);

} else {

    transacoes[indiceEdicao] = novaTransacao;

    limparIndiceEdicao();

}

salvarTransacoes();

atualizarInterface();

limparFormulario();

fecharFormulario();

}

