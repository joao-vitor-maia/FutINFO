//Envio de horário do usuário ao afiliado
async function solicitarHorario() {
    const horario = document.querySelector("#horario").value;
    //Horario dividido em inicial e final em forma de array
    const horarioDividido = horario.split(" - ");
    const modalidade = document.querySelector("#modalidade").value;
    const data = document.querySelector("#data").value;
    //Data dividida em ano mês e dia em forma de array
    const dataDividida = data.split("/");
    const quadraId = event.target.value;

    const dados = {
        quadraId:quadraId,
        ano: dataDividida[2],
        mes: dataDividida[1],
        dia: dataDividida[0],
        horarioInicial: horarioDividido[0],
        horarioFinal: horarioDividido[1],
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
        location.href = "/pagina-inicial";
    };
}