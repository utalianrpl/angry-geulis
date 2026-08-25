// ======================================================
// CONFIG.JS
// Data awal dan konfigurasi aplikasi.
// ======================================================

const STORAGE = {
  USERS: "kas_users_v2",
  KAS: "kas_kas_v2",
  SISWA: "kas_siswa_v2",
  EVENTS: "kas_events_v2",
  TRANSACTIONS: "kas_transactions_v2",
  SESSION: "kas_session_v2"
};

// ======================================================
// USER
// Role:
// - bendahara = bisa mengelola kas miliknya
// - viewer     = hanya bisa melihat semua kas
// ======================================================

const DEFAULT_USERS = [
  {
    id_user: 1,
    username: "admin",
    password: "12345",
    role: "bendahara"
  },
  {
    id_user: 2,
    username: "viewer",
    password: "12345",
    role: "viewer"
  }
];

// ======================================================
// KAS
// id_bendahara menghubungkan kas dengan USER bendahara.
// ======================================================

const DEFAULT_KAS = [
  {
    id_kas: 1,
    nama_kas: "Kas 10 RPL 1",
    id_bendahara: 1
  },
  {
    id_kas: 2,
    nama_kas: "Kas 10 RPL 2",
    id_bendahara: 3
  },
  {
    id_kas: 3,
    nama_kas: "Kas 10 RPL 3",
    id_bendahara: 4
  }
];

// ======================================================
// SISWA
// Setiap siswa punya id_kas masing-masing.
// ======================================================

const DEFAULT_SISWA = [
  { id_siswa: 1, nama_siswa: "Andi", id_kas: 1 },
  { id_siswa: 2, nama_siswa: "Budi", id_kas: 1 },
  { id_siswa: 3, nama_siswa: "Citra", id_kas: 1 },
  { id_siswa: 4, nama_siswa: "Dinda", id_kas: 1 },

  { id_siswa: 5, nama_siswa: "Eka", id_kas: 2 },
  { id_siswa: 6, nama_siswa: "Fajar", id_kas: 2 },
  { id_siswa: 7, nama_siswa: "Gita", id_kas: 2 },

  { id_siswa: 8, nama_siswa: "Hana", id_kas: 3 },
  { id_siswa: 9, nama_siswa: "Intan", id_kas: 3 },
  { id_siswa: 10, nama_siswa: "Joko", id_kas: 3 }
];

// ======================================================
// EVENT
// Dipakai untuk transaksi Uang Keluar.
// ======================================================

const DEFAULT_EVENTS = [
  { id_event: 1, nama_event: "Beli konsumsi" },
  { id_event: 2, nama_event: "Acara kelas" },
  { id_event: 3, nama_event: "Dekorasi kelas" },
  { id_event: 4, nama_event: "Fotokopi / Print" },
  { id_event: 5, nama_event: "Study Tour" },
  { id_event: 6, nama_event: "Kegiatan sekolah" },
  { id_event: 7, nama_event: "Hadiah / Apresiasi" },
  { id_event: 8, nama_event: "Kebersihan kelas" },
  { id_event: 9, nama_event: "Perlengkapan belajar" },
  { id_event: 10, nama_event: "Lainnya" }
];
