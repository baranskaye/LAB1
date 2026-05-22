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

// СТАТИСТИКА
async function getStatsByStatus() {

  return await all(`
    SELECT
      status,
      COUNT(*) as count
    FROM Requests
    GROUP BY status
  `);
}

// POST
async function create(data) {

  const now = new Date().toISOString();

  const result = await run(`
    INSERT INTO Requests (
      user,
      date,
      type,
      comment,
      status,
      createdAt
    )
    VALUES (
      '${data.user}',
      '${data.date}',
      '${data.type}',
      '${data.comment}',
      '${data.status}',
      '${now}'
    )
  `);

  return await get(`
    SELECT * FROM Requests
    WHERE id = ${result.lastID}
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

module.exports = { getAll, getById, create, remove, update, getStatsByStatus };