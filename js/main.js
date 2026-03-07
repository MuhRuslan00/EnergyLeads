/**
 * main.js — якоря, валидация формы с inline-ошибками.
 */

function qs(selector, root = document) {
  return root.querySelector(selector);
}

/* Плавная прокрутка по якорям */
function initSmoothAnchors() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const target = qs(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* Показать/скрыть inline-ошибку внутри инпута */
function setFieldError(input, message) {
  // Убираем старую ошибку
  const existing = input.parentElement.querySelector(".field__error");
  if (existing) existing.remove();

  if (!message) {
    input.classList.remove("field__input--error");
    return;
  }

  input.classList.add("field__input--error");
  const err = document.createElement("span");
  err.className = "field__error";
  err.textContent = message;
  input.parentElement.appendChild(err);
}

/* Валидация одного поля */
function validateField(input) {
  const val = input.value.trim();

  if (input.required && val === "") {
    setFieldError(input, "Это поле обязательно для заполнения");
    return false;
  }

  if (input.type === "email" && val !== "" && !val.includes("@")) {
    setFieldError(input, "Введите корректный email");
    return false;
  }

  if (input.name === "name" && val !== "" && val.length < 2) {
    setFieldError(input, "Имя слишком короткое");
    return false;
  }

  setFieldError(input, null);
  return true;
}

/* Состояние кнопки: неактивна только после попытки сабмита без чекбокса */
function updateSubmitState(afterAttempt = false) {
  const policy = qs("#policy");
  const btn = qs("#submitBtn");
  if (!policy || !btn) return;
  if (afterAttempt) {
    btn.disabled = !policy.checked;
  } else {
    btn.disabled = false;
  }
}

function initForm() {
  const form = qs("#partnerForm");
  const policy = qs("#policy");
  const checkBox = policy && policy.closest(".check");
  if (!form || !policy) return;

  updateSubmitState();
  policy.addEventListener("change", () => {
    updateSubmitState(true);
    if (policy.checked && checkBox) {
      checkBox.classList.remove("check--error");
    }
  });

  // Валидация при потере фокуса
  form.querySelectorAll(".field__input").forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.classList.contains("field__input--error")) {
        validateField(input);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    // Проверяем все обязательные инпуты
    form.querySelectorAll(".field__input").forEach((input) => {
      if (!validateField(input)) valid = false;
    });

    // Проверяем чекбокс
    if (!policy.checked) {
      valid = false;
      if (checkBox) checkBox.classList.add("check--error");
      updateSubmitState(true);
    }

    if (!valid) return;

    // Успех
    const hint = qs("#formHint");
    if (hint) hint.textContent = "Готово. (Сабмит заглушка — подключи свой эндпоинт.)";
    form.reset();
    updateSubmitState();
    form.querySelectorAll(".field__input").forEach((input) => setFieldError(input, null));
    if (checkBox) checkBox.classList.remove("check--error");
  });
}

/* Бургер-меню */
function initBurger() {
  const burger = qs(".burger");
  const menu = qs(".mobile-menu");
  if (!burger || !menu) return;

  burger.addEventListener("click", () => {
    const isOpen = burger.classList.toggle("is-open");
    menu.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", isOpen);
    menu.setAttribute("aria-hidden", !isOpen);
  });

  // Закрыть при клике на ссылку
  menu.querySelectorAll(".mobile-menu__link").forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("is-open");
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", false);
      menu.setAttribute("aria-hidden", true);
    });
  });
}

initSmoothAnchors();
initForm();
initBurger();
