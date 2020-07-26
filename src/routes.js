const express = require('express')
const { Router } = require('express')

const foodfy = require('./app/controllers/foodfy')
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')

const routes = express.Router()

routes.get("/", foodfy.index)
routes.get("/about", foodfy.about)
routes.get("/recipes", foodfy.recipes)
routes.get("/recipes/:id", foodfy.recipeDetails)
routes.get("/chefs", foodfy.chefs)


// admin recipes

routes.get("/admin/recipes", recipes.index)
routes.get("/admin/recipes/create", recipes.create)
routes.get("/admin/recipes/:id", recipes.show)
routes.get("/admin/recipes/:id/edit", recipes.edit)

routes.post("/admin/recipes", recipes.post)
routes.put("/admin/recipes", recipes.put)
routes.delete("/admin/recipes", recipes.delete)

// admin chefs

routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/create", chefs.create)
routes.get("/admin/chefs/:id", chefs.show)
routes.get("/admin/chefs/:id/edit", chefs.edit)

routes.post("/admin/chefs", chefs.post)
routes.put("/admin/chefs", chefs.put)
routes.delete("/admin/chefs", chefs.delete)


module.exports = routes