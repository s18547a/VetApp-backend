import { SearchVisitParameters, getSurgeryPrameters } from '../common/Types';
import {
	deleteResponseHandler,
	getResponseHandler,
	postResponseHandler,
	putResponseHandler,
} from '../utils/responseHandler';

class SurgeryController {
	surgeryRepository;

	constructor(surgeryRepository) {
		this.surgeryRepository = surgeryRepository;
	}
	getSurgery = async (req, res) => {
		const surgeryId: string = req.params.SurgeryId;
		const results = await this.surgeryRepository.getSurgery(surgeryId);

		return getResponseHandler(res, results);
	};

	getSurgeries = async (req, res) => {
		const parameters: getSurgeryPrameters = {
			ownerId: req.query.OwnerId,
			vetId: req.query.VetId,
			date: req.query.Date,
		};
		const results = await this.surgeryRepository.getSurgeries(parameters);

		return getResponseHandler(res, results);
	};

	getSurgeryTypes = async (req, res) => {
		const results = await this.surgeryRepository.getSurgeryTypes();
		return getResponseHandler(res, results);
	};

	searchSurgeries = async (req, res) => {
		const parameters: SearchVisitParameters = {
			email: req.query.Email,
			name: req.query.Name,
			date: req.query.Date,
			ownerId: req.query.OwnerId,
		};

		const results = await this.surgeryRepository.searchSurgeries(parameters);

		return getResponseHandler(res, results);
	};

	registerSurgery = async (req, res) => {
		const surgery = req.body;

		const results = await this.surgeryRepository.registerSurgery(surgery);
		return postResponseHandler(res, results);
	};

	updateSurgeryReport = async (req, res) => {
		const surgeryReport = req.body;

		const results = await this.surgeryRepository.updateSurgeryReport(
			surgeryReport
		);
		return putResponseHandler(res, results);
	};

	deleteSurgery = async (req, res) => {
		const surgeryId = req.params.SurgeryId;

		const results = await this.surgeryRepository.deleteSurgery(surgeryId);
		return deleteResponseHandler(res, results);
	};
}

export default SurgeryController;
