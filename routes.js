const express = require('express')
const { Router } = require('express')

const data = require('./public/data')

const routes = express.Router()

routes.get("/", (req, res) => {
    return res.render("index", { recipes: data })
})

routes.get("/about", (req, res) => {
    return res.render("about")
})

routes.get("/recipes", (req, res) => {
    return res.render("recipes/recipes", { recipes: data })
})

routes.get("/recipes/:id", (req, res) => {
    const { id } = req.params

    const foundRecipe = data.find((recipe) => {
        return recipe.id == id
    })

    if (!foundRecipe) return res.send("Recipe not found!")

    return res.render("recipes/details", { recipe: foundRecipe })
})

module.exports = routes