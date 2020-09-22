const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create({ filename, path }) {
        const query = `
        INSERT INTO FILES (
            name,
            path
        ) VALUES ($1, $2)
        RETURNING id
        `

        const values = [
            filename,
            path
        ]

        return db.query(query, values)
    },
    async createRecipeFiles({ filename, path, recipe_id }) {
        try {
            let query = `
                INSERT INTO files (
                    name,
                    path            
                ) VALUES ($1, $2)
                RETURNING id
                `

            let values = [
                filename,
                path
            ]

            const results = await db.query(query, values)
            const file_id = results.rows[0].id

            query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
            `

            return db.query(query, [recipe_id, file_id])
        } catch (error) {
            console.error(error)
        }
    },
    async delete(id) {
        try {
            const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = results.rows[0]

            fs.unlinkSync(file.path)

            await db.query(`DELETE FROM recipe_files WHERE recipe_files.file_id = $1`, [id])

            return db.query(`DELETE FROM files WHERE id = $1`, [id])
        } catch (error) {
            console.error(error)
        }
    }
}