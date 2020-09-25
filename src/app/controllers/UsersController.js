const User = require('../models/User')

module.exports = {
    async list(req, res) {
        const users = await User.all()

        return res.render('admin/users/index.njk', { users })
    },
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