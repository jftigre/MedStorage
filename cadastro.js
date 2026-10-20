const registerForm = document.querySelector("#register-form");
const formError = document.querySelector("#form-error");
const passwordToggles = [
  { input: document.querySelector("#password"), button: document.querySelector("#toggle-password") },
  { input: document.querySelector("#confirm-password"), button: document.querySelector("#toggle-confirm-password") }
];
const fields = {
  name: {
    input: document.querySelector("#full-name"),
    error: document.querySelector("#full-name-error")
  },
  cpf: {
    input: document.querySelector("#cpf"),
    error: document.querySelector("#cpf-error")
  },
  phone: {
    input: document.querySelector("#phone"),
    error: document.querySelector("#phone-error")
  },
  email: {
    input: document.querySelector("#email"),
    error: document.querySelector("#email-error")
  },
  password: {
    input: document.querySelector("#password"),
    error: document.querySelector("#password-error")
  },
  confirmPassword: {
    input: document.querySelector("#confirm-password"),
    error: document.querySelector("#confirm-password-error")
  }
};

function showFieldError(field, message) {
  field.error.textContent = message;
  field.error.classList.toggle("hidden", !message);
  field.input.setAttribute("aria-invalid", String(Boolean(message)));
}

function getFieldErrors(values) {
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  const passwordIsValid = values.password.length >= 6;

  return {
    name: values.name ? "" : "Informe seu nome completo.",
    cpf: values.cpf ? "" : "Informe seu CPF.",
    phone: values.phone ? "" : "Informe seu telefone.",
    email: emailIsValid ? "" : "Digite um e-mail válido.",
    password: passwordIsValid ? "" : "A senha deve ter no mínimo 6 caracteres.",
    confirmPassword: values.confirmPassword && values.confirmPassword === values.password
      ? ""
      : "As senhas devem ser iguais."
  };
}

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const values = {
    name: fields.name.input.value.trim(),
    cpf: fields.cpf.input.value.trim(),
    phone: fields.phone.input.value.trim(),
    email: fields.email.input.value.trim(),
    password: fields.password.input.value,
    confirmPassword: fields.confirmPassword.input.value
  };
  const errors = getFieldErrors(values);
  const firstInvalidField = Object.keys(errors).find((key) => errors[key]);

  Object.keys(fields).forEach((key) => showFieldError(fields[key], errors[key]));
  formError.textContent = "";
  formError.classList.add("hidden");

  if (firstInvalidField) {
    fields[firstInvalidField].input.focus();
    return;
  }

  try {
    const storedUsers = localStorage.getItem("medstorage_usersDB");
    const usersDB = storedUsers === null ? [] : JSON.parse(storedUsers);

    if (!Array.isArray(usersDB)) {
      throw new Error("O cadastro armazenado não está em um formato válido.");
    }

    if (usersDB.some((user) => user.email === values.email)) {
      showFieldError(fields.email, "E-mail já registado");
      fields.email.input.focus();
      return;
    }

    usersDB.push({
      id: Date.now(),
      nome: values.name,
      cpf: values.cpf,
      email: values.email,
      telefone: values.phone,
      senha: values.password
    });
    localStorage.setItem("medstorage_usersDB", JSON.stringify(usersDB));
    window.location.href = "login.html";
  } catch {
    formError.textContent = "Não foi possível salvar seu cadastro neste navegador. Tente novamente.";
    formError.classList.remove("hidden");
  }
});

Object.values(fields).forEach(({ input, error }) => {
  input.addEventListener("input", () => showFieldError({ input, error }, ""));
});

passwordToggles.forEach(({ input, button }) => {
  button.addEventListener("click", () => {
    const shouldShowPassword = input.type === "password";
    input.type = shouldShowPassword ? "text" : "password";
    button.textContent = shouldShowPassword ? "Ocultar" : "Mostrar";
    button.setAttribute("aria-pressed", String(shouldShowPassword));
  });
});
