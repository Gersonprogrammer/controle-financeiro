import { transacoes } from "./state.js";

export function exportarCSV() {

    let csv = "Data,Descrição,Categoria,Tipo,Valor\n";

    transacoes.forEach((transacao) => {

        csv += `${transacao.data},${transacao.descricao},${transacao.categoria},${transacao.tipo},${transacao.valor}\n`;

    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "caltrack-transacoes.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}