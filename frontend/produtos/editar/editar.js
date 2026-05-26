const params = new URLSearchParams(window.location.search);
const id = params.get("id");

$.ajax({
  url: `http://127.0.0.1:8000/produtos/${id}`,
  method: "GET",
  success: function (produto) {

    $("#nome").val(produto.nome);
    $("#preco").val(produto.preco);

  },
  error: function () {
    alert("Produto não encontrado");
  }

});

$("#formEditar").submit(function (event) {
  event.preventDefault();
  const nome = $("#nome").val();
  const preco = $("#preco").val();

  $.ajax({
    url: `http://127.0.0.1:8000/produtos/${id}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
      nome: nome,
      preco: parseFloat(preco)
    }),
    success: function () {
      alert("Produto atualizado!");
      window.location.href = "../index.html";

    },
    error: function () {
      alert("Erro ao atualizar produto");

    }
  });
});

$("#btnExcluir").click(function () {
  $.ajax({
    url: `http://127.0.0.1:8000/produtos/${id}`,
    method: "DELETE",
    success: function () {
      alert("Produto deletado!");
      window.location.href = "../index.html";

    },
    error: function () {
      alert("Erro ao deletar produto");
    }
  });
});