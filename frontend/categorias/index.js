$.ajax({
  url: "http://127.0.0.1:8000/categorias",
  method: "GET",
  success: function (categorias) {
    $("#lista").empty();
    categorias.forEach(function (categoria) {

      $("#lista").append(`
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <strong>${categoria.nome}</strong>
          <span class="badge bg-primary">
            ID: ${categoria.id}
          </span>
        </li>

      `);
    });
  },
  error: function () {
    alert("Erro ao carregar categorias");

  }
});