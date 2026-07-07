let idParaExcluir = null;

if (!localStorage.getItem("token")) {
  window.location.href = "../login.html";
}

$("#btnConfirmarExcluir").on("click", function () {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("modalExcluir"),
  );
  modal.hide();

  $.ajax({
    url: `${API_URL}/categorias/${idParaExcluir}`,
    method: "DELETE",
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    success: function () {
      idParaExcluir = null;
      carregarCategorias();
    },
    error: function (xhr) {
      idParaExcluir = null;
      if (xhr.status === 400) showToast(xhr.responseJSON.detail, "danger");
      else showToast("Erro ao excluir categoria.", "danger");
    },
  });
});

function carregarCategorias() {
  $.ajax({
    url: `${API_URL}/categorias`,
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
        idParaExcluir = $(this).data("id");
        const nome = $(this).closest("li").find("strong").text();
        $("#modalExcluirTexto").text(
          `Tem certeza que deseja excluir a categoria "${nome}"? Esta ação não pode ser desfeita.`,
        );
        new bootstrap.Modal(document.getElementById("modalExcluir")).show();
      });
    },

    error: function () {
      showToast("Erro ao carregar categorias.", "danger");
    },
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
