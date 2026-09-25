// ==============================
// Caltrack - Sua vida financeira sob controle
// ==============================

import { atualizarInterface } from "./interface.js";
import { atualizarGrafico } from "./grafico.js";
import { exportarCSV } from "./exportacao.js";
import { carregarTransacoes, carregarMetas } from "./storage.js";
import { atualizarCards } from "./dashboard.js";
import { transacoes, transacoesFiltradas } from "./state.js";


import {
    criarMeta,
    listarMetas,
    excluirMeta,
    editarMeta,
    prepararNovaMeta
} from "./metas.js";



import {
    listarTransacoes,
    excluirTransacao,
    salvarTransacao,
    editarTransacao
} from "./transacoes.js";

import {
    abrirFormulario,
    fecharFormulario
} from "./ui.js";

import {
    botaoNova,
    modal,
    botaoCancelar,
    campoPesquisa,
    filtroCategoria,
    filtroTipo,
    ordenacao,
    btnExportar,
    campoValor,
    filtroMes,
    filtroAno,
    botaoNovaMeta,
    modalMeta,
    botaoCancelarMeta,
    formularioMeta,
campoMetaNome,
campoMetaObjetivo,
campoMetaInicial,
campoMetaMes,
campoMetaAno
} from "./dom.js";





window.excluirTransacao = excluirTransacao;

window.editarTransacao = editarTransacao;

window.excluirMeta = excluirMeta;

window.editarMeta = editarMeta;



function aplicarFiltros() {

    const texto = campoPesquisa.value.toLowerCase();

    const categoria = filtroCategoria.value;
    
    const tipo = filtroTipo.value;


    const ordem = ordenacao.value;

    const mes = filtroMes.value;

const ano = filtroAno.value;

    const listaFiltrada = transacoes.filter(function (transacao) {

        const correspondePesquisa =
            transacao.descricao.toLowerCase().includes(texto) ||
            transacao.categoria.toLowerCase().includes(texto) ||
            transacao.tipo.toLowerCase().includes(texto);

const correspondeCategoria =
    categoria === "" ||
    transacao.categoria === categoria;

const correspondeTipo =
    tipo === "" ||
    transacao.tipo === tipo;

    const correspondeMes =
    mes === "" ||
    transacao.mes === Number(mes);

const correspondeAno =
    ano === "" ||
    transacao.ano === Number(ano);

 

return (
    correspondePesquisa &&
    correspondeCategoria &&
    correspondeTipo &&
    correspondeMes &&
    correspondeAno
);


    });


if (ordem === "valor-desc") {



    listaFiltrada.sort((a, b) => b.valor - a.valor);

}

if (ordem === "valor-asc") {

    listaFiltrada.sort((a, b) => a.valor - b.valor);

}

if (ordem === "data-desc") {

    listaFiltrada.sort((a, b) => {

        const dataA = new Date(a.data.split("/").reverse().join("-"));
        const dataB = new Date(b.data.split("/").reverse().join("-"));

        return dataB.getTime() - dataA.getTime();

    });

}

if (ordem === "data-asc") {

    listaFiltrada.sort((a, b) => {

        const dataA = new Date(a.data.split("/").reverse().join("-"));
        const dataB = new Date(b.data.split("/").reverse().join("-"));

        return dataA.getTime() - dataB.getTime();

    });

}


transacoesFiltradas.length = 0;
transacoesFiltradas.push(...listaFiltrada);


listarTransacoes(listaFiltrada);

atualizarCards(listaFiltrada);

atualizarGrafico(listaFiltrada);

}


// ==============================
// Eventos
// ==============================

// Escuta o clique no botão

function mostrarNotificacao(mensagem) {

    const notificacao = document.createElement("div");

    notificacao.className = "notificacao";

    notificacao.textContent = mensagem;

    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.classList.add("visivel");
    }, 10);

    setTimeout(() => {
        notificacao.classList.remove("visivel");

        setTimeout(() => {
            notificacao.remove();
        }, 300);

    }, 2500);
}

botaoNova.addEventListener("click", abrirFormulario);

botaoNovaMeta.addEventListener("click", () => {

    prepararNovaMeta();

});


botaoCancelarMeta.addEventListener("click", () => {
    modalMeta.classList.add("oculto");
});



campoPesquisa.addEventListener("input", aplicarFiltros);
    

filtroCategoria.addEventListener("change", aplicarFiltros);

filtroTipo.addEventListener("change", aplicarFiltros);

ordenacao.addEventListener("change", aplicarFiltros);

filtroMes.addEventListener("change", aplicarFiltros);

filtroAno.addEventListener("change", aplicarFiltros);

window.addEventListener("interfaceAtualizada", aplicarFiltros);

botaoCancelar.addEventListener("click", fecharFormulario);

btnExportar.addEventListener("click", exportarCSV);

const btnMenu = document.querySelector(".btn-menu");
const sidebar = document.querySelector(".sidebar");

const menuMetas = document.querySelector("#menu-metas");
const secaoMetas = document.querySelector("#secao-metas");

console.log("menuMetas:", menuMetas);
console.log("secaoMetas:", secaoMetas);

const menuDashboard = document.querySelector("#menu-dashboard");
const menuTransacoes = document.querySelector("#menu-transacoes");

const secaoDashboard = document.querySelector(".cards");
const secaoTransacoes = document.querySelector(".transacoes");

const secaoGrafico = document.querySelector(".grafico");


function mostrarSecao(secao) {

    secaoDashboard.classList.add("oculto");
    secaoGrafico.classList.add("oculto");
    secaoTransacoes.classList.add("oculto");
    secaoMetas.classList.add("oculto");

    secao.classList.remove("oculto");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

menuMetas.addEventListener("click", () => {
    mostrarSecao(secaoMetas);
});

menuDashboard.addEventListener("click", () => {

    mostrarSecao(secaoDashboard);

    secaoGrafico.classList.remove("oculto");

});

menuTransacoes.addEventListener("click", () => {
    mostrarSecao(secaoTransacoes);
});





campoValor.addEventListener("input", () => {

    let valor = campoValor.value.replace(/\D/g, "");

    if (valor === "") {
        campoValor.value = "";
        return;
    }

    valor = (Number(valor) / 100).toFixed(2);

    const partes = valor.split(".");
    const inteiro = partes[0];
    const decimal = partes[1];

    const inteiroFormatado = Number(inteiro).toLocaleString("pt-BR");

    campoValor.value = `${inteiroFormatado},${decimal}`;

});

// Menu mobile - Sidebar

if (btnMenu && sidebar) {

    btnMenu.addEventListener("click", () => {

        sidebar.classList.toggle("ativo");

    });

    document.addEventListener("click", (event) => {

        if (
            sidebar.classList.contains("ativo") &&
            !sidebar.contains(event.target) &&
            !btnMenu.contains(event.target)
        ) {
            sidebar.classList.remove("ativo");
        }

    });

}





const formulario = document.querySelector("#form-transacao");

formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    salvarTransacao();
});

formularioMeta.addEventListener("submit", (event) => {

    event.preventDefault();

    const nome = campoMetaNome.value.trim();

const valorObjetivo = Number(
    campoMetaObjetivo.value
        .replace("R$", "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".")
);
const valorAtual = campoMetaInicial.value === ""
    ? 0
    : Number(
        campoMetaInicial.value
            .replace("R$", "")
            .replace(/\s/g, "")
            .replace(/\./g, "")
            .replace(",", ".")
    );

    const prazoMes = Number(campoMetaMes.value);

    const prazoAno = Number(campoMetaAno.value);

    criarMeta({
        nome,
        valorObjetivo,
        valorAtual,
        prazoMes,
        prazoAno
    });

    listarMetas();

    formularioMeta.reset();

    campoMetaAno.value = new Date().getFullYear();

    modalMeta.classList.add("oculto");

    mostrarNotificacao("Meta criada com sucesso!");
    
});

// Fechar modal com a tecla ESC
document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        fecharFormulario();
    }

});

// Fechar modal clicando fora dele

modal.addEventListener("click", function (event) {

    if (event.target === modal) {
        fecharFormulario();
    }
});

// ==============================
// Inicialização
// ==============================

// Carregar dados ao iniciar o aplicativo
carregarTransacoes();
carregarMetas();

atualizarInterface();
aplicarFiltros();
listarMetas();

lucide.createIcons();