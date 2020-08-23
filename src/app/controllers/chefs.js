const Chef = require('../models/Chef')

module.exports = {
    index(req, res) {
        let { page, limit } = req.query

        page = page || 1
        limit = limit || 6
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

                return res.render('admin/chefs/index.njk', { chefs, pagination })
            }
        }

        Chef.paginate(params)
    },
    create(req, res) {
        return res.render('admin/chefs/create.njk')
    },
    async post(req, res) {
        let results = await Chef.create(req.body)
        const chefId = results.rows[0].id

        return res.redirect(`/admin/chefs/${chefId}`)
    },
    async show(req, res) {
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]
        const recipes = results.rows
        const totalRecipes = results.rowCount

        if (!chef) return res.send('Chefe não encontrado')

        return res.render('admin/chefs/show.njk', { chef, recipes, totalRecipes })
    },
    async edit(req, res) {
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if (!chef) return res.send('Chefe não encontrado')

        return res.render('admin/chefs/edit.njk', { chef })
    },
    async put(req, res) {
        let results = await Chef.update(req.body)

        return res.redirect(`/admin/chefs/${req.body.id}`)
    },
    async delete(req, res) {
        let results = await Chef.delete(req.body.id)

        return res.redirect('/admin/chefs')
    }
}

