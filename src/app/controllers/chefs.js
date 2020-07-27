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

                return res.render("admin/chefs/index", { chefs, pagination })
            }
        }

        Chef.paginate(params)
    },
    create(req, res) {
        return res.render("admin/chefs/create")
    },
    post(req, res) {
        Chef.create(req.body, chef => {
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },
    show(req, res) {
        Chef.find(req.params.id, (chef, recipes, totalRecipes) => {
            if (!chef) return res.send('Chefe não encontrado')

            return res.render('admin/chefs/show', { chef, recipes, totalRecipes })
        })
    },
    edit(req, res) {
        Chef.find(req.params.id, chef => {
            if (!chef) return res.send("Chefe não encontrado")

            return res.render("admin/chefs/edit", { chef })
        })
    },
    put(req, res) {
        Chef.update(req.body, () => {
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    delete(req, res) {
        Chef.delete(req.body.id, () => {
            return res.redirect("/admin/chefs")
        })
    }
}

