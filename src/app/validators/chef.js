
module.exports = {
    async post(req, res, next) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == '' && key != 'id') return res.render('admin/chefs/create.njk', {
                error: 'Por favor, preencha todos os campos!'
            })
        }

        if (req.files.length == 0) res.render('admin/chefs/create.njk', {
            chef: req.body,
            error: 'Por favor, insira uma imagem!'
        })

        next()
    },
    async put(req, res, next) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == '' && key != 'removed_files') {
                return res.render('admin/chefs/edit.njk', {
                    error: 'Por favor, preencha todos os campos!'
                })
            }
        }

        next()
    }
}