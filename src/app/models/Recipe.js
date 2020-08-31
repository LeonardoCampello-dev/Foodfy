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
            title,
            ingredients,
            preparation,
            information,
            created_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        `

        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
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
    findBy(filter) {
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
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5)
        WHERE id = $6
        `

        const values = [
            data.chef,
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
    },
    files(id) {
        try {
            const query = `
            SELECT files.*
            FROM files
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
            WHERE recipe_files.recipe_id = $1
            `

            return db.query(query, [id])

        } catch (error) {
            console.error(error)
        }
    },
    recipeFiles(id) {
        const subquery = `(   
            SELECT files.path
            FROM FILES
            LEFT JOIN recipe_files ON (files.id = recipe.files.file_id)
            WHERE recipe_files.recipe_id = $1
            LIMIT 1
        )
        `
        
        const query = `
        SELECT *, ${subquery}
        FROM recipes
        LEFT JOIN recipe_files ON (recipes.id = recipe_files.recipe_id)  
        WHERE recipes.id = $1
        LIMIT 1
        `

        return db.query(query, [id])
    }
}
