const Chef = require('../models/Chef')
const File = require('../models/File')
const db = require('../../config/db')
const Recipe = require('../models/Recipe')

module.exports = {
    index(req, res) {
        let { page, limit } = req.query

        page = page || 1
        limit = limit || 6
        offset = limit * (page - 1)

        params = {
            page,
            limit,
            offset,
            callback(chefs) {
                const pagination = {
                    total: Math.ceil(chefs[0].total / limit),
                    page
                }

                return res.render('admin/chefs/index.njk', { chefs, pagination })
            }
        }

        Chef.paginate(params)
    },
    create(req, res) {
        return res.render('admin/chefs/create.njk')
    },
    async post(req, res) {
        try {
            if (req.files.length == 0) return res.send('Por favor, insira uma imagem.')

            const filePromise = req.files.map(file => File.create({ ...file }))
            let results = await filePromise[0]
            const fileId = results.rows[0].id

            results = await Chef.create(req.body, fileId)
            const chefId = results.rows[0].id

            return res.redirect(`admin/chefs/${chefId}`)
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {
        const chefId = req.params.id

        let results = await Chef.find(chefId)
        const chef = results.rows[0]

        if (!chef) return res.send('Chefe não encontrado')

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
    },
    async edit(req, res) {
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if (!chef) return res.send('Chefe não encontrado')

        let avatar = await Chef.files(chef.file_id)

        avatar = avatar.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return res.render('admin/chefs/edit.njk', { chef, avatar })
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == '' && key != 'removed_files') {
                    return res.send('Por favor, preencha todos os campos.')
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

            let results = await Chef.update(req.body, file_id)

            return res.redirect(`/admin/chefs/${req.body.id}`)
        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        let results = await Chef.delete(req.body.id)

        return res.redirect('/admin/chefs')
    },
}

