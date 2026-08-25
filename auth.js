// ======================================================
// AUTH.JS
// Login, register viewer, reset password, logout.
// ======================================================

function getData(key, fallback = []) {
  const raw = localStorage.getItem(key);

  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getUsers() {
  return getData(STORAGE.USERS, DEFAULT_USERS);
}

function getSession() {
  return getData(STORAGE.SESSION, null);
}

function setSession(user) {
  saveData(STORAGE.SESSION, {
    id_user: user.id_user,
    username: user.username,
    role: user.role
  });
}

function clearSession() {
  localStorage.removeItem(STORAGE.SESSION);
}

function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  const message = document.getElementById("loginMessage");

  const users = getUsers();

  const user = users.find(
    item =>
      item.username.toLowerCase() === username.toLowerCase() &&
      item.password === password
  );

  if (!user) {
    message.textContent = "Username atau password salah.";
    message.style.color = "#fda4af";
    return;
  }

  setSession(user);

  message.textContent = "Login berhasil.";
  message.style.color = "#86efac";

  setTimeout(showDashboard, 250);
}

function registerViewer() {
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;
  const message = document.getElementById("signupMessage");

  if (!username || !password || !confirm) {
    message.textContent = "Semua kolom harus diisi.";
    message.style.color = "#fda4af";
    return;
  }

  if (password !== confirm) {
    message.textContent = "Konfirmasi password tidak cocok.";
    message.style.color = "#fda4af";
    return;
  }

  const users = getUsers();

  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    message.textContent = "Username sudah digunakan.";
    message.style.color = "#fda4af";
    return;
  }

  const nextId =
    users.length === 0
      ? 1
      : Math.max(...users.map(u => u.id_user)) + 1;

  // PENTING:
  // Semua akun yang dibuat dari halaman daftar otomatis VIEWER.
  users.push({
    id_user: nextId,
    username,
    password,
    role: "viewer"
  });

  saveData(STORAGE.USERS, users);

  message.textContent = "Akun Viewer berhasil dibuat.";
  message.style.color = "#86efac";

  setTimeout(closeSignup, 700);
}

function resetPassword() {
  const username = document.getElementById("forgotUsername").value.trim();
  const password = document.getElementById("forgotPassword").value;
  const confirm = document.getElementById("forgotConfirm").value;
  const message = document.getElementById("forgotMessage");

  if (!username || !password || !confirm) {
    message.textContent = "Semua kolom harus diisi.";
    message.style.color = "#fda4af";
    return;
  }

  if (password !== confirm) {
    message.textContent = "Konfirmasi password tidak cocok.";
    message.style.color = "#fda4af";
    return;
  }

  const users = getUsers();
  const index = users.findIndex(
    u => u.username.toLowerCase() === username.toLowerCase()
  );

  if (index === -1) {
    message.textContent = "Username tidak ditemukan.";
    message.style.color = "#fda4af";
    return;
  }

  users[index].password = password;
  saveData(STORAGE.USERS, users);

  message.textContent = "Password berhasil diubah.";
  message.style.color = "#86efac";

  setTimeout(closeForgot, 700);
}

function logout() {
  clearSession();
  showLogin();
}
