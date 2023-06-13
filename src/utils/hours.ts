export function createVetVisitHours(VetWorkingHours: string) {
	const beginEndHours = VetWorkingHours.split('-');

	const startHour: number = Number(beginEndHours[0].split(':')[0]);
	const endHour: number = Number(beginEndHours[1].split(':')[0]);

	const times: string[] = [];
	for (let i = startHour; i < endHour; i++) {
		if (i < 10) {
			times.push('0' + i + ':00');
			times.push('0' + i + ':20');
			times.push('0' + i + ':40');
		} else {
			times.push(i + ':00');
			times.push(i + ':20');
			times.push(i + ':40');
		}
	}
	return times;
}
