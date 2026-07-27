// ==============================
// Caltrack - Sua vida financeira sob controle
// ==============================


import { carregarTransacoes } from "./storage.js";
import { atualizarCards } from "./dashboard.js";

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
    botaoCancelar
} from "./dom.js";


window.excluirTransacao = excluirTransacao;

window.editarTransacao = editarTransacao;

// ==============================
// Eventos
// ==============================

// Escuta o clique no botão

botaoNova.addEventListener("click", abrirFormulario);

botaoCancelar.addEventListener("click", fecharFormulario);

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

listarTransacoes();

atualizarCards();

// Inicialização dos ícones
lucide.createIcons();