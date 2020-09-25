const express = require('express')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')

const routes = require('./routes')
const session = require('./config/session')

const server = express()

server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)
server.use(session)

server.set('view engine', 'njk')

nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: false
})

server.listen(5000, () => {
    console.log('Server is running')
})