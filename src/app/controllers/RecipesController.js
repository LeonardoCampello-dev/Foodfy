const { unlinkSync } = require('fs')

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

            const formattedRecipes = await Promise.all(recipesPromises)

            return res.render('admin/recipes/index.njk', {
                recipes: formattedRecipes,
                pagination,
                success: req.query.success,
                error: req.query.error
            })
        } catch (error) {
            console.error(error)
        }
    },
    async create(req, res) {
        try {
            const chefSelectOptions = await Recipe.chefSelectOptions()

            return res.render('admin/recipes/create.njk', { chefSelectOptions })
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            const {
                chef,
                title,
                ingredients,
                preparation,
                information
            } = req.body

            let recipe_id = await Recipe.create({
                chef_id: chef,
                title,
                ingredients: `{${ingredients}}`,
                preparation: `{${preparation}}`,
                information,
                user_id: req.session.userId,
            })

            const filesPromises = req.files.map(file =>
                File.createRecipeFiles({ ...file, recipe_id }))
            await Promise.all(filesPromises)

            res.redirect(`/admin/recipes/${recipe_id}?success=Receitada criada!`)
        } catch (error) {
            console.error(error)

            const chefSelectOptions = await Recipe.chefSelectOptions()

            return res.render('admin/recipes/create.njk', {
                error: 'Erro ao criar receita!',
                chefSelectOptions
            })
        }
    },
    async show(req, res) {
        const { id } = req.params

        let recipe = await Recipe.findOne({
            where: { id }
        })

        if (!recipe) return res.send('Receita não encontrada')

        files = await Recipe.files(recipe.id)

        recipe.files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return res.render('admin/recipes/show.njk', {
            recipe,
            success: req.query.success,
            error: req.query.error
        })
    },
    async edit(req, res) {
        try {
            const { id } = req.params

            let recipe = await Recipe.find(id)

            if (!recipe) return res.render('admin/recipes/edit.njk', {
                error: 'Receita não encontrada!'
            })

            const chefSelectOptions = await Recipe.chefSelectOptions()

            let files = await Recipe.files(recipe.id)

            recipe.files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('admin/recipes/edit.njk', { recipe, chefSelectOptions })
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            const { id } = req.body

            if (req.files.length != 0) {
                const newFilePromises = req.files.map(file =>
                    File.createRecipeFiles({ ...file, recipe_id: id }))

                await Promise.all(newFilePromises)
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromises = removedFiles.map(id => File.delete(id))

                await Promise.all(removedFilesPromises)
            }

            const {
                chef,
                title,
                ingredients,
                preparation,
                information
            } = req.body

            await Recipe.update(id, {
                chef_id: chef,
                title,
                ingredients: `{${ingredients}}`,
                preparation: `{${preparation}}`,
                information,
            })

            return res.redirect(`/admin/recipes/${req.body.id}?success=Receita atualizada!`)
        } catch (error) {
            console.error(error)

            const chefSelectOptions = await Recipe.chefSelectOptions()

            return res.render('admin/recipes/edit.njk', {
                error: 'Erro ao atualizar receita!',
                chefSelectOptions
            })
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.body

            const files = await Recipe.files(id)

            files.map(file => {
                try {
                    unlinkSync(file.path)
                } catch (error) {
                    console.error(error)
                }
            })

            await Recipe.deleteDBfiles(id)
            await Recipe.delete(id)

            return res.redirect('/admin/recipes?success=Receita removida!')
        } catch (error) {
            console.error(error)
            return res.render('admin/recipes/edit.njk', {
                error: 'Erro ao deletar receita!'
            })
        }
    }
}