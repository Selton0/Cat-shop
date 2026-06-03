if (!localStorage.getItem("token")) {
  window.location.href = "../login.html";
}

function carregarProdutos() {
  $.ajax({
    url: "http://127.0.0.1:8000/produtos",
    method: "GET",

    success: function (produtos) {
      $("#lista").empty();

      produtos.forEach(function (produto) {
        $("#lista").append(`
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>${produto.nome}</strong>
              <span class="badge bg-secondary">${produto.categoria.nome}</span>
            </div>
            <div>
              <button class="btn btn-danger btn-sm excluir" data-id="${produto.id}">
                Excluir
              </button>
            </div>
          </li>
        `);
      });

      $(".excluir").on("click", function () {
        const id = $(this).data("id");
        if (!confirm("Excluir este produto?")) return;

        $.ajax({
          url: `http://127.0.0.1:8000/produtos/${id}`,
          method: "DELETE",
          headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
          success: function () { carregarProdutos(); },
          error: function () { alert("Erro ao excluir produto."); }
        });
      });
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

  carregarProdutos();
});