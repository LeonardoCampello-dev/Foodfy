const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'chefs' })

module.exports = {
    ...Base,
    async find(id) {
        try {
            const query = `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs 
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
            `

            const results = await db.query(query, [id])

            return results.rows[0]

        } catch (error) {
            console.error(error)
        }
    },
    async files(id) {
        try {
            const results = await db.query(`SELECT files.path FROM files WHERE files.id = $1 `, [id])
            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async findChefRecipes(id) {
        try {
            const query = `
            SELECT * FROM chefs 
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id) 
            WHERE chefs.id = $1
            `

            const results = await db.query(query, [id])

            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async getAvatar(id) {
        try {
            const query = `
            SELECT files.* FROM files 
            LEFT JOIN chefs ON (chefs.file_id = files.id)
            WHERE chefs.id = $1
            `

            const results = await db.query(query, [id])

            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
    },
    async paginate({ limit, offset }) {
        try {
            let query = '',
                totalQuery = `(
                SELECT count(*) FROM chefs
            ) AS total
            `


            query = `
            SELECT chefs.*, ${totalQuery}, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            GROUP BY chefs.id
            ORDER BY updated_at DESC
            LIMIT $1 OFFSET $2
            `

            const results = await db.query(query, [limit, offset])

            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async deleteDBfile(id) {
        try {
            const query = `
            SELECT files.* FROM FILES
            LEFT JOIN chefs ON (chefs.file_id = files.id)
            WHERE chefs.id = $1
            `

            const results = await db.query(query, [id])
            const files = results.rows

            files.map(async file => {
                await db.query(`DELETE FROM files WHERE id = $1`, [file.id])
            })
        } catch (error) {
            console.error(error)
        }
    }
}
