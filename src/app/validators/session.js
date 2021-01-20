const User = require("../models/User");

const { compare } = require("bcryptjs");

module.exports = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
      });

      if (!user)
        return res.render("session/login.njk", {
          error: "Usuário não cadastrado!",
        });

      const passed = await compare(password, user.password);

      if (!passed)
        return res.render("session/login.njk", {
          user: req.body,
          error: "Senha incorreta!",
        });

      req.user = user;

      next();
    } catch (error) {
      console.error(error);
    }
  },
  async forgot(req, res, next) {
    try {
      const { email } = req.body;

      const user = await User.findOne({
        where: { email },
      });

      if (!user)
        return res.render("session/forgot-password.njk", {
          user: req.body,
          error: "Email não cadastrado!",
        });

      req.user = user;

      next();
    } catch (error) {
      console.error(error);
    }
  },
  async reset(req, res, next) {
    try {
      const { email, password, passwordRepeat, token } = req.body;

      const user = await User.findOne({
        where: { email },
      });

      if (!user)
        return res.render("session/reset-password.njk", {
          token,
          user: req.body,
          error: "Usuário não cadastrado!",
        });

      if (password !== passwordRepeat)
        return res.render("session/reset-password.njk", {
          token,
          user: req.body,
          error: "Senhas não correspondentes!",
        });

      if (token != user.reset_token)
        return res.render("session/reset-password.njk", {
          token,
          user: req.body,
          error: "Token inválido! Solicite uma nova recuperação de senha.",
        });

      let now = new Date();
      now = now.setHours(now.getHours());

      if (now > user.reset_token_expires)
        return res.render("session/reset-password.njk", {
          token,
          user: req.body,
          error: "Token expirado! Solicite uma nova recuperação de senha.",
        });

      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      return res.render("session/reset-password.njk", {
        token,
        user: req.body,
        error: "Erro inesperado, tente novamente!",
      });
    }
  },
};
