/* eslint-disable indent */

import { createIDwithUUIDV4 } from '../../utils/idHelpers';

import { validateContact, validateEmail } from '../../utils/validator';
import { hashPassword } from '../../utils/auth/authUtils';
import { getDayOfAWeekName } from '../../utils/dateHelper';
import VetTypeRepository from './VetTypeRepository';

import Repository from './Repository';
import SharedRepository from './SharedRepository';
import { GetVetParameters } from '../../common/Types';
import Vet from '../../models/Vet';

const sql = require('mssql');

class VetRepository extends Repository {
	vetTypeRepository;
	sharedRepository;
	constructor(
		db,
		vetTypeRepository: VetTypeRepository,
		sharedRepository: SharedRepository
	) {
		super(db);
		this.vetTypeRepository = vetTypeRepository;
		this.sharedRepository = sharedRepository;
	}

	getVet = async (vetId: string) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const results = await pool
				.request()
				.input('VetId', sql.VarChar, vetId)
				.query(
					'Select v.VetId, Name,LastName, Contact,HireDate, u.Email, ProfileImage From Vet v join [User] u on v.VetId=u.VetId where v.VetId=@VetId'
				);
			const vetRecord = results.recordset[0];

			if (vetRecord == undefined) {
				return null;
			}

			let vetTypes = await this.vetTypeRepository.getVetTypes({ vetId: vetId });

			if (vetTypes === null) {
				vetTypes = [];
			}

			const vet = new Vet(
				vetRecord.VetId,
				vetRecord.Name,
				vetRecord.LastName,
				vetRecord.Contact,
				vetRecord.Email,
				vetRecord.HireDate.toISOString().split('T')[0],
				vetRecord.ProfileImage,
				vetTypes
			);
			return vet;
		} catch (error) {
			console.log(error);

			return error;
		}
	};

	getVets = async (parameters: GetVetParameters) => {
		try {
			let vetsRecordset: any[] = [];
			const pool = await sql.connect(this.databaseConfiguration);

			if (parameters.date) {
				const newDate = getDayOfAWeekName(parameters.date);

				const vetPool = await pool
					.request()
					.query(
						`Select v.VetId, Name,LastName, Contact,HireDate, ProfileImage From Vet v join Schedulde s on v.VetId=s.VetId where ${newDate} is not null Order by HireDate desc`
					);
				vetsRecordset = vetPool.recordset;
			} else if (parameters.vetType) {
				const vetPool = await pool
					.request()
					.input('VetType', sql.VarChar, parameters.vetType)
					.query(
						'Select v.VetId,v.Name,v.LastName, v.Contact,v.HireDate, v.ProfileImage From Vet v join VetTypeVet vtv on v.VetId=vtv.VetId join SurgeryType st on vtv.VetType=st.VetType where st.SurgeryType=@VetType Order by v.HireDate desc'
					);
				vetsRecordset = vetPool.recordset;
			} else if (!parameters.vetType && !parameters.date) {
				const vetPool = await pool
					.request()

					.query(
						'Select v.VetId,v.Name,v.LastName, v.Contact,v.HireDate, u.Email, v.ProfileImage From Vet v join [User] u on v.VetId=u.VetId Order by v.HireDate desc'
					);
				vetsRecordset = vetPool.recordset;
			}

			let isEmpty: boolean;

			vetsRecordset[0] == undefined ? (isEmpty = true) : (isEmpty = false);
			if (isEmpty) {
				return null;
			} else {
				const vets: Vet[] = await Promise.all(
					vetsRecordset.map(async (vet) => {
						let vetTypes: { VetType: string; Salary: number }[] =
							await this.vetTypeRepository.getVetTypes({ VetId: vet.VetId });

						if (vetTypes === null) {
							vetTypes = [];
						}

						return new Vet(
							vet.VetId,
							vet.Name,
							vet.LastName,
							vet.Contact,
							vet.Email,
							vet.HireDate.toISOString().split('T')[0],
							vet.ProfileImage,
							vetTypes
						);
					})
				);

				return vets;
			}
		} catch (error) {
			console.log(error);

			return error;
		}
	};

	registerVet = async (vet) => {
		try {
			const VetId: string = createIDwithUUIDV4();
			const Email: string = validateEmail(vet.Email.trim());
			const Password: string | null = vet.Password.trim();
			const Name: string = vet.Name.trim();
			const LastName: string = vet.LastName.trim();
			const Contact: string = validateContact(vet.Contact);
			const HireDate: string = vet.HireDate.trim();
			const ProfileImage: string | null = vet.ProfileImage;
			const VetType: string[] = vet.VetType;

			const hashedPassword = hashPassword(Password);

			const emailExists = await this.sharedRepository.emailExists(Email);

			if (emailExists) {
				return null;
			}
			const pool = await sql.connect(this.databaseConfiguration);
			const transaction = new sql.Transaction(pool);
			try {
				await transaction.begin();
				let results = await new sql.Request(transaction)
					.input('VetId', sql.VarChar, VetId)
					.input('Name', sql.VarChar, Name)
					.input('LastName', sql.VarChar, LastName)
					.input('Contact', sql.VarChar, Contact)
					.input('HireDate', sql.VarChar, HireDate)
					.input('ProfileImage', sql.VarChar, ProfileImage)
					.query(
						'INSERT into VET values(@VetId,@Name,@LastName,@Contact,@HireDate,@ProfileImage)'
					);

				const rowsAffected = results.rowsAffected[0];

				if (rowsAffected != 1) {
					throw Error('Transaction error');
				}
				results = await new sql.Request(transaction)
					.input('VetId', sql.VarChar, VetId)
					.input('Email', sql.VarChar, Email)
					.input('Password', sql.VarChar, hashedPassword)

					.query(
						'INSERT INTO [USER](UserId,Email,Password,OwnerId,VetId,Manager)values(@VetId,@Email,@Password,null,@VetId,null);'
					);

				if (results.rowsAffected[0] != 1) {
					throw Error('Transactio error');
				}

				if (VetType.length > 0) {
					for await (const value of VetType) {
						const vetTypeResult = await new sql.Request(transaction)
							.input('VetId', sql.VarChar, VetId)
							.input('VetType', sql.VarChar, value)
							.query(
								'Insert Into VetTypeVet(VetId,VetType) values(@VetId,@VetType)'
							);

						if (vetTypeResult.rowsAffected[0] != 1) {
							throw Error('Transaction error');
						}
					}
				}

				const createScheduldeResults = await this.createVetSchedulde(
					VetId,
					transaction
				);
				if (createScheduldeResults != VetId) {
					throw Error('Transaction error');
				}
				await transaction.commit();
				pool.close();
				return VetId;
			} catch (error) {
				console.log(error);
				await transaction.rollback();
				pool.close();
				throw Error('Transaction error');
			}
		} catch (error: any) {
			if (error.message == 'validationError') {
				return null;
			}
			console.log(error);
			return error;
		}
	};

	updateVet = async (Vet) => {
		try {
			const VetId: string = Vet.VetId.trim();
			const Name: string = Vet.Name.trim();
			const LastName: string = Vet.LastName.trim();
			const Email: string = Vet.Email.trim();
			const Contact: string = validateContact(Vet.Contact.trim());
			const HireDate = Vet.HireDate.trim();
			const ProfileImage = Vet.ProfileImage;
			const OldEmail = Vet.OldEmail.trim();
			const VetTypes = Vet.VetType;
			if (OldEmail != Email) {
				const sharedRepository = new SharedRepository(
					this.databaseConfiguration
				);
				const emailExists = await sharedRepository.emailExists(Email);

				if (emailExists) {
					return null;
				}
			}
			const pool = await sql.connect(this.databaseConfiguration);

			const transaction = await new sql.Transaction(pool);
			try {
				await transaction.begin();
				let results = await new sql.Request(transaction)
					.input('VetId', sql.VarChar, VetId)
					.input('Name', sql.VarChar, Name)
					.input('LastName', sql.VarChar, LastName)
					.input('Contact', sql.VarChar, Contact)
					.input('ProfileImage', sql.VarChar, ProfileImage)
					.input('HireDate', sql.VarChar, HireDate)
					.query(
						'Update Vet set Name=@Name, LastName=@LastName, Contact=@Contact, ProfileImage=@ProfileImage, HireDate=@HireDate  Where VetId=@VetId'
					);

				if (results.rowsAffected[0] != 1) {
					throw Error('Transaction error');
				}

				results = await new sql.Request(transaction)
					.input('Email', sql.VarChar, Email)
					.input('VetId', sql.VarChar, VetId)
					.query('Update [User] set Email=@Email Where VetId=@VetId');

				if (results.rowsAffected[0] != 1) {
					throw Error('Transaction error');
				}

				results = await new sql.Request(transaction)
					.input('VetId', sql.VarChar, VetId)
					.query('Delete From VetTypeVet Where VetId=@VetId');

				if (results instanceof Error) {
					throw Error('Failed to delete from VetType');
				}
				if (VetTypes.length > 0) {
					for await (const type of VetTypes) {
						const results = await new sql.Request(transaction)
							.input('VetId', sql.VarChar, VetId)
							.input('VetType', sql.VarChar, type)
							.query(
								'Insert Into VetTypeVet(VetId,VetType) values(@VetId,@VetType)'
							);

						if (results.rowsAffected[0] != 1) {
							throw Error('Transaction error ');
						}
					}
				}

				await transaction.commit();
				return VetId;
			} catch (error) {
				await transaction.rollback();
				console.log(error);
				throw Error('Transaction error');
			}
		} catch (error: any) {
			if (error.message == 'validationError') {
				return null;
			}
			console.log(error);
			return error;
		}
	};

	createVetSchedulde = async (VetId: string, transaction) => {
		try {
			const vetId: string = VetId;

			const results = await new sql.Request(transaction)
				.input('VetId', sql.VarChar, vetId)
				.query(
					'Insert Into Schedulde(VetId,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday) values (@VetId,null,null,null,null,null,null,null)'
				);

			const rowsAffected = results.rowsAffected[0];
			if (rowsAffected != 1) {
				throw Error('Transaction error');
			} else return VetId;
		} catch (error) {
			console.log(error);

			return error;
		}
	};
}

export default VetRepository;
