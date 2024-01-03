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
      $("#loadModalUbah").html("");
      if (response.status === 200) {
        let modal_delete = "";
        let modal_ubah = "";
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
          modal_ubah += `
                <!-- Form Pengguna -->
                <div class="modal fade" id="modalPengguna_${v.id}">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h6 class="modal-title">Tambah Pengguna Baru</h6>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                      <form id="ubahPengguna_${v.id}"  enctype="multipart/form-data">
                        <div class="form-group">
                          <label for="nama_lengkap">Nama Lengkap <small class="text-danger"> *Tidak boleh kosong</small> </label>
                          <input type="text" class="form-control" id="nama_lengkap" value="${v.nama_lengkap}" name="nama_lengkap" required />
                        </div>
                        <div class="form-group">
                          <label for="Username">Username <small class="text-danger"> *Tidak boleh kosong</small></label>
                          <input type="text" class="form-control" id="username" value="${v.username}" name="username" required />
                        </div>
                        <div class="row">
                          <div class="col-sm-6">
                            <div class="form-group">
                              <label for="password">Password </label>
                              <input type="password" id="password" class="form-control" placeholder="******" name="password"  />
                            </div>
                          </div>
                          <div class="col-sm-6">
                            <div class="form-group">
                              <label for="re_password">Ulangi Password </label>
                              <input type="password" class="form-control" id="re_password" placeholder="******" name="re_password" />
                            </div>
                          </div>
                          <div class="col-sm-12">
                          <small> Catatan. Abaikan kolom password jika tidak akan merubah password</small>
                          </div>
                        </div>
                        <div class="form-group mt-3">
                          <label for="telpon">Nomor Telpon <small class="text-success"> *Optional</small></label>
                          <input type="number" class="form-control" id="telpon" value="${v.telpon}" name="telpon" />
                        </div>
                        <div class="form-group">
                          <label for="email">Email <small class="text-success"> *Optional</small></label>
                          <input type="email" class="form-control" id="email" value="${v.alamat_email}" name="email" />
                        </div>
                        <div class="form-group">
                          <label for="customFile">Upload Foto Pribadi <small class="text-success"> *Optional</small></label>
                          <div class="custom-file">
                            <input type="file" class="custom-file-input" id="customFile"  name="gambar"/>
                            <label class="custom-file-label" for="customFile">Upload foto kamu disini...</label>
                          </div>
                        </div>
                        </form>
                      </div>
                      <div class="modal-footer float-right">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="ubahPengguna(${v.id})">Ubah Pengguna</button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
        });
        $("#loadModalDelete").append(modal_delete);
        $("#loadModalUbah").append(modal_ubah);
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
          <a role="button" data-toggle="modal" data-target="#modalPengguna_${v.id}" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></a>
          <a role="button" data-toggle="modal" data-target="#hapusPenggunaModal_${v.id}" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>
          </div>
        `;
        },
        className: "text-center",
      },
    ],
  });
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
          text: "Data user berhasil dihapus.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat menghapus data user.",
        });
      }
    },
    error: function (error) {
      console.error("Terjadi kesalahan:", error.messages);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat menghapus data user.",
      });
    },
  });
}

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

function ubahPengguna(id) {
  var formData = new FormData($("#ubahPengguna_" + id)[0]);

  console.log("Data yang dikirimkan:", formData);
  console.log("Apakah formulir kosong:", formData.has("nama_lengkap"));

  $.ajax({
    url: baseUrl + "users/" + id,
    method: "PUT",
    contentType: false,
    processData: false,
    data: formData,
    success: function (response) {
      console.log("Perubahan berhasil Diubah:", response);

      users();
      $("#modalPengguna_" + id).modal("hide");

      if (response && response.status === 200) {
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
