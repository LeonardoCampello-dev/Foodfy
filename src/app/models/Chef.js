const { date } = require('../../libs/utils')
const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create(data, file_id) {
        try {
            const query = `
            INSERT INTO chefs (
                file_id,
                name, 
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `
            const values = [
                file_id,
                data.name,
                date(Date.now()).iso
            ]

            return db.query(query, values)

        } catch (error) {
            console.error(error)
        }
    },
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
    update(data) {
        try {
            const query = `
            UPDATE chefs SET
                file_id = ($1),
                name=($2)
            WHERE id = $3
            `

            const values = [
                file_id,
                data.name,
                data.id
            ]

            return db.query(query, values)
        } catch (error) {
            console.error(error)
        }
    },
    delete(id) {
        try {
            return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
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
    async fileDelete(id) {
        try {
            const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = results.rows[0]

            fs.unlinkSync(file.path)

            return db.query(`DELETE FROM files WHERE id = $1`, [id])

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
    }
}
