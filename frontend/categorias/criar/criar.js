$("#formCategoria").submit(function (event) {
  event.preventDefault();
  const nome = $("#nome").val();

  $.ajax({
    url: "http://127.0.0.1:8000/categorias",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      nome: nome
    }),
    success: function () {
      alert("Categoria criada!");
      window.location.href = "../index.html";

    },
    error: function () {
      alert("Erro! Verifique se preencheu todos os dados corretamente");

    }
  });
});