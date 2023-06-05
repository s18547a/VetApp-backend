import express, { Router } from 'express';
import ReservationController from '../controllers/ReservationContoller';
import { isAuthorizated } from '../middlewares/isAuthorizatied';

class ReservationRouter {
	router: Router;

	constructor(reservationController: ReservationController) {
		const router = express.Router();

		router.get('/', isAuthorizated, reservationController.getReservations);

		router.post('/', isAuthorizated, reservationController.registerReservation);

		router.delete(
			'/:ReservationId',
			isAuthorizated,
			reservationController.deleteReservation
		);

		this.router = router;
	}
}

export default ReservationRouter;
