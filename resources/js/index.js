const MDCRipple = mdc.ripple.MDCRipple;
for(const button of $('.mdc-button')) {
	new MDCRipple(button);
}

$('.manage').on('click', () => {
	window.open('/Manage')
})

$('.player').on('click', () => {
	window.open('/Player')
})

$('.spectator').on('click', () => {
	window.open('/Spectate')
})

$('.code').on('click', () => {
	window.open('https://github.com/huytrinhm/entropy-demo')
})