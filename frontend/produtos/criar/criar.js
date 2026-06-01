$.ajax({
  url: "http://127.0.0.1:8000/categorias",
  method: "GET",

  success: function (categorias) {

    categorias.forEach(function (categoria) {

      $("#categoria").append(`
        <option value="${categoria.id}">
          ${categoria.nome}
        </option>
      `);

    });

  }
});

$("#formProduto").submit(function (event) {
  event.preventDefault();
  const nome = $("#nome").val();
  const preco = $("#preco").val();
  const categoria = $("#categoria").val();

  $.ajax({
    url: "http://127.0.0.1:8000/produtos",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      nome: nome,
      preco: parseFloat(preco),
      categoria_id: parseInt(categoria)
    }),
    
    success: function () {
      alert("Produto criado!");
    },
    error: function (erro) {
      console.log(erro);
      alert("Erro! Verifique se preencheu todos os dados corretamente");
    }
  });

});