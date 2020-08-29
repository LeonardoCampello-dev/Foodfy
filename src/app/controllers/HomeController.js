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

        return res.render('site/details/recipe.njk', { recipe })

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
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]
        const recipes = results.rows
        const totalRecipes = results.rowCount

        if (!chef) return res.send('Chefe não encontrado')

        return res.render('site/details/chef', { chef, recipes, totalRecipes })
    },
    async showResults(req, res) {
        const { filter } = req.query

        let results = await Recipe.findBy(filter)
        const recipes = results.rows

        return res.render('site/results.njk', { filter, recipes })
    }
}