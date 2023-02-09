//define a data today como a maxima aceita
const dataInicial = document.getElementById("dataInicial");
const todayInicial = new Date();
const currentDateInicial = todayInicial
    .toLocaleString()
    .split(" ")[0]
    .split("/")
    .reverse()
    .join("-");
dataInicial.max = currentDateInicial + "T23:59";

//define a data today como a maxima aceita
const dataFinal = document.getElementById("dataFinal");
const todayFinal = new Date();
const currentDateFinal = todayFinal
    .toLocaleString()
    .split(" ")[0]
    .split("/")
    .reverse()
    .join("-");
dataFinal.max = currentDateFinal + "T23:59";

const novoConvenio = document.getElementById("novoConvenio")

function printTarget(tableId) {
    let divToPrint = document.getElementById("tableId");
    let htmlToPrint =
        '<style type="text/css">' +
        "table {" +
        "font-family: arial, sans-serif;" +
        "border-collapse: collapse;" +
        "width: 95%;" +
        "margin-left: 20px" +
        "}" +
        "th, td {" +
        "border:1px solid #000;" +
        "padding: 8px;" +
        "}" +
        "tr:nth-child(even) {" +
        "background-color: #dddddd;" +
        "}" +
        "</style>";
    htmlToPrint += divToPrint.outerHTML;
    let windowToPrint = window.open("");
    windowToPrint.document.write(htmlToPrint);
    windowToPrint.print();
    windowToPrint.close();
}

function filterSearch() {
    limpaTabela()
    const convenio = document.getElementById("novoConvenio").value;
    bd.transaction(function (ler) {
        ler.executeSql(
            "SELECT * FROM consultas WHERE convenio=? ",
            [convenio],
            function (ler, resultado) {
                let listaConsultas = [];

                for (let i = 0; i < resultado.rows.length; i++) {
                    listaConsultas.push(resultado.rows.item(i));
                }
                insereTable(listaConsultas);
            }
        );
    });
}
function limpaTabela(){
    const table = document.getElementById("table")
    table.innerHTML = `<tr>
    <th>Nome do Paciente</th>
    <th>Nº cartão/convênio</th>
    <th>Data/Hora da Consulta</th>
    <th>Convênio</th>
    <th>Valor da Consulta</th>
    <th>Img Guia</th>
    <th>Editar/Excluir</th>
  </tr>`
}

function clearSearch() {
    limpaTabela()
    const listaConsultas =[];
    dataInicial.value = ""
    dataFinal.value = ""
    novoConvenio.value = ""

    bd.transaction(function (ler) {
        ler.executeSql(
            "SELECT rowid, * FROM consultas",
            [],
            function (ler, resultados) {
                for (let i = 0; i < resultados.rows.length; i++) {
                    listaConsultas.push(resultados.rows.item(i));
                }
                insereTable(listaConsultas);
            }
        );
    });

}