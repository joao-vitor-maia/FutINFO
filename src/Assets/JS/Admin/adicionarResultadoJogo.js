async function adicionarResultadoJogo() {    
    const modalidade = document.querySelector("#modalidade").value;
    const categoria = document.querySelector("#categoria").value;
    const divisao = document.querySelector("#divisao").value;
    const time1 = document.querySelector("#time1").value;
    const time2 = document.querySelector("#time2").value;
    const golTime1 = document.querySelector("#golTime1").value;
    const golTime2 = document.querySelector("#golTime2").value;
    const rodada = document.querySelector("#rodada").value;
    
    
    const dados = {
        modalidade:modalidade,
        categoria:categoria,
        divisao:divisao,
        time1:time1,
        time2:time2,
        golTime1:golTime1,
        golTime2:golTime2,
        rodada:rodada
    };

    const resultadoObject = await fetch("/efetuando-adicionar-resultado-jogo", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "authorization": localStorage.getItem("token")
        },
        body:JSON.stringify(dados)
    });

    const resultado = await resultadoObject.json();

    if (resultado.message == "error") {
        alert("Ocorreu um erro ao adicionar resultado de jogo");
    } else if (resultado.message == "not found") {
        alert("Time não encontrado, digite o nome correto");
    } else if (resultado.message == "invalid") {
        alert("Os dados estão inválidos");
    } else if (resultado.message == "unauthorized") {
        alert("Voçê não está autorizado a acessar essa página");
        location.href = "/usuario/login";
    } else {
        alert("Resultado de jogo salvo com sucesso")
        location.href = "/pagina-inicial";
    };
}