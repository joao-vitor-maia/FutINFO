async function adicionarModalidade() {
    const modalidade1 = document.querySelector("#modalidade1").value;
    const modalidade2 = document.querySelector("#modalidade2").value;
    const modalidade3 = document.querySelector("#modalidade3").value;
    const modalidade4 = document.querySelector("#modalidade4").value;
    
    const dados = {
        modalidade1:modalidade1,
        modalidade2:modalidade2,
        modalidade3:modalidade3,
        modalidade4:modalidade4
    };

    const resultadoObject = await fetch("/efetuando-adicionar-modalidade", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "authorization": localStorage.getItem("token")
        },
        body:JSON.stringify(dados)
    });

    const resultado = await resultadoObject.json();

    if (resultado.message == "error") {
        alert("Ocorreu um erro ao adicionar modalidade");
    } else if (resultado.message == "invalid") {
        alert("Os dados estão inválidos");
    } else if (resultado.message == "unauthorized") {
        alert("Voçê não está autorizado a acessar essa página");
        location.href = "/usuario/login";
    } else {
        alert("Modalidade salva com sucesso")
        location.href = "/pagina-inicial";
    };
}