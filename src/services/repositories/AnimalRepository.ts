import { GetAnimals } from '../../common/Types';
import Animal, { Sex } from '../../models/Animal';

import { createIDwithUUIDV4 } from '../../utils/idHelpers';
import AnimalTypeRepository from './AnimalTypeRepository';
import OwnerRepository from './OwnerRepository';
import Repository from './Repository';

const sql = require('mssql');

class AnimalRepostiory extends Repository {
	animalTypeRepository;
	ownerRepository;

	constructor(
		databse,
		animalTypeRepository: AnimalTypeRepository,
		ownerRepository: OwnerRepository
	) {
		super(databse);
		this.animalTypeRepository = animalTypeRepository;
		this.ownerRepository = ownerRepository;
		//
	}
	getAnimal = async (animalId: string) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const result = await pool
				.request()
				.input('AnimalId', sql.VarChar, animalId)
				.query(
					'Select AnimalId,Name,BirthDate,AnimalTypeId,OwnerId,ProfileImage,Sex From Animal where AnimalId=@AnimalId'
				);
			const animalRecord = result.recordset[0];

			if (animalRecord == undefined) {
				return null;
			}

			const animalType = await this.animalTypeRepository.getAnimalTypes({
				animalTypeId: animalRecord.AnimalTypeId,
			});

			const ownerResult = await this.ownerRepository.getOwner(
				animalRecord.OwnerId
			);

			const newAnimal = new Animal(
				animalId,
				animalRecord.Name,
				animalRecord.BirthDate.toISOString().split('T')[0],
				animalRecord.OwnerId,
				animalRecord.ProfileImage,
				animalRecord.Sex,
				animalRecord.AnimalTypeId,
				animalType,
				{ Email: ownerResult.Email }
			);

			return newAnimal;
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	getAnimals = async (parameters: GetAnimals, animalTypeRepository) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			let animalsRecordset;

			if (!parameters.ownerId && !parameters.email) {
				const result = await pool
					.request()
					.query(
						'Select AnimalId, Name, BirthDate, AnimalTypeId, OwnerId, Sex  From Animal'
					);
				animalsRecordset = result.recordset;
			} else if (parameters.ownerId) {
				const result = await pool
					.request()
					.input('OwnerId', sql.VarChar, parameters.ownerId)
					.query(
						'Select AnimalId, Name, BirthDate, AnimalTypeId, OwnerId, ProfileImage, Sex From Animal Where OwnerId=@OwnerId'
					);
				animalsRecordset = result.recordset;
			} else if (parameters.email) {
				const result = await pool
					.request()
					.query(
						`Select AnimalId,Name,BirthDate,u.OwnerId,Sex,AnimalTypeId From Animal a join [User] u on a.OwnerId=u.OwnerId   where u.Email like '${parameters.email}%'`
					);
				animalsRecordset = result.recordset;
			}

			let isEmpty: boolean;
			animalsRecordset[0] == undefined || animalsRecordset[0] === null
				? (isEmpty = true)
				: (isEmpty = false);

			if (isEmpty) {
				return null;
			} else {
				const animals: Animal[] = await Promise.all(
					animalsRecordset.map(async (animal) => {
						const AnimalType = await animalTypeRepository.getAnimalTypes({
							animalTypeId: animal.AnimalTypeId,
						});

						const ownerResult = await this.ownerRepository.getOwner(
							animal.OwnerId
						);

						const newAnimal = new Animal(
							animal.AnimalId,
							animal.Name,
							animal.BirthDate.toISOString().split('T')[0],

							animal.OwnerId,
							animal.ProfileImage,
							animal.Sex,
							animal.AnimalTypeId,

							AnimalType,
							{ Email: ownerResult.Email }
						);

						return newAnimal;
					})
				);

				return animals;
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	};
	registerAnimal = async (newAnimal) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);

			const transaction = new sql.Transaction(pool);

			try {
				const AnimalId: string = createIDwithUUIDV4();
				const Name: string = newAnimal.Name.trim();
				const BirthDate: string = newAnimal.BirthDate.trim();
				const AnimalTypeId: string = newAnimal.AnimalTypeId.trim();
				const OwnerId: string | null = newAnimal.OwnerId.trim();
				const Sex: Sex = newAnimal.Sex;

				const ProfileImage: string = newAnimal.ProfileImage;

				await transaction.begin();
				const results = await new sql.Request(transaction)
					.input('AnimalId', sql.VarChar, AnimalId)
					.input('Name', sql.VarChar, Name)
					.input('BirthDate', sql.Date, BirthDate)
					.input('AnimalTypeId', sql.VarChar, AnimalTypeId)
					.input('OwnerId', sql.VarChar, OwnerId)
					.input('Sex', sql.TinyInt, Sex)
					.input('ProfileImage', sql.VarChar, ProfileImage)
					.query(
						'Insert into Animal(AnimalId,Name,BirthDate,AnimalTypeId,OwnerId,ProfileImage,Sex) values(@AnimalId,@Name,@BirthDate,@AnimalTypeId,@OwnerId,@ProfileImage,@Sex)'
					);
				const rowsAffected = results.rowsAffected[0];

				if (rowsAffected != 1) {
					throw Error('Transaction error');
				} else {
					const createAnimalMedicalInformationResult = await new sql.Request(
						transaction
					)
						.input('AnimalId', sql.VarChar, AnimalId)
						.query(
							"Insert into AnimalMedicalInfo(AnimalId,Chipped,Sterilized,Skeletal,Muscular,Nervous,Endocrine,Cardiovascular,Lymphatic,Respiratory,Digestive,Urinary,Reproductive,Optical,Dental,Dermatological ,Others,Weight) values(@AnimalId,null,null,'','','','','','','','','','','','','','',null)"
						);
					if (createAnimalMedicalInformationResult.rowsAffected[0] != 1) {
						throw Error('Transaction failed');
					} else {
						await transaction.commit();

						return AnimalId;
					}
				}
			} catch (error) {
				await transaction.rollback();
				console.log(error);
				throw error;
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	updateAnimal = async (Animal) => {
		const AnimalId: string | null = Animal.AnimalId.trim();
		const Name: string = Animal.Name.trim();
		const BirthDate: string = Animal.BirthDate.trim();

		const AnimalTypeId: string = Animal.AnimalTypeId.trim();
		const OwnerId: string = Animal.OwnerId.trim();
		const Sex: number = Animal.Sex;

		const ProfileImage: string | null = Animal.ProfileImage;

		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const results = await pool
				.request()
				.input('Name', sql.VarChar, Name)
				.input('BirthDate', sql.Date, BirthDate)

				.input('AnimalTypeId', sql.VarChar, AnimalTypeId)
				.input('OwnerId', sql.VarChar, OwnerId)
				.input('Sex', sql.TinyInt, Sex)

				.input('AnimalId', sql.VarChar, AnimalId)
				.input('ProfileImage', sql.VarChar, ProfileImage)

				.query(
					'Update Animal set Name=@Name, BirthDate = @BirthDate,Sex=@Sex,AnimalTypeId=@AnimalTypeId,OwnerId=@OwnerId, ProfileImage=@ProfileImage where AnimalId=@AnimalId'
				);

			if (results.rowsAffected[0] != 1) {
				throw Error('Transaction failed');
			}

			return AnimalId;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
}
export default AnimalRepostiory;
