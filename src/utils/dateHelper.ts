import translate from 'translate';
export function getCurrentDate() {
	const date = new Date();

	return date.toISOString().split('T')[0];
}

export function getDayOfAWeekName(NewDate: string): string {
	const newDate: Date = new Date(NewDate);
	console.log(newDate);
	return newDate.toLocaleDateString('en-PL', { weekday: 'long' });
}

export async function translateDayOfWeekName(
	englishName: string
): Promise<string> {
	translate.engine = 'google';
	const translatedName = await translate(englishName, 'pl');

	return translatedName;
}
