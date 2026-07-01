$("#formCategoria").submit(function (event) {
  event.preventDefault();

  const nome = $("#nome").val();

  $.ajax({
    url: `${API_URL}/categorias`,
    method: "POST",
    contentType: "application/json",

    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },

    data: JSON.stringify({
      nome: nome,
    }),

    success: function () {
      showToast("Categoria criada!", "success");
      window.location.href = "../index.html";
    },

    error: function (xhr) {
      console.log(xhr);

      if (xhr.status === 422) {
        showToast("Preencha o nome da categoria.", "warning");
      } else {
        showToast("Erro ao criar categoria.", "danger");
      }
    },
  });
});
