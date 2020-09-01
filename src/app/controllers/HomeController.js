const Site = require('../models/Home')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    async home(req, res) {
        const recipes = await Recipe.all()

        if (!recipes) return res.send('Receitas não encontradas')

        async function getImage(recipeId) {
            let results = await Recipe.recipeFiles(recipeId) 
            results = results.map(recipe => `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`)

            return results[0]
        }

        const recipesPromises = recipes.map(async recipe => {
            recipe.image = await getImage(recipe.id)

            return recipe
        })

        const recipeFixed = await Promise.all(recipesPromises)

        return res.render('site/index.njk', { recipes: recipeFixed })
    },
    about(req, res) {
        return res.render('site/about.njk')
    },
    async recipes(req, res) {
        let { page, limit, filter } = req.query

        page = page || 1
        limit = limit || 6
        offset = limit * (page - 1)

        params = {
            page,
            limit,
            offset
        }

        let recipes = await Recipe.paginate(params)

        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }

        if (!recipes) return res.send('Receitas não encontradas')
        
        async function getImage(recipeId) {
            let results = await Recipe.recipeFiles(recipeId)
            results = results.map(recipe => `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`)

            return results[0]
        }

        const recipesPromises = recipes.map(async recipe => {
            recipe.image = await getImage(recipe.id)

            return recipe
        })

        const recipesFixed = await Promise.all(recipesPromises)

        return res.render('site/recipes.njk', { recipes: recipesFixed, pagination, filter })
    },
    async recipeDetails(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send('Receita não encontrada')

        results = await Recipe.files(recipe.id)
        files = results.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return res.render('site/details/recipe.njk', { recipe, files })
    },
    async chefs(req, res) {
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
            let results = await Chef.getAvatar(chefId)

            return results.path
        }

        const chefsPromises = chefs.map(async chef => {
            chef.image = await getImage(chef.id)
            chef.image = `${req.protocol}://${req.headers.host}${chef.image.replace('public', '')}`

            return chef
        })

        const chefAvatar = await Promise.all(chefsPromises)

        return res.render('site/chefs.njk', { chefs: chefAvatar, pagination })
    },
    async chefDetails(req, res) {
        const chefId = req.params.id

        let results = await Chef.find(chefId)
        const chef = results.rows[0]

        if (!chef) return res.send('Chefe não encontrado')

        const chefRecipes = await Chef.findChefRecipes(chefId)
        const thereIsRecipe = chefRecipes[0].id

        if (thereIsRecipe != null) {
            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId)
                return results[0].path
            }

            const recipesPromises = chefRecipes.map(async recipe => {
                recipe.image = await getImage(recipe.id)
                recipe.image = `${req.protocol}://${req.headers.host}${recipe.image.replace('public', '')}`

                return recipe
            })

            recipes = await Promise.all(recipesPromises)
        }

        chefAvatar = await Chef.getAvatar(chefId)
        chefAvatar.path = `${req.protocol}://${req.headers.host}${chefAvatar.path.replace('public', '')}`

        return res.render('site/details/chef.njk', { chef, recipes, chefAvatar })
    },
    async showResults(req, res) {
        const { filter } = req.query

        let results = await Recipe.findBy(filter)
        const recipes = results.rows

        return res.render('site/results.njk', { filter, recipes })
    }
}