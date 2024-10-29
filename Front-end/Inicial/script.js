

const openModalButton = document.querySelector("#open-modal");
const closeModalButton = document.querySelector("#close-modal");
const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");

const toggleModal = () => {
  modal.classList.toggle("hide");
  fade.classList.toggle("hide");
};

[openModalButton, closeModalButton, fade].forEach((el) => {
  el.addEventListener("click", () => toggleModal());
});

const openModalButton2 = document.querySelector("#open-modal2");
const closeModalButton2 = document.querySelector("#close-modal2");
const modal2 = document.querySelector("#modal2");
const fade2 = document.querySelector("#fade2");

const toggleModal2 = () => {
  modal2.classList.toggle("hide2");
  fade2.classList.toggle("hide2");
};

[openModalButton2, closeModalButton2, fade2].forEach((el2) => {
  el2.addEventListener("click", () => toggleModal2());
});





const formCadastro = document.getElementById('formCadastro');


formCadastro.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    // Capturando os valores dos campos
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const placa = document.getElementById('placa').value;
    const cor = document.getElementById('cor').value;
    const modelo = document.getElementById('modelo').value;
    const marca = document.getElementById('marca').value;
    
    try {
        const response = await fetch('http://localhost:8080/Cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                telefone: telefone,
                veiculo: {
                    placa: placa,
                    cor: cor,
                    modelo: modelo,
                    marca: marca
                }
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar cliente');
        }

        const result = await response.json();
        alert(result+'Cliente cadastrado com sucesso');

       
        formCadastro.reset();
    } catch (error) {
        console.error('Erro:', error);
    }
});

const FormVaga = document.getElementById('formCadastroVaga');

FormVaga.addEventListener('submit', async function (event) {
    event.preventDefault();

    const PlacaCarro = document.getElementById('placa-vaga').value;

    try {
        const response = await fetch('http://localhost:8080/vagas', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                placa: PlacaCarro,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar vaga');
        }

        const result = await response.json();
        alert(result+'Carro estacionado com sucesso');

        // Pega o horário atual
        const horarioAtual = new Date().toLocaleTimeString();

        // Salvar dados no LocalStorage
        let registrosPlacas = JSON.parse(localStorage.getItem('registrosPlacas')) || [];
        registrosPlacas.push({ placa: PlacaCarro, horario: horarioAtual });
        localStorage.setItem('registrosPlacas', JSON.stringify(registrosPlacas));

        // Adicionar registro na página
        adicionarRegistroNaPagina(PlacaCarro, horarioAtual);

        // Limpar o campo após adicionar
        FormVaga.reset();
    } catch (error) {
        console.error('Erro:', error);
    }
});


// Carregar registros salvos ao carregar a página
window.addEventListener('load', function() {
    const registrosSalvos = JSON.parse(localStorage.getItem('registrosPlacas')) || [];
    registrosSalvos.forEach(registro => {
        adicionarRegistroNaPagina(registro.placa, registro.horario);
    });
});

// Função para adicionar o registro na página e associar o botão de remover
function adicionarRegistroNaPagina(placa, horarioEntrada) {
    const novaDiv = document.createElement("div");
    novaDiv.classList.add("resposta-item");

    const novaResposta = document.createElement("p");
    novaResposta.textContent = `Placa: ${placa}`;

    const horarioAdicionado = document.createElement("p");
    horarioAdicionado.textContent = `Horário de entrada: ${horarioEntrada}`;

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";

    botaoRemover.addEventListener("click", async function() {
        alert(`Veículo removido! Comprovante para pagamento já foi criado.`);

        try {
            const response = await fetch(`http://localhost:8080/saida?placa=${placa}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    placa:placa
                })
            });
            const result = await response.json();
            console.log('foi saida'+result)

            const Comprovante = await fetch(`http://localhost:8080/tempo?placa=${placa}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    placa: placa
                })
            });
            const resultComprovante = await Comprovante.json();
            console.alert('foi comprovante' + resultComprovante);

            const MostrarComprovante = await fetch(`http://localhost:8080/vercomprovante?placa=${placa}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    placa: placa
                })
            });

            
            console.log('Mostrando comprovante');

            const ResultMostrarComprovante = await MostrarComprovante.json();
            window.location.href = "payment.html";

            let RegistroComprovante = JSON.parse(localStorage.getItem('RegistroComprovante')) || [];
            const comprovante = {
                    IdVeiculo: ResultMostrarComprovante[0].idveiculo,
                    Modelo: ResultMostrarComprovante[0].modelo,
                    placa: ResultMostrarComprovante[0].placa,
                    HorarioEntrada: ResultMostrarComprovante[0].horario_entrada,
                    HorarioSaida: ResultMostrarComprovante[0].horario_saida,
                    Preco : ResultMostrarComprovante[0].preco
            };
            RegistroComprovante.push(comprovante)
            localStorage.setItem('RegistroComprovante', JSON.stringify(RegistroComprovante));

            adicionarResultadoComprovanteNapagina(
                    comprovante.IdVeiculo,
                    comprovante.Modelo,
                    comprovante.placa,
                    comprovante.HorarioEntrada,
                    comprovante.HorarioSaida,
                    comprovante.Preco
                );

                window.addEventListener('load', function() {
                    const ComprovanteSalvos = JSON.parse(localStorage.getItem('RegistroComprovante')) || [];
                    ComprovanteSalvos.forEach(registro => {
                        adicionarResultadoComprovanteNapagina(
                            registro.IdVeiculo,
                            registro.Modelo,
                            registro.placa,
                            registro.HorarioEntrada,
                            registro.HorarioSaida,
                            registro.Preco
                        );
                    });
                });
                function adicionarResultadoComprovanteNapagina(IdVeiculo,Modelo,placa,HorarioEntrada,HorarioSaida,Preco) {
                    const novaDiv = document.createElement("div");
                    novaDiv.classList.add("resposta-comprovante");

                    const RespostaIDVeiculo = document.createElement("p");
                    RespostaIDVeiculo.textContent = `Id Veiculo: ${IdVeiculo}`;

                    const RespostaModelo = document.createElement("p");
                    RespostaModelo.textContent = `  Modelo: ${Modelo}`;
                
                    const RespostaPlaca = document.createElement("p");
                    RespostaPlaca.textContent = `Placa: ${placa}`;
                
                    const RespostaHorarioEntrada = document.createElement("p");
                    RespostaHorarioEntrada.textContent = `Horário de entrada: ${HorarioEntrada}`;

                    const RespostaHorarioSaida = document.createElement("p");
                    RespostaHorarioSaida.textContent = `Horário de saida: ${HorarioSaida}`;

                    const RespostaPreco = document.createElement("p");
                    RespostaPreco.textContent = `Preco: ${Preco}`;
                
                    const botaoRemover = document.createElement("button");
                    botaoRemover.textContent = "Remover";
                
                    botaoRemover.addEventListener("click", async function() {
                        alert(`Mostrando Comprovante`);
                
                    });
                
                    novaDiv.appendChild(RespostaIDVeiculo);
                    novaDiv.appendChild(RespostaModelo);
                    novaDiv.appendChild(RespostaPlaca);
                    novaDiv.appendChild(RespostaHorarioEntrada);
                    novaDiv.appendChild(RespostaHorarioSaida);
                    novaDiv.appendChild(RespostaPreco);
                    novaDiv.appendChild(botaoRemover);
                
                    // Adicionar borda ao adicionar o item
                    novaDiv.style.border = "1px solid black"; 
                    novaDiv.style.padding = "10px"; 
                    novaDiv.style.margin = "20px"; 
                
                    document.getElementById("comprovante").appendChild(novaDiv);
                }
                
            
            console.log('foi mostra comprovante',ResultMostrarComprovante)

        } catch (error) {
            console.error("Erro:mostrar comprovante")
            
        }


        novaDiv.remove();

        // Remover o registro do LocalStorage
        removerRegistroDoLocalStorage(placa);


    });

    novaDiv.appendChild(novaResposta);
    novaDiv.appendChild(horarioAdicionado);
    novaDiv.appendChild(botaoRemover);

    // Adicionar borda ao adicionar o item
    novaDiv.style.border = "1px solid black"; 
    novaDiv.style.padding = "10px"; 
    novaDiv.style.margin = "20px"; 

    document.getElementById("resposta").appendChild(novaDiv);
}

// Função para remover um registro do LocalStorage
function removerRegistroDoLocalStorage(placa) {
    let registrosPlacas = JSON.parse(localStorage.getItem('registrosPlacas')) || [];
    registrosPlacas = registrosPlacas.filter(registro => registro.placa !== placa);
    localStorage.setItem('registrosPlacas', JSON.stringify(registrosPlacas));
}
