const mongoose = require('mongoose')

const userGoogleSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    personalPlan: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Expense'
        }
    ],
    email: {
        type: String,
        required: true
    }
})

userGoogleSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
        delete returnedObj.passwordHash
    }
})

const UserGoogle = mongoose.model('UserGoogle', userGoogleSchema)

module.exports = UserGoogle