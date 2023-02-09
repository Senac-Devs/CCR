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
function addEventListenerElem(elementoId){
    const input = document.getElementById(elementoId);
    input?.addEventListener("change", exibeGuiaConvenio);
    return input
}

function exibeGuiaConvenio() {
    const status = document.getElementById("status-imagem");
    status.innerText = this?.files[0].name;
}

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
                    //'<input type="button" value="Enviar" class="btnBaixar"/>';
                    `<div class="conteudo-group1" >
                    <label class="btnNav" for="guiaParaEnviar-id-${i}">Anexar</label>
                <span id="status-imagem" style="font-size: 8px;"></span>
                <input type="file" multiple="false" capture="camera" style="display: none;" accept="image/*" id="guiaParaEnviar-id-${i}"/>
                <label class="btnNav" onclick="coletarGuiaEnviar('guiaParaEnviar-id-${i}')">Enviar</label></div>
                `;
                addEventListenerElem(`guiaParaEnviar-id-${i}`);
            } else if (
                cols[j] == "imagem" &&
                consultas[i][cols[j]] !== "undefined"
            ) {
                cell.innerHTML = `<div class="conteudo-group1" ><label class="btnNav" onclick="exibeGuia('${consultas[i][cols[j]]}')">Visualizar</label></div>`;
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
                    //'<button type="button" class="button">Excluir</button></div>';
                    `<div class="conteudo-group1" ><label class="btnNav" onclick="deleteConsulta('${i}')">Excluir</label></div>`;
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
    iframe.src = bloburl;
    iframe.style = "width: 50%;";
    setTimeout(() => {
        janela.document.body.appendChild(iframe);
    }, 0);
}
