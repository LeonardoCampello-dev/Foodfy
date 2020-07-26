const Site = require('../models/Site')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    index(req, res) {
        const { filter } = req.query

        if (filter) {
            return res.redirect("/results")
        } else {
            Recipe.all(recipes => {
                return res.render("site/index", { recipes })
            })
        }
    },
    about(req, res) {
        return res.render("site/about")
    },
    recipes(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 6
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

                return res.render("site/recipes", { recipes, filter, pagination })
            }
        }

        Site.paginate(params)
    },
    recipeDetails(req, res) {
        Recipe.find(req.params.id, recipe => {
            return res.render("site/details/recipe", { recipe })
        })
    },
    chefs(req, res) {
        Chef.all(chefs => {
            return res.render("site/chefs", { chefs })
        })
    },
    showResults(req, res) {
        const { filter } = req.query

        Recipe.findBy(filter, recipes => {
            return res.render("site/results", { filter, recipes })
        })
    }
}