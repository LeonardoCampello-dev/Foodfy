const { unlinkSync } = require('fs')

const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) {
        let { page, limit } = req.query

        page = page || 1
        limit = limit || 6
        offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset
        }

        const chefs = await Chef.paginate(params)

        const pagination = {
            total: Math.ceil(chefs[0].total / limit),
            page
        }

        if (!chefs) return res.send('Chefes não encontrados')

        async function getImage(chefId) {
            let results = await Chef.getAvatar(chefId)

            return results.path
        }

        const chefsPromises = chefs.map(async chef => {
            chef.image = await getImage(chef.id)
            chef.image = `${req.protocol}://${req.headers.host}${chef.image.replace('public', '')}`

            return chef
        })

        const chefAvatar = await Promise.all(chefsPromises)

        return res.render('admin/chefs/index.njk', {
            chefs: chefAvatar,
            pagination,
            success: req.query.success,
            error: req.query.error
        })
    },
    create(req, res) {
        return res.render('admin/chefs/create.njk')
    },
    async post(req, res) {
        try {
            const { files } = req

            const filesPromises = files.map(file => File.create({
                name: file.filename,
                path: `public/images/${file.filename}`
            }))

            const fileId = await Promise.all(filesPromises)

            const values = {
                name: req.body.name,
                file_id: JSON.parse(fileId)
            }

            chefId = await Chef.create(values)

            return res.redirect(`/admin/chefs/${chefId}?success=Chefe registrado!`)
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {
        try {
            const chefId = req.params.id

            let chef = await Chef.find(chefId)

            if (!chef) return res.render('admin/chefs/show.njk', {
                error: 'Chefe não encontrado!'
            })

            const chefRecipes = await Chef.findChefRecipes(chefId)
            const thereIsRecipe = chefRecipes[0].id

            if (thereIsRecipe != null) {
                async function getImage(recipeId) {
                    let results = await Recipe.files(recipeId)
                    return results[0].path
                }

                const recipesPromises = chefRecipes.map(async recipe => {
                    recipe.image = await getImage(recipe.id)
                    recipe.image = `${req.protocol}://${req.headers.host}${recipe.image.replace('public', '')}`

                    return recipe
                })

                recipes = await Promise.all(recipesPromises)
            }

            chefAvatar = await Chef.getAvatar(chefId)
            chefAvatar.path = `${req.protocol}://${req.headers.host}${chefAvatar.path.replace('public', '')}`

            return res.render('admin/chefs/show.njk', {
                chef,
                recipes,
                chefAvatar,
                success: req.query.success,
                error: req.query.error
            })
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        try {
            let chef = await Chef.find(req.params.id)

            if (!chef) return res.send('Chefe não encontrado')

            let avatar = await Chef.files(chef.file_id)

            avatar = avatar.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('admin/chefs/edit.njk', { chef, avatar })
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            if (req.files.length != 0) {
                const { files } = req

                const newFilesPromises = files.map(file => File.create({
                    name: file.filename,
                    path: `public/images/${file.filename}`
                }))

                const fileId = await Promise.all(newFilesPromises)

                const values = {
                    name: req.body.name,
                    file_id: JSON.parse(fileId)
                }

                await Chef.update(req.body.id, values)

                return res.redirect(`/admin/chefs/${req.body.id}?success=Chefe atualizado!`)
            }

            const values = {
                name: req.body.name
            }

            await Chef.update(req.body.id, values)

            return res.redirect(`/admin/chefs/${req.body.id}?success=Chefe atualizado!`)
        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/edit.njk', {
                error: 'Erro ao atualizar o chefe!'
            })
        }
    },
    async delete(req, res) {
        try {
            const chef = await Chef.find(req.body.id)

            const files = await Chef.files(chef.file_id)

            files.map(file => {
                try {
                    unlinkSync(file.path)
                } catch (error) {
                    console.error(error)
                }
            })

            await Chef.delete(req.body.id)

            return res.redirect('/admin/chefs?success=Chefe removido!')
        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/edit.njk', {
                error: 'Erro ao deletar o chefe!'
            })
        }
    }
}

