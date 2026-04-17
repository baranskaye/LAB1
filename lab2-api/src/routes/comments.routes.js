const express = require("express");
const repo = require("../repositories/commentsRepo");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await repo.getAll();
    res.json({ data });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { requestId, text } = req.body;

    if (!requestId || !text) {
      return res.status(400).json({ error: "requestId and text required" });
    }

    const created = await repo.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "text required"
      });
    }

    const updated = await repo.update(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({
        error: "Not found"
      });
    }

    res.json(updated);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const ok = await repo.remove(req.params.id);

    if (!ok) {
      return res.status(404).json({
        error: "Not found"
      });
    }

    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

module.exports = router;