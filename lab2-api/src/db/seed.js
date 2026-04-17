const { run } = require("./dbClient");
const initDb = require("./dbInit");

async function seed() {
  await initDb();

  const now = new Date().toISOString();

  // USERS
  await run(`INSERT INTO Users (name) VALUES ('Lisa')`);
  await run(`INSERT INTO Users (name) VALUES ('Anna')`);
  await run(`INSERT INTO Users (name) VALUES ('Mark')`);

  // REQUESTS
  await run(`
    INSERT INTO Requests (userId, comment, status, createdAt)
    VALUES (1, 'Test request 1', 'Pending', '${now}')
  `);

  await run(`
    INSERT INTO Requests (userId, comment, status, createdAt)
    VALUES (2, 'Test request 2', 'Done', '${now}')
  `);

  await run(`
    INSERT INTO Requests (userId, comment, status, createdAt)
    VALUES (3, 'Test request 3', 'Pending', '${now}')
  `);

  // COMMENTS
  await run(`
    INSERT INTO RequestNotes (requestId, text, createdAt)
    VALUES (1, 'First note', '${now}')
  `);

  await run(`
    INSERT INTO RequestNotes (requestId, text, createdAt)
    VALUES (1, 'Second note', '${now}')
  `);

  await run(`
    INSERT INTO RequestNotes (requestId, text, createdAt)
    VALUES (2, 'Another note', '${now}')
  `);

  console.log("SEED DONE");
}

seed();