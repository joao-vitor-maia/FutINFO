async function adicionarTime() {    
    const modalidade = document.querySelector("#modalidade").value;
    const categoria = document.querySelector("#categoria").value;
    const divisao = document.querySelector("#divisao").value;
    const classificacao = document.querySelector("#classificacao").value;
    const nome = document.querySelector("#nome").value;
    const ponto = document.querySelector("#ponto").value;
    const jogo = document.querySelector("#jogo").value;
    const vitoria = document.querySelector("#vitoria").value;
    const derrota = document.querySelector("#derrota").value;
    const empate = document.querySelector("#empate").value;

    const dados = {
        modalidade:modalidade,
        categoria:categoria,
        divisao:divisao,
        classificacao:classificacao,
        nome:nome,
        ponto:ponto,
        jogo:jogo,
        vitoria:vitoria,
        derrota:derrota,
        empate:empate
    };

    const resultadoObject = await fetch("/efetuando-adicionar-time", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "authorization": localStorage.getItem("token")
        },
        body:JSON.stringify(dados)
    });

    const resultado = await resultadoObject.json();

    if (resultado.message == "error") {
        alert("Ocorreu um erro ao adicionar time");
    } else if (resultado.message == "invalid") {
        alert("Os dados estão inválidos");
    } else if (resultado.message == "unauthorized") {
        alert("Voçê não está autorizado a acessar essa página");
        location.href = "/usuario/login";
    } else {
        alert("Time salvo com sucesso")
        location.href = "/pagina-inicial";
    };
}