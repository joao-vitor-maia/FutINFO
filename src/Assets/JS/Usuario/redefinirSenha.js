async function redefinirSenha() {
    const email = document.querySelector("#email").value;
    const senhaNova = document.querySelector("#senhaNova").value;
    const senhaReserva = document.querySelector("#senhaReserva").value;

    if(senhaReserva == senhaNova){
        alert("A senha não pode ser igual a senha reserva")
    }else {
        const dados = {
            email:email,
            senhaNova:senhaNova,
            senhaReserva:senhaReserva
        };
    
        const resultadoObject = await fetch("/efetuando-atualizacao-de-senha", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });
    
        const resultado = await resultadoObject.json();
    
        if (resultado.message == "error") {
            alert("Ocorreu um erro ao redefinir senha.");
        }else if(resultado.message == "not found" || resultado.message == "incorrect password"){
            alert("O email ou senha reserva digitados estão incorretos.");
        } else if(resultado.message == "invalid"){
            alert("A senha devem ter no minimo 8 caracteres")
        }else{
            location.href = "/pagina-inicial";
        };
    }
}