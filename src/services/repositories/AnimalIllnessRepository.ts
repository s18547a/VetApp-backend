import { IllnessCuredParameters } from '../../common/Types';
import Illness from '../../models/Illness';

import Repository from './Repository';

const sql = require('mssql');

class AnimalIllnessRepository extends Repository {
	constructor(database) {
		super(database);
	}

	getIllnesses = async (parameters) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			let illnessRecordest;
			if (parameters.animalId) {
				const illnessPool = await pool
					.request()
					.input('AnimalId', sql.VarChar, parameters.animalId)
					.query(
						'Select AnimalId, VisitId, Description, DiagnosisDate, RecoveryDate   From Illness Where AnimalId=@AnimalId Order By DiagnosisDate DESC'
					);
				illnessRecordest = illnessPool.recordset;
			} else {
				const illnessPool = pool
					.request()
					.query(
						'Select AnimalId, VisitId, Description, DiagnosisDate, RecoveryDate From Illness '
					);
				illnessRecordest = illnessPool.recordset;
			}

			let isEmpty: boolean;

			illnessRecordest[0] == undefined ? (isEmpty = true) : (isEmpty = false);

			if (isEmpty) {
				return null;
			} else {
				const illnessList: Illness[] = illnessRecordest.map((illness) => {
					let recDate = illness.RecoveryDate;
					if (recDate != null) {
						recDate = recDate.toISOString().split('T')[0];
					}

					return new Illness(
						illness.AnimalId,
						illness.VisitId,
						illness.Description,
						illness.DiagnosisDate.toISOString().split('T')[0],
						recDate
					);
				});

				return illnessList;
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	setIllnessCured = async (parameters: IllnessCuredParameters) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);

			const illenssPool = await pool
				.request()
				.input('AnimalId', sql.VarChar, parameters.animalId)
				.input('Description', sql.VarChar, parameters.description)
				.input('VisitId', sql.VarChar, parameters.visitId)
				.input('RecoveryDate', sql.VarChar, parameters.recoveryDate)
				.query(
					'Update Illness Set RecoveryDate=@RecoveryDate  Where VisitId=@VisitId And AnimalId=@AnimalId and Description=@Description'
				);

			const rowsAffected = illenssPool.rowsAffected[0];
			if (rowsAffected == 1) {
				return parameters.animalId;
			} else throw Error('Transaction failed');
		} catch (error) {
			console.log(error);
			return error;
		}
	};
}
export default AnimalIllnessRepository;
