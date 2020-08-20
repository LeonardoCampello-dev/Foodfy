const Site = require('../models/Site')
const Recipe = require('../models/Recipe')

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

                return res.render("admin/recipes/index", { recipes, pagination })
            }
        }

        Site.paginate(params)
    },
    async create(req, res) {
        let results = await Recipe.chefSelectOptions()
        const chefSelectOptions = results.rows

        return res.render("admin/recipes/create", { chefSelectOptions })
    },
    async post(req, res) {
        try {
            let results = await Recipe.create(req.body)
            const recipeId = results.rows[0].id

            return res.redirect(`/admin/recipes/${recipeId}`)

        } catch (error) {
            throw new Error(error)
        }
    },
    async show(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send("Receita não encontrada")

        return res.render("admin/recipes/show", { recipe })
    },
    async edit(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send("Receita não encontrada")

        results = await Recipe.chefSelectOptions()
        const chefSelectOptions = results.rows

        return res.render("admin/recipes/edit", { recipe, chefSelectOptions })
    },
    async put(req, res) {
        let results = await Recipe.update(req.body)

        return res.redirect(`/admin/recipes/${req.body.id}`)
    },
    async delete(req, res) {
        let results = await Recipe.delete(req.body.id)

        return res.redirect("/admin/recipes")
    }
}