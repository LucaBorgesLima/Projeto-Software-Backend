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
        alert(result.message);

       
        formCadastro.reset();
    } catch (error) {
        console.error('Erro:', error);
    }
});

const FormVaga = document.getElementById('FormVaga');

FormVaga.addEventListener('submit', async function (EventVaga) {
    EventVaga.preventDefault();

    
    const NumeroVaga = document.getElementById('vaga').value;
    const PlacaCarro = document.getElementById('placa-vaga').value;

    try {

        const response = await fetch('http://localhost:8080/vagas', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                numero: NumeroVaga,
                placa: PlacaCarro,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar vaga');
        }

        const result = await response.json();
        alert(result.message); 

        FormVaga.reset();
    } catch (error) {
        console.error('Erro:', error);
    }
});
