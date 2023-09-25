function show_pass() {
    let input_pass = document.getElementById("password");
    input_pass.type === "password"
      ? (input_pass.type = "text")
      : (input_pass.type = "password");
  }
  const form = document.querySelector("form");
  const usernameError = document.querySelector(".username.error");
  const emailError = document.querySelector(".email.error");
  const passwordError = document.querySelector(".password.error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // get values
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    try {
      const res = await fetch("/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log(data);
      if (data.errors) {
        usernameError.textContent = data.errors.username;
        emailError.textContent = data.errors.email;
        passwordError.textContent = data.errors.password;
      }
      if (data.user) {
        Swal.fire({
          title: "You have successfully registered!",
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
          location.assign("/");
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Registration failed!",
        text: `${err.message}`,
        icon: "error",
      });
    }
  });