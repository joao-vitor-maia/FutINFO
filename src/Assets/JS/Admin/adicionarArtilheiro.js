async function adicionarArtilheiro() {    
    const modalidade = document.querySelector("#modalidade").value;
    const categoria = document.querySelector("#categoria").value;
    const divisao = document.querySelector("#divisao").value;
    const nomeTime = document.querySelector("#nomeTime").value;
    const nomeArtilheiro = document.querySelector("#nomeArtilheiro").value;
    const gol = document.querySelector("#gol").value;
    
    const dados = {
        modalidade:modalidade,
        categoria:categoria,
        divisao:divisao,
        nomeTime:nomeTime,
        nomeArtilheiro:nomeArtilheiro,
        gol:gol
    };

    const resultadoObject = await fetch("/efetuando-adicionar-artilheiro", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "authorization": localStorage.getItem("token")
        },
        body:JSON.stringify(dados)
    });

    const resultado = await resultadoObject.json();

    if (resultado.message == "error") {
        alert("Ocorreu um erro ao adicionar artilheiro");

    } else if (resultado.message == "invalid") {
        alert("Os dados estão inválidos");

    } else if (resultado.message == "unauthorized") {
        alert("Voçê não está autorizado a acessar essa página");
        location.href = "/usuario/login";
        
    } else {
        alert("Artilheiro salvo com sucesso")
        location.href = "/pagina-inicial";
    };
}