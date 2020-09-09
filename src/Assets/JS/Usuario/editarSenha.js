async function editarSenha() {
    const senhaAtual = document.querySelector("#senhaAtual").value;
    const senha1 = document.querySelector("#senha1").value;
    const senha2 = document.querySelector("#senha2").value;

    const dados = {
        senhaAtual:senhaAtual,
        senha1:senha1,
        senha2:senha2
    };

    const resultadoObject = await fetch("/efetuando-editar-senha", {
        method: "POST",
        headers: {
            "authorization": localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados)
    });

    const resultado = await resultadoObject.json();

    if (resultado.message == "error") {
        alert("Ocorreu um erro ao editar senha");

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