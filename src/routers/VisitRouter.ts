import express, { Router } from 'express';
import VisitController from '../controllers/VisitController';
import { isAuthorizated } from '../middlewares/isAuthorizatied';

class VisitRouter {
	router: Router;
	constructor(visitController: VisitController) {
		const router = express.Router();
		router.get(
			'/activities',
			isAuthorizated,
			visitController.getVisitActivities
		);
		router.post(
			'/activities',
			isAuthorizated,
			visitController.addVisitActivity
		);
		router.delete(
			'/activities/:MedicalActivityId',
			isAuthorizated,
			visitController.deleteActivity
		);
		router.get('/search', isAuthorizated, visitController.searchVisits);
		router.get('/:VisitId', isAuthorizated, visitController.getVisit);

		router.get('/', isAuthorizated, visitController.getVisits);
		router.post('/', isAuthorizated, visitController.registerVisit);
		this.router = router;
	}
}

export default VisitRouter;
