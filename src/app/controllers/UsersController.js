const User = require('../models/User')

module.exports = {
    create(req, res) {
        return res.render('admin/users/create.njk')
    }
}