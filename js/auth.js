import { auth } from "./firebase.js";
import { atualizarInterface } from "./interface.js";


import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import {
    carregarTransacoesFirestore,
    carregarMetasFirestore
} from "./firestore-service.js";

import { transacoes, metas } from "./state.js";

const telaAutenticacao = document.querySelector("#tela-autenticacao");
const formularioLogin = document.querySelector("#form-login");
const campoEmail = document.querySelector("#email-login");
const campoSenha = document.querySelector("#senha-login");
const botaoMostrarCadastro = document.querySelector("#btn-mostrar-cadastro");
const tituloAutenticacao = document.querySelector("#titulo-autenticacao");
const botaoEntrar = document.querySelector("#btn-entrar");
const mensagemAutenticacao = document.querySelector("#mensagem-autenticacao");

const cabecalho = document.querySelector("header");
const painel = document.querySelector(".container");
const botaoSair = document.querySelector("#btn-sair");
botaoSair.addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (erro) {
        console.error("Erro ao encerrar a sessão:", erro);
        alert("Não foi possível sair da conta. Tente novamente.");
    }
});


let modoCadastro = false;
let aplicativoIniciado = false;

formularioLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = campoEmail.value.trim();
    const senha = campoSenha.value;

    mensagemAutenticacao.textContent = "";
    botaoEntrar.disabled = true;

    try {
        if (modoCadastro) {
            await createUserWithEmailAndPassword(auth, email, senha);
        } else {
            await signInWithEmailAndPassword(auth, email, senha);
        }
    } catch (erro) {
        const mensagens = {
            "auth/email-already-in-use": "Este e-mail já está cadastrado.",
            "auth/invalid-email": "Informe um e-mail válido.",
            "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
            "auth/invalid-credential": "E-mail ou senha incorretos.",
            "auth/network-request-failed": "Falha de conexão. Verifique sua internet."
        };

        mensagemAutenticacao.textContent =
            mensagens[erro.code] || "Não foi possível concluir. Tente novamente.";
    } finally {
        botaoEntrar.disabled = false;
    }
});

botaoMostrarCadastro.addEventListener("click", () => {
    modoCadastro = !modoCadastro;

    tituloAutenticacao.textContent = modoCadastro
        ? "Criar sua conta"
        : "Entrar na sua conta";

    botaoEntrar.textContent = modoCadastro ? "Criar conta" : "Entrar";

    botaoMostrarCadastro.textContent = modoCadastro
        ? "Voltar para entrar"
        : "Criar conta";

    formularioLogin.reset();
    mensagemAutenticacao.textContent = "";
});

onAuthStateChanged(auth, async (usuario) => {

        console.log("[AUTH] Estado recebido:", usuario ? "AUTENTICADO" : "SEM USUÁRIO");
    console.log("[AUTH] UID:", usuario?.uid ?? null);



if (!usuario) {

     // Limpa os campos de e-mail e senha.
    formularioLogin.reset();
    
    // Limpa os dados mantidos na memória.

    transacoes.splice(0, transacoes.length);
    metas.splice(0, metas.length);

    // Limpa os dados visíveis na interface.
    atualizarInterface();

    // Exibe a tela de login e oculta o aplicativo.
    telaAutenticacao.classList.remove("oculto");
    cabecalho.classList.add("oculto");
    painel.classList.add("oculto");

    return;
}



    telaAutenticacao.classList.add("oculto");
    cabecalho.classList.add("oculto");
    painel.classList.add("oculto");

    mensagemAutenticacao.textContent = "";

    try {
        const [transacoesSalvas, metasSalvas] = await Promise.all([
            carregarTransacoesFirestore(usuario.uid),
            carregarMetasFirestore(usuario.uid)
        ]);

        transacoes.splice(0, transacoes.length, ...transacoesSalvas);
        metas.splice(0, metas.length, ...metasSalvas);

        if (!aplicativoIniciado) {
            await import("./app.js");
            aplicativoIniciado = true;
        }

        cabecalho.classList.remove("oculto");
        painel.classList.remove("oculto");
    } catch (erro) {
        console.error("Erro ao carregar os dados do usuário:", erro);

        telaAutenticacao.classList.remove("oculto");
        mensagemAutenticacao.textContent =
            "Não foi possível carregar seus dados. Verifique a conexão e as regras do Firestore.";
    }
});
