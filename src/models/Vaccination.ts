class Vaccination {
	AnimalId: string;
	VaccineType: string;
	VaccinationDate: string;

	constructor(AnimalId: string, VaccineType: string, VaccinationDate: string) {
		this.AnimalId = AnimalId;
		this.VaccineType = VaccineType;
		this.VaccinationDate = VaccinationDate;
	}
}

export default Vaccination;
