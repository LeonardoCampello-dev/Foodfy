const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const foodfydb = require("./db");

module.exports = session({
  store: new pgSession({
    pool: foodfydb,
  }),
  secret: "f00dfy-s3cr3t@",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
});
