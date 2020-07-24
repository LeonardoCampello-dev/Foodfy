const express = require('express')
const { Router } = require('express')
const admin = require('./app/controllers/admin')

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


routes.get("/admin/recipes", admin.index)
routes.get("/admin/recipes/create", admin.create)
routes.get("/admin/recipes/:id", admin.show)
routes.get("/admin/recipes/:id/edit", admin.edit)

routes.post("/admin/recipes", admin.post)
routes.put("/admin/recipes", admin.put)
routes.delete("/admin/recipes", admin.delete)

module.exports = routes