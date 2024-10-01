let totalVagas = 15; 
let vagasOcupadas = 0; 

document.getElementById("btn").addEventListener("click", function() {
    document.getElementById("modal").classList.add("show");
});

document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("modal").classList.remove("show");
});

document.getElementById("adicionar-btn").addEventListener("click", function() {
    if (vagasOcupadas >= totalVagas) {
        alert("Não há vagas disponíveis.");
        return; 
    }

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
    novaDiv.classList.add("resposta-item");

    var novaResposta = document.createElement("p");
    novaResposta.textContent = `Cliente: ${nome}, Modelo: ${modelo}, Cor: ${cor}, Placa: ${placa}, Vaga: ${vaga}`;

    var horarioAdicionado = document.createElement("p");
    var horarioAtual = new Date().toLocaleTimeString();
    horarioAdicionado.textContent = `Horário de Adição: ${horarioAtual}`;

    var botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";
    
    botaoRemover.addEventListener("click", function() {
        var horarioRemocao = new Date().toLocaleTimeString();
        alert(`Veículo removido! Tempo total: + ${horarioAtual} - ${horarioRemocao}`);
        novaDiv.remove();

        // Libera a vaga
        vagasOcupadas--;
        atualizarVagasDisponiveis();
    });

    novaDiv.appendChild(novaResposta);
    novaDiv.appendChild(horarioAdicionado);
    novaDiv.appendChild(botaoRemover);

    // Adicionar borda ao adicionar o item
    novaDiv.style.border = "1px solid black"; 
    novaDiv.style.padding = "10px"; 
    novaDiv.style.margin = "20px"; 

    document.getElementById("resposta").appendChild(novaDiv);

    vagasOcupadas++;
    atualizarVagasDisponiveis();

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

// Função para atualizar o número de vagas disponíveis
function atualizarVagasDisponiveis() {
    var vagasDisponiveis = totalVagas - vagasOcupadas;
    document.getElementById("vagas-disponiveis").textContent = `Vagas disponíveis: ${vagasDisponiveis}`;
}
