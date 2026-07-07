if (!localStorage.getItem("token")) {
  window.location.href = "../../login.html";
}

$(document).ready(function () {
  // Exibe usuário e botão Sair
  const usuario = localStorage.getItem("usuario") || "Usuário";
  $("nav.menu, nav.d-flex").prepend(`
    <span class="text-white me-2 align-self-center small">${usuario}</span>
    <button class="btn btn-outline-light btn-sm" id="btnSair">Sair</button>
  `);

  $("#btnSair").on("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "../../login.html";
  });

  $.ajax({
    url: `${API_URL}/categorias`,
    method: "GET",
    success: function (categorias) {
      categorias.forEach(function (cat) {
        $("#categoria_id").append(
          `<option value="${cat.id}">${cat.nome}</option>`,
        );
      });
    },
  });

  $("#formProduto").submit(function (event) {
    event.preventDefault();

    $.ajax({
      url: `${API_URL}/produtos`,
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify({
        nome: $("#nome").val(),
        preco: parseFloat($("#preco").val()),
        categoria_id: parseInt($("#categoria_id").val()),
      }),
      success: function () {
        showToast("Produto criado!", "success");
        window.location.href = "../index.html";
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          showToast("Sessão expirada. Faça login novamente.", "warning");
          window.location.href = "../../login.html";
        } else if (xhr.status === 404) {
          showToast("Categoria não encontrada.", "danger");
        } else if (xhr.status === 422) {
          showToast("Preencha todos os campos.", "warning");
        } else {
          showToast("Erro ao criar produto.", "danger");
        }
      },
    });
  });
});
