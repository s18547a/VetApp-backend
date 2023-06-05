class Owner {
	OwnerId: string;
	Name: string;
	LastName: string;
	Contact: string;
	Email: string;
	Password: string | null;
	constructor(
		OwnerId: string,
		Name: string,
		LastName: string,
		Contact: string,
		Email: string,
		Password: string | null
	) {
		this.OwnerId = OwnerId;
		this.Name = Name;
		this.LastName = LastName;
		this.Contact = Contact;
		this.Email = Email;
		this.Password = Password;
	}

	checkIfEmpty() {
		let isEmpty = false;
		if (this.OwnerId === undefined) {
			isEmpty = true;
		}

		if (this.Name === undefined) {
			isEmpty = true;
		}

		if (this.LastName == undefined) {
			isEmpty = true;
		}

		if (this.Contact === undefined) {
			isEmpty = true;
		}

		if (this.Email === undefined) {
			isEmpty = true;
		}
		return isEmpty;
	}
}
export default Owner;
