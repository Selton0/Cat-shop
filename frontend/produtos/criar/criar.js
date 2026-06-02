$.ajax({
  url: "http://127.0.0.1:8000/categorias",
  method: "GET",
  success: function (categorias) {
    categorias.forEach(function (cat) {
      $("#categoria_id").append(`<option value="${cat.id}">${cat.nome}</option>`);
    });
  }
});

$("#formProduto").submit(function (event) {
  event.preventDefault();

  $.ajax({
    url: "http://127.0.0.1:8000/produtos",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      nome: $("#nome").val(),
      preco: parseFloat($("#preco").val()),
      categoria_id: parseInt($("#categoria_id").val())
    }),
    success: function () {
      alert("Produto criado!");
      window.location.href = "../index.html";
    },
    error: function (xhr) {
      if (xhr.status === 404) alert("Categoria não encontrada.");
      else if (xhr.status === 422) alert("Preencha todos os campos.");
      else alert("Erro ao criar produto.");
    }
  });
});