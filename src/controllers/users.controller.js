const service = require("../services/users.service");

exports.getAll = (req, res) => {
  res.json({ items: service.getAll() });
};

exports.getById = (req, res) => {
  const user = service.getById(req.params.id);

  if (!user) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Ресурс не знайдено" }
    });
  }

  res.json(user);
};

exports.create = (req, res) => {
  if (!req.body.user) {
    return res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Необхідний користувач" }
    });
  }

  const user = service.create(req.body);
  res.status(201).json(user);
};

exports.update = (req, res) => {
  const result = service.update(req.params.id, req.body);

  if (!result) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Ресурс не знайдено" }
    });
  }

  res.json(result);
};

exports.remove = (req, res) => {
  const ok = service.remove(req.params.id);

  if (!ok) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Ресурс не знайдено" }
    });
  }

  res.status(204).send();
};
