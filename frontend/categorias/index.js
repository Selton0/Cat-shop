if (!localStorage.getItem("token")) {
  window.location.href = "../login.html";
}

function carregarCategorias() {
  $.ajax({
    url: "http://127.0.0.1:8000/categorias",
    method: "GET",

    success: function (categorias) {
      $("#lista").empty();

      if (categorias.length === 0) {
        $("#lista").append(`
          <li class="list-group-item text-muted">Nenhuma categoria cadastrada.</li>
        `);
        return;
      }

      categorias.forEach(function (cat) {
        $("#lista").append(`
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <strong>${cat.nome}</strong>
            <button class="btn btn-danger btn-sm excluir" data-id="${cat.id}">
              Excluir
            </button>
          </li>
        `);
      });

      $(".excluir").on("click", function () {
        const id = $(this).data("id");
        if (!confirm("Excluir esta categoria?")) return;

        $.ajax({
          url: `http://127.0.0.1:8000/categorias/${id}`,
          method: "DELETE",
          headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
          success: function () { carregarCategorias(); },
          error: function (xhr) {
            if (xhr.status === 400) alert(xhr.responseJSON.detail);
            else alert("Erro ao excluir categoria.");
          }
        });
      });
    },

    error: function () {
      alert("Erro ao carregar categorias.");
    }
  });
}

$(document).ready(function () {
  const usuario = localStorage.getItem("usuario") || "Usuário";
  $("nav.menu, nav.d-flex").prepend(`
    <span class="text-white me-2 align-self-center small">${usuario}</span>
    <button class="btn btn-outline-light btn-sm" id="btnSair">Sair</button>
  `);

  $("#btnSair").on("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "../login.html";
  });

  carregarCategorias();
});