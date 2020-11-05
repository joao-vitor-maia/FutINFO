async function registrar() {
    const preco = document.querySelector("#preco").value;
    const promocao = document.querySelector("#promocao").value;
    
    const dados = {
        preco:preco,
        promocao:promocao
    };

    const resultadoObject = await fetch("/efetuando-registrar-preco", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "authorization": localStorage.getItem("token")
        },
        body:JSON.stringify(dados)
    });

    const resultado = await resultadoObject.json();

    if (resultado.message == "error") {
        alert("Ocorreu um erro ao registrar preco");

    } else if (resultado.message == "invalid") {
        alert("Os dados estão inválidos");

    } else if (resultado.message == "unauthorized") {
        alert("Voçê não está autorizado a acessar essa página");
        location.href = "/usuario/login";
        
    } else {
        alert("Preço registrado com sucesso")
        location.href = "/pagina-inicial";
    };
}