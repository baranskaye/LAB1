const { all, get, run } = require("../db/dbClient");

async function create(data) {
  const now = new Date().toISOString();

  const result = await run(`
    INSERT INTO RequestNotes (requestId, text, createdAt)
    VALUES (${Number(data.requestId)}, '${data.text}', '${now}')
  `);

  return get(`SELECT * FROM RequestNotes WHERE id = ${result.lastID}`);
}

async function getAll() {
  return all("SELECT * FROM RequestNotes ORDER BY id DESC");
}


async function remove(id) {
  const result = await run(`
    DELETE FROM RequestNotes WHERE id = ${Number(id)}
  `);

  return result.changes > 0;
}

module.exports = { getAll, create, remove };