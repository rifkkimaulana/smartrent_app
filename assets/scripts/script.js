app_name = "Smart Rent";

$(function () {
  //open_preload();
  //load home
  home();

  $(".footer-bar-6 .circle-nav").append("<strong><u></u></strong>");
  $(".footer-bar-6 .active-nav").append("<em></em>");
});

function shop() {
  //open_preload();
  $.ajax({
    type: "GET",
    url: "page-shop.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#shop").addClass("active-nav");
      $("#kategori").removeClass("active-nav");
      $("#home").removeClass("active-nav");
      $("#transaksi").removeClass("active-nav");
      $("#profil").removeClass("active-nav");
    },
  });
}

function kategori() {
  //open_preload();
  $.ajax({
    type: "GET",
    url: "page-kategori.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#shop").removeClass("active-nav");
      $("#kategori").addClass("active-nav");
      $("#home").removeClass("active-nav");
      $("#transaksi").removeClass("active-nav");
      $("#profil").removeClass("active-nav");
    },
  });
}

function home() {
  // open_preload();
  $.ajax({
    type: "GET",
    url: "page-home.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#shop").removeClass("active-nav");
      $("#kategori").removeClass("active-nav");
      $("#home").addClass("active-nav");
      $("#transaksi").removeClass("active-nav");
      $("#profil").removeClass("active-nav");
      $(".title").text("Home");
    },
  });
}

function transaksi() {
  // open_preload();
  $.ajax({
    type: "GET",
    url: "page-kategori.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#shop").removeClass("active-nav");
      $("#kategori").removeClass("active-nav");
      $("#home").removeClass("active-nav");
      $("#transaksi").addClass("active-nav");
      $("#profil").removeClass("active-nav");
    },
  });
}

function profil() {
  //open_preload();
  $.ajax({
    type: "GET",
    url: "page-profil.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#shop").removeClass("active-nav");
      $("#kategori").removeClass("active-nav");
      $("#home").removeClass("active-nav");
      $("#transaksi").removeClass("active-nav");
      $("#profil").addClass("active-nav");
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
