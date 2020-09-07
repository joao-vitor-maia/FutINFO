async function editarEmail() {
    const email1 = document.querySelector("#email1").value;
    const email2 = document.querySelector("#email2").value;

    const dados = {
        email1:email1,
        email2:email2
    };

    const resultadoObject = await fetch("/efetuando-editar-email", {
        method: "POST",
        headers: {
            "authorization": localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados)
    });

    const resultado = await resultadoObject.json();

    if (resultado.message == "error") {
        alert("Ocorreu um erro ao editar email");

    }else if(resultado.message == "unauthorized"){
        alert("Voçê não está autorizado a acessar essa página");
        location.href = "/usuario/login";

    } else if(resultado.message == "invalid"){
        alert("Os dados estão inválidos");

    }else{
        localStorage.clear("token");
        location.href = "/pagina-inicial";
    };
}