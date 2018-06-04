import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import bluebird from 'bluebird'

import config from './config'

import route_users from './routes/users'
import route_teams from './routes/teams'

const API_VER = "0.1-beta"
const API_NAME = "minimal_api @ pre-ems-sys-voting"
const API_AUTHOR = "Ozan Sazak <ozan.sazak@ieee.metu.edu.tr>"

mongoose.Promise = bluebird.Promise

mongoose.connect(config.database)
	.then(() => {
    let app = express()

		app.use(cors())

		app.use(bodyParser.json())

		app.use((req, res, next) => {
			res.set('X-Powered-By', 'IEEE METU | Computer Society')
			next()
		})

		app.get('/', (req, res, next) => {
			return res.status(200).json({
				success: true,
				api: API_NAME,
				api_version: API_VER,
				api_author: API_AUTHOR
			})
		})

		app.use('/u', route_users)
		app.use('/t', route_teams)

		app.use('*', (req, res) => {
			return res.status(404).end('Unimplemented or unknown API endpoint')
		})

		app.use((err, req, res, next) => {
      console.log(err)
			console.error(Object.assign({}, err))
			if (!res.headersSent) {
					res.json({
            success: false,
            err: err
          })
			}
		})

		app.listen(3000, (err) => {
			if (!err)
				console.log('[+] Server has started on port 3000')
		})
	})
