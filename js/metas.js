
import { metas } from "./state.js";
import { auth } from "./firebase.js";
import {
    salvarMetaFirestore,
    excluirMetaFirestore
} from "./firestore-service.js";


import {
    modalMeta,
    campoMetaNome,
    campoMetaObjetivo,
    campoMetaInicial,
    campoMetaMes,
    campoMetaAno
} from "./dom.js";

let metaEmEdicao = null;


export async function criarMeta({
    nome,
    valorObjetivo,
    valorAtual,
    prazoMes,
    prazoAno
}) {
    const usuario = auth.currentUser;

    if (!usuario) {
        alert("Faça login para salvar uma meta.");
        return;
    }

    const metaOriginal = metaEmEdicao !== null
        ? metas.find((meta) => meta.id === metaEmEdicao)
        : null;

    const novaMeta = {
        nome,
        valorObjetivo,
        valorAtual,
        prazoMes,
        prazoAno,
        criadaEm: metaOriginal?.criadaEm
            || new Date().toLocaleDateString("pt-BR")
    };

    if (metaOriginal) {
        novaMeta.id = metaOriginal.id;
    }

    try {
        const metaSalva = await salvarMetaFirestore(
            usuario.uid,
            novaMeta
        );

        if (metaOriginal) {
            const indice = metas.findIndex(
                (meta) => meta.id === metaOriginal.id
            );

            if (indice !== -1) {
                metas[indice] = metaSalva;
            }

            metaEmEdicao = null;
        } else {
            metas.push(metaSalva);
        }

        listarMetas();
    } catch (erro) {
        console.error("Erro ao salvar meta:", erro);
        alert("Não foi possível salvar a meta. Tente novamente.");
    }
}






export function listarMetas() {



    const lista = document.querySelector("#lista-metas");

    if (!lista) return;

    lista.innerHTML = "";


    metas.forEach((meta) => {



        const percentual =
            meta.valorObjetivo > 0
                ? (meta.valorAtual / meta.valorObjetivo) * 100
                : 0;

        const percentualExibido = Math.min(percentual, 100);

        const card = document.createElement("div");

        card.className = "meta-card";

        card.innerHTML = `
            <div class="meta-card-header">

                <div>
                    <h3>${meta.nome}</h3>
                    <p>Meta financeira</p>
                </div>

<button
    class="btn-excluir-meta"
    type="button"
    onclick="excluirMeta('${meta.id}')"
>
    <i data-lucide="trash-2"></i>
</button>

            </div>

            <div class="meta-valores">

                <div>
                    <span>Atual</span>
                    <strong>
                        ${meta.valorAtual.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                    </strong>
                </div>

                <div>
                    <span>Objetivo</span>
                    <strong>
                        ${meta.valorObjetivo.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                    </strong>
                </div>

            </div>

            <div class="meta-progresso">

                <div class="meta-progresso-barra">

                    <div
                        class="meta-progresso-preenchimento"
                        style="width: ${percentualExibido}%;">
                    </div>

                </div>

                <span>${percentualExibido.toFixed(0)}%</span>

            </div>

            <div class="meta-footer">

                <span>
                    Prazo: ${meta.prazoMes}/${meta.prazoAno}
                </span>

             <button
    class="btn-editar-meta"
    type="button"
    onclick="editarMeta('${meta.id}')"
>
    Editar
</button>

            </div>
        `;

        lista.appendChild(card);
    });

    lucide.createIcons();
}


export async function excluirMeta(id) {
    const usuario = auth.currentUser;

    if (!usuario) {
        alert("Faça login para excluir uma meta.");
        return;
    }

    const indice = metas.findIndex(
        (meta) => String(meta.id) === String(id)
    );

    if (indice === -1) {
        return;
    }

    try {
        await excluirMetaFirestore(usuario.uid, id);

        metas.splice(indice, 1);

        if (metaEmEdicao !== null && String(metaEmEdicao) === String(id)) {
            metaEmEdicao = null;
        }

        listarMetas();
    } catch (erro) {
        console.error("Erro ao excluir meta:", erro);
        alert("Não foi possível excluir a meta. Tente novamente.");
    }
}


export function editarMeta(id) {

    const meta = metas.find(
    (meta) => String(meta.id) === String(id)
);

    if (!meta) {
        return;
    }

    metaEmEdicao = id;


    campoMetaNome.value = meta.nome;

    campoMetaObjetivo.value = meta.valorObjetivo
        .toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    campoMetaInicial.value = meta.valorAtual
        .toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    campoMetaMes.value = meta.prazoMes;

    campoMetaAno.value = meta.prazoAno;

    modalMeta.classList.remove("oculto");
}

export function prepararNovaMeta() {

    metaEmEdicao = null;

    campoMetaNome.value = "";
    campoMetaObjetivo.value = "";
    campoMetaInicial.value = "";
    campoMetaMes.value = "";
    campoMetaAno.value = new Date().getFullYear();

    modalMeta.classList.remove("oculto");
}


