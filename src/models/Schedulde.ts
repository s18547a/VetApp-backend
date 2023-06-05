class Schedulde {
	VetId: string;
	Monday: string | null;
	Tuesday: string | null;
	Wednesday: string | null;
	Thursday: string | null;
	Friday: string | null;
	Saturday: string | null;
	Sunday: string | null;
	constructor(
		VetId: string,
		Monday: string | null,
		Tuesday: string | null,
		Wednesday: string | null,
		Thursday: string | null,
		Friday: string | null,
		Saturday: string | null,
		Sunday: string | null
	) {
		this.VetId = VetId;
		this.Monday = Monday;
		this.Tuesday = Tuesday;
		this.Wednesday = Wednesday;
		this.Thursday = Thursday;
		this.Friday = Friday;
		this.Saturday = Saturday;
		this.Sunday = Sunday;
	}
}
export default Schedulde;
