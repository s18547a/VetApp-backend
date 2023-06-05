import express, { Router } from 'express';
import VetController from '../controllers/VetController';
import { isAuthorizated } from '../middlewares/isAuthorizatied';

class VetRouter {
	router: Router;

	constructor(vetController: VetController) {
		const router = express.Router();
		router.get(
			'/todaySchedulde',
			isAuthorizated,
			vetController.getTodaySchedulde
		);
		router.get('/types', isAuthorizated, vetController.getVetTypes);
		router.get('/:VetId', isAuthorizated, vetController.getVet);
		router.get('/', isAuthorizated, vetController.getVets);
		router.post('/', isAuthorizated, vetController.registerVet);
		router.get(
			'/schedulde/availableHours',
			isAuthorizated,
			vetController.getAvailableHours
		);
		router.get(
			'/:VetId/schedulde',
			isAuthorizated,
			vetController.getVetSchedulde
		);
		router.get(
			'/:VetId/daysOfWeek',
			isAuthorizated,
			vetController.getVetDaysOfWeek
		);

		router.get(
			'/schedulde/full',
			isAuthorizated,
			vetController.getFullSchedulde
		);

		router.put('/schedulde', isAuthorizated, vetController.updateSchedulde);

		router.put('/', isAuthorizated, vetController.updateVet);
		this.router = router;
	}
}

export default VetRouter;
