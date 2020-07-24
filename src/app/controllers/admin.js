const fs = require('fs')
const data = require('../../../data.json')
const { date } = require('../../libs/utils')
const db = require('../../config/db')

module.exports = {

    index(req, res) {
        return res.render("admin/index", { recipes: data.recipes })
    },
    create(req, res) {
        return res.render("admin/create")
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos!")
            }
        }

        const query = `
        INSERT INTO recipes (
            chef_id, 
            image,
            title,
            ingredients,
            preparation,
            information, 
            created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)

        RETURNING id
        `

        const values = [
            req.body.chef_id,
            req.body.image,
            req.body.title,
            req.body.ingredients,
            req.body.preparation,
            req.body.information,
            date(Date.now()).iso
        ]

        db.query(query, values, (err, results) => {
            if (err) throw `Database error! ${err}`

            return res.redirect(`/admin/recipes/${results.rows[0].id}`)
        })
    },
    show(req, res) {
        const { id } = req.params

        const foundRecipe = data.recipes.find((recipe) => {
            return recipe.id == id
        })

        if (!foundRecipe) return res.send("Recipe not found!")

        return res.render("admin/show", { recipe: foundRecipe })
    },
    edit(req, res) {
        const { id } = req.params

        const foundRecipe = data.recipes.find((recipe) => {
            return recipe.id == id
        })

        return res.render("admin/edit", { recipe: foundRecipe })
    },
    put(req, res) {
        const { id } = req.body
        let index = 0

        const foundRecipe = data.recipes.find((recipe, foundIndex) => {
            if (recipe.id == id) {
                index = foundIndex
                return true
            }
        })

        if (!foundRecipe) return res.send("Recipe not found!")

        const recipe = {
            ...foundRecipe,
            ...req.body,
            id: Number(req.body.id)
        }

        data.recipes[index] = recipe

        fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
            if (err) return res.send("Write file error!")
        })

        return res.redirect(`/admin/recipes/${id}`)
    },
    delete(req, res) {
        const { id } = req.body

        const filteredRecipes = data.recipes.filter((recipe) => {
            return recipe.id != id
        })

        data.recipes = filteredRecipes

        fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
            if (err) return res.send("Write file error!")
        })

        return res.redirect("/admin/recipes")
    }
}