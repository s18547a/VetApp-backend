import express, { Router } from 'express';
import ClinicInfoController from '../controllers/ClinicInfoController';

class ClinicInfoRouter {
	router: Router;
	constructor(clinicInfoController: ClinicInfoController) {
		const router = express.Router();
		router.get('/schedulde', clinicInfoController.getClinicSchedulde);

		this.router = router;
	}
}

export default ClinicInfoRouter;
