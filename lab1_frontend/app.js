import { API_BASE_URL } from "./config.js";

const form = document.getElementById("createForm");
const state = { items: [] };

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dto = readForm();

  if (!validate(dto)) {return};

  try {
    const response = await fetch(`${API_BASE_URL}/requests`, {

      method: "POST",
      headers: {
                "Content-Type": "application/json",
            },

      body: JSON.stringify(dto),
    });

    const result = await response.json();
    console.log(result);
    form.reset();
    await loadEntity("requests");

  } catch (error) {
    console.error(error);
  }
});

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
/*валідація*/

function validate(dto) {
  clearErrors();
  let ok = true;

  if (!dto.user) {
    showError("userInput", "userError", "Поле є обовʼязковим");
    ok = false;
  } else if (dto.user.length < 3 || dto.user.length > 30) {
    showError("userInput", "userError", "Довжина має бути від 3 до 30 символів");
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
    showError("commentInput", "commentInputError", "Довжина має бути від 5 до 200 символів");
    ok = false;
  }

  return ok;
}

/*  АГРЕГУВАННЯ */
function renderStatusTable(items) {


  const tbody = document.querySelector("#itemsStatusTable");
  tbody.innerHTML = "";

  const status1 = "Pending";
  const status2 = "Allowed";
  const status3 = "Rejected";
  let count1 = 0;
  let count2 = 0;
  let count3 = 0;

  for (let item of items) {
    
  if (item.status === status1) {
    count1++
  }

  if (item.status === status2) {
    count2++
  }

  if (item.status === status3) {
    count3++
  }
  }

  console.log(count1, count2, count3)
    tbody.innerHTML = `<tr> <td> ${count1}</td>  <td> ${count2} </td> <td>${count3} </td></tr>`;

}

/*кнопка редагувати в таблиці */
window.addEventListener("DOMContentLoaded", () => {

  loadEntity("requests");

  document.getElementById("entitySelect")
    .addEventListener("change", (e) => {

      loadEntity(e.target.value);

  });

});
/*кнопка видалити у формі*/ 
const formReset = document.getElementById("createForm");
const clearBtn = document.getElementById("deleteBtn");

clearBtn.addEventListener("click", () => {
  formReset.reset();
});

/*кнопка видалити в таблиці*/
document.getElementById("itemsTableBody")
  .addEventListener("click", async (e) => {

    if (e.target.classList.contains("delete-btn")) {

      const id = e.target.dataset.id;

      const entity =
        document.getElementById("entitySelect").value;

      try {

        const response = await fetch(
          `${API_BASE_URL}/${entity}/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Не вдалося видалити запис");
        }

        await loadEntity(entity);

      } catch (error) {

        console.error(error);
        alert(error.message);

      }
    }
});

/* пошук за ID*/
document.getElementById("searchBtn").addEventListener("click", async () => {

  const id = document.getElementById("searchIdInput").value;

  const container = document.getElementById("detailsContainer");

  try {

    container.textContent = "Завантаження...";

    const response = await fetch(`${API_BASE_URL}/requests/${id}`);

    if (!response.ok) {
      throw new Error("Запис не знайдено");
    }

    const item = await response.json();

    container.innerHTML = `
      <p>ID: ${item.id}</p>
      <p>User: ${item.user}</p>
      <p>Comment: ${item.comment}</p>
      <p>Status: ${item.status}</p>
    `;

  } catch (error) {
    container.textContent = error.message;
  }
});

/* завантаження таблиці */ 
async function loadEntity(entity) {

  try {

    const response = await fetch(`${API_BASE_URL}/${entity}`);

    if (!response.ok) {
      throw new Error("Помилка завантаження");
    }

    const data = await response.json();

    const items = Array.isArray(data)
      ? data
      : data.data || [];

    console.log(entity);
    console.log(items);

    renderEntity(entity, items);

  } catch (error) {

    console.error(error);

  }
}

loadEntity("requests");

document.getElementById("entitySelect")
  .addEventListener("change", (e) => {

    loadEntity(e.target.value);

});

function renderEntity(entity, items) {

  const thead = document.getElementById("tableHead");
  const tbody = document.getElementById("itemsTableBody");

  if (entity === "requests") {

    thead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Користувач</th>
        <th>Дата</th>
        <th>Тип доступу</th>
        <th>Коментар</th>
        <th>Статус</th>
        <th>Видалення</th>
        <th>Редагування</th>
      </tr>
    `;

    tbody.innerHTML = items.map((item, index) => `
      <tr>
        <td>${item.id}</td>
        <td>${item.user}</td>
        <td>${item.date}</td>
        <td>${item.type}</td>
        <td>${item.comment}</td>
        <td>${item.status}</td>

        <td>
          <button
            type="button"
            class="delete-btn"
            data-id="${item.id}"
          >
            Видалити
          </button>
        </td>

        <td>
          <button onclick="editItem(${index})">
            Редагувати
          </button>
        </td>

      </tr>
    `).join("");

    renderStatusTable(items);
  }

  if (entity === "users") {

  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Видалення</th>
    </tr>
  `;

  tbody.innerHTML = items.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>

      <td>
        <button
          type="button"
          class="delete-btn"
          data-id="${item.id}"
        >
          Видалити
        </button>
      </td>

    </tr>
  `).join("");
}

if (entity === "comments") {

  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Request ID</th>
      <th>Text</th>
      <th>Created At</th>
      <th>Видалення</th>
    </tr>
  `;

  tbody.innerHTML = items.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.requestId}</td>
      <td>${item.text}</td>
      <td>${item.createdAt}</td>

      <td>
        <button
          type="button"
          class="delete-btn"
          data-id="${item.id}"
        >
          Видалити
        </button>
      </td>

    </tr>
  `).join("");
};
  
}

