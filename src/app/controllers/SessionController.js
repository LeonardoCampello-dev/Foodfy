const User = require('../models/User')

module.exports = {
    loginForm(req, res) {
        return res.render('session/login.njk')
    },
    forgotForm(req, res) {
        return res.render('session/forgot-password.njk')
    },
    resetForm(req, res) {
        return res.render('session/reset-password.njk')
    }
}