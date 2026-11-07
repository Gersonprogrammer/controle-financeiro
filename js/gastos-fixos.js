import { gastosFixos, transacoes } from "./state.js";
import { auth } from "./firebase.js";

import {
    salvarGastoFixoFirestore,
    excluirGastoFixoFirestore,
    lancarGastoFixoFirestore
} from "./firestore-service.js";

import {
    modalGastoFixo,
    campoGastoFixoDescricao,
    campoGastoFixoValor,
    campoGastoFixoCategoria,
    campoGastoFixoDia,
    listaGastosFixos,
    campoGastosFixosMes,
    campoGastosFixosAno,
    selecionarTodosGastos
} from "./dom.js";

let gastoFixoEmEdicao = null;

export async function salvarGastoFixo() {

    const usuario = auth.currentUser;

    if (!usuario) {
        alert("Faça login para salvar um gasto fixo.");
        return false;
    }

    const descricao = campoGastoFixoDescricao.value.trim();
    const valor = Number(campoGastoFixoValor.value);
    const categoria = campoGastoFixoCategoria.value;
    const diaVencimento = Number(campoGastoFixoDia.value);

    if (!descricao || !categoria || valor <= 0 || !Number.isFinite(valor)) {
        alert("Preencha todos os campos corretamente.");
        return false;
    }

    if (!Number.isInteger(diaVencimento) || diaVencimento < 1 || diaVencimento > 31) {
        alert("Informe um dia de vencimento entre 1 e 31.");
        return false;
    }

    const gastoOriginal = gastoFixoEmEdicao !== null
        ? gastosFixos.find(
            (gasto) => gasto.id === gastoFixoEmEdicao
        )
        : null;

    const novoGastoFixo = {
        descricao,
        valor,
        categoria,
        diaVencimento
    };

    if (gastoOriginal) {
        novoGastoFixo.id = gastoOriginal.id;
    }

    try {

        const gastoSalvo = await salvarGastoFixoFirestore(
            usuario.uid,
            novoGastoFixo
        );

        if (gastoOriginal) {

            const indice = gastosFixos.findIndex(
                (gasto) => gasto.id === gastoOriginal.id
            );

            if (indice !== -1) {
                gastosFixos[indice] = gastoSalvo;
            }

            gastoFixoEmEdicao = null;

        } else {

            gastosFixos.push(gastoSalvo);

        }

        listarGastosFixos();

        return true;

    } catch (erro) {

        console.error("Erro ao salvar gasto fixo:", erro);

        alert("Não foi possível salvar o gasto fixo. Tente novamente.");

        throw erro;
    }
}

export function listarGastosFixos() {

    if (!listaGastosFixos) return;

    listaGastosFixos.innerHTML = "";

    gastosFixos.forEach((gasto) => {

        const card = document.createElement("div");

        card.className = "gasto-fixo-card";

        card.innerHTML = `
           <div class="gasto-fixo-card-header">

    <div class="gasto-fixo-identificacao">

        <input
            type="checkbox"
            class="checkbox-gasto-fixo"
            value="${gasto.id}"
            aria-label="Selecionar ${gasto.descricao}"
        >

        <div>
            <h3>${gasto.descricao}</h3>
            <p>${gasto.categoria}</p>
        </div>

    </div>

                <div class="gasto-fixo-acoes">

                    <button
                        class="btn-editar-gasto-fixo"
                        type="button"
                        onclick="editarGastoFixo('${gasto.id}')">
                        Editar
                    </button>

                    <button
                        class="btn-excluir-gasto-fixo"
                        type="button"
                        onclick="excluirGastoFixo('${gasto.id}')">
                        <i data-lucide="trash-2"></i>
                    </button>

                </div>

            </div>

            <div class="gasto-fixo-card-footer">

                <strong>
                    ${gasto.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </strong>

                <span>Vencimento: dia ${gasto.diaVencimento}</span>

            </div>
        `;

        listaGastosFixos.appendChild(card);

    });

    lucide.createIcons();
}

export function editarGastoFixo(id) {

    const gasto = gastosFixos.find(
        (gasto) => String(gasto.id) === String(id)
    );

    if (!gasto) {
        return;
    }

    gastoFixoEmEdicao = id;

    campoGastoFixoDescricao.value = gasto.descricao;
    campoGastoFixoValor.value = gasto.valor;
    campoGastoFixoCategoria.value = gasto.categoria;
    campoGastoFixoDia.value = gasto.diaVencimento;

    modalGastoFixo.classList.remove("oculto");
}

export async function excluirGastoFixo(id) {

    const usuario = auth.currentUser;

    if (!usuario) {
        alert("Faça login para excluir um gasto fixo.");
        return;
    }

    const indice = gastosFixos.findIndex(
        (gasto) => String(gasto.id) === String(id)
    );

    if (indice === -1) {
        return;
    }

    const gasto = gastosFixos[indice];

    const confirmar = confirm(
        `Tem certeza que deseja excluir o gasto fixo "${gasto.descricao}"?`
    );

    if (!confirmar) {
        return;
    }

    try {

        await excluirGastoFixoFirestore(usuario.uid, id);

        gastosFixos.splice(indice, 1);

        if (gastoFixoEmEdicao !== null && String(gastoFixoEmEdicao) === String(id)) {
            gastoFixoEmEdicao = null;
        }

        listarGastosFixos();

    } catch (erro) {

        console.error("Erro ao excluir gasto fixo:", erro);

        alert("Não foi possível excluir o gasto fixo. Tente novamente.");

    }
}

// Lança os gastos fixos selecionados no mês escolhido.
export async function lancarGastosFixosSelecionados() {

    const usuario = auth.currentUser;

    if (!usuario) {
        throw new Error("Usuário não autenticado.");
    }

    const mes = Number(campoGastosFixosMes.value);
    const ano = Number(campoGastosFixosAno.value);

    if (!Number.isInteger(mes) || mes < 1 || mes > 12) {
        throw new Error("Selecione um mês válido.");
    }

    if (!Number.isInteger(ano) || ano < 2000 || ano > 2100) {
        throw new Error("Informe um ano válido.");
    }

    const caixasSelecionadas = document.querySelectorAll(
        ".checkbox-gasto-fixo:checked"
    );

    const idsSelecionados = Array.from(caixasSelecionadas).map(
        (caixa) => caixa.value
    );

    if (idsSelecionados.length === 0) {
        throw new Error("Selecione pelo menos um gasto fixo.");
    }

    const gastosSelecionados = gastosFixos.filter((gasto) =>
        idsSelecionados.includes(String(gasto.id))
    );

    const periodo = `${ano}-${String(mes).padStart(2, "0")}`;

    let lancados = 0;
    let duplicados = 0;
    let falhas = 0;

    const ultimoDia = new Date(ano, mes, 0).getDate();

    for (const gasto of gastosSelecionados) {

        const dia = Math.min(
            Number(gasto.diaVencimento),
            ultimoDia
        );

        const data = [
            String(dia).padStart(2, "0"),
            String(mes).padStart(2, "0"),
            ano
        ].join("/");

        const transacao = {
            descricao: gasto.descricao,
            valor: Number(gasto.valor),
            categoria: gasto.categoria,
            tipo: "despesa",
            data,
            mes,
            ano,
            gastoFixoId: gasto.id,
            periodo
        };

        try {

            const novaTransacao = await lancarGastoFixoFirestore(
                usuario.uid,
                gasto.id,
                periodo,
                transacao
            );

            transacoes.push(novaTransacao);
            lancados++;

        } catch (erro) {

            if (erro.message === "GASTO_FIXO_JA_LANCADO") {
                duplicados++;
            } else {
                falhas++;
                console.error(
                    `Erro ao lançar ${gasto.descricao}:`,
                    erro
                );
            }

        }

    }

    return {
        lancados,
        duplicados,
        falhas
    };

}

