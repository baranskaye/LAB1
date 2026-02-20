
const form = document.getElementById("createForm");
const state = { items: [] };

function clearErrors() {
  document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
}


function showError(inputId, errorId, message) {
  document.getElementById(inputId).classList.add('invalid');
  document.getElementById(errorId).textContent = message;
}


function readForm() {
  return {
    user: document.getElementById("userInput").value.trim(),
    date: document.getElementById("dateTimeInput").value,
    type: document.getElementById("accessTypeSelect").value,
    comment: document.getElementById("commentInput").value.trim(),
    status: document.getElementById("statusSelect").value
  };
}

function validate(dto) {
  clearErrors();
  let ok = true;

  if (!dto.user) {
    showError("userInput", "userError", "Поле є обовʼязковим");
    ok = false;
  } else if (dto.user.length < 3 || dto.user.length > 30) {
    showError("userInput", "userError", "Довжина 3–30 символів");
    ok = false;
  }

  if (!dto.date) {
    showError("dateTimeInput", "dateTimeError", "Вкажіть дату");
    ok = false;
  }

  if (!dto.type) {
    showError("accessTypeSelect", "accessTypeError", "Оберіть тип доступу");
    ok = false;
  }

  if (!dto.comment) {
    showError("commentInput", "commentInputError", "Коментар обовʼязковий");
    ok = false;
  } else if (dto.comment.length < 5 || dto.comment.length > 200) {
    showError("commentInput", "commentInputError", "Довжина 5–200 символів");
    ok = false;
  }

  return ok;
}

function render() {
  const tbody = document.getElementById("itemsTableBody");
  tbody.innerHTML = state.items.map((item, index) => `
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

form.addEventListener("submit", e => {
  e.preventDefault();

  const dto = readForm();
  if (!validate(dto)) return;

  state.items.push({
    id: Date.now(),
    ...dto
  });

  render();
  form.reset();
  clearErrors();
});

document.getElementById("itemsTableBody").addEventListener("click", e => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    state.items = state.items.filter(item => item.id != id);
    render();
  }
});