$("#formCategoria").submit(function (event) {
  event.preventDefault();

  const nome = $("#nome").val();

  $.ajax({
    url: "http://127.0.0.1:8000/categorias",
    method: "POST",
    contentType: "application/json",

    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },

    data: JSON.stringify({
      nome: nome,
    }),

    success: function () {
      alert("Categoria criada!");
      window.location.href = "../index.html";
    },

    error: function (xhr) {
      console.log(xhr);

      if (xhr.status === 422) {
        alert("Preencha o nome da categoria.");
      } else {
        alert("Erro ao criar categoria.");
      }
    },
  });
});
