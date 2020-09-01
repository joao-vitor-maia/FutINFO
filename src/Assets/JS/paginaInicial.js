async function redirecionarLogin(){
    location.href = "/usuario/login";
};
async function logout(){
    const resultadoObject = await fetch("/efetuando-logout", {
        method: "GET",
        headers: {
            "Content-Type":"application/json"
        }
    });

    const resultado = await resultadoObject.json();

    if(resultado.message == "error") {
        alert("Ocorreu um erro ao fazer logout");
    }else {
        localStorage.clear("token");
        location.href = "/pagina-inicial";
    }
};