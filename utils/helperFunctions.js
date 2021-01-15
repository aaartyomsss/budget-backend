const UserGoogle = require('../models/UserGoogle')
const User = require('../models/User')

const returningUser = async (body) => {
    if(body.googleId) {
        const user = await UserGoogle.findOne({ googleId: body.googleId })
        return user
    } else if (body.username) {
        const user = await User.findOne({ username: body.username })
        return user
    }
}

module.exports = returningUser