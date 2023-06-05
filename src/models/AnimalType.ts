class AnimalType {
	AnimalTypeId: string;
	Family: string;
	Race: string;
	constructor(AnimalTypeId: string, Family: string, Race: string) {
		this.AnimalTypeId = AnimalTypeId;
		this.Family = Family;
		this.Race = Race;
	}

	getData() {
		return {
			AnimalTypeId: this.AnimalTypeId,
			AnimalType: this.Family + ', ' + this.Race,
		};
	}
}

export default AnimalType;
