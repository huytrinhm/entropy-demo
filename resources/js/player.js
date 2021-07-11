const MDCRipple = mdc.ripple.MDCRipple
const MDCDialog = mdc.dialog.MDCDialog
const MDCList = mdc.list.MDCList
for(const button of $('.mdc-button')) {
	new MDCRipple(button)
}
for(const list_item of $('.mdc-list-item')) {
	new MDCRipple(list_item)
}
const dialog = new MDCDialog(document.querySelector('.mdc-dialog'))
const list = new MDCList(document.querySelector('.mdc-list'));

var socket = null
var data = null
var curImage = null
var imageInterval = null
var imageTimeout = null
var timeout = null

var currentPlayer = null

$(document).ready(() => {
	dialog.open()
	dialog.listen('MDCDialog:closing', function() {
		if($('input:checked').length == 1)
			currentPlayer = parseInt($('input:checked')[0].id[6]) - 1
		console.log(currentPlayer)
		socket = io(document.location.origin, {
			path: '/socket/',
			query: {
				site: 'player',
				index: currentPlayer
			}
		})

		socket.on('matchData', (d) => {
			data = d
			console.log(d)
			$('.result-view').hide()
			$('.main-container').show()
			$('.image').css('background-image', '')
			$('.answer span').html('')
			$('.question').text('')
			for(var i = 0; i < 4; i++) {
				$($('.result-view').children()[i]).removeClass('wrong')
			}
			$('.time-inner').css('transition', "all 1s ease-in-out")
			$('.time-inner').css('height', "100%")
			setTimeout(() => {
				socket.emit('confirm')
			}, 2000)
		})

		socket.on('start', () => {
			$('.question').text(data.question)
			$('.time-inner').css('transition', "all 30s ease-in-out")
			$('.time-inner').css('height', "0%")
			if (data.time.length > 1) {
				curImage = 0
				timeout = 0
				$('.image').css('background-image', "url("+data.imageData[curImage++]+")")
				nextTime = data.time[curImage]
				imageInterval = setInterval(() => {
					if(nextTime == timeout) {
						if(curImage == data.time.length)
							return
						nextTime += data.time[curImage]
						$('.image').css('background-image', "url("+data.imageData[curImage++]+")")
					}
					timeout++
				}, 1000)
				imageTimeout = setTimeout(() => {
					clearInterval(imageInterval)
				}, 30000)				
			}
		})

		socket.on('stop', () => {
			var computed = $('.time-inner').css('height')
			$('.time-inner').css('height', computed)
			$('.time-inner').css('transition', 'none')
			clearInterval(imageInterval)
			clearTimeout(imageTimeout)
		})

		socket.on('finish', (d) => {
			$('.main-container').hide()
			for(var i = 0; i < 4; i++) {
				$('.name')[i].innerHTML = (d[i].name)
				$('.res-answer')[i].innerHTML = (d[i].answer)
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
	})
})

$('.ip-answer').on('keydown', (e) => {
	if(e.key == "Enter") {
		var curAns = $('.ip-answer').val().trim()
		socket.emit('answer', curAns, (d) => {
			if(!d.success)
				return
			$('.answer span').text(curAns.toUpperCase())
		})
		$('.ip-answer').val('')
	}
})
