async function registrar() {
    const cep = document.querySelector("#cep").value;
    
    if(/[0-9]{5}-[0-9]{3}/.test(cep) == false) {
        alert("Digite o cep no formato correto");
    } else {
        const nome = document.querySelector("#nome").value;
        const rua = document.querySelector("#rua").value;
        const numeroRua = document.querySelector("#numeroRua").value;
        const descricao = document.querySelector("#descricao").value;
        
        const dados = {
            nome:nome,
            rua:rua,
            numeroRua:numeroRua,
            descricao:descricao,
            cep:cep
        };

        const resultadoObject = await fetch("/efetuando-registrar-quadra", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "authorization": localStorage.getItem("token")
            },
            body:JSON.stringify(dados)
        });

        const resultado = await resultadoObject.json();

        if (resultado.message == "error") {
            alert("Ocorreu um erro ao registrar quadra");

        } else if (resultado.message == "invalid") {
            alert("Os dados estão inválidos");

        } else if (resultado.message == "unauthorized") {
            alert("Voçê não está autorizado a acessar essa página");
            location.href = "/usuario/login";
            
        } else {
            alert("Quadra salva com sucesso")
            location.href = "/pagina-inicial";
        };
    }
}