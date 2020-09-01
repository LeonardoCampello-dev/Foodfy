const Site = require('../models/Home')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    async index(req, res) {
        const { filter } = req.query

        if (filter) {
            return res.redirect('/results')
        } else {
            let results = await Recipe.all()
            const recipes = results.rows

            return res.render('site/index.njk', { recipes })
        }
    },
    about(req, res) {
        return res.render('site/about.njk')
    },
    recipes(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 9
        offset = limit * (page - 1)

        params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }

                return res.render('site/recipes.njk', { recipes, filter, pagination })
            }
        }

        Site.paginate(params)
    },
    async recipeDetails(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send('Receita não encontrada')

        results = await Recipe.files(recipe.id)
        files = results.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return res.render('site/details/recipe.njk', { recipe, files })
    },
    chefs(req, res) {
        let { page, limit } = req.query

        page = page || 1
        limit = limit || 9
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

                return res.render('site/chefs.njk', { chefs, pagination })
            }
        }

        Chef.paginate(params)
    },
    async chefDetails(req, res) {
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

        return res.render('site/details/chef.njk', { chef, recipes, chefAvatar })
    },
    async showResults(req, res) {
        const { filter } = req.query

        let results = await Recipe.findBy(filter)
        const recipes = results.rows

        return res.render('site/results.njk', { filter, recipes })
    }
}