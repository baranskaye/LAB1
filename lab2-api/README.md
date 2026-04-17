Lab 3 (SQLite + Express)


Сутності: Users , Requests, RequestNotes.

Функціонал: 
- CRUD для кожної сутності
- Валідація даних (400 Bad Request)
- Обробка помилок (404, 500)
- Логування запитів

Запуск:
  npm install
  node src/server.js

Сервер: http://localhost:3000

СТРУКТУРА БД:
  Users - Користувачі
  Requests - Запити
  RequestNotes - Коментарі до заявок

Використано:
  зовнішні ключі (Foreign Keys)
  каскадне видалення (ON DELETE CASCADE)

ЕНДПОІНТИ:

  Users
    GET /api/users
    GET /api/users/:id
    POST /api/users
    DELETE /api/users/:id

  Requests
    GET /api/requests
    GET /api/requests/:id
    POST /api/requests
    PUT /api/requests/:id
    DELETE /api/requests/:id

    Додатково:

    GET /api/requests/with-users — заявки з іменами користувачів (JOIN)
    GET /api/requests/filter?status=Pending&userId=1 — фільтрація

  RequestNotes
    GET /api/comments
    POST /api/comments
    PUT /api/comments/:id
    DELETE /api/comments/:id

Приклади запитів:

1) Створення користувача

POST /api/users

{
  "name": "Lisa"
}

2) Створення заявки

POST /api/requests

{
  "userId": 1,
  "comment": "test",
  "status": "Pending"
}

3) Створення коментаря

POST /api/comments

{
  "requestId" : 1,
  "text" : "comment"
}

Коди відповіді:
200 OK
201 Created
204 No Content
400 Bad Request
404 Not Found
409 Conflict
500 Internal Server Error

