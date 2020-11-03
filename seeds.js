const faker = require('faker')
const { hash } = require('bcryptjs')

const Recipe = require('./src/app/models/Recipe')
const Chef = require('./src/app/models/Chef')
const User = require('./src/app/models/User')
const File = require('./src/app/models/File')
const Base = require('./src/app/models/Base')


let userIds = [],
    chefsIds = [],
    filesIds = [],
    recipesIds = []

const totalUsers = 6
const totalChefs = 4
const totalRecipes = 20
const totalFiles = totalRecipes + totalChefs

async function createUsers() {
    let users = []
    const password = await hash('@foodfy', 8)

    const trueOrFalse = [true, false]

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.findName(),
            email: faker.internet.email(),
            password,
            is_admin: trueOrFalse[Math.round(Math.random())]
        })
    }

    const usersPromises = await users.map(user => User.create(user))

    usersIds = await Promise.all(usersPromises)
}

async function createChefs() {
    let chefs = []

    for (let file_id = 1; chefs.length < totalChefs; file_id++) {
        chefs.push({
            name: faker.name.firstName(),
            file_id,
        })
    }

    const chefsPromises = await chefs.map(chef => Chef.create(chef))

    chefsIds = await Promise.all(chefsPromises)
}

async function createFiles() {
    let files = []

    while (files.length < totalFiles) {
        files.push({
            name: faker.name.title(),
            path: `/images/placeholder.png`
        })
    }

    const filesPromises = await files.map(file => File.create(file))

    filesIds = await Promise.all(filesPromises)
}

async function createRecipes() {
    let recipes = []

    while (recipes.length < totalRecipes) {
        recipes.push({
            chef_id: Math.ceil(Math.random() * totalChefs),
            user_id: Math.ceil(Math.random() * totalUsers),
            title: faker.name.title(),
            ingredients: `{${faker.lorem.paragraph(1).split(' ')}}`,
            preparation: `{${faker.lorem.paragraph(1).split(' ')}}`,
            information: faker.lorem.paragraph()
        })
    }

    const recipesPromises = await recipes.map(recipe => Recipe.create(recipe))

    recipesIds = await Promise.all(recipesPromises)
}

async function createRelationshipsRecipesAndFiles() {
    const relations = []

    let recipe_id = 0

    for (let file_id = totalChefs + 1; relations.length < totalRecipes; file_id++) {
        recipe_id++

        relations.push({
            recipe_id,
            file_id
        })
    }

    const relationshipsPromises = relations.map(relation => {
        Base.init({ table: 'recipe_files' })

        Base.create(relation)
    })

    await Promise.all(relationshipsPromises)
}

async function init() {
    await createUsers()
    await createFiles()
    await createChefs()
    await createRecipes()
    await createRelationshipsRecipesAndFiles()
}

init()

