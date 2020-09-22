const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

const users = require('./users')
const chefs = require('./chefs')
const recipes = require('./recipes')

routes.use('/admin/users', users)
routes.use('/admin/chefs', chefs)
routes.use('/admin/recipes', recipes)

// Home routes 
routes.get('/', HomeController.home)
routes.get('/about', HomeController.about)
routes.get('/recipes', HomeController.recipes)
routes.get('/recipes/:id', HomeController.recipeDetails)
routes.get('/chefs', HomeController.chefs)
routes.get('/chefs/:id', HomeController.chefDetails)
routes.get('/results', HomeController.showResults)

module.exports = routes