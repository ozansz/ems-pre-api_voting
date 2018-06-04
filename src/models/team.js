const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TeamSchema = Schema({
  name: {
    type: String,
    required: true
  },
  vote_count: {
    type: Number,
    default: 0
  },
  voters: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
})

module.exports.Team = mongoose.model('Team', TeamSchema)
