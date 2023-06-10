import AnimalRepostiory from '../services/repositories/AnimalRepository';

import AnimalTypeRepository from '../services/repositories/AnimalTypeRepository';
import AnimalMedicalInfoRepository from '../services/repositories/AnimalMedicalInfoRepository';
import AnimalIllnessRepository from '../services/repositories/AnimalIllnessRepository';
import { GetAnimalType, GetAnimals } from '../common/Types';
import AnimalMedicalInfo from '../models/AnimalMedicalInfo';
import {
	getResponseHandler,
	postResponseHandler,
	putResponseHandler,
} from '../utils/responseHandler';

class AnimalController {
	animalRepository: AnimalRepostiory;
	animalTypeRepository: AnimalTypeRepository;
	animalMedicalInfoRepository: AnimalMedicalInfoRepository;
	animalIllnessRepository: AnimalIllnessRepository;

	constructor(
		animalRepository: AnimalRepostiory,
		animalTypeRepository: AnimalTypeRepository,
		animalMedicalInfoRepository: AnimalMedicalInfoRepository,
		animalIllnessRepository: AnimalIllnessRepository
	) {
		this.animalRepository = animalRepository;
		this.animalTypeRepository = animalTypeRepository;
		this.animalMedicalInfoRepository = animalMedicalInfoRepository;
		this.animalIllnessRepository = animalIllnessRepository;
	}

	getAnimal = async (req, res) => {
		const animalId = req.params.AnimalId;
		const result = await this.animalRepository.getAnimal(animalId);
		return getResponseHandler(res, result);
	};

	getAnimals = async (req, res) => {
		const parameters: GetAnimals = {
			ownerId: req.query.OwnerId,
			email: req.query.Email,
		};

		const result = await this.animalRepository.getAnimals(
			parameters,
			this.animalTypeRepository
		);

		return getResponseHandler(res, result);
	};

	registerAnimal = async (req, res) => {
		const animal = req.body;
		const results = await this.animalRepository.registerAnimal(animal);

		return postResponseHandler(res, results);
	};

	updateAnimal = async (req, res) => {
		const updatedAnimal = req.body;

		const results = await this.animalRepository.updateAnimal(updatedAnimal);

		return putResponseHandler(res, results);
	};

	getAnimalTypes = async (req, res) => {
		const parameters: GetAnimalType = {
			animalTypeId: req.query.AnimalTypeId,
		};
		const results = await this.animalTypeRepository.getAnimalTypes(parameters);
		return getResponseHandler(res, results);
	};

	getAnimalSpecies = async (req, res) => {
		const results = await this.animalTypeRepository.getAnimalSpecies();
		return getResponseHandler(res, results);
	};

	getIllnesses = async (req, res) => {
		const parameters = { animalId: req.params.AnimalId };

		const results = await this.animalIllnessRepository.getIllnesses(parameters);
		return getResponseHandler(res, results);
	};

	updateIllness = async (req, res) => {
		const parameters = {
			animalId: req.body.AnimalId,
			description: req.body.Description,
			visitId: req.body.VisitId,
			recoveryDate: req.body.RecoveryDate,
		};

		const results = await this.animalIllnessRepository.setIllnessCured(
			parameters
		);
		return putResponseHandler(res, results);
	};

	getMedicalInfo = async (req, res) => {
		const animalId = req.params.AnimalId;

		console.log(animalId);
		const results =
			await this.animalMedicalInfoRepository.getAnimalMedicalInformation(
				animalId
			);
		return getResponseHandler(res, results);
	};

	updateMedicalInfo = async (req, res) => {
		const animalMedicalInfo: AnimalMedicalInfo = req.body;
		const results =
			await this.animalMedicalInfoRepository.updateAnimalMedicalInfo(
				animalMedicalInfo
			);
		return putResponseHandler(res, results);
	};
}
export default AnimalController;
