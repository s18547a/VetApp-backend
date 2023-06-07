import { GetReservationParameters } from '../common/Types';
import Reservation from '../models/Reservation';
import ReservationRepository from '../services/repositories/ReservationRepository';
import {
	deleteResponseHandler,
	getResponseHandler,
	postResponseHandler,
} from '../utils/responseHandler';

class ReservationController {
	reservationRepository: ReservationRepository;

	constructor(reservationRepository: ReservationRepository) {
		this.reservationRepository = reservationRepository;
	}

	getReservations = async (req, res) => {
		const parameters: GetReservationParameters = {
			vetId: req.query.VetId,
			date: req.query.Date,
			ownerId: req.query.OwnerId,
		};
		const results = await this.reservationRepository.getReservations(
			parameters
		);
		return getResponseHandler(res, results);
	};

	registerReservation = async (req, res) => {
		const reservation: Reservation = req.body;

		const results = await this.reservationRepository.createReservation(
			reservation
		);

		return postResponseHandler(res, results);
	};

	deleteReservation = async (req, res) => {
		const ReservationId: string = req.params.ReservationId;

		const results = await this.reservationRepository.cancelReservation(
			ReservationId,
			null
		);

		return deleteResponseHandler(res, results);
	};
}
export default ReservationController;
