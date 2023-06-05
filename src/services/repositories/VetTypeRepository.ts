import { GetVetTypesParameters } from '../../common/Types';
import Repository from './Repository';
const sql = require('mssql');

class VetTypeRepository extends Repository {
	constructor(db) {
		super(db);
	}

	getVetTypes = async (parameters: GetVetTypesParameters) => {
		try {
			const returnList = true;
			let vetTypeRecoordset;
			const pool = await sql.connect(this.databaseConfiguration);
			if (parameters.vetId) {
				const vetTypePool = await pool
					.request()
					.input('VetId', sql.VarChar, parameters.vetId)
					.query(
						'Select vtv.VetType From Vet v inner join VetTypeVet vtv on v.VetId=vtv.VetId join VetType vt on vtv.VetType=vt.VetType where v.VetId=@VetId'
					);
				vetTypeRecoordset = vetTypePool.recordset;
			} else {
				const vetTypePool = await pool.request().query('Select * From VetType');
				vetTypeRecoordset = vetTypePool.recordset;
			}

			let isEmpty: boolean;
			vetTypeRecoordset[0] == undefined ? (isEmpty = true) : (isEmpty = false);

			if (isEmpty) {
				return null;
			} else {
				if (!returnList && vetTypeRecoordset.length == 1) {
					return vetTypeRecoordset[0];
				} else return vetTypeRecoordset;
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	};
}
export default VetTypeRepository;
