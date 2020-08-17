async function adicionarImagens(){
    const files = document.querySelector("#imagens").files;
    
    if(files.length < 1){
        alert("Selecione uma imagem");
    }else{

        const formData = new FormData();
        for(const file of files){
            formData.append("file",file);
        };

        const resultadoObject = await fetch("/efetuando-adicionar-imagens-da-quadra", {
            method: "POST",
            headers: {
                "authorization": localStorage.getItem("token"),
            },
            body:formData
        });

        const resultado = await resultadoObject.json();

        if (resultado.message == "error") {
            alert("Ocorreu um erro ao registrar quadra");

        } else if (resultado.message == "imagens limit") {
            alert("Você só pode ter no máximo 7 imagens");
            
        } else if (resultado.message == "unauthorized") {
            alert("Voçê não está autorizado a acessar essa página");
            location.href = "/usuario/login";

        } else if (resultado.message == "quadra empty") {
            alert("Você precisa registrar uma quadra primeiro");

        } else if (resultado.message == "invalid") {
            alert("Tipo de imagem inválido");
        }else {
            location.href = "/pagina-inicial";
        };
    };
};