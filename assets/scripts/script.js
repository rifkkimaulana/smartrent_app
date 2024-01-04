app_name = "Smart Rent";

var baseUrl = "http://localhost:8080/api/";

$(function () {
  //open_preload();
  //load home
  home();

  $(".footer-bar-6 .circle-nav").append("<strong><u></u></strong>");
  $(".footer-bar-6 .active-nav").append("<em></em>");
});

function shop() {
  open_preload();
  $.ajax({
    type: "GET",
    url: "pages/page-shop.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#shop").addClass("active-nav");
      $("#kategori").removeClass("active-nav");
      $("#home").removeClass("active-nav");
      $("#transaksi").removeClass("active-nav");
      $("#profil").removeClass("active-nav");
      document.title = "Shop";
      $(".header-title .title").text("Shop");
      $("h1 .title").text("Shop");

      fetch_rekomendasi_home();
    },
  });
}

function kategori() {
  open_preload();
  $.ajax({
    type: "GET",
    url: "pages/page-kategori.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#shop").removeClass("active-nav");
      $("#kategori").addClass("active-nav");
      $("#home").removeClass("active-nav");
      $("#transaksi").removeClass("active-nav");
      $("#profil").removeClass("active-nav");
      document.title = "Kategori";
      $(".header-title .title").text("Kategori");
      $("h1 .title").text("Kategori");

      fetch_kategori();
      fetch_rekomendasi_home();
    },
  });
}

function home() {
  open_preload();
  $.ajax({
    type: "GET",
    url: "pages/page-home.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#shop").removeClass("active-nav");
      $("#kategori").removeClass("active-nav");
      $("#home").addClass("active-nav");
      $("#transaksi").removeClass("active-nav");
      $("#profil").removeClass("active-nav");
      document.title = "Home";
      $(".header-title .title").text("Home");
      $("h1 .title").text("Home");

      fetch_rekomendasi_home();
      fetch_wisata_home();
    },
  });
}

function fetch_kategori() {
  $.ajax({
    method: "GET",
    url: baseUrl + "kategori/",
    dataType: "JSON",
    success: function (response) {
      $("#load_kategori").html("");
      if (response.status === 200) {
        let modal_delete = "";
        $.each(response.data, function (i, data) {
          modal_delete += `
          <div class="form-check interest-check">
          <input class="form-check-input" type="checkbox" value="" id="check${data.id}" />
          <label class="form-check-label shadow-xl rounded-xl" for="check1">${data.nama_kategori}</label>
          <i class="fa fa-check-circle color-white font-18"></i>
          <i class="fa fa-mobile-alt font-17 color-red-dark"></i>
        </div>
         `;
        });
        $("#load_kategori").append(modal_delete);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data:", error);
    },
  });
}
function fetch_rekomendasi_home() {
  $.ajax({
    method: "GET",
    url: baseUrl + "inventaris/",
    dataType: "JSON",
    success: function (response) {
      $("#load_rekomendasi_home").html("");
      if (response.status === 200) {
        let modal_delete = "";
        $.each(response.data, function (i, data) {
          // Tambahkan AJAX untuk mendapatkan nama kategori berdasarkan ID
          $.ajax({
            method: "GET",
            url: baseUrl + "kategori/" + data.kategori_id,
            dataType: "JSON",
            success: function (kategoriResponse) {
              if (kategoriResponse.status === 200) {
                modal_delete += `
                  <div class="col-6 pe-2">
                    <div class="card card-style mx-0 px-2">
                      <img src="${data.gambar}" class="img-fluid mt-2" />
                      <p class="color-highlight font-600 mb-n1">${kategoriResponse.data[0].nama_kategori}</p>
                      <h2>${data.nama_barang}</h2>
                      <h5 class="font-14">${formatCurrency(data.harga_sewa)}</h5>
                      <p class="font-11 line-height-s pt-3">${data.deskripsi}</p>
                      <a role="button" onclick="detail_produk(${
                        data.id
                      })" class="btn btn-s btn-full border-highlight rounded-s color-highlight mb-3">Order</a>
                    </div>
                  </div>
                `;
                $("#load_rekomendasi_home").append(modal_delete);
              }
            },
            error: function (xhr, status, error) {
              console.error("Error fetching category data:", error);
            },
          });
        });
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data:", error);
    },
  });
}

function fetch_wisata_home() {
  $.ajax({
    method: "GET",
    url: baseUrl + "destinasi/",
    dataType: "JSON",
    success: function (response) {
      $("#load_rekomendasi_destinasi").html("");
      if (response.status === 200) {
        let destinasi = "";
        $.each(response.data, function (i, data) {
          destinasi += `
          <div class="col-6 pe-2">
                <div class="card card-style mx-0 px-2">
                    <img src="${data.gambar_destinasi}" class="img-fluid mt-2" />
                    <p class="color-highlight font-600 mb-n1">${data.lokasi}</p>
                    <h2>${data.nama_destinasi}</h2>
                    <p class="font-11 line-height-s pt-3">${data.deskripsi}</p>
                    <a href="#" class="btn btn-s btn-full border-highlight rounded-s color-highlight mb-3">Order</a>
                </div>
            </div>
         `;
        });
        $("#load_rekomendasi_destinasi").append(destinasi);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data:", error);
    },
  });
}

function detail_produk(id) {
  open_preload();
  $.ajax({
    type: "GET",
    url: "pages/detail_produk.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#shop").addClass("active-nav");
      $("#kategori").removeClass("active-nav");
      $("#home").removeClass("active-nav");
      $("#transaksi").removeClass("active-nav");
      $("#profil").removeClass("active-nav");
      document.title = "Produk";
      $(".header-title .title").text("Produk");
      $("h1 .title").text("Produk");
      fetch_detailProduk(id);
    },
  });
}
function fetch_detailProduk(id) {
  // fetch detail produk
  $.ajax({
    method: "GET",
    url: baseUrl + "inventaris/" + id,
    dataType: "JSON",
    success: function (response) {
      $("#load_produk").html("");
      if (response.status === 200) {
        let destinasi = "";

        destinasi += `
        <img src="${response.data[0].gambar}" class="img-fluid mt-2" />
        <h1 class="mb-0 mt-3">${response.data[0].nama_barang}</h1>
        <p>${response.data[0].deskripsi}</p>

        <div class="d-flex">
          <div class="me-auto align-self-center">
            <h2 class="pt-1 me-3 font-700">${formatCurrency(response.data[0].harga_sewa)}</h2>
            <p class="font-400 font-10 mt-n2 opacity-50">*Harga tertera belum termasuk biaya admin.</p>
          </div>
          <div class="align-self-center">
            <a href="#" data-menu="menu-heart" class="icon icon-xs bg-white shadow-xl color-red-dark rounded-xl"
              ><i class="fa fa-heart"></i
            ></a>
            <a href="#" data-menu="menu-share" class="icon icon-xs bg-white shadow-xl color-blue-dark rounded-xl ms-1"
              ><i class="fa fa-share-alt"></i
            ></a>
          </div>
        </div>

        <div class="divider mt-3"></div>

        <a role="button" onclick="formSewa(${
          response.data[0].id
        })" class="btn btn-full btn-m rounded-s font-600 gradient-highlight">Mulai Sewa</a>
         `;
        $("#load_produk").append(destinasi);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data:", error);
    },
  });
}

function formSewa(id) {
  open_preload();
  $.ajax({
    type: "GET",
    url: "pages/form_sewa.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#shop").removeClass("active-nav");
      $("#kategori").removeClass("active-nav");
      $("#home").removeClass("active-nav");
      $("#transaksi").addClass("active-nav");
      $("#profil").removeClass("active-nav");
      document.title = "Transaksi";
      $(".header-title .title").text("Transaksi");
      $("h1 .title").text("Transaksi");
      $.ajax({
        method: "GET",
        url: baseUrl + "inventaris/" + id,
        dataType: "JSON",
        success: function (response) {
          $("#load_form").html("");
          if (response.status === 200) {
            let destinasi = "";

            destinasi += `
            <div class="page-content">
  <div class="card card-style">
    <div class="content">
      <p class="font-600 color-highlight mb-n1"></p>
      <h3>Rental Details</h3>
      <p>Silahkan selesaikan pembayaran anda.</p>

      <div class="d-flex mb-3">
        <div>
          <img src="${response.data[0].gambar}" width="110" class="rounded-s shadow-xl" />
        </div>
        <div class="ps-3 w-100">
          <h2>${response.data[0].nama_barang}</h2>
          <h5 class="font-500">${formatCurrency(response.data[0].harga_sewa)}</h5>
          <p class="mb-0 color-highlight">1x Item</p>
        </div>
      </div>
      <div class="mt-2 mb-4">
        <a href="#" class="float-start mt-1 ms-4 font-11 color-theme font-12"><i class="fa fa-trash color-red-dark me-1"></i> Remove</a>
        <div class="clearfix"></div>
      </div>

      <div class="divider"></div>
    </div>

    <div class="card card-style">
      <div class="content mb-2 mt-3">
        <div class="d-flex">
          <div class="pe-4 w-60">
            <p class="font-600 color-highlight mb-0 font-13">Your Total</p>
            <h1>${formatCurrency(response.data[0].harga_sewa)}</sup></h1>
          </div>
          <div class="w-100 pt-1">
            <h6 class="font-14 font-700">Total<span class="float-end color-green-dark">${formatCurrency(
              response.data[0].harga_sewa
            )}</span></h6>
            <div class="divider mb-2 mt-1"></div>
            <h6 class="font-14 font-700">Discount<span class="float-end color-red-dark">0%</span></h6>
          </div>
        </div>
      </div>
    </div>

    <div class="card card-style">
      <div class="content">
        <h3>Pilih Metode Pembayaran</h3>
        <p>untuk pembayaran online kamu dapat membayar lewat virual account bank, alfa, indomart, dsb.</p>
        <div class="fac fac-radio fac-highlight">
          <span></span>
          <input id="box2-fac-radio" type="radio" name="rad" value="1" checked />
          <label for="box2-fac-radio">Duitku Payment</label>
        </div>
        <div class="fac fac-radio fac-highlight">
          <span></span>
          <input id="box3-fac-radio" type="radio" name="rad" value="1" />
          <label for="box3-fac-radio">Bank Transfer</label>
        </div>
      </div>
    </div>
    <div class="card card-style">
      <div class="content">
        <h3>Detail Pemesanan</h3>
        <p>silahkan isi formulir di bawah ini.</p>
        <div class="input-style has-borders no-icon input-style-always-active validate-field mb-4">
          <input type="name" class="form-control validate-name" id="form2" placeholder="example. Annisa Maharani" />
          <label for="form2" class="color-blue-dark font-500">Nama Lengkap</label>
          <i class="fa fa-times disabled invalid color-red-dark"></i>
          <i class="fa fa-check disabled valid color-green-dark"></i>
          <em>(required)</em>
        </div>
        <div class="input-style has-borders no-icon validate-field input-style-always-active mb-4">
          <input type="number" class="form-control validate-number" id="form2a" placeholder="example. 08310xxxxxx" />
          <label for="form2a" class="color-blue-dark font-500">Nomor Telpon</label>
          <i class="fa fa-times disabled invalid color-red-dark"></i>
          <i class="fa fa-check disabled valid color-green-dark"></i>
          <em>(required)</em>
        </div>
        <div class="row mb-0">
          <div class="col-6">
            <div class="input-style has-borders no-icon validate-field input-style-always-active mb-4">
              <input
                type="date"
                class="form-control validate-name"
                id="form234512"
                value="2024-12-31"
                max="2024-12-01"
                min="2021-01-01"
                placeholder="Awal Sewa"
              />
              <label for="form234512" class="color-blue-dark font-500">Awal Sewa</label>
              <i class="fa fa-times disabled invalid color-red-dark"></i>
              <i class="fa fa-check disabled valid color-green-dark"></i>
              <em></em>
            </div>
          </div>
          <div class="col-6">
            <div class="input-style has-borders no-icon validate-field input-style-always-active mb-4">
              <input
                type="date"
                class="form-control validate-name"
                id="form234512"
                value="2024-1-31"
                max="2024-01-01"
                min="2021-01-01"
                placeholder="Akhir Sewa"
              />
              <label for="form234512" class="color-blue-dark font-500">Akhir Sewa</label>
              <i class="fa fa-times disabled invalid color-red-dark"></i>
              <i class="fa fa-check disabled valid color-green-dark"></i>
              <em></em>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card card-style">
      <div class="content">
        <p class="font-600 color-highlight mb-n1">Extra Information</p>
        <h3>Catatan Tambahan</h3>
        <p>Jika ada silahkan berikan kami catatan tambahan untuk detail order anda!.</p>
        <div class="input-style has-borders input-style-always-active no-icon mb-4">
          <textarea id="form7" placeholder="" style="height: 150px"></textarea>
          <label for="form7" class="color-highlight">Enter your Message</label>
          <em class="mt-n3">(required)</em>
        </div>
      </div>
    </div>

    <a role="button" onclick="invoices(${
      response.data[0].id
    })" class="close-menu btn btn-margins btn-full gradient-blue font-13 btn-l font-600 mt-3 rounded-sm">Selesaikan Pembayaran</a>
  </div>
</div>

             `;
            $("#load_form").append(destinasi);
          }
        },
        error: function (xhr, status, error) {
          console.error("Error fetching data:", error);
        },
      });
    },
  });
}

function invoices(id) {
  open_preload();
  $.ajax({
    type: "GET",
    url: "pages/invoice.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#shop").removeClass("active-nav");
      $("#kategori").removeClass("active-nav");
      $("#home").removeClass("active-nav");
      $("#transaksi").addClass("active-nav");
      $("#profil").removeClass("active-nav");
      document.title = "Transaksi";
      $(".header-title .title").text("Transaksi");
      $("h1 .title").text("Transaksi");
      $.ajax({
        method: "GET",
        url: baseUrl + "inventaris/" + id,
        dataType: "JSON",
        success: function (response) {
          $("#load_invoice").html("");
          if (response.status === 200) {
            let destinasi = "";

            destinasi += `
            <div class="content">
            <div class="d-flex">
              <div class="mt-1">
                <h1>Transaksi Berhasil!</h1>
              </div>
             
            </div>
          
            
            <div class="divider"></div>
          
            <div class="d-flex mb-3">
              <div>
                <img src="${response.data[0].gambar}" width="110" class="rounded-s shadow-xl" />
              </div>
              <div class="ps-3 w-100">
                <p class="mb-0 color-highlight">1x Item</p>
                <h1>${formatCurrency(response.data[0].harga_sewa)}</h1>
                <h5 class="font-500"></h5>
              </div>
            </div>
          
          
            <div class="divider mt-4"></div>
          
            <div class="d-flex mb-3">
              <div><h5 class="opacity-50 font-500">Shipping</h5></div>
              <div class="ms-auto"><h5>${formatCurrency(response.data[0].harga_sewa)}</h5></div>
            </div>
            <div class="d-flex mb-3">
              <div><h5 class="opacity-50 font-500">Taxes</h5></div>
              <div class="ms-auto"><h5>0%</h5></div>
            </div>
            <div class="d-flex mb-3">
              <div><h3 class="font-700">Grand Total</h3></div>
              <div class="ms-auto"><h3>${formatCurrency(response.data[0].harga_sewa)}</h3></div>
            </div>
          
            <div class="divider"></div>
          
            <a href="#" class="btn btn-full btn-l rounded-s font-600 gradient-highlight">Download Invoice in PDF</a>
          </div>
          
             `;
            $("#load_invoice").append(destinasi);
          }
        },
        error: function (xhr, status, error) {
          console.error("Error fetching data:", error);
        },
      });
    },
  });
}
function transaksi() {
  open_preload();
  $.ajax({
    type: "GET",
    url: "pages/page-transaksi.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#shop").removeClass("active-nav");
      $("#kategori").removeClass("active-nav");
      $("#home").removeClass("active-nav");
      $("#transaksi").addClass("active-nav");
      $("#profil").removeClass("active-nav");
      document.title = "Transaksi";
      $(".header-title .title").text("Transaksi");
      $("h1 .title").text("Transaksi");
    },
  });
}

function profil() {
  open_preload();
  $.ajax({
    type: "GET",
    url: "pages/page-profil.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#shop").removeClass("active-nav");
      $("#kategori").removeClass("active-nav");
      $("#home").removeClass("active-nav");
      $("#transaksi").removeClass("active-nav");
      $("#profil").addClass("active-nav");

      document.title = "Profil";
      $(".header-title .title").text("Profil");
      $("h1 .title").text("Profil");
    },
  });
}

function open_preload() {
  $.ajax({
    type: "GET",
    url: "index.html",

    success: function () {
      $("#load-preload").html(` 
      <div id="preloader"><div class="spinner-border color-blue-dark" role="status"></div></div>
      `);
      setTimeout(function () {
        $("#load-preload").html("");
      }, 500);
    },
  });
}

// Function to format currency
function formatCurrency(amount) {
  return "IDR." + parseFloat(amount).toFixed(2);
}
