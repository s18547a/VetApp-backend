import { GetOwnerParamters } from '../common/Types';
import OwnerRepository from '../services/repositories/OwnerRepository';
import {
	getResponseHandler,
	postResponseHandler,
} from '../utils/responseHandler';

class OwnerController {
	ownerRepository: OwnerRepository;
	constructor(ownerRepository: OwnerRepository) {
		this.ownerRepository = ownerRepository;
	}
	getOwner = async (req, res) => {
		const ownerId = req.params.OwnerId;

		const results = await this.ownerRepository.getOwner(ownerId);
		return getResponseHandler(res, results);
	};

	getOwners = async (req, res) => {
		const parameters: GetOwnerParamters = {
			animalId: req.query.AnimalId,
		};
		const results = await this.ownerRepository.getOwners(parameters);
		return getResponseHandler(res, results);
	};

	registerOwner = async (req, res) => {
		const newOwner = req.body;

		const results = await this.ownerRepository.registerOwner(newOwner);

		return postResponseHandler(res, results);
	};
}

export default OwnerController;
