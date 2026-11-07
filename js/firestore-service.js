import { db } from "./firebase.js";
import { auth } from "./firebase.js";

import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    deleteDoc,
    runTransaction
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

// Retorna a coleção financeira de um usuário.
function obterColecao(uid, nomeColecao) {
    const usuario = auth.currentUser;

    if (!usuario) {
        throw new Error("Usuário não autenticado.");
    }

    if (usuario.uid !== uid) {
        throw new Error("O usuário autenticado não corresponde ao UID informado.");
    }

    return collection(db, "users", uid, nomeColecao);
}

// Carrega todos os documentos de uma coleção do usuário.
async function carregarDados(uid, nomeColecao) {
    const referencia = obterColecao(uid, nomeColecao);
    const resultado = await getDocs(referencia);

    return resultado.docs.map((documento) => ({
        ...documento.data(),
        id: documento.id
    }));
}

// Salva um item, preservando seu identificador.
async function salvarDado(uid, nomeColecao, item) {
    const referencia = obterColecao(uid, nomeColecao);

    const documento = item.id
        ? doc(referencia, String(item.id))
        : doc(referencia);

    const dados = { ...item, id: documento.id };

    await setDoc(documento, dados);

    return dados;
}

// Exclui um item da coleção do usuário.

async function excluirDado(uid, nomeColecao, id) {
    const usuario = auth.currentUser;

    if (!usuario) {
        throw new Error("Usuário não autenticado.");
    }

    if (usuario.uid !== uid) {
        throw new Error("O usuário autenticado não corresponde ao UID informado.");
    }

    if (!id) {
        throw new Error("Identificador do registro não informado.");
    }

    const referencia = doc(
        db,
        "users",
        uid,
        nomeColecao,
        String(id)
    );

    await deleteDoc(referencia);
}


export async function carregarTransacoesFirestore(uid) {
    return carregarDados(uid, "transacoes");
}

export async function salvarTransacaoFirestore(uid, transacao) {
    return salvarDado(uid, "transacoes", transacao);
}

export async function excluirTransacaoFirestore(uid, id) {
    return excluirDado(uid, "transacoes", id);
}

export async function carregarMetasFirestore(uid) {
    return carregarDados(uid, "metas");
}

export async function salvarMetaFirestore(uid, meta) {
    return salvarDado(uid, "metas", meta);
}

export async function excluirMetaFirestore(uid, id) {
    return excluirDado(uid, "metas", id);
}

// Gastos Fixos

export async function carregarGastosFixosFirestore(uid) {
    return carregarDados(uid, "gastosFixos");
}

export async function salvarGastoFixoFirestore(uid, gastoFixo) {
    return salvarDado(uid, "gastosFixos", gastoFixo);
}

export async function excluirGastoFixoFirestore(uid, id) {
    return excluirDado(uid, "gastosFixos", id);
}

// Lança um gasto fixo como transação, impedindo duplicidade.
export async function lancarGastoFixoFirestore(
    uid,
    gastoFixoId,
    periodo,
    transacao
) {
    const usuario = auth.currentUser;

    if (!usuario || usuario.uid !== uid) {
        throw new Error("Usuário não autenticado ou UID inválido.");
    }

    const transacaoRef = doc(
        obterColecao(uid, "transacoes")
    );

    const marcadorRef = doc(
        db,
        "users",
        uid,
        "lancamentosGastosFixos",
        `${gastoFixoId}_${periodo}`
    );

    await runTransaction(db, async (operacao) => {

        const marcador = await operacao.get(marcadorRef);

        if (marcador.exists()) {
            throw new Error("GASTO_FIXO_JA_LANCADO");
        }

        operacao.set(transacaoRef, {
            ...transacao,
            id: transacaoRef.id
        });

        operacao.set(marcadorRef, {
            gastoFixoId,
            periodo,
            transacaoId: transacaoRef.id,
            criadoEm: new Date().toISOString()
        });

    });

    return {
        ...transacao,
        id: transacaoRef.id
    };
}