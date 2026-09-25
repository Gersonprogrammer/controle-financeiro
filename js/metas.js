import { metas } from "./state.js";
import { salvarMetas } from "./storage.js";

import {
    modalMeta,
    campoMetaNome,
    campoMetaObjetivo,
    campoMetaInicial,
    campoMetaMes,
    campoMetaAno
} from "./dom.js";

let metaEmEdicao = null;


export function criarMeta({
    nome,
    valorObjetivo,
    valorAtual,
    prazoMes,
    prazoAno
}) {

    

    if (metaEmEdicao !== null) {

        const meta = metas.find(
            (meta) => meta.id === metaEmEdicao
        );




        if (meta) {
            meta.nome = nome;
            meta.valorObjetivo = valorObjetivo;
            meta.valorAtual = valorAtual;
            meta.prazoMes = prazoMes;
            meta.prazoAno = prazoAno;
        }

        metaEmEdicao = null;

    } else {

        const novaMeta = {
            id: Date.now(),
            nome: nome,
            valorObjetivo: valorObjetivo,
            valorAtual: valorAtual,
            prazoMes: prazoMes,
            prazoAno: prazoAno,
            criadaEm: new Date().toLocaleDateString("pt-BR")
        };

        metas.push(novaMeta);
    }

    salvarMetas();
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
    onclick="excluirMeta(${meta.id})"
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
    onclick="editarMeta(${meta.id})"
>
    Editar
</button>

            </div>
        `;

        lista.appendChild(card);
    });

    lucide.createIcons();
}

export function excluirMeta(id) {

    const indice = metas.findIndex((meta) => meta.id === id);

    if (indice === -1) {
        return;
    }

    metas.splice(indice, 1);

    salvarMetas();

    listarMetas();
}
export function editarMeta(id) {

    const meta = metas.find((meta) => meta.id === id);

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


