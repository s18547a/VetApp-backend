import AnimalType from '../../models/AnimalType';
import Repository from './Repository';

const sql = require('mssql');

class AnimalTypeRepository extends Repository {
	constructor(db) {
		super(db);
	}

	getAnimalTypes = async (parameters: { animalTypeId: string | undefined }) => {
		try {
			let animalTypeRecordSet;
			const pool = await sql.connect(this.databaseConfiguration);
			let returnList = true;
			if (!parameters.animalTypeId) {
				const animalTypePool = await pool
					.request()
					.query('Select AnimalTypeId, Family, Race From AnimalType');
				animalTypeRecordSet = animalTypePool.recordset;
			} else {
				const animalTypePool = await pool
					.request()
					.input('AnimalTypeId', sql.VarChar, parameters.animalTypeId)
					.query(
						'Select AnimalTypeId, Family, Race From AnimalType where AnimalTypeId=@AnimalTypeId'
					);
				animalTypeRecordSet = animalTypePool.recordset;
				returnList = false;
			}

			const animalTypes: AnimalType[] = animalTypeRecordSet.map(
				(animalType) => {
					return new AnimalType(
						animalType.AnimalTypeId,
						animalType.Family,
						animalType.Race
					);
				}
			);
			if (returnList == false) {
				return animalTypes[0];
			} else return animalTypes;
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	getAnimalSpecies = async () => {
		try {
			let pool = await sql.connect(this.databaseConfiguration);

			const results = await pool
				.request()
				.query('Select Family From AnimalType Group by Family');

			const speciesList: (string | null)[] = results.recordset.map(
				(species) => {
					return species.Family;
				}
			);
			speciesList.push(null);

			return speciesList;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
}
export default AnimalTypeRepository;
