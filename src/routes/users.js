import express from 'express'
const router = express.Router()

import {User} from '../models/user'
import {Team} from '../models/team'

import {asyncWrap, Success, NotFound, InstanceExists, create_access_token, send_create_mail} from '../utils'

router.get('/', asyncWrap(async (req, res, next) => {
  let users = await User.find({}, {_id: 0, __v: 0})
  console.log(users)
  if (users.length == 0) {
    return NotFound(res, {
      'model': 'User'
    })
  }
  return Success(res, {
    'users': users
  })
}))

router.post('/', asyncWrap(async (req, res, next) => {
  let found = await User.findOne({email: req.body.email})
  if (found) {
    return InstanceExists(res, {
      model: 'User'
    })
  }
  let user = new User({
    email: req.body.email
  })
  let token = create_access_token()
  user.token = token
  await user.save()
  send_create_mail(user.email, user.token)
  return Success(res)
}))

module.exports = router

router.post('/vote', asyncWrap(async (req, res, next) => {
  let team = await Team.findById(req.body.team_id)
  if (team) {
    let user = await User.findOne({token: req.body.token})
    if (user) {
      if (user.voted_id == 'none') {
        team.vote_count += 1
        team.voters.push(user._id)
        await team.save()
        user.voted_id = team._id
        await user.save()
        return Success(res)
      } else {
        return InstanceExists(res, {
          model: 'Vote',
          voted_id: user.voted_id
        })
      }
    } else {
      return NotFound(res, {
        model: 'User'
      })
    }
  } else {
    return NotFound(res, {
      model: 'Team'
    })
  }
}))
