const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports.UTYPES = [
  'admin',
  'participant'
]

const UserSchema = Schema({
  email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  voted_id: {
    type: String,
    default: 'none'
  }
})

module.exports.User = mongoose.model('User', UserSchema)
