$(document).ready(function () {
  // Panggil fungsi-fungsi lain setelah halaman dimuat
  navbar();
  header();
  footer();
  dashboard();
});

function customstyle() {
  var table = $("#tablerifkkimaulana").DataTable({
    paging: true,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: false,
    language: {
      lengthMenu: "_MENU_",
      zeroRecords: "No data found",
      info: "Showing _START_ to _END_ of _TOTAL_ entries",
      infoEmpty: "Showing 0 to 0 of 0 entries",
      infoFiltered: "(filtered from _MAX_ total entries)",
      search: "Cari:",
      paginate: {
        first: "Start",
        last: "End",
        next: "Next",
        previous: "Previous",
      },
    },
    lengthMenu: [5, 10, 50, 100, 500],
    pageLength: 5,
  });

  $("#selectLength").on("change", function () {
    table.page.len($(this).val()).draw();
  });

  // Identifikasi plugin select2
  $(".select2").select2({
    theme: "bootstrap4",
  });

  $(function () {
    bsCustomFileInput.init();
  });
}

// Layout
function navbar() {
  $.ajax({
    url: "../admin/layout/navbar.html",
    method: "GET",
    success: function (data) {
      $("#navbar").html(data);
    },
  });
}

function header() {
  $.ajax({
    url: "../admin/layout/header.html",
    method: "GET",
    success: function (data) {
      $("#header").html(data);
    },
  });
}
function footer() {
  $.ajax({
    url: "../admin/layout/footer.html",
    method: "GET",
    success: function (data) {
      $("#footer").html(data);
    },
  });
}

// Pages
function dashboard() {
  $.ajax({
    url: "../admin/pages/dashboard.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Dashboard");
    },
  });
}
function users() {
  $.ajax({
    url: "../admin/pages/users.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Manajement User");
    },
  });
}
function transaksi() {
  $.ajax({
    url: "../admin/pages/transaksi.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Transaksi");
    },
  });
}
function pembayaran() {
  $.ajax({
    url: "../admin/pages/pembayaran.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Pembayaran");
    },
  });
}
function inventaris() {
  $.ajax({
    url: "../admin/pages/inventaris.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Investari");
    },
  });
}
function kategori_inventaris() {
  $.ajax({
    url: "../admin/pages/kategori_inventaris.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Kategori Inventaris");
    },
  });
}
function destinasi() {
  $.ajax({
    url: "../admin/pages/destinasi.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Dashboard");
    },
  });
}
function paket_perjalanan() {
  $.ajax({
    url: "../admin/pages/paket_perjalanan.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Paket Perjalanan");
    },
  });
}
function kategori_perjalanan() {
  $.ajax({
    url: "../admin/pages/kategori_perjalanan.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Kategori Perjalanan");
    },
  });
}
function pemesanan_perjalanan() {
  $.ajax({
    url: "../admin/pages/pemesanan_perjalanan.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Pemesanan Perjalanan");
    },
  });
}
function apikey() {
  $.ajax({
    url: "../admin/pages/apikey.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Apikey Setting");
    },
  });
}
function bank() {
  $.ajax({
    url: "../admin/pages/bank.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Bank Pengguna");
    },
  });
}
function daftar_bank() {
  $.ajax({
    url: "../admin/pages/daftar_bank.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Manajemen Bank");
    },
  });
}
function duitku_payment() {
  $.ajax({
    url: "../admin/pages/duitku_payment.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Setting Duitku");
    },
  });
}
function whatsapp_gateway() {
  $.ajax({
    url: "../admin/pages/whatsapp_gateway.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Setting Whatsapp Gateway Apikey");
    },
  });
}

function setTitle(title) {
  document.title = title;
  $("#title").text(title);
  $("#title-header").text(title);
}

function open_preload() {
  $.ajax({
    type: "GET",
    url: "index.html",

    success: function () {
      $("#load-preload").html(` 
        <div class="preloader flex-column justify-content-center align-items-center">
        <div class="spinner-border text-primary" role="status" transition="all 2s ease-in-out>
          <span class="sr-only"></span>
        </div>
      </div>
        `);
      setTimeout(function () {
        $("#load-preload").html("");
      }, 2000);
    },
  });
}
