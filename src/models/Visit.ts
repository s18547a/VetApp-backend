import Animal from './Animal';
import MedicalActivity from './MedicalActivity';
import Vet from './Vet';

class Visit {
	VisitId: string;
	VetId: string;
	AnimalId: string;
	VisitDate: string;
	Hour: string;
	Note: string;
	Bill: number;
	MedicalActivities: MedicalActivity[];
	Vet: { VetId: string; Name: string; LastName: string; Email: string };
	Animal: { AnimalId: string; OwnerId: string; Name: string };
	constructor(
		VisitId: string,
		VetId: string,
		AnimalId: string,
		VisitDate: string,
		Hour: string,
		Note: string,
		Bill: number,
		MedicalActivities: MedicalActivity[],
		Vet: { VetId: string; Name: string; LastName: string; Email: string },
		Animal: { AnimalId: string; OwnerId: string; Name: string }
	) {
		this.VisitId = VisitId;
		this.VetId = VetId;
		this.AnimalId = AnimalId;
		this.VisitDate = VisitDate;
		this.Hour = Hour;
		this.Note = Note;
		this.MedicalActivities = MedicalActivities;
		this.Bill = Bill;
		this.Vet = Vet;
		this.Animal = Animal;
	}
}

export default Visit;
