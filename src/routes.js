const express = require('express')
const { Router } = require('express')
const multer = require('./app/middlewares/multer')

const HomeController = require('./app/controllers/HomeController')
const RecipesController = require('./app/controllers/RecipesController')
const ChefsController = require('./app/controllers/ChefsController')

const routes = express.Router()

routes.get('/', HomeController.home)
routes.get('/about', HomeController.about)
routes.get('/recipes', HomeController.recipes)
routes.get('/recipes/:id', HomeController.recipeDetails)
routes.get('/chefs', HomeController.chefs)
routes.get('/chefs/:id', HomeController.chefDetails)
routes.get('/results', HomeController.showResults)


// admin RecipesController

routes.get('/admin/recipes', RecipesController.index)
routes.get('/admin/recipes/create', RecipesController.create)
routes.get('/admin/recipes/:id', RecipesController.show)
routes.get('/admin/recipes/:id/edit', RecipesController.edit)

routes.post('/admin/recipes', multer.array('photos', 5), RecipesController.post)
routes.put('/admin/recipes', multer.array('photos', 5), RecipesController.put)
routes.delete('/admin/recipes', RecipesController.delete)

// admin ChefsController

routes.get('/admin/chefs', ChefsController.index)
routes.get('/admin/chefs', ChefsController.create)
routes.get('/admin/chefs/:id', ChefsController.show)
routes.get('/admin/chefs/:id/edit', ChefsController.edit)

routes.post('/admin/chefs', multer.array('photos', 1), ChefsController.post)
routes.put('/admin/chefs', multer.array('photos', 1), ChefsController.put)
routes.delete('/admin/chefs', ChefsController.delete)


module.exports = routes