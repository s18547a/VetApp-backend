import ClinicInfoRepository from '../services/repositories/ClinicInfoRepository';
import { getResponseHandler } from '../utils/responseHandler';

class ClinicInfoController {
	clinicInfoRepository: ClinicInfoRepository;
	constructor(clinicInfoRepository: ClinicInfoRepository) {
		this.clinicInfoRepository = clinicInfoRepository;
	}

	getClinicSchedulde = async (req, res) => {
		const results = await this.clinicInfoRepository.getClinicSchedulde();
		return getResponseHandler(res, results);
	};
}
export default ClinicInfoController;
