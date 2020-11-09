const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'recipes' })

module.exports = {
    ...Base,
    async find(id) {
        try {
            const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1
            `

            const results = await db.query(query, [id])

            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
    },
    async findBy(filter) {
        const query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY recipes.title
        `

        const results = await db.query(query)

        return results.rows
    },
    async chefSelectOptions() {
        try {
            const results = await db.query(`SELECT name, id FROM chefs`)

            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async files(id) {
        try {
            const query = `
            SELECT files.* FROM files
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
            WHERE recipe_files.recipe_id = $1
            `

            const results = await db.query(query, [id])

            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async recipeFiles(id) {
        try {
            const subquery = `(
                SELECT files.path FROM files
                LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
                WHERE recipe_files.recipe_id = $1
                LIMIT 1
                )
                `

            const query = `
                SELECT *, ${subquery} FROM recipes
                LEFT JOIN recipe_files ON (recipes.id = recipe_files.recipe_id)
                WHERE recipes.id = $1
                LIMIT 1
                `

            const results = await db.query(query, [id])

            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async paginate({ filter, limit, offset }) {
        try {
            let query = '',
                filterQuery = '',
                totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`

            if (filter) {
                filterQuery = `
                WHERE recipes.title ILIKE '%${filter}%'`

                totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
                ) AS total`
            }

            query = `
            SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${filterQuery}
            ORDER BY updated_at DESC
            LIMIT $1 OFFSET $2
            `

            const results = await db.query(query, [limit, offset])

            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async deleteDBfiles(id) {
        const query = `
        SELECT files.* FROM FILES
        LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.recipe_id = $1
        `

        const results = await db.query(query, [id])
        const files = results.rows

        files.map(async file => {
            await db.query(`DELETE FROM recipe_files WHERE recipe_files.file_id = $1`, [file.id])
            await db.query(`DELETE FROM files WHERE id = $1`, [file.id])
        })
    }
}
