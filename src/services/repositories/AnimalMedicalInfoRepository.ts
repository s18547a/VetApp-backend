import AnimalMedicalInfo from '../../models/AnimalMedicalInfo';
import Repository from './Repository';
const sql = require('mssql');

class AnimalMedicalInfoRepository extends Repository {
	constructor(db) {
		super(db);
	}

	getAnimalMedicalInformation = async (AnimalId: string) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);

			const animalMedInfoPool = await pool
				.request()
				.input('AnimalId', sql.VarChar, AnimalId)
				.query('Select * From AnimalMedicalInfo Where AnimalId = @AnimalId');

			const animalMedInfoRecord = animalMedInfoPool.recordset[0];

			if (animalMedInfoRecord) {
				const animalMedicalInfo = new AnimalMedicalInfo(
					animalMedInfoRecord.AnimalId,
					animalMedInfoRecord.Weight,
					animalMedInfoRecord.Chipped,
					animalMedInfoRecord.Sterilized,
					animalMedInfoRecord.Skeletal,
					animalMedInfoRecord.Muscular,
					animalMedInfoRecord.Nervous,
					animalMedInfoRecord.Endocrine,
					animalMedInfoRecord.Cardiovascular,
					animalMedInfoRecord.Lymphatic,
					animalMedInfoRecord.Respiratory,
					animalMedInfoRecord.Digestive,
					animalMedInfoRecord.Urinary,
					animalMedInfoRecord.Reproductive,
					animalMedInfoRecord.Optical,
					animalMedInfoRecord.Decimal,
					animalMedInfoRecord.Dermatological,
					animalMedInfoRecord.Others
				);

				return animalMedicalInfo;
			} else return null;
		} catch (error) {
			console.log(error);

			return error;
		}
	};

	updateAnimalMedicalInfo = async (AnimalMedicalInfo: AnimalMedicalInfo) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);

			const animalMedInfoPool = await pool
				.request()
				.input('AnimalId', sql.VarChar, AnimalMedicalInfo.AnimalId)
				.input('Weight', sql.Decimal(5, 2), AnimalMedicalInfo.Weight)
				.input('Chipped', sql.Bit, AnimalMedicalInfo.Chipped)
				.input('Sterilized', sql.Bit, AnimalMedicalInfo.Sterilized)
				.input('Skeletal', sql.VarChar, AnimalMedicalInfo.Skeletal)
				.input('Muscular', sql.VarChar, AnimalMedicalInfo.Muscular)
				.input('Nervous', sql.VarChar, AnimalMedicalInfo.Nervous)
				.input('Endocrine', sql.VarChar, AnimalMedicalInfo.Endocrine)
				.input('Cardiovascular', sql.VarChar, AnimalMedicalInfo.Cardiovascular)
				.input('Lymphatic', sql.VarChar, AnimalMedicalInfo.Lymphatic)
				.input('Respiratory', sql.VarChar, AnimalMedicalInfo.Respiratory)
				.input('Digestive', sql.VarChar, AnimalMedicalInfo.Digestive)
				.input('Urinary', sql.VarChar, AnimalMedicalInfo.Urinary)
				.input('Reproductive', sql.VarChar, AnimalMedicalInfo.Reproductive)
				.input('Optical', sql.VarChar, AnimalMedicalInfo.Optical)
				.input('Dental', sql.VarChar, AnimalMedicalInfo.Dental)
				.input('Dermatological', sql.VarChar, AnimalMedicalInfo.Dermatological)
				.input('Others', sql.VarChar, AnimalMedicalInfo.Others)

				.query(
					'Update  AnimalMedicalInfo set Chipped=@Chipped, Sterilized=@Sterilized, Skeletal=@Skeletal, Muscular=@Muscular,Nervous=@Nervous,Endocrine=@Endocrine,Cardiovascular=@Cardiovascular,Lymphatic =@Lymphatic ,Respiratory=@Respiratory,Digestive=@Digestive,Urinary=@Urinary, Reproductive=@Reproductive,Optical=@Optical, Dental=@Dental, Dermatological=@Dermatological,Others=@Others, Weight=@Weight Where AnimalId=@AnimalId'
				);

			if (animalMedInfoPool.rowsAffected[0] != 1) {
				return Error('Transaction failed');
			} else return AnimalMedicalInfo.AnimalId;
		} catch (error) {
			console.log(error);

			return error;
		}
	};
}
export default AnimalMedicalInfoRepository;
