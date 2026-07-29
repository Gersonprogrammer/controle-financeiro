import { transacoes } from "./state.js";

let graficoFinanceiro;

export function atualizarGrafico() {

    const canvas = document.querySelector("#graficoFinanceiro");

    if (!canvas) return;


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
                    ]
                }
            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}