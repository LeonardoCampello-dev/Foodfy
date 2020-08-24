const { Pool } = require('pg')

module.exports = new Pool ({
    user: 'leonardo',
    password: 'dev123',
    host: 'localhost',
    port: 5432,
    database: 'foodfydb'
})