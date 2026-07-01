if (localStorage.getItem("token")) {
  window.location.href = "produtos/index.html";
}

$("#btnCadastrar").on("click", function () {
  const nome = $("#nome").val().trim();
  const email = $("#email").val().trim();
  const senha = $("#senha").val();
  const confirmarSenha = $("#confirmarSenha").val();

  if (!nome || !email || !senha || !confirmarSenha) {
    showToast("Preencha todos os campos.", "warning");
    return;
  }

  if (nome.length < 2) {
    showToast("Nome muito curto.", "warning");
    return;
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValido) {
    showToast("Digite um email válido.", "warning");
    return;
  }

  if (senha.length < 4) {
    showToast("A senha deve ter pelo menos 4 caracteres.", "warning");
    return;
  }

  if (senha !== confirmarSenha) {
    showToast("As senhas não coincidem.", "warning");
    return;
  }

  $.ajax({
    url: "http://127.0.0.1:8000/usuarios",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ nome, email, senha }),

    success: function () {
      window.location.href = "login.html?cadastro=sucesso";
    },

    error: function (xhr) {
      if (xhr.status === 409) {
        showToast("Este email já está cadastrado.", "danger");
      } else if (xhr.status === 422) {
        showToast("Preencha os campos corretamente.", "warning");
      } else {
        showToast("Erro ao cadastrar. Tente novamente.", "danger");
      }
    },
  });
});
