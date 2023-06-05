import sql from 'mssql';

import Owner from '../../models/Owner';
import { createIDwithUUIDV4 } from '../../utils/idHelpers';
import { validateContact, validateEmail } from '../../utils/validator';

import { hashPassword } from '../../utils/auth/authUtils';
import Repository from './Repository';
import SharedRepository from './SharedRepository';
import { GetOwnerParamters } from '../../common/Types';

class OwnerRepository extends Repository {
	sharedRepository;
	constructor(db, sharedRepository: SharedRepository) {
		super(db);
		this.sharedRepository = sharedRepository;
	}

	getOwner = async (OwnerId: string): Promise<Owner | null | unknown> => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const result = await pool
				.request()
				.input('OwnerId', sql.VarChar, OwnerId)
				.query(
					'Select o.OwnerId,Name,LastName,Contact,u.Email ' +
						'From Owner o inner join [User] u on o.OwnerId=u.OwnerId where o.OwnerId=@OwnerId'
				);

			const ownerRecord = result.recordset[0];

			let isEmpty: boolean;

			ownerRecord == undefined ? (isEmpty = true) : (isEmpty = false);
			if (isEmpty) {
				return null;
			}

			const owner = new Owner(
				ownerRecord.OwnerId,
				ownerRecord.Name,
				ownerRecord.LastName,
				ownerRecord.Contact,
				ownerRecord.Email,
				ownerRecord.Password
			);

			return owner;
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	getOwners = async (parameters: GetOwnerParamters) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			let ownerRecordset;
			if (!parameters.animalId) {
				const result = await pool
					.request()
					.query(
						'Select o.OwnerId,Name,LastName,Contact,Email From Owner o inner join [User] u on o.OwnerId=u.OwnerId'
					);

				ownerRecordset = result.recordset;
			}

			let isEmpty: boolean;
			ownerRecordset[0] == undefined ? (isEmpty = true) : (isEmpty = false);

			if (isEmpty) {
				//  pool.close();
				return null;
			} else {
				const owners = ownerRecordset.map((owner) => {
					return new Owner(
						owner.OwnerId,
						owner.Name,
						owner.LastName,
						owner.Contact,
						owner.Email,
						owner.Password
					);
				});

				return owners;
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	registerOwner = async (owner) => {
		try {
			const UserId: string = createIDwithUUIDV4();
			const Email: string = validateEmail(owner.Email.trim());
			const Password: string | null = owner.Password.trim();
			const Name: string = owner.Name.trim();
			const LastName: string = owner.LastName.trim();
			const Contact: string = validateContact(owner.Contact).trim();
			const hashedPassword = hashPassword(Password);
			const emailExists: boolean = await this.sharedRepository.emailExists(
				Email
			);

			if (emailExists) {
				return null;
			}
			const pool = await sql.connect(this.databaseConfiguration);
			const transaction = new sql.Transaction(pool);
			try {
				await transaction.begin();
				let results = await new sql.Request(transaction)
					.input('UserId', sql.VarChar, UserId)
					.input('Email', sql.VarChar, Email)
					.input('Password', sql.VarChar, hashedPassword)
					.input('Name', sql.VarChar, Name)
					.input('LastName', sql.VarChar, LastName)
					.input('Contact', sql.VarChar, Contact)
					.query(
						'INSERT INTO Owner(OwnerId,Name,LastName,Contact) Values(@UserId,@Name,@LastName,@Contact)'
					);

				if (results.rowsAffected[0] != 1) {
					throw Error('Transaction error');
				}
				results = await new sql.Request(transaction)
					.input('UserId', sql.VarChar, UserId)
					.input('Email', sql.VarChar, Email)
					.input('Password', sql.VarChar, hashedPassword)
					.query(
						'INSERT INTO [USER](UserId,Email,Password,OwnerId,VetId,Manager)values(@UserId,@Email,@Password,@UserId,null,null);'
					);

				if (results.rowsAffected[0] != 1) {
					throw Error('Transaction error');
				}
				await transaction.commit();
				return UserId;
			} catch (error) {
				transaction.rollback();
				console.log(error);
				return Error('Trasaction error');
			}
		} catch (error: any) {
			if (error.message == 'validationError') {
				return null;
			}
			return error;
		}
	};
}

export default OwnerRepository;
