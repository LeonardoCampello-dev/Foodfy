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
        Recipe.all(recipes => {
            return res.render("site/recipes", { recipes })
        })
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