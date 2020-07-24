async function aprovar(){
    const idHorario = event.target.id;

    const resultadoObject = await fetch("/efetuando-aprovar-horario",{
        method:"POST",
        headers:{
            "authorization":localStorage.getItem("token"),
            "Content-Type":"application/json"
        },
        body:JSON.stringify({idHorario:idHorario})
    });

    const resultado = await resultadoObject.json();
        
    if(resultado.message == "error"){
        alert("Ocorreu um erro ao aprovar horário");
    }else if(resultado.message == "unauthorized"){
        alert("Você não está autorizado a acessar essa página");
    }else{
        location.href = "/afiliado/horarios-solicitados";
    };
};
async function recusar(){
    const idHorario = event.target.id;

    const resultadoObject = await fetch("/efetuando-recusar-horario",{
        method:"POST",
        headers:{
            "authorization":localStorage.getItem("token"),
            "Content-Type":"application/json"
        },
        body:JSON.stringify({idHorario:idHorario})
    });

    const resultado = await resultadoObject.json();
        
    if(resultado.message == "error"){
        alert("Ocorreu um erro ao recusar horário");
    }else if(resultado.message == "unauthorized"){
        alert("Você não está autorizado a acessar essa página");
    }else{
        location.href = "/afiliado/horarios-solicitados";
    };
};