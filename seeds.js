const faker = require('faker')
const { hash } = require('bcryptjs')

const Recipe = require('./src/app/models/Recipe')
const Chef = require('./src/app/models/Chef')
const User = require('./src/app/models/User')
const File = require('./src/app/models/File')


let userIds = [],
    chefsIds = [],
    filesIds = [],
    recipesIds = []

const totalUsers = 6
const totalChefs = 4
const totalRecipes = 16

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
            name: faker.name.findName(),
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
            name: faker.image.image(),
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
            chef_id: Math.ceil(Math.random() * 4),
            user_id: userIds[Math.floor(Math.random() * totalUsers)],
            title: faker.name.title,
            ingredients: faker.lorem.paragraph(Math.ceil(Math.random() * 2)).split(' '),
            preparation: faker.lorem.paragraph(Math.ceil(Math.random() * 2)).split(' '),
            informatin: faker.lorem.paragraph(Math.ceil(Math.random() * 8))
        })
    }

    const recipesPromises = await recipes.map(recipe => Recipe.create(recipe))

    recipesIds = await Promise.all(recipesPromises)
}

async function init() {
    await createUsers()
    await createChefs()
    await createFiles()
    await createRecipes()
}

