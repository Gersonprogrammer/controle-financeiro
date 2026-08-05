import { transacoes } from "./state.js";

let graficoFinanceiro;
let graficoCategorias;

export function atualizarGrafico() {

    const canvas = document.querySelector("#graficoFinanceiro");

    const canvasCategorias = document.querySelector("#graficoCategorias");

    if (!canvas || !canvasCategorias) return;


    let totalReceitas = 0;
    let totalDespesas = 0;


    transacoes.forEach((transacao) => {

        if (transacao.tipo === "receita") {

            totalReceitas += transacao.valor;

        }

        if (transacao.tipo === "despesa") {

            totalDespesas += transacao.valor;

        }

    });


    if (graficoFinanceiro) {

        graficoFinanceiro.destroy();

    }


    graficoFinanceiro = new Chart(canvas, {

        type: "pie",

        data: {

            labels: [
                "Receitas",
                "Despesas"
            ],

          datasets: [
    {
        data: [
            totalReceitas,
            totalDespesas
        ],

        backgroundColor: [
            "#22c55e",
            "#ef4444"
        ],

        borderColor: [
            "#16a34a",
            "#dc2626"
        ],

        borderWidth: 2

    }
]

        },
options: {

    responsive: true,

    maintainAspectRatio: false,

    animation: {

        duration: 800,

        easing: "easeOutQuart"

    },

    plugins: {

        legend: {

            position: "bottom"

        },

        tooltip: {

            callbacks: {

                label: function (context) {

                    const valor = context.raw;

                    return `${context.label}: ${valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}`;

                }

            }

        }

    }

}

    });

    atualizarGraficoCategorias();

}




function atualizarGraficoCategorias() {

    const canvas = document.querySelector("#graficoCategorias");

    if (!canvas) return;

    if (graficoCategorias) {

        graficoCategorias.destroy();

    }
const categorias = {};

transacoes.forEach((transacao) => {

    if (transacao.tipo !== "despesa") return;

    if (!categorias[transacao.categoria]) {

        categorias[transacao.categoria] = 0;

    }

    categorias[transacao.categoria] += transacao.valor;

});

const labels = Object.keys(categorias);

const valores = Object.values(categorias);

    graficoCategorias = new Chart(canvas, {

        type: "bar",

   data: {

    labels: labels,

    datasets: [
        {
            label: "Despesas por Categoria",

            data: valores
        }
    ]

},
   options: {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

        legend: {

            display: false

        }

    }

}

    });

}

