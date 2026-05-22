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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    comment TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL
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

<<<<<<< HEAD
=======
  await run(`
  INSERT INTO Users (name)
  VALUES ('Lisa')
`);

await run(`
  INSERT INTO RequestNotes (
    requestId,
    text,
    createdAt
  )
  VALUES (
    1,
    'Тестовий коментар',
    '${new Date().toISOString()}'
  )
`);
  
>>>>>>> 3bb40db (lab4 final frontend+backend)
  const tables = await all(`
    SELECT name FROM sqlite_master WHERE type='table';
  `);

  console.log("TABLES:", tables);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_requests_userId
    ON Requests (user);
  `);

  console.log("INIT DB DONE");
};
<<<<<<< HEAD
=======

>>>>>>> 3bb40db (lab4 final frontend+backend)
