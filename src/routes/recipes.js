const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')

const RecipesController = require('../app/controllers/RecipesController')

const { onlyUsers, isTheOwner } = require('../app/middlewares/session')

routes.get('/', onlyUsers, RecipesController.index)
routes.get('/create', onlyUsers, RecipesController.create)
routes.get('/:id', onlyUsers, RecipesController.show)
routes.get('/:id/edit', onlyUsers, isTheOwner, RecipesController.edit)

routes.post('/', multer.array('photos', 5), RecipesController.post)
routes.put('/', multer.array('photos', 5), RecipesController.put)
routes.delete('/', RecipesController.delete)

module.exports = routes
