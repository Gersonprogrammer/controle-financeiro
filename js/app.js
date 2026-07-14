// ==============================
// ALVESO - PERSONAL FINANCE
// ==============================

// Lista de transações
const transacoes = [];
transacoes.push({
    descricao: "Salário",
    valor: 5000,
    tipo: "receita",
    categoria: "Salário",
    data: "13/07/2026"
});

transacoes.push({
    descricao: "Supermercado",
    valor: 380,
    tipo: "despesa",
    categoria: "Alimentação",
    data: "13/07/2026"
});
console.log(transacoes);

// Inicialização dos ícones
lucide.createIcons();