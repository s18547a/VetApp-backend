import sql from 'mssql';
import User from '../../models/User';

import Repository from './Repository';

class UserRepository extends Repository {
	constructor(db) {
		super(db);
	}

	getUserByEmail = async (Email: string) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const userPool = await pool
				.request()
				.input('Email', sql.VarChar, Email.trim())
				.query(
					'Select UserId, Email, Password, OwnerId, VetId, Manager   From [User] Where Email=@Email'
				);

			if (userPool.recordset.length == 0) {
				return null;
			}

			const userRecordset = userPool.recordset[0];
			let profileImage = null;
			if (userRecordset.VetId != null) {
				const pool = await sql.connect(this.databaseConfiguration);
				const imagePool = await pool
					.request()
					.input('VetId', sql.VarChar, userRecordset.VetId)
					.query('Select ProfileImage From Vet Where VetId=@VetId');

				profileImage = imagePool.recordset[0].ProfileImage;
			}

			return new User(
				userRecordset.UserId,
				userRecordset.Email,
				userRecordset.Password,
				userRecordset.OwnerId,
				userRecordset.VetId,
				userRecordset.Manager,
				profileImage
			);
		} catch (error) {
			console.log(error);
			return error;
		}
	};
}

export default UserRepository;
