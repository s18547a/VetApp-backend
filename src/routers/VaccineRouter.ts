import express, { Router } from 'express';
import VaccineController from '../controllers/VaccineController';
import { isAuthorizated } from '../middlewares/isAuthorizatied';

class VaccineRouter {
	router: Router;
	constructor(vaccineController: VaccineController) {
		const router = express.Router();

		router.get('/types', isAuthorizated, vaccineController.getVaccineTypes);
		router.get(
			'/:AnimalId',
			isAuthorizated,
			vaccineController.getAnimalVaccines
		);
		router.get(
			'/core/:AnimalId',
			isAuthorizated,
			vaccineController.getAnimalCoreVaccineTypes
		);
		router.get('/', isAuthorizated, vaccineController.getVacciness);
		router.post('/', isAuthorizated, vaccineController.registerVaccine);
		router.delete(
			'/:VaccineType',
			isAuthorizated,
			vaccineController.deleteVaccine
		);
		this.router = router;
	}
}

export default VaccineRouter;
