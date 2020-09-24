const nodemailer = require('nodemailer') 

module.exports = nodemailer.createTransport({ 
    host: 'smtp.mailtrap.io', 
    port: 2525,
    auth: {
        user: 'b3a2af85a6b254',
        pass: '041b5e729005f6'
    }
})