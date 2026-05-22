export async function getRequests() {

  const response = await fetch(`${API_BASE_URL}/requests`);

  if (!response.ok) {
    throw new Error("Помилка завантаження");
  }

  return await response.json();
}

export async function getRequestById(id) {

  const response = await fetch(`${API_BASE_URL}/requests/${id}`);

  if (!response.ok) {
    throw new Error("Запис не знайдено");
  }

  return await response.json();
}

export async function createRequest(data) {

  const response = await fetch(`${API_BASE_URL}/requests`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Помилка створення");
  }

  return await response.json();
}