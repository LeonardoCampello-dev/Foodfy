const { unlinkSync } = require('fs')

const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) {
        let { page, limit } = req.query

        page = page || 1
        limit = limit || 6
        offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset
        }

        const chefs = await Chef.paginate(params)

        const pagination = {
            total: Math.ceil(chefs[0].total / limit),
            page
        }

        if (!chefs) return res.send('Chefes não encontrados')

        async function getImage(chefId) {
            const results = await Chef.getAvatar(chefId)

            return results.path
        }

        const chefsPromises = chefs.map(async chef => {
            chef.image = await getImage(chef.id)
            chef.image = `${req.protocol}://${req.headers.host}${chef.image.replace('public', '')}`

            return chef
        })

        const formattedChefs = await Promise.all(chefsPromises)

        return res.render('admin/chefs/index.njk', {
            chefs: formattedChefs,
            pagination,
            success: req.query.success,
            error: req.query.error
        })
    },
    create(req, res) {
        return res.render('admin/chefs/create.njk')
    },
    async post(req, res) {
        try {
            const { files } = req

            const filesPromises = files.map(file => File.create({
                name: file.filename,
                path: `public/images/${file.filename}`
            }))

            const fileId = await Promise.all(filesPromises)

            const values = {
                name: req.body.name,
                file_id: JSON.parse(fileId)
            }

            chefId = await Chef.create(values)

            return res.redirect(`/admin/chefs/${chefId}?success=Chefe registrado!`)
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {
        try {
            const { id } = req.params

            let chef = await Chef.find(id)

            if (!chef) return res.render('admin/chefs/show.njk', {
                error: 'Chefe não encontrado!'
            })

            chef.recipes = await Chef.findChefRecipes(id)
            const thereIsRecipe = chef.recipes[0].id

            if (thereIsRecipe) {
                async function getImage(recipeId) {
                    const results = await Recipe.files(recipeId)
                    return results[0].path
                }

                const recipesPromises = chef.recipes.map(async recipe => {
                    recipe.image = await getImage(recipe.id)
                    recipe.image = `${req.protocol}://${req.headers.host}${recipe.image.replace('public', '')}`

                    return recipe
                })

                recipes = await Promise.all(recipesPromises)
            }

            chef.avatar = await Chef.getAvatar(id)
            chef.avatar.path = `${req.protocol}://${req.headers.host}${chef.avatar.path.replace('public', '')}`

            return res.render('admin/chefs/show.njk', {
                chef,
                success: req.query.success,
                error: req.query.error
            })
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        try {
            const { id } = req.params

            let chef = await Chef.find(id)

            if (!chef) return res.send('Chefe não encontrado')

            chef.avatar = await Chef.getAvatar(id)
            chef.avatar.path = `${req.protocol}://${req.headers.host}${chef.avatar.path.replace('public', '')}`

            return res.render('admin/chefs/edit.njk', { chef })
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            const { id } = req.body

            if (req.files.length != 0) {
                const { files } = req

                const newFilesPromises = files.map(file => File.create({
                    name: file.filename,
                    path: `public/images/${file.filename}`
                }))

                const fileId = await Promise.all(newFilesPromises)

                const values = {
                    name: req.body.name,
                    file_id: JSON.parse(fileId)
                }

                await Chef.update(id, values)

                return res.redirect(`/admin/chefs/${id}?success=Chefe atualizado!`)
            }

            const values = {
                name: req.body.name
            }

            await Chef.update(id, values)

            return res.redirect(`/admin/chefs/${id}?success=Chefe atualizado!`)
        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/edit.njk', {
                error: 'Erro ao atualizar o chefe!'
            })
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.body

            const chef = await Chef.find(id)
            const files = await Chef.files(chef.file_id)

            files.map(file => {
                try {
                    unlinkSync(file.path)
                } catch (error) {
                    console.error(error)
                }
            })

            await Chef.deleteDBfile(id)
            await Chef.delete(id)

            return res.redirect('/admin/chefs?success=Chefe removido!')
        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/edit.njk', {
                error: 'Erro ao deletar o chefe!'
            })
        }
    }
}

