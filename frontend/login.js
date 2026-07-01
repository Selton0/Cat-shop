$(document).ready(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get("cadastro") === "sucesso") {
    showToast("Cadastro realizado com sucesso! Faça login.", "success");
  }
});

if (localStorage.getItem("token")) {
  window.location.href = "produtos/index.html";
}

$("#btnLogin").on("click", function () {
  const email = $("#email").val();
  const senha = $("#senha").val();

  $.ajax({
    url: "http://127.0.0.1:8000/login",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ email, senha }),

    success: function (res) {
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("usuario", res.nome || email);
      window.location.href = "produtos/index.html";
    },

    error: function (xhr) {
      const msg = xhr.responseJSON?.detail || "Erro ao fazer login.";
      showToast(msg, "danger");
    },
  });
});
