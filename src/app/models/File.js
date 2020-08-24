const db = require('../../config/db')

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

        values = [
            recipe_id,
            file_id
        ]

        return db.query(query, values)
    }
}