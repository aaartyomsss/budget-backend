const googleRouter = require('express').Router()
const UserGoogle = require('../models/UserGoogle')
const jwt = require('jsonwebtoken')

googleRouter.post('/', async (req, res) => {
    console.log(req.body)
    const body = req.body 

    let user = await UserGoogle.findOne({ googleId: body.googleId})

    if(user) {
        res.send({ user })
    } else {
        user = new UserGoogle({
            googleId: body.googleId,
            email: body.email,
            name: body.name,
            image: body.imageUrl
        })

        try {
            await user.save()
            res.send({ user })
        } catch (e) {
            console.error(e.message)
        }
    }

})

module.exports = googleRouter