function newAns(ans, time, index) {
	$($('.mdc-data-table__content')[index]).append(
		`<tr class="mdc-data-table__row">
			<td class="mdc-data-table__cell ans">${ans}</td>
			<td class="mdc-data-table__cell time">${time.toFixed(2)}</td>
		</tr>`);
}