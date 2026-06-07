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
      return res.status(400).json({ error: {
        code: "VALIDATION_ERROR",
        message: "Необхідні requestId та текст коментаря."
      }
         });
    };

    const created = await repo.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const ok = await repo.remove(req.params.id);

    if (!ok) {
      return res.status(404).json({

        error: {
          code: "NOT_FOUND",
          message: "Ресурс не знайдено."
        }
      });
    }

    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

module.exports = router;