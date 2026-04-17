const express = require("express");
const initDb = require("./db/dbInit");

const usersRoutes = require("./routes/users.routes");
const requestsRoutes = require("./routes/requests.routes");
const requestsComments = require("./routes/comments.routes");


const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// логування
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(req.method, req.url, res.statusCode, Date.now() - start + "ms");
  });
  next();
});

console.log(typeof requestsComments);

console.log(requestsComments);
// routes
app.use("/api/users", usersRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/comments", requestsComments);


// error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: {
      code: "SERVER_ERROR",
      message: "Помилка сервера"
    }
  });
});

// запуск
async function start() {
  try {
    await initDb();

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  } catch (err) {
    console.error(err);
  }
}

start();