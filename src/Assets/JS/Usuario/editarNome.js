async function editarNome() {
    const nome1 = document.querySelector("#nome1").value;
    const nome2 = document.querySelector("#nome2").value;

    const dados = {
        nome1:nome1,
        nome2:nome2
    };

    const resultadoObject = await fetch("/efetuando-editar-nome", {
        method: "POST",
        headers: {
            "authorization": localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados)
    });

    const resultado = await resultadoObject.json();

    if (resultado.message == "error") {
        alert("Ocorreu um erro ao editar nome");

    }else if(resultado.message == "unauthorized"){
        alert("Voçê não está autorizado a acessar essa página");
        location.href = "/usuario/login";

    } else if(resultado.message == "invalid"){
        alert("Os dados estão inválidos");

    }else{
        alert("Nome editado com sucesso");
        localStorage.removeItem("token");
        location.href = "/pagina-inicial";
    };
}