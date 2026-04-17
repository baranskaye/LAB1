const { all, get, run } = require("../db/dbClient");

exports.getAll = () => all("SELECT * FROM Users");

exports.getById = (id) =>
  get(`SELECT * FROM Users WHERE id = ${Number(id)}`);

exports.create = async (name) => {
  const result = await run(`
    INSERT INTO Users (name)
    VALUES ('${name}')
  `);

  return get(`SELECT * FROM Users WHERE id = ${result.lastID}`);
};