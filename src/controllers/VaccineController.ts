import VaccineType from '../models/VaccineType';
import VaccineRepository from '../services/repositories/VaccineRepository';
import {
	deleteResponseHandler,
	getResponseHandler,
	postResponseHandler,
} from '../utils/responseHandler';

interface getVaccineTypesParameters {
	unAdministratedAnimalId: string;
}
class VaccineController {
	vaccineRepository: VaccineRepository;
	constructor(vaccineReposity: VaccineRepository) {
		this.vaccineRepository = vaccineReposity;
	}

	getAnimalCoreVaccineTypes = async (req, res) => {
		const animalId: string = req.params.AnimalId;

		const results = await this.vaccineRepository.getAnimalCoreVaccineTypes(
			animalId
		);

		return getResponseHandler(res, results);
	};

	getAnimalVaccines = async (req, res) => {
		const animalId: string = req.params.AnimalId;

		const results = await this.vaccineRepository.getAnimalVaccines(animalId);

		return getResponseHandler(res, results);
	};

	getVaccineTypes = async (req, res) => {
		const parameters: getVaccineTypesParameters = {
			unAdministratedAnimalId: req.query.unAdministratedAnimalId,
		};

		const results = await this.vaccineRepository.getVisitVaccineTypes(
			parameters
		);

		return getResponseHandler(res, results);
	};

	getVacciness = async (req, res) => {
		const results = await this.vaccineRepository.getVacciness();
		return getResponseHandler(res, results);
	};

	registerVaccine = async (req, res) => {
		const vaccineType: VaccineType = req.body;

		const results = await this.vaccineRepository.registerVaccine(vaccineType);
		return postResponseHandler(res, results);
	};

	deleteVaccine = async (req, res) => {
		const vacccineType: string = req.params.VaccineType;
		const results = await this.vaccineRepository.deleteVaccine(vacccineType);
		return deleteResponseHandler(res, results);
	};
}
export default VaccineController;
