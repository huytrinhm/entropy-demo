const MDCRipple = mdc.ripple.MDCRipple;
for(const button of $('.mdc-button')) {
	new MDCRipple(button)
}

const socket = io(document.location.origin, {
	path: '/socket/',
	query: {
		site: 'manage'
	}
})

function newAns(ans, time, index) {
	$($('.mdc-data-table__content')[index]).append(
		`<tr class="mdc-data-table__row">
			<td class="mdc-data-table__cell ans">${ans}</td>
			<td class="mdc-data-table__cell time">${time.toFixed(2)}</td>
		</tr>`)
}

function clearTable() {
	for (var i = 0; i < 4; i++) {
		$('.mdc-data-table__content')[i].innerHTML = ''
	}
}

socket.on('finish', () => {
	$('.timer').removeClass('visible')
})

socket.on('newAns', (d) => {
	newAns(d.val, d.time, d.index)
})

var timer = null
var intervalTimeout = null
var timeout = 30
var data = null


$('.start').on('click', () => {
	$('.start')[0].disabled = true
	socket.emit('start', (d) => {
		if(!d.success) {
			$('.start')[0].disabled = false
			alert('Lỗi!')
			return
		}
	})
})

socket.on('start', () => {
	timeout = 30
	timer = setInterval(() => {
		timeout--
		$('.timer').html(timeout)
	}, 1000)
	intervalTimeout = setTimeout(() => {
		clearInterval(timer)
		$('.start')[0].disabled = false
		$('.stop')[0].disabled = true
	}, 30000)
	clearTable()
	$('.timer').html('30')
	$('.timer').addClass('visible')
	$('.timer-audio')[0].currentTime = 0
	$('.timer-audio')[0].play()
	$('.stop')[0].disabled = false
	$('.question').text(data.question)
})

$('.stop').on('click', () => {
	socket.emit('stop')
	clearInterval(timer)
	clearTimeout(intervalTimeout)
	$('.timer-audio')[0].pause()
	$('.start')[0].disabled = false
	$('.stop')[0].disabled = true
})

socket.on('matchData', (d) => {
	data = d
	console.log(d)
})