import MedicalActivity from '../../models/MedicalActivity';
import { createIDwithUUIDV4 } from '../../utils/idHelpers';
import Repository from './Repository';

const sql = require('mssql');

class MedicalActivityRepository extends Repository {
	constructor(db) {
		super(db);
	}
	getMedicalActivities = async () => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const visitActivitiesPool = await pool
				.request()
				.query(
					'Select MedicalActivityId, ActivityName, Price From MedicalActivity Order By ActivityName'
				);
			const visitActivitiesRecordset = visitActivitiesPool.recordset;

			const medicalActivities = visitActivitiesRecordset.map((activit) => {
				return new MedicalActivity(
					activit.MedicalActivityId,
					activit.ActivityName,
					activit.Price
				);
			});

			return medicalActivities;
		} catch (error) {
			console.log(error);

			return error;
		}
	};

	getVisitMedicalActivies = async (VisitId) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const results = await pool
				.request()
				.input('VisitId', sql.VarChar, VisitId)
				.query(
					'Select vma.MedicalActivityId,ma.ActivityName,ma.Price From VisitMedicalActivities vma join MedicalActivity ma on vma.MedicalActivityId=ma.MedicalActivityId where vma.VisitId=@VisitId'
				);
			const visitMedicalActivitiesRecordset = results.recordset;
			if (results.recordset[0] == undefined) {
				return [];
			}

			const visitMedicalActivies: MedicalActivity[] =
				visitMedicalActivitiesRecordset.map((visitActivity) => {
					return new MedicalActivity(
						visitActivity.MedicalActivityId,
						visitActivity.ActivityName,
						visitActivity.Price
					);
				});

			return visitMedicalActivies;
		} catch (error) {
			console.log(error);

			return error;
		}
	};

	addMedicalActivity = async (activity) => {
		try {
			const MedicalActivityId: string = createIDwithUUIDV4();
			const ActivityName: string = activity.ActivityName;
			const Price: number = activity.Price;
			const pool = await sql.connect(this.databaseConfiguration);

			const checkResults = await pool
				.request()
				.input('ActivityName', sql.VarChar, ActivityName)
				.query(
					'Select * From MedicalActivity Where ActivityName=@ActivityName'
				);

			if (checkResults.recordset[0] != undefined) {
				return null;
			}

			const results = await pool
				.request()
				.input('MedicalActivityId', sql.VarChar, MedicalActivityId)
				.input('ActivityName', sql.VarChar, ActivityName)
				.input('Price', sql.VarChar, Price)
				.query(
					'Insert into MedicalActivity values(@MedicalActivityId,@ActivityName,@Price)'
				);

			const rowsAffected = results.rowsAffected[0];

			if (rowsAffected != 1) {
				throw Error('Failed to insert');
			} else return MedicalActivityId;
		} catch (error) {
			console.log(error);

			return error;
		}
	};
	deleteMedicalActivity = async (medicalActivityId: string) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const transaction = new sql.Transaction(pool);
			try {
				await transaction.begin();

				const results = await new sql.Request(transaction)
					.input('MedicalActivityId', sql.VarChar, medicalActivityId)
					.query(
						'Delete From MedicalActivity Where MedicalActivityId=@MedicalActivityId'
					);

				if (results.rowsAffected[0] < 1) {
					throw Error('Transaction errror');
				} else {
					transaction.commit();
					return medicalActivityId;
				}
			} catch (error) {
				transaction.rollback();
				throw Error('Transaction error');
			}
		} catch (error) {
			console.log(error);

			return error;
		}
	};
}
export default MedicalActivityRepository;
