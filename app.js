require('dotenv').config()
const fs = require('fs').promises
const express = require('express')
const app = express()
const httpServer = require("http").createServer(app)
const socketOptions = {
	path: '/socket/',
	maxHttpBufferSize: 1e7,
}
const io = require("socket.io")(httpServer, socketOptions)

var running = false
var finishTimeout = null
var startTime = 0
var answers = null
var data = null
var numPlayer = 0
var numJury = 0

io.on("connection", socket => {
	try {
		if(socket.handshake.query.site == 'manage') {
			socket.join('jury')
			numJury++
			socket.on('disconnect', () => {
				numJury--
				if(numJury)
					return
				try {
					running = false
					startTime = 0
					answers = null
					data = null
					clearTimeout(finishTimeout)
					io.emit('stop')
					finishTimeout = null
				} catch(e) {
					console.log(e)
				}
			})
			socket.on('start', async (callback) => {
				if(!running) {
					try {
						if(!numPlayer) {
							callback({success: false, message: "Không có thí sinh nào đang kết nối"})
							return
						}
						data = JSON.parse(await fs.readFile('./resources/matchData/sample.json', {encoding: 'utf8'}))
						for (var i = 1; i <= data.time.length; i++) {
							await data.imageData.push(`/matchData/${i}.JPG`)
						}
						io.emit('matchData', data)
					} catch (e) {
						console.log(e)
						callback({success: false})
					}
				} else {
					callback({success: false, message: "Một trận đấu khác đang diễn ra. Vui lòng đợi ít nhất 30s rồi thử lại!"})
				}
			})
			socket.on('stop', () => {
				running = false
				clearTimeout(finishTimeout)
				io.emit('stop')
			})
			socket.on('mark', (d) => {
				io.emit('mark', d)
			})
		} else if(socket.handshake.query.site == 'player') {
			socket.join('player')
			numPlayer++
			socket.on('disconnect', () => {
				numPlayer--
			})
			socket.on('answer', (val, callback) => {
				var ansTime = Math.round((Date.now() - startTime + Number.EPSILON)/10) / 100
				if(running && ansTime <= 30 && answers) {
					answers[socket.handshake.query.index].push(
					{
						val: val,
						time: ansTime
					})
					io.to('jury').emit('newAns', {val: val, time: ansTime, index: socket.handshake.query.index})
					callback({success: true})
				} else {
					callback({success: false})
				}
			})
			socket.on('confirm', () => {
				if(!running) {
					startTime = Date.now()
					finishTimeout = setTimeout(() => {
						var sendData = []
						for (var i = 0; i < 4; i++) {
							sendData.push({name: `Thí sinh ${i+1}`, answer: answers[i].length?answers[i][answers[i].length-1].val:"", time: answers[i].length?answers[i][answers[i].length-1].time:9999})
						}
						sendData.sort((a, b) => {
							if(a.time < b.time) {
								return -1
							} else if(a.time > b.time) {
								return 1
							} else {
								return a.name<b.name?-1:1
							}
						})
						console.log(sendData)
						io.emit('finish', sendData)
						running = false
					}, 33000)
					io.emit('start')
					running = true
					answers = [[], [], [], []]
					console.log('Start round at', Date(startTime))
				}
			})
		} else if(socket.handshake.query.site == 'spectate') {
			socket.join('spectate')
		}
	} catch(e) {
		console.log(e)
	}
})

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

httpServer.listen(process.env.PORT)
console.log(`Listening at http://localhost:${process.env.PORT}/`)