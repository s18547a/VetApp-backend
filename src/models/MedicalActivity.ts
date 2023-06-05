class MedicalActivity {
	MedicalActivityId: string;
	ActivityName: string;
	Price: number;

	constructor(MedicalActivityId: string, ActivityName: string, Price: number) {
		this.MedicalActivityId = MedicalActivityId;
		this.ActivityName = ActivityName;
		this.Price = Price;
	}
}

export default MedicalActivity;
