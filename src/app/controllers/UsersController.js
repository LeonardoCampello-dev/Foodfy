const { unlinkSync } = require('fs')

const User = require('../models/User')
const Recipe = require('../models/Recipe')

const mailer = require('../../libs/mailer')

module.exports = {
    async profile(req, res) {
        try {
            const user = await User.findOne({
                where: { id: req.session.userId }
            })

            return res.render('admin/users/profile.njk', { user })
        } catch (error) {
            console.error(error)
        }
    },
    async list(req, res) {
        try {
            const users = await User.findAll()

            return res.render('admin/users/index.njk', {
                users,
                success: req.query.success
            })
        } catch (error) {
            console.error(error)
        }
    },
    create(req, res) {
        return res.render('admin/users/create.njk')
    },
    async post(req, res) {
        try {
            const {
                name,
                email,
                password,
                is_admin
            } = req.body

            const userId = await User.create({
                name,
                email,
                password,
                is_admin
            })

            req.session.userId = userId

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

            return res.redirect('/admin/users?success=Usuário registrado!')
        } catch (error) {
            console.error(error)
            return res.render('admin/users/create.njk', {
                user: req.body,
                error: 'Erro ao criar usuário!'
            })
        }
    },
    show(req, res) {
        try {
            const user = req.user

            return res.render('admin/users/edit.njk', {
                user,
                success: req.query.success
            })
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            const { user } = req
            const { name, email, is_admin } = req.body

            await User.update(user.id, {
                name,
                email,
                is_admin
            })

            return res.redirect('/admin/users?success=Usuário atualizado!')
        } catch (error) {
            console.error(error)
            return res.render('admin/users/edit.njk', {
                user: req.body,
                error: 'Erro ao atualizar o usuário!'
            })
        }
    },
    async delete(req, res) {
        try {
            const user_id = req.body.id

            const recipes = await Recipe.findAll({
                where: { user_id }
            })

            const allFilesPromises = recipes.map(recipe => Recipe.files(recipe.id))

            let promiseResults = await Promise.all(allFilesPromises)

            promiseResults.map(files => {
                files.map(file => {
                    try {
                        unlinkSync(file.path)
                    } catch (error) {
                        console.error(error)
                    }
                })
            })


            await User.delete(user_id)

            return res.redirect('/admin/users?success=Usuário removido!')
        } catch (error) {
            console.error(error)
            return res.render('admin/users/edit.njk', {
                user: req.body,
                error: 'Erro ao deletar o usuário!'
            })
        }
    }
}