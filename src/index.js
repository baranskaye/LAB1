const express = require("express");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(req.method, req.url, res.statusCode, Date.now() - start + "ms");
  });
  next();
});

const usersRoutes = require("./routes/users.routes");
const requestsRoutes = require("./routes/requests.routes");

app.use("/api/users", usersRoutes);
app.use("/api/requests", requestsRoutes);

app.use((err, req, res, next) => {
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
