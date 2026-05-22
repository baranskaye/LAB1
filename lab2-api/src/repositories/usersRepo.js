const { all, get, run } = require("../db/dbClient");

async function getAll() {
  return await all(`
    SELECT * FROM Users
  `);
}

async function getById(id) {
  return await get(`
    SELECT * FROM Users
    WHERE id = ${Number(id)}
  `);
}

async function create(name) {

  const result = await run(`
    INSERT INTO Users (name)
    VALUES ('${name}')
  `);

  return await get(`
    SELECT * FROM Users
    WHERE id = ${result.lastID}
  `);
}

async function remove(id) {

  const result = await run(`
    DELETE FROM Users
    WHERE id = ${Number(id)}
  `);

  return result.changes > 0;
}

module.exports = {
  getAll,
  getById,
  create,
  remove
};