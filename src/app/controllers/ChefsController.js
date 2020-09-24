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

        return res.render('admin/chefs/index.njk', { chefs: chefAvatar, pagination })
    },
    create(req, res) {
        return res.render('admin/chefs/create.njk')
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == '' && key != 'id') return res.render('admin/chefs/create.njk', {
                    error: 'Por favor, preencha todos os campos!'
                })
            }

            if (req.files.length == 0) res.render('admin/chefs/create.njk', {
                chef: req.body,
                error: 'Por favor, insira uma imagem!'
            })

            const filePromise = req.files.map(file => File.create({ ...file }))
            let results = await filePromise[0]
            const fileId = results.rows[0].id

            chefId = await Chef.create(req.body, fileId)

            return res.redirect(`admin/chefs/${chefId}`)
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

            return res.render('admin/chefs/show.njk', { chef, recipes, chefAvatar })
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
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == '' && key != 'removed_files') {
                    return res.render('admin/chefs/edit.njk', {
                        error: 'Por favor, preencha todos os campos!'
                    })
                }
            }

            if (req.files.length != 0) {
                const newFilePromise = req.files.map(file => File.create(file))

                const results = await newFilePromise[0]
                file_id = results.rows[0].id
            }

            if (req.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                await removedFiles.map(id => Chef.fileDelete(id))
            }

            await Chef.update(req.body, file_id)

            return res.redirect(`/admin/chefs/${req.body.id}`)
        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/edit.njk', {
                error: 'Erro ao atualizar o chefe!'
            })
        }
    },
    async delete(req, res) {
        try {
            await Chef.delete(req.body.id)

            return res.redirect('/admin/chefs')
        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/edit.njk', {
                error: 'Erro ao deletar o chefe!'
            })
        }
    },
}

