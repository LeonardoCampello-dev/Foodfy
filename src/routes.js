const express = require('express')
const { Router } = require('express')
const multer = require('./app/middlewares/multer')

const site = require('./app/controllers/site')
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')

const routes = express.Router()

routes.get('/', site.index)
routes.get('/about', site.about)
routes.get('/recipes', site.recipes)
routes.get('/recipes/:id', site.recipeDetails)
routes.get('/chefs', site.chefs)
routes.get('/chefs/:id', site.chefDetails)
routes.get('/results', site.showResults)


// admin recipes

routes.get('/admin/recipes', recipes.index)
routes.get('/admin/recipes/create', recipes.create)
routes.get('/admin/recipes/:id', recipes.show)
routes.get('/admin/recipes/:id/edit', recipes.edit)

routes.post('/admin/recipes', multer.array('photos', 5), recipes.post)
routes.put('/admin/recipes', multer.array('photos', 5), recipes.put)
routes.delete('/admin/recipes', recipes.delete)

// admin chefs

routes.get('/admin/chefs', chefs.index)
routes.get('/admin/chefs/create', chefs.create)
routes.get('/admin/chefs/:id', chefs.show)
routes.get('/admin/chefs/:id/edit', chefs.edit)

routes.post('/admin/chefs', multer.array('photos', 1), chefs.post)
routes.put('/admin/chefs', multer.array('photos', 1), chefs.put)
routes.delete('/admin/chefs', chefs.delete)


module.exports = routes