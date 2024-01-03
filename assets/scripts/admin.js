$(document).ready(function () {
  // Panggil fungsi-fungsi lain setelah halaman dimuat
  navbar();
  header();
  footer();
  users();
});

// Variabel baseUrl
var baseUrl = "http://localhost:8080/api/";

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
      //open_preload();
      $("#content").html(data);
      fetch_userData();
      setTitle("Manajement User");
    },
  });
}

function fetch_userData() {
  $.ajax({
    method: "GET",
    url: baseUrl + "users/",
    dataType: "JSON",
    success: function (response) {
      $("#loadModalDelete").html("");
      if (response.status === 200) {
        let modal_delete = "";
        $.each(response.data, function (i, v) {
          modal_delete += `
          <!-- Modal Hapus Pengguna -->
          <div class="modal fade" id="hapusPenggunaModal_${v.id}">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h6 class="modal-title">Hapus Pengguna</h6>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Apakah anda yakin ingin menghapus pengguna <b>${v.nama_lengkap}</b> ini ?</p>
                </div>
                <div class="modal-footer float-right">
                  <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
                  <button type="button" onclick="hapusPengguna(${v.id})" class="btn btn-danger">Hapus</button>
                </div>
              </div>
            </div>
          </div>`;
        });
        $("#loadModalDelete").append(modal_delete);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data:", error);
    },
  });
  $("#tablerifkkimaulana").DataTable({
    ajax: {
      url: baseUrl + "users",
      type: "GET",
      dataSrc: "data",
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, no) {
          return no.row + 1;
        },
        className: "text-center",
      },
      { data: "nama_lengkap" },
      { data: "username" },
      { data: "level_user" },
      {
        data: null,
        render: function (data, type, v) {
          return `
          <div class="text-center">
          <a role="button" onclick="formEditPengguna(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
          <a role="button" data-toggle="modal" data-target="#hapusPenggunaModal_${v.id}" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
          </div>
        `;
        },
        className: "text-center",
      },
    ],
  });
}

// Pengiriman insert/delete pengguna
function submitPengguna() {
  var form = document.getElementById("formPengguna");
  var formData = new FormData(form);

  // cek userid dalam form
  var isTambah = !formData.get("userId");

  // URL endpoint REST API untuk tambah atau ubah
  var apiUrl = isTambah ? baseUrl + "users/" : baseUrl + "users/" + formData.get("userId");

  $.ajax({
    type: isTambah ? "POST" : "PUT",
    url: apiUrl,
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      console.log(response);

      $("#modalPengguna").modal("hide");
      // Load page

      if (response && (response.status === 200 || response.status === 201)) {
        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: response.data ? response.data.messages : "Operasi berhasil",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data ? response.data.messages : "Terjadi kesalahan",
        });
      }

      users();
    },
    error: function (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: response.data.messages,
      });
    },
  });
}

// Fungsi untuk menampilkan data pengguna yang akan diubah
function formEditPengguna(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "users/" + id,

    success: function (response) {
      console.log(id);

      // convert object data
      var user = response.data[0];
      $("#userId").val(user.id);
      $("#nama_lengkap").val(user.nama_lengkap);
      $("#username").val(user.username);
      $("#telpon").val(user.telpon);
      $("#email").val(user.alamat_email);

      $("#modalPengguna").modal("show");
    },
    error: function (error) {
      console.error("Terjadi kesalahan:", error.messages);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}

// Fungsi untuk menangani tombol "Simpan" di modal
function tambahPengguna() {
  // Ambil nilai userId dari formulir
  var userId = $("#userId").val();

  // Jika userId kosong, ini operasi tambah. Jika tidak, ini operasi ubah.
  if (!userId) {
    submitPengguna(); // Operasi tambah
  } else {
    submitPengguna(); // Operasi ubah
  }
}

function hapusPengguna(id) {
  $.ajax({
    url: baseUrl + "users/" + id,
    method: "DELETE",
    success: function (response) {
      console.log("Perubahan berhasil dihapus:", response);

      users();
      $("#hapusPenggunaModal_" + id).modal("hide");

      if (response && response.status === 204) {
        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: "Pengguna berhasil dihapus",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat menghapus pengguna",
        });
      }
    },
    error: function (error) {
      console.error("Terjadi kesalahan:", error.responseJSON.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat menghapus pengguna",
      });
    },
  });
}
/*
function tambahPengguna() {
  $.ajax({
    url: baseUrl + "users",
    method: "POST",
    contentType: false,
    processData: false,
    data: new FormData($("#tambahPengguna")[0]),
    success: function (response) {
      console.log("Perubahan berhasil disimpan:", response);

      users();
      $("#modalPengguna").modal("hide");

      if (response && response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: response.data.messages,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.messages,
        });
      }
    },
    error: function (error) {
      console.error("Terjadi kesalahan:", error.responseText);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: response.data.messages,
      });
    },
  });
}
*/

function riwayat() {
  $.ajax({
    url: "../admin/pages/riwayat.html",
    method: "GET",
    success: function (data) {
      //open_preload();
      $("#content").html(data);
      setTitle("Riwayat Pengguna");
      // datatabel ajax
      $("#tablerifkkimaulana").DataTable({
        ajax: {
          url: baseUrl + "riwayat",
          type: "GET",
          dataSrc: "data",
        },
        columns: [
          {
            data: null,
            render: function (data, type, row, no) {
              return no.row + 1;
            },
            className: "text-center",
          },
          { data: "user_id" },
          { data: "aktivitas" },
          { data: "created_at", className: "text-center" },
        ],
      });
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

      $("#tablerifkkimaulana").DataTable({
        ajax: {
          url: baseUrl + "transaksi",
          type: "GET",
          dataSrc: "data",
        },
        columns: [
          {
            data: null,
            render: function (data, type, row, no) {
              return no.row + 1;
            },
            className: "text-center",
          },
          { data: "no_transaksi" },
          { data: "user_id" },
          { data: "tanggal_penyewaan" },
          { data: "tanggal_pengembalian" },
          { data: "total_harga" },
          { data: "status_transaksi" },
          { data: "created_at" },
          {
            data: null,
            render: function (data, type, v) {
              return `
              <div class="text-center">
              <a role="button" onclick="tambahTransaksi(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" data-toggle="modal" data-target="#hapusTransaksi${v.id}" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
              </div>
            `;
            },
            className: "text-center",
          },
        ],
      });
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
      /*
 <th class="text-center">No</th>
                <th>Reference</th>
                <th>No Transaksi</th>
                <th>Customer</th>
                <th>Channel</th>
                <th>Pembayaran</th>
                <th>Status</th>
                <th>Aksi</th>*/
      // data table ajax

      $("#tablerifkkimaulana").DataTable({
        ajax: {
          url: baseUrl + "pembayaran",
          type: "GET",
          dataSrc: "data",
        },
        columns: [
          {
            data: null,
            render: function (data, type, row, no) {
              return no.row + 1;
            },
            className: "text-center",
          },
          { data: "reference" },
          { data: "no_transaksi" },
          { data: "user_id" },
          { data: "channel" },
          { data: "pembayaran" },
          { data: "status" },
          {
            data: null,
            render: function (data, type, v) {
              return `
              <div class="text-center">
              <a role="button" onclick="tambahDestinasi(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" data-toggle="modal" data-target="#hapusDestinasi${v.id}" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
              </div>
            `;
            },
            className: "text-center",
          },
        ],
      });
    },
  });
}

function inventaris() {
  $.ajax({
    url: "../admin/pages/inventaris/daftar_inventaris.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Investari");

      /*
       <tr>
                <th class="text-center">#</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Harga Sewa</th>
                <th>Status</th>
                <th>Satuan Sewa</th>
                <th>Aksi</th>
              </tr>
              */

      $("#tablerifkkimaulana").DataTable({
        ajax: {
          url: baseUrl + "inventaris",
          type: "GET",
          dataSrc: "data",
        },
        columns: [
          {
            data: null,
            render: function (data, type, row, no) {
              return no.row + 1;
            },
            className: "text-center",
          },
          { data: "nama_barang" },
          { data: "kategori_id" },
          { data: "harga_sewa" },
          { data: "status" },
          { data: "durasi_sewa" },
          {
            data: null,
            render: function (data, type, v) {
              return `
                      <div class="text-center">
                      <a role="button" onclick="tambahDestinasi(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
                      <a role="button" data-toggle="modal" data-target="#hapusDestinasi${v.id}" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
                      </div>
                    `;
            },
            className: "text-center",
          },
        ],
      });
    },
  });
}

function kategori_inventaris() {
  $.ajax({
    url: "../admin/pages/inventaris/kategori_inventaris.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Kategori Inventaris");

      /*
       <tr>
                <th class="text-center">#</th>
                <th>Nama Kategori</th>
                <th>Dibuat</th>
              </tr>*/
      // datatable ajax
      $("#tablerifkkimaulana").DataTable({
        ajax: {
          url: baseUrl + "kategori",
          type: "GET",
          dataSrc: "data",
        },
        columns: [
          {
            data: null,
            render: function (data, type, row, no) {
              return no.row + 1;
            },
            className: "text-center",
          },
          { data: "nama_kategori" },
          {
            data: null,
            render: function (data, type, v) {
              return `
              <div class="text-center">
              <a role="button" onclick="ubahKategori(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" data-toggle="modal" data-target="#hapusKategori${v.id}" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
              </div>
            `;
            },
            className: "text-center",
          },
        ],
      });
    },
  });
}

function destinasi() {
  $.ajax({
    url: "../admin/pages/perjalanan/destinasi.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Dashboard");

      /*
    <th>Nama Destinasi</th>
    <th>Lokasi</th>
    <th>Dibuat</th>
    */

      $("#tablerifkkimaulana").DataTable({
        ajax: {
          url: baseUrl + "destinasi",
          type: "GET",
          dataSrc: "data",
        },
        columns: [
          {
            data: null,
            render: function (data, type, row, no) {
              return no.row + 1;
            },
            className: "text-center",
          },
          { data: "nama_destinasi" },
          { data: "lokasi" },
          { data: "created_at" },
          {
            data: null,
            render: function (data, type, v) {
              return `
              <div class="text-center">
              <a role="button" onclick="tambahDestinasi(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" data-toggle="modal" data-target="#hapusDestinasi${v.id}" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
              </div>
            `;
            },
            className: "text-center",
          },
        ],
      });
    },
  });
}

function paket_perjalanan() {
  $.ajax({
    url: "../admin/pages/perjalanan/paket.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Paket Perjalanan");

      /*
      <th class="text-center">No</th>
      <th>Nama Paket</th>
      <th>Kuota</th>
      <th>Harga</th>
      <th>Kategori</th>
      <th>Aksi</th>

      id	kategori_id	nama_paket	deskripsi	harga_paket	kuota_peserta	gambar_paket	created_at

      */
      $("#tablerifkkimaulana").DataTable({
        ajax: {
          url: baseUrl + "paket_perjalanan",
          type: "GET",
          dataSrc: "data",
        },
        columns: [
          {
            data: null,
            render: function (data, type, row, no) {
              return no.row + 1;
            },
            className: "text-center",
          },
          { data: "nama_paket" },
          { data: "kuota_peserta" },
          { data: "harga_paket" },
          { data: "kategori_id" },

          {
            data: null,
            render: function (data, type, v) {
              return `
              <div class="text-center">
              <a role="button" onclick="tambahDestinasi(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" data-toggle="modal" data-target="#hapusDestinasi${v.id}" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
              </div>
            `;
            },
            className: "text-center",
          },
        ],
      });
    },
  });
}

function kategori_perjalanan() {
  $.ajax({
    url: "../admin/pages/perjalanan/kategori.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Kategori Perjalanan");
      /*
            <th class="text-center">No</th>
            <th>Nama Kategori</th>
            <th>Aksi</th>
          */
      $("#tablerifkkimaulana").DataTable({
        ajax: {
          url: baseUrl + "kategori_perjalanan",
          type: "GET",
          dataSrc: "data",
        },
        columns: [
          {
            data: null,
            render: function (data, type, row, no) {
              return no.row + 1;
            },
            className: "text-center",
          },
          { data: "nama_kategori" },

          {
            data: null,
            render: function (data, type, v) {
              return `
              <div class="text-center">
              <a role="button" onclick="tambahDestinasi(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" data-toggle="modal" data-target="#hapusDestinasi${v.id}" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
              </div>
            `;
            },
            className: "text-center",
          },
        ],
      });
    },
  });
}

function pemesanan_perjalanan() {
  $.ajax({
    url: "../admin/pages/perjalanan/pemesanan.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Pemesanan Perjalanan");

      /*

        <th class="text-center">#</th>
        <th>Pemesan</th>
        <th>Paket</th>
        <th>Jumlah Peserta</th>
        <th>Total Pembayaran</th>
        <th>Status Pembayaran</th>
        <th>Dibuat</th>
        <th>Aksi</th>

      id	no_transaksi	user_id	paket_id	jumlah_peserta	total_pembayaran	tanggal_pemesanan	status_pembayaran

      */

      $("#tablerifkkimaulana").DataTable({
        ajax: {
          url: baseUrl + "pemesanan_perjalanan",
          type: "GET",
          dataSrc: "data",
        },
        columns: [
          {
            data: null,
            render: function (data, type, row, no) {
              return no.row + 1;
            },
            className: "text-center",
          },
          { data: "user_id" },
          { data: "paket_id" },
          { data: "jumlah_peserta" },
          { data: "total_pembayaran" },
          { data: "status_pembayaran" },
          { data: "tanggal_pemesanan" },

          {
            data: null,
            render: function (data, type, v) {
              return `
              <div class="text-center">
              <a role="button" onclick="tambahPesanan(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" data-toggle="modal" data-target="#hapusPesanan${v.id}" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
              </div>
            `;
            },
            className: "text-center",
          },
        ],
      });
    },
  });
}

function bank() {
  $.ajax({
    url: "../admin/pages/pengaturan/bank.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Bank Pengguna");

      // datatables
      $("#tablerifkkimaulana").DataTable({
        ajax: {
          url: baseUrl + "bank",
          type: "GET",
          dataSrc: "data",
        },
        columns: [
          {
            data: null,
            render: function (data, type, row, no) {
              return no.row + 1;
            },
            className: "text-center",
          },
          { data: "user_id" },
          { data: "daftar_bank_id" },
          { data: "nama_lengkap" },
          { data: "nomor_rekening" },
          {
            data: null,
            render: function (data, type, v) {
              return `
              <div class="text-center">
              <a role="button" onclick="editBank(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" data-toggle="modal" data-target="#ubahBank${v.id}" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
              </div>
            `;
            },
            className: "text-center",
          },
        ],
      });
    },
  });
}

function daftar_bank() {
  $.ajax({
    url: "../admin/pages/pengaturan/daftar_bank.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Manajemen Bank");

      // datatables
      $("#tablerifkkimaulana").DataTable({
        ajax: {
          url: baseUrl + "daftar_bank",
          type: "GET",
          dataSrc: "data",
        },
        columns: [
          {
            data: null,
            render: function (data, type, row, no) {
              return no.row + 1;
            },
            className: "text-center",
          },
          { data: "logo_bank" },
          { data: "nama_bank" },
          {
            data: null,
            render: function (data, type, v) {
              return `
              <div class="text-center">
              <a role="button" onclick="editBank(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" data-toggle="modal" data-target="#ubahBank${v.id}" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
              </div>
            `;
            },
            className: "text-center",
          },
        ],
      });
    },
  });
}

function duitku_payment() {
  $.ajax({
    url: "../admin/pages/pengaturan/duitku.html",
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
    url: "../admin/pages/pengaturan/wablas.html",
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
