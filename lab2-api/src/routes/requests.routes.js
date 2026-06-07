const express = require("express");
const repo = require("../repositories/requestsRepo");
const { all } = require("../db/dbClient");

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

router.get("/with-users", async (req, res, next) => {
  try {
    const data = await require("../db/dbClient").all(`
      SELECT 
        r.id,
        r.comment,
        r.status,
        r.createdAt,
        u.name as userName
      FROM Requests r
      JOIN Users u ON u.id = r.userId
      ORDER BY r.id DESC
    `);

    res.json({ data });
  } catch (err) {
    next(err);
  }
})

router.get("/filter", async (req, res, next) => {

  try {

    const { all } = require("../db/dbClient");

    const { status, user } = req.query;

    let sql = `
      SELECT * FROM Requests
      WHERE 1=1
    `;

    const params = [];

    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }

    if (user) {
      sql += ` AND user = ?`;
      params.push(user);
    }

    sql += ` ORDER BY createdAt DESC`;
    const data = await all(sql, params);
    res.json({ data });

  } catch (err) {
      next(err);
  }
});

router.get("/stat", async (req,res, next) => {
try {
  const data = await repo.getStatsByStatus();
  res.json({data})
} catch (e){
next(e)
}
});

// GET by id
router.get("/:id", async (req, res, next) => {

  try {

    const item = await repo.getById(req.params.id);

    if (!item) {

      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Ресурс не знайдено"
        }
      });

    }

    const currentUser = 
      req.header("X-Demo-User");

    if (!currentUser) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Передайте X-Demo-User"
        }
      });
    } 

    console.log("HEADER:", currentUser);
    console.log("ITEM USER:", item.user);

    if (item.user !== currentUser) {

      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "Немає доступу"
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
    const { user, date, type, comment, status } = req.body;

    if (!user || !comment || !date || !type || !status) {
      return res.status(400).json({ error: {
        code: "VALIDATION_ERROR",
        message: "Заповніть необхідні поля форми."
      },
         });
    }

    const created = await repo.create({
      user,
      date,
      type,
      comment,
      status
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { comment, status } = req.body;

    if (!comment && !status) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Немає даних для оновлення."
        }
      });
    }

    const updated = await repo.update(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Ресурс не знайдено."
        }
      });
    }

    res.json(updated);
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
      },  });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});


module.exports = router;