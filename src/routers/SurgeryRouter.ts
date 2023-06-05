import express, { Router } from 'express';
import SurgeryController from '../controllers/SurgeryController';
import { isAuthorizated } from '../middlewares/isAuthorizatied';

class SurgeryRouter {
	router: Router;
	constructor(surgeryController: SurgeryController) {
		const router = express.Router();
		router.get('/types', isAuthorizated, surgeryController.getSurgeryTypes);
		router.get('/search', isAuthorizated, surgeryController.searchSurgeries);
		router.get('/:SurgeryId', isAuthorizated, surgeryController.getSurgery);

		router.get('/', isAuthorizated, surgeryController.getSurgeries);
		router.post('/', isAuthorizated, surgeryController.registerSurgery);
		router.put(
			'/:SurgeryId/report',
			isAuthorizated,
			surgeryController.updateSurgeryReport
		);
		router.delete(
			'/:SurgeryId',
			isAuthorizated,
			surgeryController.deleteSurgery
		);

		this.router = router;
	}
}
export default SurgeryRouter;
