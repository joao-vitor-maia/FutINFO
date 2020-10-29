async function solicitarHorario() {
    const horario = document.querySelector("#horario").value;
    const modalidade = document.querySelector("#modalidade").value;
    const quadraId = event.target.value;

    const dados = {
        quadraId:quadraId,
        // ano:,
        // mes: ,
        // dia: ,
        horarioInicial: horario.start,
        horarioFinal: horario.end,
        modalidade:modalidade
    };

    const resultadoObject = await fetch("/efetuando-solicitar-horario", {
        method: "POST",
        headers: {
            "authorization": localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados)
    });

    const resultado = await resultadoObject.json();

    if (resultado.message == "error") {
        alert("Ocorreu um erro ao solicitar horário");

    }else if(resultado.message == "unauthorized"){
        alert("Voçê não está autorizado a acessar essa página");
        location.href = "/usuario/login";

    } else if(resultado.message == "invalid"){
        alert("Os dados estão inválidos");

    }else{
        alert("Horário solicitado com sucesso");
    };
}