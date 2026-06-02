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
              <span class="badge bg-secondary">
                  ${produto.categoria.nome}
              </span>
            </div>

            <div>
              <button
                class="btn btn-danger btn-sm excluir"
                data-id="${produto.id}"
              >
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
          success: function () {
            carregarProdutos();
          },
          error: function () {
            alert("Erro ao excluir produto.");
          }
        });
      });
    }
  });
}

$(document).ready(carregarProdutos);