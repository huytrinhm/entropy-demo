require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.static('resources'))

app.get('/Manage', (req, res, next) => {
	res.sendFile('./views/manage.html', {root: __dirname})
})

app.get('/Player', (req, res, next) => {
	res.sendFile('./views/player.html', {root: __dirname})
})

app.get('/Spectate', (req, res, next) => {
	res.sendFile('./views/spectate.html', {root: __dirname})
})

app.get('/', (req, res, next) => {
	res.sendFile('./views/index.html', {root: __dirname})
})

app.use((err, req, res, next) => {
	if (err) {
		return res.sendStatus(500)
	}
	next()
})

app.use((req, res) => {
	res.sendStatus(404)
})

app.listen(process.env.PORT)
console.log(`Listening at http://localhost:${process.env.PORT}/`)