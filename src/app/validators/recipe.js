module.exports = {
  async post(req, res, next) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "" && key != "id")
        return res.render("admin/recipes/create.njk", {
          error: "Por favor, preencha todos os campos!",
        });
    }

    next();
  },
  async put(req, res, next) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files") {
        return res.send("Por favor, preencha todos os campos.");
      }
    }

    next();
  },
};
