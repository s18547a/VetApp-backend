class Illness {
	AnimalId: string;
	VisitId: string;
	Description: string;
	DiagnosisDate: string;
	RecoveryDate: string | null;

	constructor(
		AnimalId: string,
		VisitId: string,
		Description: string,
		DiagnosisDate: string,
		RecoveryDate: string | null
	) {
		this.AnimalId = AnimalId;
		this.VisitId = VisitId;
		this.Description = Description;
		this.DiagnosisDate = DiagnosisDate;
		this.RecoveryDate = RecoveryDate;
	}
}

export default Illness;
