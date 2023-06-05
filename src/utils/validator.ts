export function validateContact(contact: string) {
	const isNumber = /^\d+$/.test(contact);

	if (contact.length != 9 || !isNumber) {
		throw Error('validationError');
	}

	return contact;
}

export function validateEmail(email: string) {
	if (!email.includes('@')) {
		throw Error('validationError');
	}

	return email;
}
