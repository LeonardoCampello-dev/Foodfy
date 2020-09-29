const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        try {
            let { page, limit } = req.query

            page = page || 1
            limit = limit || 10
            offset = limit * (page - 1)

            params = {
                page,
                limit,
                offset
            }

            let recipes = await Recipe.paginate(params)

            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page
            }

            if (!recipes) return res.send('Receitas não encontradas')

            async function getImage(recipeId) {
                let results = await Recipe.recipeFiles(recipeId)
                results = results.map(recipe => `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`)

                return results[0]
            }

            const recipesPromises = recipes.map(async recipe => {
                recipe.image = await getImage(recipe.id)

                return recipe
            })

            const recipesFixed = await Promise.all(recipesPromises)

            return res.render('admin/recipes/index.njk', {
                recipes: recipesFixed,
                pagination,
                success: req.query.success
            })
        } catch (error) {
            console.error(error)
        }
    },
    async create(req, res) {
        try {
            let chefSelectOptions = await Recipe.chefSelectOptions()

            return res.render('admin/recipes/create.njk', { chefSelectOptions })
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == '' && key != 'id') return res.render('admin/recipes/create.njk', {
                    error: 'Por favor, preencha todos os campos!'
                })
            }

            let recipeId = await Recipe.create(req.body)

            const filesPromises = req.files.map(file =>
                File.createRecipeFiles({ ...file, recipe_id: recipeId }))
            await Promise.all(filesPromises)

            res.redirect(`/admin/recipes/${recipeId}?success=Receitada criada!`)
        } catch (error) {
            console.error(error)
            return res.render('admin/recipes/create.njk', {
                error: 'Erro ao criar receita!'
            })
        }
    },
    async show(req, res) {
        let recipe = await Recipe.find(req.params.id)

        if (!recipe) return res.send('Receita não encontrada')

        results = await Recipe.files(recipe.id)
        files = results.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return res.render('admin/recipes/show.njk', {
            recipe,
            files,
            success: req.query.success
        })
    },
    async edit(req, res) {
        try {
            let recipe = await Recipe.find(req.params.id)

            if (!recipe) return res.render('admin/recipes/edit.njk', {
                error: 'Receita não encontrada!'
            })

            chefSelectOptions = await Recipe.chefSelectOptions()

            results = await Recipe.files(recipe.id)
            let files = results

            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('admin/recipes/edit.njk', { recipe, chefSelectOptions, files })
        } catch (error) {
            console.error(error)
        }
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
                const newFilePromises = req.files.map(file =>
                    File.createRecipeFiles({ ...file, recipe_id: req.body.id }))

                await Promise.all(newFilePromises)
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromises = removedFiles.map(id => File.delete(id))

                await Promise.all(removedFilesPromises)
            }

            await Recipe.update(req.body)

            return res.redirect(`/admin/recipes/${req.body.id}?success=Receita atualizada!`)
        } catch (error) {
            console.error(error)
            return res.render('admin/recipes/edit.njk', {
                error: 'Erro ao atualizar receita!'
            })
        }
    },
    async delete(req, res) {
        try {
            await Recipe.delete(req.body.id)

            return res.redirect('/admin/recipes?success=Receita removida!')
        } catch (error) {
            console.error(error)
            return res.render('admin/recipes/edit.njk', {
                error: 'Erro ao deletar receita!'
            })
        }
    }
}