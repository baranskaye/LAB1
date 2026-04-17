
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

/* лічильник*/

/* рендер */
function render(items = state.items) {
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
      <td> 
        <button onclick="editItem(${index})">Редагувати</button>
      </td>
    </tr>
  `).join("");
  renderStatusTable(items)
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



  // for (let status in counts) {
  //   const tr = document.createElement("tr");

  //   const tdStatus = document.createElement("td");
  //   tdStatus.textContent = status;

  //   const tdCount = document.createElement("td");
  //   tdCount.textContent = counts[status];

  // }
}

/*кнопка редагувати в таблиці */
let editIndex = null;
function editItem(index) {
  
  const item = state.items[index];

  document.getElementById("userInput").value = item.user;
  document.getElementById("dateTimeInput").value = item.date;
  document.getElementById("accessTypeSelect").value = item.type;
  document.getElementById("commentInput").value = item.comment;
  document.getElementById("statusSelect").value = item.status;

  editIndex = index;
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const dto = readForm();
  if (!validate(dto)) return;

  if( editIndex === null) {

    state.items.push({
      id: Date.now(),
      ...dto
    }
  );
  } else {
    state.items[editIndex] = {
      ...state.items[editIndex],
      ...dto
    };
    editIndex = null;
  }

  render();
  renderStatusTable(state.items);
  saveToStorage(state.items);
  form.reset();
  clearErrors();
  

});



/*кнопка видалити у формі*/ 
const formReset = document.getElementById("createForm");
const clearBtn = document.getElementById("deleteBtn");

clearBtn.addEventListener("click", () => {
  formReset.reset();
});

  

/*кнопка видалити в таблиці*/

document.getElementById("itemsTableBody").addEventListener("click", e => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    state.items = state.items.filter(item => item.id != id);
    render();
  }
});

const STORAGE_KEY = "lr1_items";
function saveToStorage(items) {
 const json = JSON.stringify(items);
 localStorage.setItem(STORAGE_KEY, json);
 
}

function loadFromStorage() {
  const json = localStorage.getItem(STORAGE_KEY);

  if (json) {
    state.items = JSON.parse(json);
    render();
  }
}

loadFromStorage();



