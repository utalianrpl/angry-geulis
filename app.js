// ======================================================
// APP.JS
// Entry point aplikasi.
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
  initializeDatabase();

  const session = getSession();

  if (session) {
    showDashboard();
  } else {
    showLogin();
  }

  document.getElementById("transactionDate").value = today();
});
