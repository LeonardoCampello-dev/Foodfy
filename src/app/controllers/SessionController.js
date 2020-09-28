const User = require('../models/User')

module.exports = {
    loginForm(req, res) {
        return res.render('session/login.njk')
    },
    login(req, res) {
        req.session.userId = req.user.id
        req.session.isAdmin = req.user.is_admin

        return res.redirect('/admin/users/profile')
    },
    logout(req, res) {
        req.session.destroy()

        return res.redirect('/')
    },
    forgotForm(req, res) {
        return res.render('session/forgot-password.njk')
    },
    resetForm(req, res) {
        return res.render('session/reset-password.njk')
    }
}