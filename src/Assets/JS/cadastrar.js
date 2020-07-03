async function cadastrar(){
    const nome = document.querySelector("#nome").value;
    const email = document.querySelector("#email").value;
    const senha = document.querySelector("#senha").value;
    const senhaReserva = document.querySelector("#senhaReserva").value;

        const dados = {
            nome:nome,
            email:email,
            senha:senha,
            senhaReserva:senhaReserva
        };

        const resultadoObject = await fetch("http://localhost:3333/efetuando-cadastrar",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(dados)
        }
        );
        
        const resultado = await resultadoObject.json();
        
        if(resultado.message == "error"){
            alert("Ocorreu um erro ao efetuar login.");
        }else if(resultado.message == "invalid"){
            alert("Os dados estão inválidos");
        }else{
            location.href = "/pagina-inicial";
        };

}