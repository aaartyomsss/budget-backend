const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv/config')
const nodemailer = require('nodemailer')
const confiramtionUrl = 'http://localhost:3001/api/users/confirmation'

userRouter.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users.map(user => user.toJSON()))
})

userRouter.get('/:id', async (req, res) => {
    const user = User.findById(req.params.id)
    res.json(user)
})

//Continue writing code for verification
userRouter.get('/confirmation/:token', async (req, res) => {
    const token = req.params.token
    const decodedUser = jwt.verify(token, process.env.EMAIL_TOKEN)
    console.log(token, decodedUser)
    if(!decodedUser){
        return res.status(404).json({ error: "Something went wrong"})
    }
    const user = await User.findById(decodedUser.id)
    console.log(user)
    user.confirmed = true
    try {
        await user.save()
        console.log(user)
        res.redirect('http://localhost:3000/login')
    } catch (error) {
        
    }
    
})

// Registration 
userRouter.post('/', async (req, res) => {
    const body = req.body
    if(!body.name || !body.username || !body.password || !body.email) {
        return res.status(400).json({ error: 'Please fill all required fields'})
    }
    if (body.password.length < 6) {
        return res.status(400).json({ error: 'password length is less than 6'})
    }
    if(body.username.length < 3){
        return res.status(400).json({ error: 'password length is less than 3'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        email: body.email,
        passwordHash
    })

    const emailToken = jwt.sign(user.toJSON(), process.env.EMAIL_TOKEN)
    console.log(emailToken)

    try {
        const savedUser = await user.save()
        
        // Sending email block of code
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USER, 
                pass: process.env.GMAIL_PASSWORD, 
            },
        })
    
        const mailOptions = {
            from: '"Test Budget App" <noreplyconfirmationtest@gmail.com>', // sender address
            to: `${user.email}`, // list of receivers
            subject: "Confirm your account", // Subject line
            text: `Hi, ${user.name}`, // plain text body
            html: `<p>Thank you for your registration.</p><p>By clicking following link you will activate your account:</p><p><a>${confiramtionUrl}/${emailToken}</a></p>`
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                console.log(err)
            } else {
                console.log('Email sent: ', info.response)
            }
        })

        res.json(savedUser)

    } catch (error) {
        return res.json({ error: error.message})
    }

})

module.exports = userRouter