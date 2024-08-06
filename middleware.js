const tracer = require("dd-trace").init({
  appsec: {
    enabled: true,
  },
});

function checkUser(req, res, next) {
  const username = req.body.username || req.query.username || req.headers['x-username'];

  if (username) {
    tracer.setUser({
      id: username,
      name: username,
    });
    req.username = username;
  }

  next();
}

module.exports = { checkUser };
