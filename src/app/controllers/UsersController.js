const User = require('../models/User')
const mailer = require('../../libs/mailer')

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
            const userId = await User.create(req.body)
            const user = await User.findOne({
                where: { id: userId }
            })

            await mailer.sendMail({
                from: 'admin@foodfy.com.br',
                to: user.email,
                subject: 'Bem vindo ao Foodfy 🍕',
                html: `
                <h2>Olá, estamos felizes que agora você faz parte do time Foodfy! 😁</h2>

                <p>Você está recebendo sua senha de acesso à plataforma, ela é temporária e você pode alterá-la em seu perfil.</p>

                <h4>Sua senha: ${user.password} 🔑</h4>

                <p>
                    <a href="http://localhost:3000/admin/users/login" target="_blank">
                        Faça já seu login e desbrave o mundo das receitas!
                    </a>
                </p>
                `
            })

            return res.redirect('/admin/users')
        } catch (error) {
            console.error(error)
            return res.render('admin/users/create.njk', {
                user: req.body,
                error: 'Erro ao criar usuário!'
            })
        }
    },
}