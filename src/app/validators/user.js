const User = require('../models/User')

module.exports = {
    async post(req, res, next) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == '' && key != 'id') {
                return res.render('admin/users/create.njk', {
                    user: req.body,
                    error: 'Por favor, preencha todos os campos!'
                })
            }
        }

        const { email } = req.body

        const user = await User.findOne({ where: { email } })

        if (user) return res.render('admin/users/create.njk', {
            user: req.body,
            error: 'Erro ao criar usuário!'
        })

        next()
    },
}