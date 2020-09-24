const User = require('../models/User')

module.exports = {
    create(req, res) {
        return res.render('admin/users/create.njk')
    },
    async post(req, res) {
        try {


        } catch (error) {
            console.error(error)
            return res.render('admin/users/create.njk', {
                user: req.body,
                error: 'Erro ao criar usuário!'
            })
        }
    },
}