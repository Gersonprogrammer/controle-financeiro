
import { atualizarInterface } from "./interface.js";
import {
    transacoes,
    indiceEdicao,
    definirIndiceEdicao,
    limparIndiceEdicao
} from "./state.js";

import { auth } from "./firebase.js";
import {
    salvarTransacaoFirestore,
    excluirTransacaoFirestore
} from "./firestore-service.js";

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

    <td data-label="Data">
        ${transacao.data || "-"}
    </td>

    <td data-label="Descrição">
        ${transacao.descricao}
    </td>

    <td data-label="Categoria">
        ${transacao.categoria || "-"}
    </td>

    <td data-label="Tipo">

    <span class="badge ${transacao.tipo}">

        ${transacao.tipo === "receita" ? "🟢 Receita" : "🔴 Despesa"}

    </span>

</td>

    <td data-label="Valor">
    ${transacao.valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })}
</td>

<td>

    <i
        data-lucide="square-pen"
        class="icone-editar"
        onclick="editarTransacao(${indiceOriginal})">
    </i>

    <i
        data-lucide="trash-2"
        class="icone-excluir"
        onclick="excluirTransacao(${indiceOriginal})">
    </i>

</td>
            </tr>
        `;

    });

    // Atualiza os ícones adicionados dinamicamente
    lucide.createIcons();
}


export async function excluirTransacao(index) {
    const transacao = transacoes[index];

    if (!transacao) {
        return;
    }

    if (!auth.currentUser) {
        alert("Faça login para excluir uma transação.");
        return;
    }

    try {
        if (transacao.id) {
            await excluirTransacaoFirestore(
                auth.currentUser.uid,
                transacao.id
            );
        }

        transacoes.splice(index, 1);

        atualizarInterface();
    } catch (erro) {
        console.error("Erro ao excluir transação:", erro);
        alert("Não foi possível excluir a transação. Tente novamente.");
    }
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

export async function salvarTransacao() {
    if (campoDescricao.value.trim() === "") {
        alert("Informe a descrição da transação.");
        campoDescricao.focus();
        return;
    }

    const valor = Number(
        campoValor.value.replace(/\./g, "").replace(",", ".")
    );

    if (!Number.isFinite(valor) || valor <= 0) {
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

    const usuario = auth.currentUser;

    if (!usuario) {
        alert("Faça login para salvar uma transação.");
        return;
    }

    const [ano, mes, dia] = campoData.value.split("-");

    const novaTransacao = {
        descricao: campoDescricao.value.trim(),
        valor,
        categoria: campoCategoria.value,
        tipo: campoTipo.value.toLowerCase(),
        data: `${dia}/${mes}/${ano}`,
        mes: Number(mes),
        ano: Number(ano)
    };

    if (indiceEdicao !== null) {
        const transacaoOriginal = transacoes[indiceEdicao];

        if (transacaoOriginal?.id) {
            novaTransacao.id = transacaoOriginal.id;
        }
    }

    try {
        const transacaoSalva = await salvarTransacaoFirestore(
            usuario.uid,
            novaTransacao
        );

        if (indiceEdicao === null) {
            transacoes.push(transacaoSalva);
        } else {
            transacoes[indiceEdicao] = transacaoSalva;
            limparIndiceEdicao();
        }

        atualizarInterface();
        limparFormulario();
        fecharFormulario();
    } catch (erro) {
        console.error("Erro ao salvar transação:", erro);
        alert("Não foi possível salvar a transação. Tente novamente.");
    }
}

