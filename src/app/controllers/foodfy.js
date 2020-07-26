const Foodfy = require('../models/Foodfy')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    index(req, res) {
        Recipe.all(recipes => {
            return res.render("foodfy/index", { recipes })
        })
    },
    about(req, res) {
        return res.render("foodfy/about")
    },
    recipes(req, res) {
        Recipe.all(recipes => {
            return res.render("foodfy/recipes", { recipes })
        })
    },
    recipeDetails(req, res) {
        Recipe.find(req.params.id, recipe => {
            return res.render("foodfy/details/recipe", { recipe })
        })
    },
    chefs(req, res) {
        Chef.all(chefs => {
            return res.render("foodfy/chefs", { chefs })
        })
    }
}