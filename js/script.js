const listaConsultas = [];
const table = document.getElementById("table");
const consultasTotal = document.getElementById("consultasTotal");
const somaPeriodo = document.getElementById("somaPeriodo");

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

function insereTable(consultas) {
    const cols = [];

    for (let i = 0; i < consultas.length; i++) {
        for (const k in consultas[i]) {
            if (cols.indexOf(k) === -1) {
                cols.push(k);
            }
        }
    }
    cols.push("Ações");
    for (let i = 0; i < consultas.length; i++) {
        // Cria nova linha
        let trow = table.insertRow(-1);
        for (let j = 0; j < cols.length; j++) {
            if (cols[j] == "rowid") {
                continue;
            }
            const cell = trow.insertCell(-1);

            // Insere cada célula no lugar correto

            if (cols[j] == "imagem" && consultas[i][cols[j]] == "undefined") {
                cell.innerHTML =
                    '<input type="button" value="Enviar" class="btnBaixar"/>';
            } else if (
                cols[j] == "imagem" &&
                consultas[i][cols[j]] !== "undefined"
            ) {
                cell.innerHTML = `<input type="button" value="Ver" class="btnBaixar"
                 onclick="exibeGuia('${consultas[i][cols[j]]}')"/>`;
            } else if (cols[j] == "data") {
                let data = consultas[i][cols[j]].split("T");
                let dataFormat = data[0].split("-").reverse().join("/");
                let horaFormat = data[1].split(":").slice(0, 2).join(":");
                cell.innerHTML = dataFormat + " às " + horaFormat + " horas";
            } else if (cols[j] == "valor") {
                cell.innerHTML = new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(parseFloat(consultas[i][cols[j]]));
            } else {
                cell.innerHTML = consultas[i][cols[j]];
            }
            if (cols[j] == "Ações") {
                cell.innerHTML =
                    '<div><button type="button" class="button">Editar</button><button type="button" class="button">Excluir</button></div>';
            }
        }
    }

    let somaConsulta = 0;

    consultas.forEach((item) => {
        somaConsulta += parseFloat(item.valor);
    });

    consultasTotal.innerHTML = consultas.length;
    somaPeriodo.innerHTML = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(somaConsulta);
}

function exibeGuia(bloburl) {
    const janela = window.open("about:blank");
    const iframe = janela.document.createElement("img");
    iframe.src = bloburl
    iframe.style = 'width: 50%;'
    setTimeout(()=> {
        janela.document.body.appendChild(iframe)
    },0)

}

console.log(listaConsultas);
