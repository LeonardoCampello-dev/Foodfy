const { date } = require('../../libs/utils')
const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    all(callback) {
        const query = `
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        ORDER BY chefs.name ASC
        `

        db.query(query, (err, results) => {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    create(data, file_id) {
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
    },
    find(id) {
        const query = `
        SELECT chefs.*, 
        count(recipes) AS total_recipes
        FROM chefs 
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id
        `

        return db.query(query, [id])
    },
    update(data) {
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
    },
    delete(id) {
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    },
    paginate(params) {
        let { callback, limit, offset } = params

        let query = '',
            totalQuery = `(
                SELECT count(*)
                FROM chefs 
            ) AS total`

        query = `
        SELECT chefs.*, ${totalQuery}, count(recipes) AS total_recipes
        FROM chefs 
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], (err, results) => {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
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
        const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
        const file = results.rows[0]

        fs.unlinkSync(file.path)

        return db.query(`DELETE FROM files WHERE id = $1`, [id])
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
    }
}
