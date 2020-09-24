const db = require('../../config/db')
const { hash } = require('bcrypt')
const fs = require('fs')

module.exports = {
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

        const encryptedPassword = await hash(data.password, 8)

        const values = [
            data.name,
            data.email,
            encryptedPassword,
            data.is_admin
        ]

        const results = await db.query(query, values)

        return results.rows[0].id
    },
}