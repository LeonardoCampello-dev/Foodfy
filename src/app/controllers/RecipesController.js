const Home = require('../models/Home')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
    index(req, res) {
        let { page, limit } = req.query

        page = page || 1
        limit = limit || 8
        offset = limit * (page - 1)

        params = {
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }

                return res.render('admin/recipes/index.njk', { recipes, pagination })
            }
        }

        Home.paginate(params)
    },
    async create(req, res) {
        let results = await Recipe.chefSelectOptions()
        const chefSelectOptions = results.rows

        return res.render('admin/recipes/create.njk', { chefSelectOptions })
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == '' && key != 'id') return res.send('Por favor, preencha todos os campos.')
            }

            let results = await Recipe.create(req.body)
            const recipeId = results.rows[0].id

            const filesPromises = req.files.map(file =>
                File.createRecipeFiles({ ...file, recipe_id: recipeId }))
            await Promise.all(filesPromises)

            res.redirect(`/admin/recipes/${recipeId}`)
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send('Receita não encontrada')

        results = await Recipe.files(recipe.id)
        files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return res.render('admin/recipes/show.njk', { recipe, files })
    },
    async edit(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send('Receita não encontrada')

        // get chefs
        results = await Recipe.chefSelectOptions()
        const chefSelectOptions = results.rows

        // get files
        results = await Recipe.files(recipe.id)
        let files = results.rows

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return res.render('admin/recipes/edit.njk', { recipe, chefSelectOptions, files })
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

            return res.redirect(`/admin/recipes/${req.body.id}`)
        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        try {
            let results = await Recipe.delete(req.body.id)

            return res.redirect('/admin/recipes.njk')
        } catch (error) {
            console.error(error)
        }
    }
}