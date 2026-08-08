// ==============================
// Caltrack - Sua vida financeira sob controle
// ==============================

import { atualizarInterface } from "./interface.js";
import { atualizarGrafico } from "./grafico.js";
import { exportarCSV } from "./exportacao.js";
import { carregarTransacoes } from "./storage.js";
import { atualizarCards } from "./dashboard.js";
import { transacoes } from "./state.js";

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
 
} from "./dom.js";



window.excluirTransacao = excluirTransacao;

window.editarTransacao = editarTransacao;


function aplicarFiltros() {

    const texto = campoPesquisa.value.toLowerCase();

    const categoria = filtroCategoria.value;
    
    const tipo = filtroTipo.value;

    const ordem = ordenacao.value;

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

return (
    correspondePesquisa &&
    correspondeCategoria &&
    correspondeTipo
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

listarTransacoes(listaFiltrada);

}


// ==============================
// Eventos
// ==============================

// Escuta o clique no botão

botaoNova.addEventListener("click", abrirFormulario);



campoPesquisa.addEventListener("input", aplicarFiltros);
    

filtroCategoria.addEventListener("change", aplicarFiltros);

filtroTipo.addEventListener("change", aplicarFiltros);

ordenacao.addEventListener("change", aplicarFiltros);

botaoCancelar.addEventListener("click", fecharFormulario);

btnExportar.addEventListener("click", exportarCSV);

const btnMenu = document.querySelector(".btn-menu");
const sidebar = document.querySelector(".sidebar");

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

atualizarInterface();

// Inicialização dos ícones
lucide.createIcons();