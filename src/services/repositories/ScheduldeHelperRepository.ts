import {
	getBusyNextHourFromSurgery,
	createSurgeryAvailableHours,
} from '../../utils/receptionHoursHelper';
import { createVetVisitHours } from '../../utils/hours';

import Repository from './Repository';
import ReservationRepository from './ReservationRepository';
import SurgeryRepository from './SurgeryRepository';
import Reservation from '../../models/Reservation';
import Surgery from '../../models/Surgery';

class ScheduldeHelperRepository extends Repository {
	reservationRepository;
	surgeryRepository;
	constructor(
		db,
		reservationRepository: ReservationRepository,
		surgeryRepository: SurgeryRepository
	) {
		super(db);
		this.reservationRepository = reservationRepository;
		this.surgeryRepository = surgeryRepository;
	}

	createVatAvailableHours = async (reccordset, paramters) => {
		const workHours = String(Object.values(reccordset)[0]);

		if (workHours != null) {
			let receptionHours = createVetVisitHours(workHours);

			const bookedReservations =
				(await this.reservationRepository.getReservations({
					vetId: paramters.vetId,
					date: paramters.date,
					ownerId: null,
				})) as Reservation[] | null;

			if (bookedReservations != null) {
				let bookedHours: string[] = [];
				bookedHours = bookedReservations.map((reservation) => {
					return reservation.Hour;
				});

				receptionHours = receptionHours.filter((bookedHour) => {
					return !bookedHours.includes(bookedHour);
				});
			}

			const bookedSurgeries: Surgery[] | null =
				await this.surgeryRepository.getSurgeries({
					date: paramters.date,
					vetId: paramters.vetId,
				});

			if (bookedSurgeries != null) {
				const unavalilableHoursArrays: string[][] = bookedSurgeries.map(
					(surgery) => {
						return getBusyNextHourFromSurgery(surgery.StartTime);
					}
				);

				let unavalilableHour: string[] = [];

				unavalilableHoursArrays.forEach((hoursArray) => {
					unavalilableHour = unavalilableHour.concat(hoursArray);

					unavalilableHour = unavalilableHour.filter((item, index) => {
						return unavalilableHour.indexOf(item) == index;
					});
				});

				receptionHours = receptionHours.filter((hour) => {
					return !unavalilableHour.includes(hour);
				});
			}

			if (paramters.isSurgery === false) {
				if (receptionHours.length == 0) {
					return null;
				}
				return receptionHours;
			} else {
				const availableSurgeryTime =
					createSurgeryAvailableHours(receptionHours);

				if (availableSurgeryTime.length == 0) {
					return null;
				}
				return availableSurgeryTime;
			}
		}
	};
}

export default ScheduldeHelperRepository;
