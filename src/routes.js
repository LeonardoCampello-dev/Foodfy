const express = require('express')
const { Router } = require('express')

const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')

const data = require('../data.json')

const routes = express.Router()

routes.get("/", (req, res) => {
    return res.render("foodfy/index", { recipes: data.recipes })
})

routes.get("/about", (req, res) => {
    return res.render("foodfy/about")
})

routes.get("/recipes", (req, res) => {
    return res.render("foodfy/recipes", { recipes: data.recipes })
})

routes.get("/recipes/:id", (req, res) => {
    const { id } = req.params

    const foundRecipe = data.recipes.find((recipe) => {
        return recipe.id == id
    })

    if (!foundRecipe) return res.send("Recipe not found!")

    return res.render("foodfy/details", { recipe: foundRecipe })
})


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