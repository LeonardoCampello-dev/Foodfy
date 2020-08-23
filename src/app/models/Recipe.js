const { date } = require('../../libs/utils')
const db = require('../../config/db')

module.exports = {
    all() {
        const query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY title ASC
        `

        return db.query(query)
    },
    create(data) {
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
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso,
        ]

        return db.query(query, values)
    },
    find(id) {
        const query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        `

        return db.query(query, [id])
    },
    findBy(filter, callback) {
        const query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY recipes.title
        `

        return db.query(query)
    },
    update(data) {
        const query = `
        UPDATE recipes SET
            chef_id=($1),
            image=($2),
            title=($3),
            ingredients=($4),
            preparation=($5),
            information=($6)
        WHERE id = $7
        `

        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    },
    chefSelectOptions() {
        return db.query(`SELECT name, id FROM chefs`)
    }
}
