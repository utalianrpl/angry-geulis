// ======================================================
// DATA.JS
// CRUD data kas, siswa, event, dan transaksi.
// ======================================================

function initializeDatabase() {
  if (!localStorage.getItem(STORAGE.USERS)) {
    saveData(STORAGE.USERS, DEFAULT_USERS);
  }

  if (!localStorage.getItem(STORAGE.KAS)) {
    saveData(STORAGE.KAS, DEFAULT_KAS);
  }

  if (!localStorage.getItem(STORAGE.SISWA)) {
    saveData(STORAGE.SISWA, DEFAULT_SISWA);
  }

  if (!localStorage.getItem(STORAGE.EVENTS)) {
    saveData(STORAGE.EVENTS, DEFAULT_EVENTS);
  }

  if (!localStorage.getItem(STORAGE.TRANSACTIONS)) {
    saveData(STORAGE.TRANSACTIONS, []);
  }
}

function getKas() {
  return getData(STORAGE.KAS, DEFAULT_KAS);
}

function getSiswa() {
  return getData(STORAGE.SISWA, DEFAULT_SISWA);
}

function getEvents() {
  return getData(STORAGE.EVENTS, DEFAULT_EVENTS);
}

function getTransactions() {
  return getData(STORAGE.TRANSACTIONS, []);
}

function getUserById(id_user) {
  return getUsers().find(user => user.id_user === Number(id_user));
}

function getKasById(id_kas) {
  return getKas().find(kas => kas.id_kas === Number(id_kas));
}

function getSiswaById(id_siswa) {
  return getSiswa().find(siswa => siswa.id_siswa === Number(id_siswa));
}

function getEventById(id_event) {
  return getEvents().find(event => event.id_event === Number(id_event));
}

function getKasForUser(user) {
  if (!user) return [];

  // Viewer dapat melihat semua kas.
  if (user.role === "viewer") {
    return getKas();
  }

  // Bendahara hanya dapat mengelola kas miliknya.
  return getKas().filter(
    kas => kas.id_bendahara === user.id_user
  );
}

function canManageKas(user, id_kas) {
  if (!user || user.role !== "bendahara") {
    return false;
  }

  const kas = getKasById(id_kas);

  return Boolean(kas && kas.id_bendahara === user.id_user);
}

function getTransactionsByKas(id_kas) {
  return getTransactions().filter(
    item => item.id_kas === Number(id_kas)
  );
}

function addTransactionData(transaction) {
  const transactions = getTransactions();

  const nextId =
    transactions.length === 0
      ? 1
      : Math.max(...transactions.map(t => t.id_transaksi)) + 1;

  transaction.id_transaksi = nextId;

  transactions.push(transaction);

  saveData(STORAGE.TRANSACTIONS, transactions);
}

function deleteTransactionData(id_transaksi) {
  const transactions = getTransactions().filter(
    item => item.id_transaksi !== Number(id_transaksi)
  );

  saveData(STORAGE.TRANSACTIONS, transactions);
}

function deleteAllTransactionsByKas(id_kas) {
  const transactions = getTransactions().filter(
    item => item.id_kas !== Number(id_kas)
  );

  saveData(STORAGE.TRANSACTIONS, transactions);
}
