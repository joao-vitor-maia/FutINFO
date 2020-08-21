async function deletarImagem(){
    const idImagem = event.target.value;

    const dados = {
        idImagem:idImagem
    };

    const resultadoObject = await fetch("/efetuando-deletar-imagens-da-quadra", {
        method: "POST",
        headers: {
            "authorization": localStorage.getItem("token"),
            "Content-Type": "application/json"
        },
        body:JSON.stringify(dados)
    });

    const resultado = await resultadoObject.json();

    if (resultado.message == "error") {
        alert("Ocorreu um erro ao deletar imagem");
        
    } else if (resultado.message == "unauthorized") {
        alert("Voçê não está autorizado a acessar essa página");
        location.href = "/usuario/login";

    }else {
        location.href = "/pagina-inicial";
    };
};