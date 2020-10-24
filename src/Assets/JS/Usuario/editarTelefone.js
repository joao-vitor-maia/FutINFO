async function editarTelefone() {
    const telefone1 = document.querySelector("#telefone1").value;
    const telefone2 = document.querySelector("#telefone2").value;

    const dados = {
        telefone1:telefone1,
        telefone2:telefone2
    };

    const resultadoObject = await fetch("/efetuando-editar-telefone", {
        method: "POST",
        headers: {
            "authorization": localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados)
    });

    const resultado = await resultadoObject.json();

    if (resultado.message == "error") {
        alert("Ocorreu um erro ao editar telefone");

    }else if(resultado.message == "unauthorized"){
        alert("Voçê não está autorizado a acessar essa página");
        location.href = "/usuario/login";

    } else if(resultado.message == "invalid"){
        alert("Os dados estão inválidos");

    }else{
        alert("Telefone editado com sucesso");
        localStorage.removeItem("token");
        location.href = "/pagina-inicial";
    };
}