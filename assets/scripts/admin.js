$(document).ready(function () {
  // cek user login
  var userId = localStorage.getItem("id");
  var userLevel = localStorage.getItem("user_level");

  if (!userId && !userLevel) {
    window.location.href = "/auth";
  }

  navbar();
  header();
  footer();
  dashboard();
});

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

// Role Pengguna
function users() {
  $.ajax({
    url: "../admin/pages/users.html",
    method: "GET",
    success: function (data) {
      open_preload();
      $("#content").html(data);
      setTitle("Manajement User");

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
          {
            data: null,
            render: function (data, type, v) {
              if (v.gambar && v.gambar.trim() !== "") {
                return `
                  <div class="text-center">
                    <img src="${v.gambar}" alt="" style="max-width: 50px; max-height: 50px;">
                  </div>
                `;
              } else {
                return "No Image";
              }
            },
            className: "text-center",
          },
          { data: "nama_lengkap" },
          { data: "username" },
          { data: "level_user" },
          {
            data: null,
            render: function (data, type, v) {
              var deleteButton = "";

              // Assuming you have a 'level_user' property indicating the user's role
              if (v.level_user !== "admin") {
                deleteButton = `
                  <a role="button" onclick="formHapusPengguna(${v.id})" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i>
                  </a>`;
              }

              return `
                <div class="text-center">
                  <a role="button" onclick="formEditPengguna(${v.id})" class="btn btn-sm btn-info">
                    <i class="fas fa-edit"></i>
                  </a>
                  ${deleteButton}
                </div>`;
            },
            className: "text-center",
          },
        ],
      });
    },
  });
}
function tambahModal() {
  $("#id").val("");
  $("#nama_lengkap").val("");
  $("#username").val("");
  $("#telpon").val("");
  $("#email").val("");
  $("#modalPengguna").modal("show");
}
function formEditPengguna(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "users/" + id,

    success: function (response) {
      console.log(id);

      var user = response.data[0];
      $("#id").val(user.id);
      $("#nama_lengkap").val(user.nama_lengkap);
      $("#username").val(user.username);
      $("#telpon").val(user.telpon);
      $("#email").val(user.alamat_email);

      $("#modalPengguna").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function formHapusPengguna(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "users/" + id,

    success: function (response) {
      var user = response.data[0];
      $("#hapusButton").attr("data-id", user.id);
      $("#nama_hapus").text(user.nama_lengkap);

      $("#hapusPenggunaModal").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function submitPengguna() {
  var form = document.getElementById("formPengguna");
  var formData = new FormData(form);

  $.ajax({
    type: "POST",
    url: baseUrl + "users/",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response && (response.status === 200 || response.status === 201)) {
        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: "Pengguna berhasil ditambah.",
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

      $("#modalPengguna").modal("hide");
      $(".modal-backdrop").remove();

      users();
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
      $("#modalPengguna").modal("hide");
      $(".modal-backdrop").remove();
    },
  });
}
function hapusPengguna() {
  $.ajax({
    url: baseUrl + "users/" + $("#hapusButton").attr("data-id"),
    method: "DELETE",
    success: function (response) {
      users();
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
          text: error.responseJSON.message,
        });
      }
      $("#hapusPenggunaModal").modal("hide");
      $(".modal-backdrop").remove();
    },
    error: function (error) {
      $("#hapusPenggunaModal").modal("hide");
      $(".modal-backdrop").remove();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}

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
          { data: "user_id", render: renderNamaLengkap },
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
          { data: "user_id", render: renderNamaLengkap },
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
          { data: "user_id", render: renderNamaLengkap },
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

// Role Inventaris
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
          {
            data: null,
            render: function (data, type, v) {
              if (v.gambar && v.gambar.trim() !== "") {
                return `
                  <div class="text-center">
                    <img src="${v.gambar}" alt="" style="max-width: 50px; max-height: 50px;">
                  </div>
                `;
              } else {
                return "No Image";
              }
            },
            className: "text-center",
          },
          { data: "nama_barang" },
          { data: "kategori_id", render: renderNamaKategori },
          { data: "harga_sewa" },
          { data: "status" },
          { data: "durasi_sewa" },
          {
            data: null,
            render: function (data, type, v) {
              return `
                      <div class="text-center">
                      <a role="button" onclick="formEditInventaris(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
                      <a role="button" onclick="formHapusInventaris(${v.id})" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
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
function tambahModalInventaris() {
  getKateogoriSelect();
  $("#id").val("");
  $("#nama_inventaris").val("");
  $("#kategori_id").val("1");
  $("#durasi_sewa").val("perhari");
  $("#harga_sewa").val("");
  $("#stok").val("");
  $("#Status").val("tersedia");
  $("#deskripsi").val("");
  $("#keterangan_tambahan").val("");
  $("#customFile").val("");
  $("#modalInventaris").modal("show");
}
function formEditInventaris(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "inventaris/" + id,

    success: function (response) {
      getKateogoriSelect();

      var kt = response.data[0];
      $("#id").val(kt.id);
      $("#nama_inventaris").val(kt.nama_barang);
      $("#kategori_id").val(kt.kategori_id);
      $("#durasi_sewa").val(kt.durasi_sewa);
      $("#harga_sewa").val(kt.harga_sewa);
      $("#stok").val(kt.stok);
      $("#Status").val(kt.status);
      $("#deskripsi").val(kt.deskripsi);
      $("#keterangan_tambahan").val(kt.informasi_tambahan);

      // Selected Status Option
      $("#kategori_id option[value='" + kt.kategori_id + "']").prop("selected", true);

      $("#status option[value='" + kt.status + "']").prop("selected", true);

      $("#modalInventaris").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function formHapusInventaris(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "inventaris/" + id,

    success: function (response) {
      var item = response.data[0];
      $("#hapusButtonInventaris").attr("data-id", item.id);
      $("#nama_hapus").text(item.nama_barang);

      $("#modalHapusInventaris").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function submitInventaris() {
  var form = document.getElementById("formInventaris");
  var formData = new FormData(form);

  $.ajax({
    type: "POST",
    url: baseUrl + "inventaris/",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response && (response.status === 200 || response.status === 201)) {
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

      $("#modalInventaris").modal("hide");
      $(".modal-backdrop").remove();

      // Open pages success
      inventaris();
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
      $("#modalInventaris").modal("hide");
      $(".modal-backdrop").remove();
    },
  });
}
function hapusInventaris() {
  $.ajax({
    url: baseUrl + "inventaris/" + $("#hapusButtonInventaris").attr("data-id"),
    method: "DELETE",
    success: function (response) {
      if (response && response.status === 204) {
        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: "Data inventaris berhasil dihapus",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.responseJSON.message,
        });
      }
      // open pages success
      inventaris();

      $("#modalHapusInventaris").modal("hide");
      $(".modal-backdrop").remove();
    },
    error: function (error) {
      $("#modalHapusInventaris").modal("hide");
      $(".modal-backdrop").remove();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}

// Role Kategori Inventaris
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
          {
            data: null,
            render: function (data, type, v) {
              if (v.gambar_kategori && v.gambar_kategori.trim() !== "") {
                return `
                  <div class="text-center">
                    <img src="${v.gambar_kategori}" alt="" style="max-width: 50px; max-height: 50px;">
                  </div>
                `;
              } else {
                return "";
              }
            },
            className: "text-center",
          },
          { data: "nama_kategori" },
          {
            data: null,
            render: function (data, type, v) {
              return `
              <div class="text-center">
              <a role="button" onclick="formEditKategori(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" onclick="formHapusKategori(${v.id})" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
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
function tambahModalKategori() {
  $("#id").val("");
  $("#nama_kategori").val("");
  $("#modalKategori").modal("show");
}
function formEditKategori(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "kategori/" + id,

    success: function (response) {
      console.log(id);

      var kt = response.data[0];
      $("#id").val(kt.id);
      $("#nama_kategori").val(kt.nama_kategori);

      $("#modalKategori").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function formHapusKategori(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "kategori/" + id,

    success: function (response) {
      var kt = response.data[0];
      $("#hapusButtonKategori").attr("data-id", kt.id);
      $("#nama_hapus").text(kt.nama_kategori);

      $("#modalHapusKategori").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function submitKategori() {
  var form = document.getElementById("formKategori");
  var formData = new FormData(form);

  $.ajax({
    type: "POST",
    url: baseUrl + "kategori/",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response && (response.status === 200 || response.status === 201)) {
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

      $("#modalKategori").modal("hide");
      $(".modal-backdrop").remove();

      // Open pages success
      kategori_inventaris();
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
      $("#modal").modal("hide");
      $(".modal-backdrop").remove();
    },
  });
}
function hapusKategori() {
  $.ajax({
    url: baseUrl + "kategori/" + $("#hapusButtonKategori").attr("data-id"),
    method: "DELETE",
    success: function (response) {
      if (response && response.status === 204) {
        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: "Kategori berhasil ditambahkan",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.responseJSON.message,
        });
      }
      // open pages success
      kategori_inventaris();

      $("#modalHapusKategori").modal("hide");
      $(".modal-backdrop").remove();
    },
    error: function (error) {
      $("#modalHapusKategori").modal("hide");
      $(".modal-backdrop").remove();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}

// Role Destinasi Wisata
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
          {
            data: null,
            render: function (data, type, v) {
              if (v.gambar_destinasi && v.gambar_destinasi.trim() !== "") {
                return `
                  <div class="text-center">
                    <img src="${v.gambar_destinasi}" alt="" style="max-width: 50px; max-height: 50px;">
                  </div>
                `;
              } else {
                return "No Image";
              }
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
              <a role="button" onclick="formEditDestinasi(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" onclick="formHapusDestinasi(${v.id})" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
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
function tambahModalDestinasi() {
  $("#id").val("");
  $("#nama_destinasi").val("");
  $("#deskripsi").val("");
  $("#lokasi").val("");
  $("#modalDestinasi").modal("show");
}
function formEditDestinasi(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "destinasi/" + id,

    success: function (response) {
      console.log(id);

      var kt = response.data[0];
      $("#id").val(kt.id);
      $("#nama_destinasi").val(kt.nama_destinasi);
      $("#deskripsi").val(kt.deskripsi);
      $("#lokasi").val(kt.lokasi);

      $("#modalDestinasi").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function formHapusDestinasi(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "destinasi/" + id,

    success: function (response) {
      var item = response.data[0];
      $("#hapusButtonDestinasi").attr("data-id", item.id);
      $("#nama_hapus").text(item.nama_destinasi);

      $("#modalHapusDestinasi").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function submitDestinasi() {
  var form = document.getElementById("formDestinasi");
  var formData = new FormData(form);

  $.ajax({
    type: "POST",
    url: baseUrl + "destinasi",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response && (response.status === 200 || response.status === 201)) {
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

      $("#modalDestinasi").modal("hide");
      $(".modal-backdrop").remove();

      // Open pages success
      destinasi();
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
      $("#modalDestinasi").modal("hide");
      $(".modal-backdrop").remove();
    },
  });
}
function hapusDestinasi() {
  $.ajax({
    url: baseUrl + "destinasi/" + $("#hapusButtonDestinasi").attr("data-id"),
    method: "DELETE",
    success: function (response) {
      if (response && response.status === 204) {
        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: "Destinasi berhasil Dihapus",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.responseJSON.message,
        });
      }
      // open pages success
      destinasi();

      $("#modalHapusDestinasi").modal("hide");
      $(".modal-backdrop").remove();
    },
    error: function (error) {
      $("#modalHapusDestinasi").modal("hide");
      $(".modal-backdrop").remove();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
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
          { data: "kategori_id", render: renderNamaKategoriPerjalanan },

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

// Role Kategori Perjalanan
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
              <a role="button" onclick="formEditKategoriPerjalanan(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" onclick="formHapusKategoriPerjalanan(${v.id})" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
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
function tambahModalKategoriPerjalanan() {
  $("#id").val("");
  $("#nama_kategori").val("");

  $("#modalKategoriPerjalanan").modal("show");
}
function formEditKategoriPerjalanan(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "kategori_perjalanan/" + id,

    success: function (response) {
      console.log(id);

      var kt = response.data[0];
      $("#id").val(kt.id);
      $("#nama_kategori").val(kt.nama_kategori);

      $("#modalKategoriPerjalanan").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function formHapusKategoriPerjalanan(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "kategori_perjalanan/" + id,

    success: function (response) {
      var item = response.data[0];
      $("#hapusButtonKategoriPerjalanan").attr("data-id", item.id);
      $("#nama_hapus").text(item.nama_kategori);

      $("#modalHapusDestinasi").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function submitKategoriPerjalanan() {
  var form = document.getElementById("formKategoriPerjalanan");
  var formData = new FormData(form);

  $.ajax({
    type: "POST",
    url: baseUrl + "kategori_perjalanan",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response && (response.status === 200 || response.status === 201)) {
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

      $("#modalDestinasi").modal("hide");
      $(".modal-backdrop").remove();

      // Open pages success
      kategori_perjalanan();
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
      $("#modalDestinasi").modal("hide");
      $(".modal-backdrop").remove();
    },
  });
}
function hapusKategoriPerjalanan() {
  $.ajax({
    url: baseUrl + "kategori_perjalanan/" + $("#hapusButtonKategoriPerjalanan").attr("data-id"),
    method: "DELETE",
    success: function (response) {
      if (response && response.status === 204) {
        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: "Kategori Perjalanan berhasil Dihapus",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.responseJSON.message,
        });
      }
      // open pages success
      kategori_perjalanan();

      $("#modalHapusKategoriPerjalanan").modal("hide");
      $(".modal-backdrop").remove();
    },
    error: function (error) {
      $("#modalHapusKategoriPerjalanan").modal("hide");
      $(".modal-backdrop").remove();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}

// Role Pemesanan Perjalanan
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
          { data: "user_id", render: renderNamaLengkap },
          { data: "paket_id", render: renderPaketPerjalanan },
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

// Role Bank
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
          { data: "user_id", render: renderNamaLengkap },

          { data: "nomor_rekening" },
          { data: "daftar_bank_id", render: renderBank },
          {
            data: null,
            render: function (data, type, v) {
              return `
              <div class="text-center">
              <a role="button" onclick="formEditBankPengguna(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" onclick="formHapusBankPengguna(${v.id})" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
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
function tambahBank() {
  $("#id").val("");
  $("#user_id").val("");
  $("#daftar_bank_id").val("");
  $("#nomor_rekening").val("");
  getDaftarBankSelect();
  getUsersSelect();
  $("#modalBankPengguna").modal("show");
}
function formEditBankPengguna(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "bank/" + id,

    success: function (response) {
      var kt = response.data[0];
      $("#id").val(kt.id);
      $("#user_id").val(kt.user_id);
      $("#daftar_bank_id").val(kt.daftar_bank_id);
      $("#nomor_rekening").val(kt.nomor_rekening);

      getDaftarBankSelect();
      getUsersSelect();
      $("#modalBankPengguna").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function formHapusBankPengguna(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "bank/" + id,

    success: function (response) {
      var item = response.data[0];
      $("#buttonHapusBank").attr("data-id", item.id);
      $("#nama_hapus").text(item.nama_bank);

      $("#modalHapusBank").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function submitBank() {
  var form = document.getElementById("formBankPengguna");
  var formData = new FormData(form);

  $.ajax({
    type: "POST",
    url: baseUrl + "bank/",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response && (response.status === 200 || response.status === 201)) {
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

      $("#modalBankPengguna").modal("hide");
      $(".modal-backdrop").remove();

      // Open pages success
      bank();
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
      $("#modalBankPengguna").modal("hide");
      $(".modal-backdrop").remove();
    },
  });
}
function hapusBank() {
  $.ajax({
    url: baseUrl + "bank/" + $("#buttonHapusBank").attr("data-id"),
    method: "DELETE",
    success: function (response) {
      if (response && response.status === 204) {
        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: "Data Bank berhasil dihapus",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menghapus data bank!",
        });
      }
      // open pages success
      daftar_bank();

      $("#modalHapusBank").modal("hide");
      $(".modal-backdrop").remove();
    },
    error: function (error) {
      $("#modalHapusBank").modal("hide");
      $(".modal-backdrop").remove();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}

// Role Daftar Bank
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
          {
            data: null,
            render: function (data, type, v) {
              if (v.logo_bank && v.logo_bank.trim() !== "") {
                return `
                  <div class="text-center">
                    <img src="${v.logo_bank}" alt="" style="max-width: 50px; max-height: 50px;">
                  </div>
                `;
              } else {
                return "Tidak ada gambar";
              }
            },
            className: "text-center",
          },
          { data: "nama_bank" },
          {
            data: null,
            render: function (data, type, v) {
              return `
              <div class="text-center">
              <a role="button" onclick="formEditBank(${v.id})" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
              <a role="button" onclick="formHapusBank(${v.id})" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
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
function tambahDaftarBank() {
  $("#id").val("");
  $("#nama_bank").val("");
  $("#modalDaftarBank").modal("show");
}
function formEditBank(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "daftar_bank/" + id,

    success: function (response) {
      var kt = response.data[0];
      $("#id").val(kt.id);
      $("#nama_bank").val(kt.nama_bank);

      $("#modalDaftarBank").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function formHapusBank(id) {
  $.ajax({
    type: "GET",
    url: baseUrl + "daftar_bank/" + id,

    success: function (response) {
      var item = response.data[0];
      $("#buttonHapusDaftarBank").attr("data-id", item.id);
      $("#nama_hapus").text(item.nama_bank);

      $("#modalHapusDaftarbank").modal("show");
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function submitDaftarBank() {
  var form = document.getElementById("formDaftarBank");
  var formData = new FormData(form);

  $.ajax({
    type: "POST",
    url: baseUrl + "daftar_bank/",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response && (response.status === 200 || response.status === 201)) {
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

      $("#modalDaftarBank").modal("hide");
      $(".modal-backdrop").remove();

      // Open pages success
      daftar_bank();
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
      $("#modalDaftarBank").modal("hide");
      $(".modal-backdrop").remove();
    },
  });
}
function hapusDaftarBank() {
  $.ajax({
    url: baseUrl + "daftar_bank/" + $("#buttonHapusDaftarBank").attr("data-id"),
    method: "DELETE",
    success: function (response) {
      if (response && response.status === 204) {
        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: "Daftar Bank berhasil dihapus",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menghapus data bank!",
        });
      }
      // open pages success
      daftar_bank();

      $("#modalHapusDaftarbank").modal("hide");
      $(".modal-backdrop").remove();
    },
    error: function (error) {
      $("#modalHapusDaftarbank").modal("hide");
      $(".modal-backdrop").remove();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}

// Role Duitku Payment
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
  $.ajax({
    type: "GET",
    url: baseUrl + "duitku/1",

    success: function (response) {
      var kt = response.data[0];
      $("#environment").val(kt.environment);
      $("#merchant_code").val(kt.merchant_code);
      $("#apikey_duitku").val(kt.apikey_duitku);

      $("#environment option[value='" + kt.environment + "']").prop("selected", true);
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function submitDuitku() {
  var form = document.getElementById("formDuitku");
  var formData = new FormData(form);

  $.ajax({
    type: "POST",
    url: baseUrl + "duitku/",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response && (response.status === 200 || response.status === 201)) {
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
      duitku_payment();
    },
  });
}

// Role Whatsapp Gateway
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
  $.ajax({
    type: "GET",
    url: baseUrl + "wablas/1",

    success: function (response) {
      var kt = response.data[0];
      $("#domain_api").val(kt.domain_api);
      $("#token_api").val(kt.token_api);
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.message,
      });
    },
  });
}
function submitWablas() {
  var form = document.getElementById("formWablas");
  var formData = new FormData(form);

  $.ajax({
    type: "POST",
    url: baseUrl + "wablas/",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response && (response.status === 200 || response.status === 201)) {
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
      whatsapp_gateway();
    },
  });
}

// function ubah title
function setTitle(title) {
  document.title = title;
  $("#title").text(title);
  $("#title-header").text(title);
}

// Fungction preload UI
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

// get name from id pengguna
function renderNamaLengkap(data, type, v) {
  $.ajax({
    url: baseUrl + "users/" + v.user_id,
    type: "GET",
    async: false,
    success: function (response) {
      data = response.data[0].nama_lengkap;
    },
  });

  return data;
}

// get name kategori from id
function renderNamaKategori(data, type, v) {
  $.ajax({
    url: baseUrl + "kategori/" + v.kategori_id,
    type: "GET",
    async: false,
    success: function (response) {
      data = response.data[0].nama_kategori;
    },
  });

  return data;
}

// get name kategori perjalanan from id
function renderNamaKategoriPerjalanan(data, type, v) {
  $.ajax({
    url: baseUrl + "kategori_perjalanan/" + v.kategori_id,
    type: "GET",
    async: false,
    success: function (response) {
      data = response.data[0].nama_kategori;
    },
  });

  return data;
}

// get name paket perjalanan from id
function renderPaketPerjalanan(data, type, v) {
  $.ajax({
    url: baseUrl + "paket_perjalanan/" + v.paket_id,
    type: "GET",
    async: false,
    success: function (response) {
      data = response.data[0].nama_paket;
    },
  });

  return data;
}

//get name bank from id
function renderBank(data, type, v) {
  $.ajax({
    url: baseUrl + "daftar_bank/" + v.daftar_bank_id,
    type: "GET",
    async: false,
    success: function (response) {
      data = response.data[0].nama_bank;
    },
  });

  return data;
}

// Selection Kategori_id for option form
function getKateogoriSelect() {
  $.ajax({
    type: "GET",
    url: baseUrl + "kategori",
    success: function (response) {
      if (response.data) {
        $("#kategori_id").empty();

        $.each(response.data, function (index, kategori) {
          $("#kategori_id").append('<option value="' + kategori.id + '">' + kategori.nama_kategori + "</option>");
        });
      } else {
        console.log("Respon tidak sesuai format yang diharapkan");
      }
    },
    error: function (error) {
      console.error("Terjadi kesalahan:", error);
    },
  });
}
function getUsersSelect() {
  $.ajax({
    type: "GET",
    url: baseUrl + "users",
    success: function (response) {
      if (response.data) {
        $("#user_id").empty();

        $.each(response.data, function (index, user) {
          $("#user_id").append('<option value="' + user.id + '">' + user.nama_lengkap + "</option>");
        });
      } else {
        console.log("Respon tidak sesuai format yang diharapkan");
      }
    },
    error: function (error) {
      console.error("Terjadi kesalahan:", error);
    },
  });
}
function getDaftarBankSelect() {
  $.ajax({
    type: "GET",
    url: baseUrl + "daftar_bank",
    success: function (response) {
      if (response.data) {
        $("#daftar_bank_id").empty();

        $.each(response.data, function (index, daftar_bank) {
          $("#daftar_bank_id").append('<option value="' + daftar_bank.id + '">' + daftar_bank.nama_bank + "</option>");
        });
      } else {
        console.log("Respon tidak sesuai format yang diharapkan");
      }
    },
    error: function (error) {
      console.error("Terjadi kesalahan:", error);
    },
  });
}
