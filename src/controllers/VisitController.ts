import { GetVisitPrarameters, SearchVisitParameters } from '../common/Types';
import MedicalActivityRepository from '../services/repositories/MedicalActivityRepository';
import VisitRepository from '../services/repositories/VisitRepository';
import {
	deleteResponseHandler,
	getResponseHandler,
	postResponseHandler,
} from '../utils/responseHandler';

class VisitController {
	visitRepository: VisitRepository;
	medicalActivityRepository: MedicalActivityRepository;
	constructor(
		visitRepository: VisitRepository,
		medicalActivityRepsoitory: MedicalActivityRepository
	) {
		this.visitRepository = visitRepository;
		this.medicalActivityRepository = medicalActivityRepsoitory;
	}

	getVisit = async (req, res) => {
		const visitId = req.params.VisitId;

		const results = await this.visitRepository.getVisit(visitId);

		return getResponseHandler(res, results);
	};

	getVisits = async (req, res) => {
		const parameters: GetVisitPrarameters = {
			animalId: req.query.AnimalId,
			vetId: req.query.VetId,
			ownerId: req.query.OwnerId,
		};

		const results = await this.visitRepository.getVisits(parameters);
		return getResponseHandler(res, results);
	};

	searchVisits = async (req, res) => {
		const parameters: SearchVisitParameters = {
			email: req.query.Email,
			name: req.query.Name,
			date: req.query.Date,
			ownerId: req.query.OwnerId,
		};

		const results = await this.visitRepository.searchVisits(parameters);

		return getResponseHandler(res, results);
	};

	registerVisit = async (req, res) => {
		const Visist = req.body;
		const results = await this.visitRepository.createVisit(Visist);

		return postResponseHandler(res, results);
	};

	getVisitActivities = async (req, res) => {
		const results = await this.medicalActivityRepository.getMedicalActivities();

		return getResponseHandler(res, results);
	};

	addVisitActivity = async (req, res) => {
		const newActivity = req.body;
		const results = await this.medicalActivityRepository.addMedicalActivity(
			newActivity
		);

		return postResponseHandler(res, results);
	};

	deleteActivity = async (req, res) => {
		const deletedId = req.params.MedicalActivityId;
		const results = await this.medicalActivityRepository.deleteMedicalActivity(
			deletedId
		);
		return deleteResponseHandler(res, results);
	};
}
export default VisitController;
