const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UsersController = require('../app/controllers/UsersController')

const UserValidator = require('../app/validators/user')
const { onlyUsers, isLoggedRedirectToList, isAdmin, ifAdmin } = require('../app/middlewares/session')

// // Login - Logout

routes.get('/login', isLoggedRedirectToList, SessionController.loginForm)
// routes.post('/login', SessionController.login)
routes.post('/logout', SessionController.logout)

// // Reset password - Forgot

routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/reset-password', SessionController.resetForm)
// routes.post('/forgot-password', SessionController.forgot)
// routes.post('/reset-password', SessionController.reset)

// // Users

// routes.get('/profile', UsersController.profile)
routes.get('/', onlyUsers, UsersController.list)

routes.get('/register', onlyUsers, isAdmin, UsersController.create)
routes.post('/register', UserValidator.post, UsersController.post)

routes.get('/:id', UserValidator.show, isAdmin, UsersController.show)
// routes.put('/', UsersController.put)
// routes.delete('/', UsersController.delete)

module.exports = routes
