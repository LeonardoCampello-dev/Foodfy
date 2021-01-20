const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0aa53ca222b102",
    pass: "844b8e0a7cc247",
  },
});
