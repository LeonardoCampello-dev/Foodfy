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

exports.edit = (req, res) => {
    const { id } = req.params

    const foundRecipe = data.recipes.find((recipe) => {
        return recipe.id == id
    })
    
    return res.render("admin/edit", { recipe: foundRecipe })
}

exports.put = (req, res) => {
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
}

exports.delete = (req, res) => {
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