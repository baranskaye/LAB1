const service = require("../services/requests.service");

exports.getAll = (req, res) => {
  let data = service.getAll();

  if (req.query.status) {
    data = data.filter(r => r.status === req.query.status);
  }

  res.json({ items: data });
};

exports.getById = (req, res) => {
  const request = service.getById(req.params.id);

  if (!request) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Ресурс не знайдено" }
    });
  }

  res.json(request);
};

exports.create = (req, res) => {
  const { user, comment, dateTime } = req.body;

  if (!user || !comment) {
    return res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "user та comment обовʼязкові" }
    });
  }

  const result = service.create(req.body);
  res.status(201).json(result);
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
