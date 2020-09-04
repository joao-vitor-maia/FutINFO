function mostrarSenha() {
	var x = document.getElementById('input-pass');
	  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}