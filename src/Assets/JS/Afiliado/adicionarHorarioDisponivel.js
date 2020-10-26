async function adicionarHorarioDisponivel() {
    const data = document.querySelector("#data").value;
    const ano = new Date(data).getFullYear();
    const mes = new Date(data).getMonth()+1;
    const dia = new Date(data).getDate();
    const horarioInicial = document.querySelector("#horarioInicial").value;
    const horarioFinal = document.querySelector("#horarioFinal").value;
    
    const dados = {
        ano:ano,
        mes:mes,
        dia:dia,
        horarioInicial:horarioInicial,
        horarioFinal:horarioFinal
    };
    
    const resultadoObject = await fetch("/efetuando-adicionar-horario-disponivel", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "authorization": localStorage.getItem("token")
        },
        body:JSON.stringify(dados)
    });

    const resultado = await resultadoObject.json();

    if (resultado.message == "error") {
        alert("Ocorreu um erro ao adicionar horário disponivel");
    } else if (resultado.message == "invalid") {
        alert("Os dados estão inválidos");
    } else if (resultado.message == "unauthorized") {
        alert("Voçê não está autorizado a acessar essa página");
        location.href = "/usuario/login";
    } else {
        alert("Horário disponível adicionado com sucesso")
        location.href = "/afiliado/adicionar-horarios-disponiveis";
    };
}