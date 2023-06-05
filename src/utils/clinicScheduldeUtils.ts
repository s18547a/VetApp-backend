export function getScheduldeEarliestHour(daySchedulde: string[]) {
	if (daySchedulde.length == 0) {
		return null;
	} else {
		let minHour: string | null = null;
		daySchedulde.forEach((day) => {
			const starHour: string = day.split('-')[0];

			if (minHour == null) {
				minHour = starHour;
			} else {
				if (starHour < minHour) {
					minHour = starHour;
				}
			}
		});

		return minHour;
	}
}
export function getScheduldeLatestHour(daySchedulde: string[]) {
	let maxHour: string | null = null;
	daySchedulde.forEach((day) => {
		const endHour: string = day.split('-')[1];
		if (maxHour == null) {
			maxHour = endHour;
		} else {
			if (endHour > maxHour) {
				maxHour = endHour;
			}
		}
	});

	return maxHour;
}
