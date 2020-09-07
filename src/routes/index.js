const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

const recipes = require('./recipes')
const chefs = require('./chefs')

routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)

// Home routes 
routes.get('/', HomeController.home)
routes.get('/about', HomeController.about)
routes.get('/recipes', HomeController.recipes)
routes.get('/recipes/:id', HomeController.recipeDetails)
routes.get('/chefs', HomeController.chefs)
routes.get('/chefs/:id', HomeController.chefDetails)
routes.get('/results', HomeController.showResults)

module.exports = routes