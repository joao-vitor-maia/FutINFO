//Se existir senha no localStorage adiciono ela no input senha(Senha é adicionado no localStorage
//se for marcado checkbox "lembrar senha")
document.querySelector("#senha").value = atob(localStorage.getItem("senha"));

async function login(){
    const email = document.querySelector("#email").value;
    const senha = document.querySelector("#senha").value;
    const lembrarMe = document.querySelector("#lembrarMe").checked;
        
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

    }else if(resultado.message == "not found" || resultado.message == "incorrect password"){
        alert("O email ou senha digitados estão incorretos.");

    }else{
        //Adicionando token ao localStorage(será usado na autenticação do fetch ao consultar APIs)
        localStorage.setItem("token",resultado.message);

        //Se login for realizado corretamente e checkbox de "lembrar senha" estiver marcado,
        //adiciono senha em base64 no localStorage
        if(lembrarMe == true){
            localStorage.setItem("senha",btoa(senha))
        }else{
            localStorage.removeItem("senha")
        }
        location.href = "/pagina-inicial";
    };

}