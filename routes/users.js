const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users.map(user => user.toJSON()))
})

userRouter.get('/:id', async (req, res) => {
    const user = User.findById(req.params.id)
    res.json(user)
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
    try {
        const savedUser = await user.save()
        res.json(savedUser)
    } catch (error) {
        return res.json({ error: error.message})
    }

})

module.exports = userRouter