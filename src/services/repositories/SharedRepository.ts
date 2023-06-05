import Repository from './Repository';

export {};

const sql = require('mssql');

class SharedRepository extends Repository {
	constructor(db) {
		super(db);
	}

	emailExists = async (Email: string) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const results = await pool
				.request()
				.input('Email', sql.VarChar, Email)
				.query('Select UserId From [User] Where Email=@Email');
			if (!results.recordset[0]) {
				return false;
			} else return true;
		} catch (error) {
			return error;
		}
	};

	getPassword = async (UserId: string) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const results = await pool
				.request()
				.input('UserId', sql.VarChar, UserId)
				.query('Select Password From [User] Where UserId=@UserId');
			if (!results.recordset[0]) {
				throw Error('User doesnt exists');
			} else return results.recordset[0];
		} catch (error) {
			return error;
		}
	};
}

export default SharedRepository;
