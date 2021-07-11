var data = null
var timeout = null
var timer = null
var intervalTimeout = null
var curImage = null
var curImage = null
var imageInterval = null
var imageTimeout = null
var counter = null

const socket = io(document.location.origin, {
	path: '/socket/',
	query: {
		site: 'spectate'
	}
})

socket.on('matchData', (d) => {
	data = d
	console.log(d)
	$('.result-view').hide()
	$('.main-container').show()
	$('.question-text').text("")
	$('.image').css('background-image', '')
	for(var i = 0; i < 4; i++) {
		$($('.result-view').children()[i]).removeClass('wrong')
	}
})

socket.on('start', () => {
	$('.question-text').text(data.question)
	timeout = 30
	$('.timer').html(timeout)
	$('.timer').show()
	timer = setInterval(() => {
		timeout--
		$('.timer').html(timeout)
	}, 1000)
	intervalTimeout = setTimeout(() => {
		clearInterval(timer)
		$('.timer').hide()
	}, 30000)
	if (data.time.length > 1) {
		curImage = 0
		counter = 0
		$('.image').css('background-image', "url("+data.imageData[curImage++]+")")
		nextTime = data.time[curImage]
		imageInterval = setInterval(() => {
			if(nextTime == counter) {
				if(curImage == data.time.length)
					return
				nextTime += data.time[curImage]
				$('.image').css('background-image', "url("+data.imageData[curImage++]+")")
			}
			counter++
		}, 1000)
		imageTimeout = setTimeout(() => {
			clearInterval(imageInterval)
		}, 30000)				
	}
})

socket.on('stop', () => {
	clearInterval(timer)
	clearTimeout(intervalTimeout)
	clearInterval(imageInterval)
	clearTimeout(imageTimeout)
})

socket.on('finish', (d) => {
	$('.main-container').hide()
	for(var i = 0; i < 4; i++) {
		$('.name')[i].innerHTML = (d[i].name)
		$('.answer')[i].innerHTML = (d[i].answer)
		$('.time')[i].innerHTML = (d[i].time!=9999?d[i].time.toFixed(2):'')
	}
	$('.result-view').show()
})

socket.on('mark', (d) => {
	for(var i = 0; i < 4; i++) {
		if(!(i in d)) {
			$($('.result-view').children()[i]).addClass('wrong')
		}
	}
})