import { realizarLogout } from "../services/authService.js";

document.querySelectorAll("[data-logout]").forEach((logoutLink) => {
  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    realizarLogout();
    window.location.assign("login.html");
  });
});
