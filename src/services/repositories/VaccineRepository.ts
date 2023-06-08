import Vaccination from '../../models/Vaccination';
import VaccineType from '../../models/VaccineType';
import Repository from './Repository';

const sql = require('mssql');

class VaccineRepository extends Repository {
	constructor(db) {
		super(db);
	}

	getAnimalCoreVaccineTypes = async (AnimalId: string) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);

			const results = await pool
				.request()
				.input('AnimalId', sql.VarChar, AnimalId)
				.query(
					'Select VaccineType,Species,Core From VaccineType where Species=(Select Family \
            From AnimalType aty \
                join Animal a on aty.AnimalTypeId=a.AnimalTypeId \
                where a.AnimalId=@AnimalId) \
            AND VaccineType NOT IN  \
                (Select VaccineType From AnimalVaccine where AnimalId=@AnimalId) and Core=1 \
            union Select * From VaccineType where Species is null and core=1 and \
            VaccineType NOT IN \
            (Select VaccineType From AnimalVaccine  where AnimalId=@AnimalId )'
				);

			const vaccineRecordset = results.recordset;
			if (vaccineRecordset.length == 0) {
				return null;
			}
			const coreVacciness: VaccineType[] = vaccineRecordset.map(
				(vaccineRecord) => {
					return new VaccineType(
						vaccineRecord.VaccineType,
						vaccineRecord.Species,
						vaccineRecord.Core
					);
				}
			);

			return coreVacciness;
		} catch (error) {
			console.log(error);

			return error;
		}
	};

	getAnimalVaccines = async (AnimalId: string) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);

			const results = await pool
				.request()
				.input('AnimalId', sql.VarChar, AnimalId)
				.query(
					'Select VaccineType, AnimalId, Date From AnimalVaccine Where AnimalId=@AnimalId Order By Date Desc'
				);

			const vaccineRecordset = results.recordset;
			if (vaccineRecordset.length == 0) {
				return null;
			}

			const animalVaccinations: Vaccination[] = vaccineRecordset.map(
				(vaccinationRecord) => {
					return new Vaccination(
						vaccinationRecord.AnimalId,
						vaccinationRecord.VaccineType,
						vaccinationRecord.Date.toISOString().split('T')[0]
					);
				}
			);

			return animalVaccinations;
		} catch (error) {
			console.log(error);

			return error;
		}
	};

	getVisitVaccineTypes = async (parameters: {
		unAdministratedAnimalId: string;
	}) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			let vaccineRecordset;
			if (parameters.unAdministratedAnimalId) {
				const results = await pool
					.request()
					.input('AnimalId', sql.VarChar, parameters.unAdministratedAnimalId)
					.query(
						'  Select * From VaccineType vt \
                    Where vt.VaccineType not in \
                    ( \
                    Select VaccineType \
                    From AnimalVaccine \
                    Where AnimalId=@AnimalId)\
                    and (vt.Species = \
                    (\
                    Select Family\
                    From Animal a \
                    join AnimalType aty  \
                    on a.AnimalTypeId=aty.AnimalTypeId \
                    where AnimalId=@AnimalId)\
                    or vt.Species is null\
                    )'
					);

				vaccineRecordset = results.recordset;
			} else {
				const results = await pool.request().query('Select * From VaccineType');

				vaccineRecordset = results.recordset;
			}
			if (vaccineRecordset.length == 0) {
				return null;
			}

			const vaccineTypes: VaccineType[] = vaccineRecordset.map(
				(vaccineRecord) => {
					return new VaccineType(
						vaccineRecord.VaccineType,
						vaccineRecord.Species,
						vaccineRecord.Core
					);
				}
			);

			return vaccineTypes;
		} catch (error) {
			console.log(error);

			return error;
		}
	};

	getVacciness = async () => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const results = await pool.request().query('Select * From VaccineType');

			const recordset = results.recordset;
			const vaccines: VaccineType = recordset.map((vaccine) => {
				return new VaccineType(
					vaccine.VaccineType,
					vaccine.Species,
					vaccine.Core
				);
			});

			return vaccines;
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	registerVaccine = async (vaccine: VaccineType) => {
		try {
			const vacccineType = vaccine.VaccineType.trim();
			const species = vaccine.Species;
			const core = vaccine.Core;
			console.log(vacccineType);
			const pool = await sql.connect(this.databaseConfiguration);
			let results = await pool
				.request()
				.input('VaccineType', sql.VarChar, vacccineType)
				.input('Species', sql.VarChar, species)
				.query('Select * From VaccineType Where VaccineType=@VaccineType ');
			if (results.recordset[0]) {
				return null;
			}

			results = await pool
				.request()
				.input('VaccineType', sql.VarChar, vacccineType)
				.input('Species', sql.VarChar, species)
				.input('Core', sql.Bit, core)
				.query('Insert into VaccineType values (@VaccineType,@Species,@Core)');

			if (results.rowsAffected[0] != 1) {
				throw Error('Transaction error');
			}

			return vacccineType;
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	deleteVaccine = async (vacccineType: string) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);

			const transaction = new sql.Transaction(pool);
			try {
				await transaction.begin();

				const results = await new sql.Request(transaction)
					.input('VaccineType', sql.VarChar, vacccineType)
					.query('Delete VaccineType Where VaccineType=@VaccineType');
				if (results.rowsAffected[0] < 1) {
					throw Error('Transaction failed');
				}

				await transaction.commit();
				return vacccineType;
			} catch (error) {
				console.log(error);
				await transaction.rollback();
				return error;
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	};
}
export default VaccineRepository;
