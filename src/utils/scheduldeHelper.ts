export function checkScheduldeFormat(hours: string) {
	if (hours != null) {
		const regex = '[0-2][0-9]:[0][0]';
		const match = hours.match(regex);
		if (match == null) {
			throw new Error('');
		}
		return hours;
	} else return hours;
}
