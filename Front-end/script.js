document.getElementById("btn").addEventListener("click", function() {
    // Mostrar o modal com a transição
    document.getElementById("modal").classList.add("show");
});

// Fechar o modal
document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("modal").classList.remove("show");
});

// Registrar veículo e fechar modal
document.getElementById("adicionar-btn").addEventListener("click", function() {
    var nome = document.getElementById("nome").value;
    var telefone = document.getElementById("telefone").value;
    var modelo = document.getElementById("modelo").value;
    var placa = document.getElementById("placa").value;
    var cor = document.getElementById("cor").value;
    var vaga = document.getElementById("vaga").value;

    // Validar dados (opcional)
    if (!nome || !telefone || !modelo || !placa || !cor || !vaga) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Adicionar registro na página principal
    var novaDiv = document.createElement("div");
    novaDiv.style.marginBottom = "10px";


    var novaResposta = document.createElement("p");
    novaResposta.textContent = "Cliente: " + nome + ", Modelo: " + modelo + ", Cor: " + cor + ", Placa: " + placa + ", Vaga: " + vaga;
    novaResposta.style.display = "inline";

    var botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";
    botaoRemover.style.marginLeft = "10px";
    botaoRemover.style.display = "inline-block";
    botaoRemover.style.padding = "10px"; 
    botaoRemover.style.background = "red";
    botaoRemover.style.color = "white"


    botaoRemover.addEventListener("click", function() {
        novaDiv.remove();
    });

    novaDiv.appendChild(novaResposta);
    novaDiv.appendChild(botaoRemover);
    document.getElementById("resposta").appendChild(novaDiv);

    novaResposta.style.display = "inline-block"; // Mantém o parágrafo como bloco
    novaResposta.style.border = "1px solid black"; // Borda preta
    novaResposta.style.padding = "10px"; // Espaçamento dentro da borda
    novaResposta.style.marginBottom = "10px";    
    // Limpar os campos do modal
    document.getElementById("nome").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("modelo").value = "";
    document.getElementById("placa").value = "";
    document.getElementById("cor").value = "";
    document.getElementById("vaga").value = "";

    // Fechar o modal após a submissão
    document.getElementById("modal").classList.remove("show");
});
