const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')

const RecipesController = require('../app/controllers/RecipesController')

const { onlyUsers, isTheOwner } = require('../app/middlewares/session')
const Validator = require('../app/validators/recipe')

routes.get('/', onlyUsers, RecipesController.index)
routes.get('/create', onlyUsers, RecipesController.create)
routes.get('/:id', onlyUsers, RecipesController.show)
routes.get('/:id/edit', onlyUsers, isTheOwner, RecipesController.edit)

routes.post('/', multer.array('photos', 5), Validator.post, RecipesController.post)
routes.put('/', multer.array('photos', 5), Validator.put, RecipesController.put)
routes.delete('/', RecipesController.delete)

module.exports = routes
