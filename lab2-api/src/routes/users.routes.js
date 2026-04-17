const express = require("express");
const repo = require("../repositories/usersRepo");

const router = express.Router();

// GET all
router.get("/", async (req, res, next) => {
  try {
    const data = await repo.getAll();
    res.json({data});
  } catch (err) {
    next(err);
  }
});

// GET by id
router.get("/:id", async (req, res, next) => {
  try {
    const item = await repo.getById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: {
        code: "NOT_FOUND",
        message: "Ресурс не знайдено."
      }
      });
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST
router.post("/", async (req, res, next) => {
  try {
    const { name} = req.body;

    if (!name) {
      return res.status(400).json({ error: {
        code: "VALIDATION_ERROR",
        message: "Необхідне ім'я користувача."
      }
        });
    }

    const created = await repo.create(name);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const ok = await repo.remove(req.params.id);

    if (!ok) {
      return res.status(404).json({ error: {
        code: "NOT_FOUND",
        message: "Ресурс не знайдено."
      }
        });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;