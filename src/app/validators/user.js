const User = require("../models/User");

const { compare } = require("bcryptjs");

module.exports = {
  async post(req, res, next) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "" && key != "id") {
        return res.render("admin/users/create.njk", {
          user: req.body,
          error: "Por favor, preencha todos os campos!",
        });
      }
    }

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user)
      return res.render("admin/users/create.njk", {
        user: req.body,
        error: "Usuário já existe!",
      });

    next();
  },
  async show(req, res, next) {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id },
    });

    if (!user)
      return res.render("admin/users/show.njk", {
        error: "Usuário não encontrado!",
      });

    req.user = user;

    next();
  },
  async put(req, res, next) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.render("admin/users/edit.njk", {
          user: req.body,
          error: "Por favor, preencha todos os campos!",
        });
      }
    }

    const user = await User.findOne({
      where: { id: req.body.id },
    });

    req.user = user;

    next();
  },
  async profileValidator(req, res, next) {
    const { password } = req.body;

    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.render("admin/users/profile.njk", {
          user: req.body,
          error: "Senha obrigatória para atualizar o perfil!",
        });
      }
    }

    const user = await User.findOne({
      where: { id: req.body.id },
    });

    const passed = await compare(password, user.password);

    if (!passed)
      return res.render("admin/users/profile.njk", {
        user: req.body,
        error: "Senha incorreta!",
      });

    req.user = user;

    next();
  },
};
