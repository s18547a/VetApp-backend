import express, { Router } from 'express';
import AnimalController from '../controllers/AnimalController';
const { isAuthorizated } = require('../middlewares/isAuthorizatied');

class AnimalRouter {
	router: Router;

	constructor(animalController: AnimalController) {
		const router = express.Router();

		router.get('/types', isAuthorizated, animalController.getAnimalTypes);

		router.get('/species', isAuthorizated, animalController.getAnimalSpecies);

		router.get('/:AnimalId', isAuthorizated, animalController.getAnimal);

		router.get('/', isAuthorizated, animalController.getAnimals);

		router.post('/', isAuthorizated, animalController.registerAnimal);

		router.put('/', isAuthorizated, animalController.updateAnimal);

		router.get(
			'/:AnimalId/illnesses',
			isAuthorizated,
			animalController.getIllnesses
		);

		router.put('/illnesses', isAuthorizated, animalController.updateIllness);

		router.get(
			'/:AnimalId/medicalInfo',
			isAuthorizated,
			animalController.getMedicalInfo
		);

		router.put(
			'/medicalInfo',
			isAuthorizated,
			animalController.updateMedicalInfo
		);

		this.router = router;
	}
}

export default AnimalRouter;
