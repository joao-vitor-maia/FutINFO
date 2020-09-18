async function adicionarAfiliado() {
    const nome = document.querySelector("#nome").value;
    const email = document.querySelector("#email").value;
    const senha = document.querySelector("#senha").value;
    const senhaReserva = document.querySelector("#senhaReserva").value;

    if(senhaReserva == senha){
        alert("A senha não pode ser igual a senha reserva")
    }else if(senha.length < 8){
        alert("A senha deve ter no minimo 8 caracteres")
    }else {
        const dados = {
            nome: nome,
            email: email,
            senha: senha,
            senhaReserva: senhaReserva
        };
    
        const resultadoObject = await fetch("/efetuando-adicionar-afiliado", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "authorization": localStorage.getItem("token")
            },
            body:JSON.stringify(dados)
        });
    
        const resultado = await resultadoObject.json();
    
        if (resultado.message == "error") {
            alert("Ocorreu um erro ao efetuar cadastro");
        } else if (resultado.message == "invalid") {
            alert("Os dados estão inválidos");
        } else if (resultado.message == "users equal") {
            alert("O email já existe");
        } else {
            location.href = "/pagina-inicial";
        };
    }
}