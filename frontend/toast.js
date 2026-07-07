function showToast(mensagem, tipo = "info") {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = `toast align-items-center alert alert-${tipo} border-0 mb-2`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${mensagem}</div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  container.appendChild(toast);
  const bsToast = new bootstrap.Toast(toast, { delay: 4000 });
  bsToast.show();

  toast.addEventListener("hidden.bs.toast", () => toast.remove());
}
