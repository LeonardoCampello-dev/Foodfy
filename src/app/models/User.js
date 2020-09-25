const db = require('../../config/db')
const { hash } = require('bcrypt')
const crypto = require('crypto')

module.exports = {
    async all() {
        const query = `
        SELECT * FROM users
        ORDER BY updated_at DESC
        `

        const results = await db.query(query)
        return results.rows
    },
    async findOne(filters) {
        let query = `SELECT * FROM users`

        Object.keys(filters).map(key => {
            query = `${query}
            ${key}
            `

            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)

        return results.rows[0]
    },
    async create(data) {
        const query = `
        INSERT INTO users (
            name,
            email,
            password,
            is_admin
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
        `

        const newPassword = crypto.randomBytes(10).toString('hex')

        const values = [
            data.name,
            data.email,
            newPassword,
            data.is_admin
        ]

        const results = await db.query(query, values)

        return results.rows[0].id
    },
}