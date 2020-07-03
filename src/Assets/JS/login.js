async function login(){
    const email = document.querySelector("#email").value;
    const senha = document.querySelector("#senha").value;
    
    if(validator.isEmail(email)){
        const dados = {
            email:email,
            senha:senha
        };

        const resultadoObject = await fetch("http://localhost:3333/efetuando-login",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(dados)
        }
        );
        
        const resultado = await resultadoObject.json();
        
        if(resultado.message == "error"){
            alert("Ocorreu um erro ao efetuar login.");
        }else if(resultado.message == "not found"){
            alert("O email digitado está incorreto.");
        }else if(resultado.message == "incorrect password"){
            alert("A senha digitada está incorreta.");
        }else{
            localStorage.setItem("token",resultado.message);
            location.href = "/pagina-inicial";
        };

    }else{
        alert("Digite os dados corretamente");
    };
}