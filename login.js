import { realizarLoginLocal } from "./vanilla/src/services/authService.js";

const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const formError = document.querySelector("#form-error");
const togglePasswordButton = document.querySelector("#toggle-password");

function showFieldError(input, errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.toggle("hidden", !message);
  input.setAttribute("aria-invalid", String(Boolean(message)));
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const userEmail = emailInput.value.trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);
  const passwordIsValid = passwordInput.value.length >= 6;

  showFieldError(emailInput, emailError, emailIsValid ? "" : "Digite um e-mail válido.");
  showFieldError(passwordInput, passwordError, passwordIsValid ? "" : "A senha deve ter no mínimo 6 caracteres.");
  formError.textContent = "";
  formError.classList.add("hidden");

  if (!emailIsValid || !passwordIsValid) {
    (emailIsValid ? passwordInput : emailInput).focus();
    return;
  }

  const emailDigitado = userEmail;
  const senhaDigitada = passwordInput.value;

  try {
    const sucesso = realizarLoginLocal(emailDigitado, senhaDigitada);

    if (sucesso) {
      window.location.href = "dashboard.html";
      return;
    }

    formError.textContent = "E-mail ou senha incorretos.";
    formError.classList.remove("hidden");
  } catch {
    formError.textContent = "Não foi possível iniciar sua sessão neste navegador. Tente novamente.";
    formError.classList.remove("hidden");
  }
});

emailInput.addEventListener("input", () => showFieldError(emailInput, emailError, ""));
passwordInput.addEventListener("input", () => showFieldError(passwordInput, passwordError, ""));
togglePasswordButton.addEventListener("click", () => {
  const shouldShowPassword = passwordInput.type === "password";
  passwordInput.type = shouldShowPassword ? "text" : "password";
  togglePasswordButton.textContent = shouldShowPassword ? "Ocultar" : "Mostrar";
  togglePasswordButton.setAttribute("aria-pressed", String(shouldShowPassword));
});
