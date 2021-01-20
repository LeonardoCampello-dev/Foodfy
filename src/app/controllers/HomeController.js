const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");

module.exports = {
  async home(req, res) {
    try {
      const allRecipes = await Recipe.findAllRecipes();

      const recipes = allRecipes.filter((recipe, index) =>
        index > 5 ? false : true
      );

      if (!recipes) return res.send("Receitas não encontradas!");

      async function getImage(recipeId) {
        let results = await Recipe.recipeFiles(recipeId);
        results = results.map(
          (recipe) =>
            `${req.protocol}://${req.headers.host}${recipe.path.replace(
              "public",
              ""
            )}`
        );

        return results[0];
      }

      const recipesPromises = recipes.map(async (recipe) => {
        recipe.image = await getImage(recipe.id);

        return recipe;
      });

      const recipesFixed = await Promise.all(recipesPromises);

      return res.render("site/index.njk", {
        recipes: recipesFixed,
        error: req.query.error,
      });
    } catch (error) {
      console.error(error);
    }
  },
  about(req, res) {
    return res.render("site/about.njk", { error: req.query.error });
  },
  async recipes(req, res) {
    try {
      let { page, limit, filter } = req.query;

      page = page || 1;
      limit = limit || 6;
      offset = limit * (page - 1);

      params = {
        page,
        limit,
        offset,
      };

      let recipes = await Recipe.paginate(params);

      const pagination = {
        total: Math.ceil(recipes[0].total / limit),
        page,
      };

      if (!recipes) return res.send("Receitas não encontradas");

      async function getImage(recipeId) {
        let results = await Recipe.recipeFiles(recipeId);
        results = results.map(
          (recipe) =>
            `${req.protocol}://${req.headers.host}${recipe.path.replace(
              "public",
              ""
            )}`
        );

        return results[0];
      }

      const recipesPromises = recipes.map(async (recipe) => {
        recipe.image = await getImage(recipe.id);

        return recipe;
      });

      const formattedRecipes = await Promise.all(recipesPromises);

      return res.render("site/recipes.njk", {
        recipes: formattedRecipes,
        pagination,
        filter,
        error: req.query.error,
      });
    } catch (error) {
      console.error(error);
    }
  },
  async recipeDetails(req, res) {
    try {
      let recipe = await Recipe.find(req.params.id);

      if (!recipe) return res.send("Receita não encontrada");

      let results = await Recipe.files(recipe.id);

      recipe.files = results.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      }));

      return res.render("site/details/recipe.njk", {
        recipe,
        error: req.query.error,
      });
    } catch (error) {
      console.error(error);
    }
  },
  async chefs(req, res) {
    try {
      let { page, limit } = req.query;

      page = page || 1;
      limit = limit || 6;
      offset = limit * (page - 1);

      const params = {
        page,
        limit,
        offset,
      };

      const chefs = await Chef.paginate(params);

      const pagination = {
        total: Math.ceil(chefs[0].total / limit),
        page,
      };

      if (!chefs) return res.send("Chefes não encontrados");

      async function getImage(chefId) {
        const results = await Chef.getAvatar(chefId);

        return results.path;
      }

      const chefsPromises = chefs.map(async (chef) => {
        chef.image = await getImage(chef.id);
        chef.image = `${req.protocol}://${req.headers.host}${chef.image.replace(
          "public",
          ""
        )}`;

        return chef;
      });

      const formattedChefs = await Promise.all(chefsPromises);

      return res.render("site/chefs.njk", {
        chefs: formattedChefs,
        pagination,
        error: req.query.error,
      });
    } catch (error) {
      console.error(error);
    }
  },
  async chefDetails(req, res) {
    try {
      const chefId = req.params.id;

      let chef = await Chef.find(chefId);

      if (!chef) return res.send("Chefe não encontrado");

      chef.recipes = await Chef.findChefRecipes(chefId);
      const thereIsRecipe = chef.recipes[0].id;

      if (thereIsRecipe) {
        async function getImage(recipeId) {
          const results = await Recipe.files(recipeId);

          return results[0].path;
        }

        const recipesPromises = chef.recipes.map(async (recipe) => {
          recipe.image = await getImage(recipe.id);
          recipe.image = `${req.protocol}://${
            req.headers.host
          }${recipe.image.replace("public", "")}`;

          return recipe;
        });

        recipes = await Promise.all(recipesPromises);
      }

      chef.avatar = await Chef.getAvatar(chefId);
      chef.avatar.path = `${req.protocol}://${
        req.headers.host
      }${chef.avatar.path.replace("public", "")}`;

      return res.render("site/details/chef.njk", {
        chef,
        error: req.query.error,
      });
    } catch (error) {
      console.error(error);
    }
  },
  async showResults(req, res) {
    try {
      const { filter } = req.query;

      if (!filter)
        return res.redirect(`${req.headers.referer}?error=Filtro vazio!`);

      let recipes = await Recipe.findBy(filter);

      async function getImage(recipeId) {
        let results = await Recipe.recipeFiles(recipeId);
        results = results.map(
          (recipe) =>
            `${req.protocol}://${req.headers.host}${recipe.path.replace(
              "public",
              ""
            )}`
        );

        return results[0];
      }

      const recipesPromises = recipes.map(async (recipe) => {
        recipe.image = await getImage(recipe.id);

        return recipe;
      });

      const formattedRecipes = await Promise.all(recipesPromises);

      return res.render("site/results.njk", {
        recipes: formattedRecipes,
        filter,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
