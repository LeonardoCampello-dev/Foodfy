const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UsersController = require('../app/controllers/UsersController')

const UserValidator = require('../app/validators/user')

// // Login - Logout

// routes.get('/login', SessionController.loginForm)
// routes.post('/login', SessionController.login)
// routes.post('/logout', SessionController.logout)

// // Reset password - Forgot

// routes.get('/forgot-password', SessionController.forgotForm)
// routes.get('/reset-password', SessionController.resetForm)
// routes.post('/forgot-password', SessionController.forgot)
// routes.post('/reset-password', SessionController.reset)

// // Users

// routes.get('/profile', UsersController.profile)
// routes.get('/', UserController.list)

routes.get('/register', UsersController.create)
routes.post('/register', UserValidator.post, UsersController.post)

// routes.get('/:id', UserController.show)
// routes.put('/', UserController.put)
// routes.delete('/', UserController.delete)

module.exports = routes
