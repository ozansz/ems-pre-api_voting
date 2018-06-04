import express from 'express'
const router = express.Router()

import {User} from '../models/user'
import {Team} from '../models/team'

import {asyncWrap, Success, NotFound, InstanceExists, create_access_token, send_create_mail} from '../utils'

router.get('/', asyncWrap(async (req, res, next) => {
  let teams = await Team.find({}, {_id: 0, __v: 0})
  if (teams.length == 0) {
    return NotFound(res, {
      model: 'Team'
    })
  }
  return Success(res, {
    teams: teams
  })
}))

router.post('/', asyncWrap(async (req, res, next) => {
  let found = await Team.findOne({name: req.body.name})
  if (found) {
    return InstanceExists(res, {
      model: 'Team'
    })
  } else {
    let team = new Team({
      name: req.body.name
    })
    team.save()
    return Success(res)
  }
}))

module.exports = router
