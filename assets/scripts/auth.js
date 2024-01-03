var baseUrl = "http://localhost:8080/api/";
var userId = localStorage.getItem("id");
var userLevel = localStorage.getItem("user_level");

// Auth Pages
$(document).ready(function () {
  if (userId && userLevel) {
    Swal.fire({
      icon: "success",
      title: "Anda sudah login",
      text: "dalam 5 detik anda akan dibawa ke dashboard",
    });
    setTimeout(function () {
      window.location.href = "../";
    }, 5000);
  }
  $("#login").click(function () {
    var formData = $("#loginForm").serialize();

    $.ajax({
      type: "POST",
      url: baseUrl + "users/login",
      data: formData,
      success: function (response) {
        if (response.status === 200) {
          localStorage.setItem("id", response.data.id);
          localStorage.setItem("user_level", response.data.level_user);

          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "You are now logged in!",
          });

          setTimeout(function () {
            window.location.href = "../";
          }, 5000);
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: response.data.messages,
          });
        }
      },
      error: function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.responseJSON.message,
        });
      },
    });
  });
});
