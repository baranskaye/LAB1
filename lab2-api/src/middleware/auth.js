function auth(req, res, next) {

  const userId =
    Number(req.header("X-Demo-UserId"));

  if (!userId) {

    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Передайте X-Demo-UserId"
      }
    });

  }

  req.currentUserId = userId;

  next();
}

module.exports = auth;