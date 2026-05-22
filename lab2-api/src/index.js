const cors = require("cors");
const express = require("express");
const initDb = require("./db/dbInit");

const app = express();
app.use(cors());
app.use(express.json());
initDb();

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(req.method, req.url, res.statusCode, Date.now() - start + "ms");
  });
  next();
});

const usersRoutes = require("./routes/users.routes");
const requestsRoutes = require("./routes/requests.routes");
const commentsRoutes = require("./routes/comments.routes");

app.use("/api/users", usersRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/comments", commentsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: {
      code: "SERVER_ERROR",
      message: "Помилка сервера"
    }
  });
});

app.listen(3000, () => {
  console.log("Server running");
});
