class AnimalMedicalInfo {
	AnimalId: string;
	Weight: number | null;
	Chipped: boolean | null;
	Sterilized: boolean | null;
	Skeletal: string;
	Muscular: string;
	Nervous: string;
	Endocrine: string;
	Cardiovascular: string;
	Lymphatic: string;
	Respiratory: string;
	Digestive: string;
	Urinary: string;
	Reproductive: string;
	Optical: string;
	Dental: string;
	Dermatological: string;
	Others: string;

	constructor(
		AnimalId: string,
		Weight: number | null,
		Chipped: boolean | null,
		Sterilized: boolean | null,

		Skeletal: string,
		Muscular: string,
		Nervous: string,
		Endocrine: string,
		Cardiovascular: string,
		Lymphatic: string,
		Respiratory: string,
		Digestive: string,
		Urinary: string,
		Reproductive: string,
		Optical: string,
		Dental: string,
		Dermatological: string,
		Others: string
	) {
		this.AnimalId = AnimalId;
		this.Weight = Weight;
		this.Chipped = Chipped;
		this.Sterilized = Sterilized;
		this.Skeletal = Skeletal;
		this.Muscular = Muscular;
		this.Nervous = Nervous;
		this.Endocrine = Endocrine;
		this.Cardiovascular = Cardiovascular;
		this.Lymphatic = Lymphatic;
		this.Reproductive = Reproductive;
		this.Respiratory = Respiratory;
		this.Dental = Dental;
		this.Digestive = Digestive;
		this.Urinary = Urinary;
		this.Optical = Optical;
		this.Others = Others;
		this.Dermatological = Dermatological;
	}
}

export default AnimalMedicalInfo;
