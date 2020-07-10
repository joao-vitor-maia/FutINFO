async function aprovar(){
    const idHorario = event.target.value;

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
        alert("Ocorreu um erro ao efetuar cadastro");
    }else if(resultado.message == "unauthorized"){
        alert("Você não está autorizado a acessar essa página");
    }else{
        location.href = "/horarios-reservados";
    };
};
async function recusar(){
    const idHorario = event.target.value;

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
        alert("Ocorreu um erro ao efetuar cadastro");
    }else if(resultado.message == "unauthorized"){
        alert("Você não está autorizado a acessar essa página");
    }else{
        location.href = "/horarios-reservados";
    };
};