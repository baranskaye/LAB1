const { run, all } = require("./dbClient");

module.exports = async function () {
  console.log("INIT DB START");

  await run("PRAGMA foreign_keys = ON;");

  await run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS Requests (
      id INTEGER PRIMARY KEY,
      userId INTEGER NOT NULL,
      comment TEXT NOT NULL,
      status TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS RequestNotes (
      id INTEGER PRIMARY KEY,
      requestId INTEGER NOT NULL,
      text TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (requestId) REFERENCES Requests(id)
    );
  `);

  const tables = await all(`
    SELECT name FROM sqlite_master WHERE type='table';
  `);

  console.log("TABLES:", tables);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_requests_userId
    ON Requests (userId);
  `);

  console.log("INIT DB DONE");
};
