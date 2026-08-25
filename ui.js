// ======================================================
// UI.JS
// Tampilan dashboard dan interaksi form.
// ======================================================

let selectedKasId = null;

function showLogin() {
  document.getElementById("loginPage").style.display = "flex";
  document.getElementById("dashboardPage").style.display = "none";
}

function showDashboard() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("dashboardPage").style.display = "flex";

  renderDashboard();
}

function openSignup() {
  document.getElementById("signupModal").style.display = "flex";
}

function closeSignup() {
  document.getElementById("signupModal").style.display = "none";

  document.getElementById("signupUsername").value = "";
  document.getElementById("signupPassword").value = "";
  document.getElementById("signupConfirm").value = "";
  document.getElementById("signupMessage").textContent = "";
}

function openForgot() {
  document.getElementById("forgotModal").style.display = "flex";
}

function closeForgot() {
  document.getElementById("forgotModal").style.display = "none";

  document.getElementById("forgotUsername").value = "";
  document.getElementById("forgotPassword").value = "";
  document.getElementById("forgotConfirm").value = "";
  document.getElementById("forgotMessage").textContent = "";
}

function renderDashboard() {
  const user = getSession();

  if (!user) {
    showLogin();
    return;
  }

  document.getElementById("currentUser").textContent =
    `Login sebagai: ${user.username} • ${roleLabel(user.role)}`;

  const kasList = getKasForUser(user);
  const select = document.getElementById("kasSelect");

  select.innerHTML = "";

  kasList.forEach(kas => {
    const option = document.createElement("option");

    option.value = kas.id_kas;
    option.textContent = kas.nama_kas;

    select.appendChild(option);
  });

  if (kasList.length === 0) {
    selectedKasId = null;
    renderEmptyKas(user);
    return;
  }

  if (!selectedKasId || !kasList.some(k => k.id_kas === selectedKasId)) {
    selectedKasId = kasList[0].id_kas;
  }

  select.value = selectedKasId;

  renderRoleUI(user);
  renderKas();
}

function roleLabel(role) {
  return role === "bendahara" ? "Bendahara" : "Viewer";
}

function selectKas(id) {
  selectedKasId = Number(id);
  renderKas();
}

function renderRoleUI(user) {
  const isBendahara = user.role === "bendahara";

  document.getElementById("transactionForm").style.display =
    isBendahara ? "block" : "none";

  document.getElementById("deleteAllBtn").style.display =
    isBendahara ? "inline-block" : "none";

  document.getElementById("actionHeader").style.display =
    isBendahara ? "table-cell" : "none";

  document.getElementById("viewerNotice").style.display =
    isBendahara ? "none" : "block";
}

function renderEmptyKas(user) {
  document.getElementById("kasOwnerInfo").textContent =
    user.role === "bendahara"
      ? "Akun ini belum memiliki kas."
      : "Belum ada kas.";

  document.getElementById("saldoDisplay").textContent = "Rp 0";
  document.getElementById("sudahBayarDisplay").textContent = "0";
  document.getElementById("belumBayarDisplay").textContent = "0";
  document.getElementById("jumlahSiswaDisplay").textContent = "0";
  document.getElementById("transactionTable").innerHTML =
    `<tr><td colspan="6" class="empty">Belum ada kas yang dapat dilihat.</td></tr>`;
}

function renderKas() {
  const user = getSession();
  const kas = getKasById(selectedKasId);

  if (!kas) return;

  const owner = getUserById(kas.id_bendahara);

  document.getElementById("dashboardTitle").textContent =
    kas.nama_kas;

  document.getElementById("kasOwnerInfo").textContent =
    `Bendahara: ${owner ? owner.username : "Tidak diketahui"}`;

  document.getElementById("historySubtitle").textContent =
    `Menampilkan catatan ${kas.nama_kas}.`;

  renderSummary();
  renderTransactions();

  if (user.role === "bendahara") {
    changeTransactionForm();
  }
}

function renderSummary() {
  const siswa = getSiswa().filter(
    item => item.id_kas === selectedKasId
  );

  const transactions = getTransactionsByKas(selectedKasId);

  let saldo = 0;
  let sudah = 0;
  let belum = 0;

  transactions.forEach(item => {
    if (item.tipe === "masuk") {
      if (item.status === "sudah") {
        saldo += item.nominal;
      }
    } else {
      saldo -= item.nominal;
    }
  });

  // Rekap status berdasarkan transaksi siswa terbaru.
  siswa.forEach(s => {
    const pembayaran = transactions
      .filter(t => t.id_siswa === s.id_siswa && t.tipe === "masuk")
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    const terbaru = pembayaran[0];

    if (terbaru && terbaru.status === "sudah") {
      sudah++;
    } else {
      belum++;
    }
  });

  document.getElementById("saldoDisplay").textContent =
    formatRupiah(saldo);

  document.getElementById("sudahBayarDisplay").textContent = sudah;
  document.getElementById("belumBayarDisplay").textContent = belum;
  document.getElementById("jumlahSiswaDisplay").textContent = siswa.length;
}

function formatRupiah(number) {
  return "Rp " + Number(number).toLocaleString("id-ID");
}

function formatDate(date) {
  if (!date) return "-";

  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

function today() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);

  return local.toISOString().slice(0, 10);
}

function changeTransactionForm() {
  const type = document.getElementById("transactionType").value;

  const detailLabel = document.getElementById("detailLabel");
  const detailSelect = document.getElementById("transactionDetail");
  const statusField = document.getElementById("statusField");

  detailSelect.innerHTML = "";

  if (type === "masuk") {
    detailLabel.textContent = "Nama Siswa";
    statusField.style.display = "block";

    const siswa = getSiswa().filter(
      item => item.id_kas === selectedKasId
    );

    siswa.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id_siswa;
      option.textContent = item.nama_siswa;
      detailSelect.appendChild(option);
    });

  } else {
    detailLabel.textContent = "Event / Keperluan";
    statusField.style.display = "none";

    getEvents().forEach(item => {
      const option = document.createElement("option");
      option.value = item.id_event;
      option.textContent = item.nama_event;
      detailSelect.appendChild(option);
    });
  }
}

function addTransaction() {
  const user = getSession();

  // Pengamanan role, bukan cuma menyembunyikan tombol.
  if (!user || user.role !== "bendahara") {
    alert("Akses ditolak. Hanya Bendahara yang dapat mengubah kas.");
    return;
  }

  if (!canManageKas(user, selectedKasId)) {
    alert("Kamu hanya dapat mengelola kas milikmu sendiri.");
    return;
  }

  const type = document.getElementById("transactionType").value;
  const date = document.getElementById("transactionDate").value;
  const amount = Number(document.getElementById("transactionAmount").value);
  const detail = Number(document.getElementById("transactionDetail").value);

  if (!date || !amount || amount <= 0 || !detail) {
    alert("Lengkapi tanggal, detail, dan nominal.");
    return;
  }

  const transaction = {
    id_kas: selectedKasId,
    id_siswa: type === "masuk" ? detail : null,
    id_event: type === "keluar" ? detail : null,
    tipe: type,
    status:
      type === "masuk"
        ? document.getElementById("paymentStatus").value
        : null,
    tanggal: date,
    nominal: amount
  };

  addTransactionData(transaction);

  document.getElementById("transactionAmount").value = "";
  document.getElementById("transactionDate").value = today();

  renderKas();
}

function renderTransactions() {
  const user = getSession();
  const isBendahara = user && user.role === "bendahara";

  const tbody = document.getElementById("transactionTable");
  const transactions = getTransactionsByKas(selectedKasId);

  tbody.innerHTML = "";

  if (transactions.length === 0) {
    tbody.innerHTML =
      `<tr><td colspan="6" class="empty">Belum ada transaksi.</td></tr>`;
    return;
  }

  [...transactions]
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .forEach(item => {

      const row = document.createElement("tr");

      let detail = "-";
      let status = "—";
      let typeText = item.tipe === "masuk" ? "Masuk" : "Keluar";
      let typeClass = item.tipe === "masuk" ? "masuk" : "keluar";
      let statusClass = "";

      if (item.tipe === "masuk") {
        const siswa = getSiswaById(item.id_siswa);
        detail = siswa ? siswa.nama_siswa : "Siswa dihapus";

        status =
          item.status === "sudah"
            ? "Sudah Bayar"
            : "Belum Bayar";

        statusClass =
          item.status === "sudah"
            ? "sudah"
            : "belum";
      } else {
        const event = getEventById(item.id_event);
        detail = event ? event.nama_event : "Event dihapus";
      }

      row.innerHTML = `
        <td>${formatDate(item.tanggal)}</td>
        <td><strong>${escapeHtml(detail)}</strong></td>
        <td class="${typeClass}">${typeText}</td>
        <td class="${statusClass}">${status}</td>
        <td>${formatRupiah(item.nominal)}</td>
        <td class="action-cell">
          ${
            isBendahara
              ? `<span class="delete-one" onclick="deleteTransaction(${item.id_transaksi})">Hapus</span>`
              : "—"
          }
        </td>
      `;

      tbody.appendChild(row);
    });
}

function deleteTransaction(id) {
  const user = getSession();

  if (!user || user.role !== "bendahara") {
    alert("Akses ditolak.");
    return;
  }

  const transaction = getTransactions().find(
    item => item.id_transaksi === Number(id)
  );

  if (!transaction || transaction.id_kas !== selectedKasId) {
    alert("Transaksi tidak ditemukan atau bukan milik kas ini.");
    return;
  }

  if (!canManageKas(user, selectedKasId)) {
    alert("Kamu tidak memiliki akses ke kas ini.");
    return;
  }

  if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

  deleteTransactionData(id);
  renderKas();
}

function deleteAllTransactions() {
  const user = getSession();

  if (!user || user.role !== "bendahara") {
    alert("Akses ditolak.");
    return;
  }

  if (!canManageKas(user, selectedKasId)) {
    alert("Kamu tidak memiliki akses ke kas ini.");
    return;
  }

  const count = getTransactionsByKas(selectedKasId).length;

  if (count === 0) {
    alert("Kas ini belum memiliki transaksi.");
    return;
  }

  if (!confirm(`Hapus semua ${count} transaksi dari kas ini?`)) {
    return;
  }

  deleteAllTransactionsByKas(selectedKasId);
  renderKas();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
