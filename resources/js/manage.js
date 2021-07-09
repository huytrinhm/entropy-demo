const MDCRipple = mdc.ripple.MDCRipple;
for(const button of $('.mdc-button')) {
	new MDCRipple(button)
}

var timer = null
var intervalTimeout = null
var timeout = 30

function newAns(ans, time, index) {
	$($('.mdc-data-table__content')[index]).append(
		`<tr class="mdc-data-table__row">
			<td class="mdc-data-table__cell ans">${ans}</td>
			<td class="mdc-data-table__cell time">${time.toFixed(2)}</td>
		</tr>`)
}

$('.start').on('click', () => {
	$('.start')[0].disabled = true
	$('.stop')[0].disabled = false
	$('.timer').html('30')
	timeout = 30
	$('.timer-audio')[0].currentTime = 0
	$('.timer-audio')[0].play()
	timer = setInterval(() => {
		timeout--
		$('.timer').html(timeout)
	}, 1000)
	intervalTimeout = setTimeout(() => {
		clearInterval(timer)
		$('.start')[0].disabled = false
		$('.stop')[0].disabled = true
	}, 30000)
	$('.timer').addClass('visible')

})

$('.stop').on('click', () => {
	$('.start')[0].disabled = false
	$('.stop')[0].disabled = true
	clearInterval(timer)
	clearTimeout(intervalTimeout)
	$('.timer-audio')[0].pause()
})