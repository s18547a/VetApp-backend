class Reservation {
	ReservationId: string | null;
	ReservationDate: string;
	VetId: string;
	OwnerId: string;
	Hour: string;
	Vet: {
		VetId: string;
		Name: string;
		LastName: string;
		Email: string;
		Contact: string;
	};
	Owner: {
		OwnerId: string;
		Name: string;
		LastName: string;
		Email: string;
		Contact: string;
	};

	constructor(
		ReservationId: string | null,
		ReservationDate: string,
		VetId: string,
		OwnerId: string,
		Hour: string,
		Vet: {
			VetId: string;
			Name: string;
			LastName: string;
			Email: string;
			Contact: string;
		},
		Owner: {
			OwnerId: string;
			Name: string;
			LastName: string;
			Email: string;
			Contact: string;
		}
	) {
		this.ReservationId = ReservationId;
		this.ReservationDate = ReservationDate;
		this.VetId = VetId;
		this.OwnerId = OwnerId;
		this.Hour = Hour;
		this.Vet = Vet;
		this.Owner = Owner;
	}
}

export default Reservation;
