function show_pass() {
    let input_pass = document.getElementById("password");
    input_pass.type === "password"
      ? (input_pass.type = "text")
      : (input_pass.type = "password");
  }
  const form = document.querySelector("form");
  const emailError = document.querySelector(".email.error");
  const passwordError = document.querySelector(".password.error");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // reset errors
    emailError.textContent = "";
    passwordError.textContent = "";
    // get values
    const email = form.email.value;
    const password = form.password.value;
    try {
      const res = await fetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.errors) {
        emailError.textContent = data.errors.email;
        passwordError.textContent = data.errors.password;
      }
      if (data.user) {
        Swal.fire({
          title: "Welcome back!",
          text: "You have successfully logged in.",
          icon: "success",
          background: "#f8f9fa",
          customClass: {
            container: "my-swal",
            title: "my-swal-title",
            content: "my-swal-content",
            confirmButton: "btn btn-success my-swal-btn",
          },
          showCancelButton: false,
          showCloseButton: false,
          timer: 2000,
          timerProgressBar: true,
          allowOutsideClick: false,
        }).then(() => {
          location.assign("/bestfriends");
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Login failed!",
        text: `${err.message}`,
        icon: "error",
        customClass: {
          confirmButton: "btn btn-danger",
        },
        showCancelButton: false,
        showCloseButton: true,
        allowOutsideClick: true,
      });
    }
  });