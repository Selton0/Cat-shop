$.ajax({
  url: "http://127.0.0.1:8000/produtos",
  method: "GET",
  success: function (produtos) {

    $("#lista").empty();
    produtos.forEach(function (produto) {

      $("#lista").append(`
        <li class="list-group-item d-flex justify-content-between align-items-center">

          ${produto.nome}

          <span class="badge bg-success">
            R$ ${produto.preco}
          </span>
        </li>
      `);
    });
  }
});