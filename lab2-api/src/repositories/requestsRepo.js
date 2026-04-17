const { all, get, run } = require("../db/dbClient");
const now = new Date().toISOString();

// GET all
async function getAll() {
  return await all(`
    SELECT * FROM Requests
    ORDER BY id DESC
  `);
}

// GET by id
async function getById(id) {
  return await get(`
    SELECT * FROM Requests
    WHERE id = ${Number(id)}
  `);
}

// POST
async function create(data) {
  const now = new Date().toISOString();

  const result = await run(`
    INSERT INTO Requests (userId, comment, status, createdAt)
    VALUES (${Number(data.userId)}, '${data.comment}', '${data.status}', '${now}')
  `);

  return await get(`
    SELECT * FROM Requests WHERE id = ${result.lastID}
  `);
}

async function update (id, data) {
  let updates = [];

  if (data.comment) {
    updates.push(`comment = '${data.comment}'`);
  }

  if (data.status) {
    updates.push(`status = '${data.status}'`);
  }

  if (updates.length === 0) return null;

  const sql = `
    UPDATE Requests
    SET ${updates.join(", ")}
    WHERE id = ${Number(id)}
  `;

  const result = await run(sql);

  if (result.changes === 0) return null;

  return get(`SELECT * FROM Requests WHERE id = ${Number(id)}`);
};

// DELETE
async function remove(id) {
  const result = await run(`
    DELETE FROM Requests WHERE id = ${Number(id)}
  `);

  return result.changes > 0;
}

module.exports = { getAll, getById, create, remove, update };