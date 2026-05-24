$("#formProduto").submit(function (event) {
  event.preventDefault();
  const nome = $("#nome").val();
  const preco = $("#preco").val();

  $.ajax({
    url: "http://localhost:8000/produtos",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      nome: nome,
      preco: parseFloat(preco)
    }),
    
    success: function () {
      alert("Produto criado!");
    },
    error: function (erro) {
      console.log(erro);
      alert("Erro ao criar produto");
    }
  });

});