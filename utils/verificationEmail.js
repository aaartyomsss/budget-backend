const nodemailer = require('nodemailer')
const baseUrl = 'http://localhost:3001/api/users/confirmation'
require('dotenv/config')

// Email for confirming registration
exports.sendConfiramtion = async (email, name, token) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_USER, 
            pass: process.env.GMAIL_PASSWORD, 
        },
    })

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Test Budget App" <noreplyconfirmationtest@gmail>', // sender address
        to: `${email}`, // list of receivers
        subject: "Confirm your account", // Subject line
        text: `Hi, ${name}`, // plain text body
        html: `<p>Thank you for your registration</p><p>By clicking following link you will activate your account</p><p><p><a>${baseUrl}/${token}</a></p>`, // html body
    })

    console.log("Message sent: %s", info.messageId)
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))

}

// Email for reseting the password

