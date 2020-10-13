async function editarNoticia(){
    const file = document.querySelector("#imagem").files[0];

    if(!file){
        alert("Selecione uma imagem");
    }else{
        const manchete = document.querySelector("#manchete").value;
        const conteudo = document.querySelector("#conteudo").value;
        const noticiaId = document.querySelector("#noticiaId").value;

        const formData = new FormData();
        formData.append("file",file);
        formData.append("manchete",manchete);
        formData.append("conteudo",conteudo);
        formData.append("noticiaId",noticiaId);

        alert("Aguarde...");
        const resultadoObject = await fetch("/efetuando-editar-noticias", {
            method: "POST",
            headers: {
                "authorization": localStorage.getItem("token"),
            },
            body:formData
        });

        const resultado = await resultadoObject.json();

        if (resultado.message == "error") {
            alert("Ocorreu um erro ao editar noticia");
            
        } else if (resultado.message == "unauthorized") {
            alert("Voçê não está autorizado a acessar essa página");
            location.href = "/usuario/login";

        }else if(resultado.message == "invalidType") {
            alert("Tipo de imagem inválido");

        } else if (resultado.message == "invalid") {
            alert("Os dados estão inválidos");

        }else {
            alert("Noticia salva com sucesso");
            location.href = "/pagina-inicial";
        };
    };
};