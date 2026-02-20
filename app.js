
const form = document.getElementById("createForm");
const state = { items: [] };

// Очищення помилок
function clearErrors() {
  document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
}

// Показ помилки
function showError(inputId, errorId, message) {
  document.getElementById(inputId).classList.add('invalid');
  document.getElementById(errorId).textContent = message;
}

function readForm() {
  return {
    userInput: document.getElementById("userInput").value.trim(),
    dateTimeInput: document.getElementById("dateTimeInput").value.trim(),
    accessTypeSelect: document.getElementById("accessTypeSelect").value.trim(),
    commentInput: document.getElementById("commentInput").value.trim(),
    statusSelect: document.getElementById("statusSelect").value
  };
}
// Валідація
function validate(dto) {
  clearErrors();
  let isValid = true;

  // Ім'я користувача
  const user = (dto.userInput || "").trim();
  if (!user) {
    showError("userInput", "userError", "Поле є обов’язковим.");
    isValid = false;
  } else if (user.length < 3 || user.length > 30) {
    showError("userInput", "userError", "Довжина має бути від 3 до 30 символів.");
    isValid = false;
  }

  // Дата
  const dateStr = (dto.dateTimeInput || "").trim();
  if (!dateStr) {
    showError("dateTimeInput", "dateTimeError", "Вкажіть дату.");
    isValid = false;
  } else {
    const selectedDate = new Date(dateStr);
    if (isNaN(selectedDate.getTime())) {
      showError("dateTimeInput", "dateTimeError", "Некоректна дата.");
      isValid = false;
    }
  }

  // Тип доступу
  const type = (dto.accessTypeSelect || "").trim();
  if (!type) {
    showError("accessTypeSelect", "accessTypeError", "Оберіть тип доступу.");
    isValid = false;
  }

  // Коментар
  const comment = (dto.commentInput || "").trim();
  if (!comment) {
    showError("commentInput", "commentInputError", "Коментар обов’язковий.");
    isValid = false;
  } else if (comment.length < 5 || comment.length > 200 ) {
    showError("commentInput", "commentInputError", "Довжина має бути від 5 до 200 символів.");
    isValid = false;
  } 

  return isValid;
}

// Рендер таблиці
function render(items) {
  const tbody = document.getElementById("itemsTableBody");
  tbody.innerHTML = items.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.user}</td>
      <td>${item.date}</td>
      <td>${item.type}</td>
      <td>${item.comment}</td>
      <td>${item.status}</td>
      <td>
        <button type="button" class="delete-btn" data-id="${item.id}">Видалити</button>
      </td>
    </tr>
  `).join("");
}

// Submit
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const dto = {
    userInput: document.getElementById("userInput").value,
    dateTimeInput: document.getElementById("dateTimeInput").value,
    accessTypeSelect: document.getElementById("accessTypeSelect").value,
    commentInput: document.getElementById("commentInput").value,
    statusSelect: document.getElementById("statusSelect").value
  };

  
  if (!validate(dto)) return;

  const item = {
    id: Date.now(),
    user: dto.userInput,
    date: dto.dateTimeInput,
    type: dto.accessTypeSelect,
    comment: dto.commentInput,
    status: dto.statusSelect
  };

  state.items.push(item);
  render();
  form.reset();
  clearErrors();
});