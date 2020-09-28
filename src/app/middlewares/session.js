module.exports = {
    onlyUsers(req, res, next) {
        if (!req.session.userId)
            return res.redirect('/admin/users/login')

        next()
    },
    isLoggedRedirectToList(req, res, next) {
        if (req.session.userId) {
            if (req.session.isAdmin) {
                return res.redirect('/admin/users')
            } else {
                return res.redirect('/admin/users/profile')
            }
        }

        next()
    },
    isAdmin(req, res, next) {
        if (!req.session.isAdmin) {
            req.session.error = 'Somente administradores tem acesso à esta página.'

            return res.redirect(`${req.headers.referer}`)
        }

        next()
    },
    ifAdmin(req, res, next) {
        if (!req.session.isAdmin) return res.redirect('/admin/users/profile')

        next()
    }
}