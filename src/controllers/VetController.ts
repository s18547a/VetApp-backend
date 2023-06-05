import {
	GetScheduldeParamters,
	GetTodaySchedulde,
	GetVetParameters,
} from '../common/Types';
import Schedulde from '../models/Schedulde';
import VetRepository from '../services/repositories/VetRepository';
import VetScheduldeRepository from '../services/repositories/VetScheduldeRepository';
import VetTypeRepository from '../services/repositories/VetTypeRepository';
import {
	getResponseHandler,
	postResponseHandler,
	putResponseHandler,
} from '../utils/responseHandler';

class VetController {
	vetRepository: VetRepository;
	vetTypeRepository: VetTypeRepository;
	vetScheduldeRepository: VetScheduldeRepository;

	constructor(
		vetRepository: VetRepository,
		vetTypeRepository: VetTypeRepository,
		vetScheduldeRepository: VetScheduldeRepository
	) {
		this.vetRepository = vetRepository;
		this.vetTypeRepository = vetTypeRepository;
		this.vetScheduldeRepository = vetScheduldeRepository;
	}

	getVet = async (req, res) => {
		const vetId = req.params.VetId;
		const results = await this.vetRepository.getVet(vetId);

		return getResponseHandler(res, results);
	};

	getVets = async (req, res) => {
		const parameters: GetVetParameters = {
			date: req.query.Date,

			vetType: req.query.VetType,
		};
		const results = await this.vetRepository.getVets(parameters);

		return getResponseHandler(res, results);
	};

	getVetTypes = async (req, res) => {
		const parameters = {
			vetId: req.query.VetId,
		};
		const results = await this.vetTypeRepository.getVetTypes(parameters);
		return getResponseHandler(res, results);
	};

	registerVet = async (req, res) => {
		const newVet = req.body;

		const results = await this.vetRepository.registerVet(newVet);

		return postResponseHandler(res, results);
	};

	updateVet = async (req, res) => {
		const updateVet = req.body;
		const results = await this.vetRepository.updateVet(updateVet);

		return putResponseHandler(res, results);
	};

	getAvailableHours = async (req, res) => {
		const isSurgery = req.query.isSurgery == 'false' ? false : true;
		const parameters: GetScheduldeParamters = {
			date: req.query.Date,
			vetId: req.query.VetId,
			isSurgery: isSurgery,
		};
		const results = await this.vetScheduldeRepository.getAvailableHours(
			parameters
		);

		return getResponseHandler(res, results);
	};

	getVetSchedulde = async (req, res) => {
		const vetId: string = req.params.VetId;

		const results = await this.vetScheduldeRepository.getSchedulde(vetId);
		return getResponseHandler(res, results);
	};

	getVetDaysOfWeek = async (req, res) => {
		const vetId: string = req.params.VetId;
		const results = await this.vetScheduldeRepository.getVetDaysOfWeek(vetId);
		return getResponseHandler(res, results);
	};

	updateSchedulde = async (req, res) => {
		const updatedSchedulde: Schedulde = req.body;
		const results = await this.vetScheduldeRepository.updateSchedulde(
			updatedSchedulde
		);
		return putResponseHandler(res, results);
	};

	getFullSchedulde = async (req, res) => {
		const results = await this.vetScheduldeRepository.getFullSchedulde();
		return getResponseHandler(res, results);
	};

	getTodaySchedulde = async (req, res) => {
		const parameters: GetTodaySchedulde = {
			date: req.query.Date,
			vetId: req.query.VetId,
		};
		const results = await this.vetScheduldeRepository.getTodaySchedulde(
			parameters
		);

		return getResponseHandler(res, results);
	};
}

export default VetController;
