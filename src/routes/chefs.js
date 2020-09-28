const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')

const ChefsController = require('../app/controllers/ChefsController')

const { onlyUsers, isAdmin } = require('../app/middlewares/session')

routes.get('/', onlyUsers, ChefsController.index)
routes.get('/create', onlyUsers, isAdmin, ChefsController.create)
routes.get('/:id', onlyUsers, ChefsController.show)
routes.get('/:id/edit', onlyUsers, isAdmin, ChefsController.edit)

routes.post('/', multer.array('photos', 1), ChefsController.post)
routes.put('/', multer.array('photos', 1), ChefsController.put)
routes.delete('/', isAdmin, ChefsController.delete)

module.exports = routes
