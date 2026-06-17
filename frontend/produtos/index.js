let paginaAtual = 1;
let termoBusca = "";
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
    url: `http://127.0.0.1:8000/produtos/${idParaExcluir}`,
    method: "DELETE",
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    success: function () {
      idParaExcluir = null;
      carregarProdutos();
    },
    error: function () {
      idParaExcluir = null;
      alert("Erro ao excluir produto.");
    },
  });
});

function carregarProdutos() {
  $.ajax({
    url: `http://127.0.0.1:8000/produtos?nome=${termoBusca}&page=${paginaAtual}&limit=10`,
    method: "GET",
    success: function (resposta) {
      $("#lista").empty();

      if (resposta.data.length === 0) {
        $("#lista").append(
          `<li class="list-group-item text-muted">Nenhum produto encontrado.</li>`,
        );
      }

      resposta.data.forEach(function (produto) {
        $("#lista").append(`
          <li class="list-group-item" id="item-${produto.id}">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>${produto.nome}</strong>
                <span class="badge bg-secondary ms-2">${produto.categoria.nome}</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                R$ ${produto.preco.toFixed(2)}
                <button class="btn btn-warning btn-sm editar" data-id="${produto.id}" data-nome="${produto.nome}" data-preco="${produto.preco}">Editar</button>
                <button class="btn btn-danger btn-sm excluir" data-id="${produto.id}">Excluir</button>
              </div>
            </div>

            <div class="form-editar mt-2 d-none">
              <div class="d-flex gap-2">
                <input type="text" class="form-control form-control-sm input-nome" placeholder="Nome">
                <input type="number" class="form-control form-control-sm input-preco" placeholder="Preço">
                <button class="btn btn-success btn-sm salvar" data-id="${produto.id}">Salvar</button>
                <button class="btn btn-secondary btn-sm cancelar">Cancelar</button>
              </div>
            </div>
          </li>
        `);
      });

      $(".editar")
        .off("click")
        .on("click", function () {
          const id = $(this).data("id");
          const li = $(`#item-${id}`);
          li.find(".input-nome").val($(this).data("nome"));
          li.find(".input-preco").val($(this).data("preco"));
          li.find(".form-editar").removeClass("d-none");
        });

      $(".cancelar")
        .off("click")
        .on("click", function () {
          $(this).closest(".form-editar").addClass("d-none");
        });

      $(".salvar")
        .off("click")
        .on("click", function () {
          const id = $(this).data("id");
          const li = $(`#item-${id}`);
          const nome = li.find(".input-nome").val();
          const preco = parseFloat(li.find(".input-preco").val());

          if (!nome || isNaN(preco)) {
            alert("Preencha nome e preço.");
            return;
          }

          $.ajax({
            url: `http://127.0.0.1:8000/produtos/${id}`,
            method: "PUT",
            contentType: "application/json",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            data: JSON.stringify({ nome, preco, categoria_id: 1 }),
            success: function () {
              carregarProdutos();
            },
            error: function () {
              alert("Erro ao atualizar produto.");
            },
          });
        });

      $("#paginaInfo").text(`Página ${resposta.page} de ${resposta.pages}`);
      $("#anterior").prop("disabled", resposta.page === 1);
      $("#proximo").prop("disabled", resposta.page === resposta.pages);

      $(".excluir")
        .off("click")
        .on("click", function () {
          idParaExcluir = $(this).data("id");
          const nome = $(this).data("nome");
          $("#modalExcluirTexto").text(
            `Tem certeza que deseja excluir o produto "${nome}"? Esta ação não pode ser desfeita.`,
          );
          new bootstrap.Modal(document.getElementById("modalExcluir")).show();
        });
    },
    error: function (xhr) {
      console.error("Erro ao carregar produtos:", xhr);
      alert("Erro ao carregar produtos. Verifique o console.");
    },
  });
}

$(document).ready(function () {
  const usuario = localStorage.getItem("usuario") || "Usuário";
  $("nav.menu").prepend(`
    <span class="text-white me-2 align-self-center small">${usuario}</span>
    <button class="btn btn-outline-light btn-sm" id="btnSair">Sair</button>
  `);

  $("#btnSair").on("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "../login.html";
  });

  $("#busca").on("input", function () {
    termoBusca = $(this).val();
    paginaAtual = 1;
    carregarProdutos();
  });

  $("#anterior").on("click", function () {
    paginaAtual--;
    carregarProdutos();
  });

  $("#proximo").on("click", function () {
    paginaAtual++;
    carregarProdutos();
  });

  carregarProdutos();
});
