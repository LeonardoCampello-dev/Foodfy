const Recipe = require('../models/Recipe')

module.exports = {
    index(req, res) {
        Recipe.all(recipes => {
            return res.render("admin/recipes/index", { recipes })
        })        
    },
    create(req, res) {
        Recipe.chefSelectOptions(options => {
            return res.render("admin/recipes/create", { chefSelectOptions: options })
        })        
    },
    post(req, res) {
        Recipe.create(req.body, recipe => {
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },
    show(req, res) {
        Recipe.find(req.params.id, recipe => {
            if (!recipe) return res.send("Receita não encontrada")

            return res.render("admin/recipes/show", { recipe })
        })        
    },
    edit(req, res) {
        Recipe.find(req.params.id, recipe => {
            if (!recipe) return res.send("Receita não encontrada")

            Recipe.chefSelectOptions(options => {
                return res.render("admin/recipes/edit", { recipe, chefSelectOptions: options })  
            })            
        })        
    },
    put(req, res) {
        Recipe.update(req.body, () => {
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },
    delete(req, res) {
        Recipe.delete(req.body.id, () => {
            return res.redirect("/admin/recipes")
        })
    }
}