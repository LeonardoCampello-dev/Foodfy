const fs = require('fs')
const data = require('../data')


exports.index = (req, res) => {
    return res.render("admin/index", { recipes: data.recipes })
}

exports.create = (req, res) => {
    return res.render("admin/create")
}

exports.post = (req, res) => {
    let id = 1

    const lastRecipe = data.recipes[data.recipes.length - 1]

    if (lastRecipe) {
        id = lastRecipe.id + 1  
    }
    
    data.recipes.push({
        id,
        ...req.body
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) return res.send("Write file error!")

        return res.redirect(`/admin/recipes/${id}`)
    })   

}

exports.show = (req, res) => {
    const { id } = req.params

    const foundRecipe = data.recipes.find((recipe) => {
        return recipe.id == id
    })

    if (!foundRecipe) return res.send("Recipe not found!")

    return res.render("admin/show", { recipe: foundRecipe })
}