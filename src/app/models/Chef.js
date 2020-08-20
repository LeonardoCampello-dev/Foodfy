const { date } = require('../../libs/utils')
const db = require('../../config/db')

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
    create(data) {
        const query = `
        INSERT INTO chefs (
            name,
            avatar_url,
            created_at
        ) VALUES ($1, $2, $3)
        RETURNING id
        `

        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]

        return db.query(query, values)
    },
    find(id) {
        const query = `
        SELECT chefs.*, recipes.title AS recipes_name, recipes.image AS recipes_image, recipes.id AS recipes_id
        FROM chefs 
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        `

        return db.query(query, [id])
    },
    update(data) {
        const query = `
        UPDATE chefs SET
            name=($1),
            avatar_url=($2)
        WHERE id = $3
        `

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    },
    paginate(params) {
        let { callback, limit, offset } = params

        let query = "",
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
    }
}