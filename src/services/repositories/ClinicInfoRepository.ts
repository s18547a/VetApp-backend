import {
	getScheduldeEarliestHour,
	getScheduldeLatestHour,
} from '../../utils/clinicScheduldeUtils';
import Repository from './Repository';

const sql = require('mssql');

class ClinicInfoRepository extends Repository {
	constructor(db) {
		super(db);
	}

	getClinicSchedulde = async () => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const scheduldePool = await pool
				.request()
				.query(
					'Select Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday From Schedulde'
				);
			const scheduldeRepository = scheduldePool.recordset;

			const Mondays: string[] = [];
			const Wednesdays: string[] = [];
			const Tuesdays: string[] = [];
			const Thursdays: string[] = [];
			const Fridays: string[] = [];
			const Saturdays: string[] = [];
			const Sundays: string[] = [];

			scheduldeRepository.forEach((schedule) => {
				if (schedule.Monday != null) {
					Mondays.push(schedule.Monday);
				}
				if (schedule.Tuesday != null) {
					Tuesdays.push(schedule.Tuesday);
				}
				if (schedule.Wednesday != null) {
					Wednesdays.push(schedule.Wednesday);
				}
				if (schedule.Thursday != null) {
					Thursdays.push(schedule.Thursday);
				}
				if (schedule.Friday != null) {
					Fridays.push(schedule.Friday);
				}
				if (schedule.Saturday != null) {
					Saturdays.push(schedule.Saturday);
				}
				if (schedule.Sunday != null) {
					Sundays.push(schedule.Sunday);
				}
			});

			return {
				Monday:
					getScheduldeEarliestHour(Mondays) == null
						? null
						: `${getScheduldeEarliestHour(Mondays)}-${getScheduldeLatestHour(
								Mondays
						  )}`,
				Tuesday:
					getScheduldeEarliestHour(Tuesdays) == null
						? null
						: `${getScheduldeEarliestHour(Tuesdays)}-${getScheduldeLatestHour(
								Tuesdays
						  )}`,
				Wednesday:
					getScheduldeEarliestHour(Wednesdays) == null
						? null
						: `${getScheduldeEarliestHour(Wednesdays)}-${getScheduldeLatestHour(
								Wednesdays
						  )}`,
				Thursday:
					getScheduldeEarliestHour(Thursdays) == null
						? null
						: `${getScheduldeEarliestHour(Thursdays)}-${getScheduldeLatestHour(
								Thursdays
						  )}`,
				Friday:
					getScheduldeEarliestHour(Fridays) == null
						? null
						: `${getScheduldeEarliestHour(Fridays)}-${getScheduldeLatestHour(
								Fridays
						  )}`,
				Saturday:
					getScheduldeEarliestHour(Saturdays) == null
						? null
						: `${getScheduldeEarliestHour(Saturdays)}-${getScheduldeLatestHour(
								Saturdays
						  )}`,
				Sunday:
					getScheduldeEarliestHour(Sundays) == null
						? null
						: `${getScheduldeEarliestHour(Sundays)}-${getScheduldeLatestHour(
								Sundays
						  )}`,
			};
		} catch (error) {
			console.log(error);

			return error;
		}
	};
}
export default ClinicInfoRepository;
