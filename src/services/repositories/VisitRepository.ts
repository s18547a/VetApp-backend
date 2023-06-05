const sql = require('mssql');
import Animal from '../../models/Animal';

import Vet from '../../models/Vet';

import Visit from '../../models//Visit';
import { createIDwithUUIDV4 } from '../../utils/idHelpers';
import { createVisitSearchQueryString } from '../../utils/queryStringHelpers';
import AnimalRepostiory from './AnimalRepository';
import VetRepository from './VetRepository';
import MedicalActivityRepository from './MedicalActivityRepository';
import ReservationRepository from './ReservationRepository';
import Repository from './Repository';
import { GetVisitPrarameters } from '../../common/Types';

class VisitRepository extends Repository {
	animalRepository;
	vetRepository;
	visitMedicalActivtyRepository;
	reservationRepository;
	constructor(
		db,
		animalRepository: AnimalRepostiory,
		vetRepository: VetRepository,
		visitMedicalActivtyRepository: MedicalActivityRepository,
		reservationRepository: ReservationRepository
	) {
		super(db);
		this.animalRepository = animalRepository;
		this.vetRepository = vetRepository;
		this.visitMedicalActivtyRepository = visitMedicalActivtyRepository;
		this.reservationRepository = reservationRepository;
	}

	getVisit = async (VisitId) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const results = await pool
				.request()
				.input('VisitId', sql.VarChar, VisitId)
				.query(
					"Select VisitId, Date,Hour,v.Note,a.AnimalId, v.VetId , v.Bill , a.Name as 'AnimalName',vt.Name as 'VetName',vt.LastName as 'VetLastName' From Visit v join Animal a  on v.AnimalId=a.AnimalId join Vet vt on v.VetId=vt.VetId Where VisitId=@VisitId"
				);
			const visitRecord = results.recordset[0];

			if (visitRecord == undefined) {
				return null;
			}
			const visitMedicalActivies =
				await this.visitMedicalActivtyRepository.getVisitMedicalActivies(
					VisitId
				);

			const visitVet: Vet = await this.vetRepository.getVet(visitRecord.VetId);
			const visitAnimal = await this.animalRepository.getAnimal(
				visitRecord.AnimalId
			);

			return new Visit(
				visitRecord.VisitId,
				visitRecord.VetId,
				visitRecord.AnimalId,
				visitRecord.Date.toISOString().split('T')[0],
				visitRecord.Hour,
				visitRecord.Note,
				visitRecord.Bill,
				visitMedicalActivies,
				visitVet,
				visitAnimal
			);
		} catch (error) {
			console.log(error);

			return error;
		}
	};

	getVisits = async (parameters: GetVisitPrarameters) => {
		try {
			console.log(parameters);

			const pool = await sql.connect(this.databaseConfiguration);
			let visitRecordset;
			if (!parameters.animalId && !parameters.vetId && !parameters.ownerId) {
				const visitsPool = await pool
					.request()
					.query(
						'Select VisitId, VetId, AnimalId, Date, Hour, Note, Bill From Visit Order By Date DESC'
					);
				visitRecordset = visitsPool.recordset;
			} else if (parameters.animalId) {
				const visitsPool = await pool
					.request()
					.input('AnimalId', sql.VarChar, parameters.animalId)
					.query(
						"Select VisitId, Date,Hour,v.Note,a.AnimalId, v.VetId, v.Bill ,a.Name as 'AnimalName',vt.Name as 'VetName',vt.LastName as 'VetLastName' From Visit v join Animal a  on v.AnimalId=a.AnimalId join Vet vt on v.VetId=vt.VetId Where a.AnimalId=@AnimalId order by Date DESC"
					);
				visitRecordset = visitsPool.recordset;
			} else if (parameters.vetId) {
				const visitsPool = await pool
					.request()
					.input('VetId', sql.VarChar, parameters.vetId)
					.query(
						"Select VisitId, Date,Hour,v.Note,a.AnimalId, v.VetId, v.Bill , a.Name as 'AnimalName',vt.Name as 'VetName',vt.LastName as 'VetLastName' From Visit v join Animal a  on v.AnimalId=a.AnimalId join Vet vt on v.VetId=vt.VetId Where VetId=@VetId order by Date DESC"
					);
				visitRecordset = visitsPool.recordset;
			} else if (parameters.ownerId) {
				const visitsPool = await pool
					.request()
					.input('OwnerId', sql.VarChar, parameters.ownerId)
					.query(
						"Select VisitId, Date,Hour,v.Note,a.AnimalId, v.VetId, v.Bill , a.Name as 'AnimalName',vt.Name as 'VetName',vt.LastName as 'VetLastName' From Visit v join Animal a  on v.AnimalId=a.AnimalId join Vet vt on v.VetId=vt.VetId  Where OwnerId=@OwnerId order by Date DESC"
					);
				visitRecordset = visitsPool.recordset;
			}

			let isEmpty: boolean;

			visitRecordset[0] == undefined ? (isEmpty = true) : (isEmpty = false);
			if (isEmpty) {
				pool.close();
				return null;
			} else {
				const visits = await Promise.all(
					visitRecordset.map(async (visit) => {
						const visitMedicalActivies =
							await this.visitMedicalActivtyRepository.getVisitMedicalActivies(
								visit.VisitId
							);

						const visitVet: Vet = await this.vetRepository.getVet(visit.VetId);
						const visitAnimal: Animal = await this.animalRepository.getAnimal(
							visit.AnimalId
						);

						return new Visit(
							visit.VisitId,
							visit.VetId,
							visit.AnimalId,
							visit.Date.toISOString().split('T')[0],
							visit.Hour,
							visit.Note,
							visit.Bill,
							visitMedicalActivies,
							{
								VetId: visitVet.VetId,
								Name: visitVet.Name,
								LastName: visitVet.LastName,
								Email: visitVet.Email,
							},
							{
								AnimalId: visit.AnimalId,
								OwnerId: visitAnimal.OwnerId,
								Name: visitAnimal.Name,
							}
						);
					})
				);

				return visits;
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	searchVisits = async (parameters) => {
		try {
			const queryString = createVisitSearchQueryString(parameters);
			console.log(queryString);
			const pool = await sql.connect(this.databaseConfiguration);
			const visitsPool = await pool
				.request()

				// eslint-disable-next-line quotes
				.query(
					`Select visit.VisitId , visit.VetId, visit.AnimalId, visit.Date, visit.Hour, visit.Note, visit.Bill, animal.Name, us.Email  From Visit visit join Animal animal on visit.AnimalId=animal.AnimalId  join Vet vet on visit.VetId=vet.VetId join [User] us on vet.VetId=us.VetId ${queryString}  order by Date DESC`
				);
			const visitRecordset = visitsPool.recordset;

			let isEmpty: boolean;

			visitRecordset[0] == undefined ? (isEmpty = true) : (isEmpty = false);
			if (isEmpty) {
				pool.close();
				return null;
			} else {
				const visits = await Promise.all(
					visitRecordset.map(async (visit) => {
						const visitMedicalActivies =
							await this.visitMedicalActivtyRepository.getVisitMedicalActivies(
								visit.VisitId
							);

						const visitVet: Vet = await this.vetRepository.getVet(visit.VetId);
						const visitAnimal: Animal = await this.animalRepository.getAnimal(
							visit.AnimalId
						);

						return new Visit(
							visit.VisitId,
							visit.VetId,
							visit.AnimalId,
							visit.Date.toISOString().split('T')[0],
							visit.Hour,
							visit.Note,
							visit.Bill,
							visitMedicalActivies,
							visitVet,
							visitAnimal
						);
					})
				);

				return visits;
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	createVisit = async (Visit) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			const transaction = new sql.Transaction(pool);
			try {
				await transaction.begin();

				const VisitId = createIDwithUUIDV4();
				const newVetId = Visit.VetId.trim();
				const newAnimalId = Visit.AnimalId.trim();

				const newDate = Visit.VisitDate;
				const newHour = Visit.Hour.trim();
				const newNote = Visit.Note;
				const newBill = Visit.Bill;
				const selectedActivites: string[] = Visit.MedicalActivities;
				const diagnosisList = Visit.DiagnosisList;
				const vaccineList = Visit.VaccineList;
				const cannceledReservation = Visit.ReservationId;

				const results = await new sql.Request(transaction)
					.input('VisitId', sql.VarChar, VisitId)
					.input('VetId', sql.VarChar, newVetId)
					.input('AnimalId', sql.VarChar, newAnimalId)
					.input('Date', sql.Date, newDate)
					.input('Hour', sql.VarChar, newHour)
					.input('Note', sql.VarChar, newNote)
					.input('Bill', sql.Int, newBill)
					.query(
						'INSERT INTO Visit(VisitId,VetId,AnimalId,Date,Hour,Note,Bill) values (@VisitId,@VetId,@AnimalId,@Date,@Hour,@Note,@Bill)'
					);

				const rowsAffected = results.rowsAffected[0];

				if (rowsAffected != 1) {
					throw Error('Failed to insert');
				}

				if (selectedActivites.length > 0) {
					for await (const activity of selectedActivites) {
						const resultsS = await new sql.Request(transaction)
							.input('MedicalActivityId', sql.VarChar, activity)
							.input('VisitId', sql.VarChar, VisitId)
							.query(
								'Insert into VisitMedicalActivities(MedicalActivityId,VisitId) values (@MedicalActivityId,@VisitId)'
							);

						if (resultsS.rowsAffected[0] != 1) {
							throw Error('Failed to insert');
						}
					}
				}

				if (diagnosisList.length > 0) {
					for await (const diagnosis of diagnosisList) {
						const resultsD = await new sql.Request(transaction)
							.input('AnimalId', sql.VarChar, newAnimalId)
							.input('VisitId', sql.VarChar, VisitId)
							.input('Description', sql.VarChar, diagnosis.Description.trim())
							.input('DiagnosisDate', sql.Date, newDate)
							.query(
								'Insert into Illness(AnimalId,VisitId,Description,DiagnosisDate) values (@AnimalId,@VisitId,@Description,@DiagnosisDate)'
							);
						if (resultsD.rowsAffected[0] != 1) {
							throw Error('Failed to insert');
						}
					}
				}

				if (vaccineList.length > 0) {
					for await (const VaccineType of vaccineList) {
						const result = await new sql.Request(transaction)
							.input('AnimalId', sql.VarChar, newAnimalId)
							.input('VaccineType', sql.VarChar, VaccineType.trim())
							.input('Date', sql.Date, newDate)
							.query(
								'Insert into AnimalVaccine values(@VaccineType,@AnimalId,@Date)'
							);

						const rowsAffected = result.rowsAffected;
						if (rowsAffected != 1) {
							throw Error('Failed to insert');
						}
					}
				}
				if (cannceledReservation != '') {
					const canceledReservationId =
						await this.reservationRepository.cancelReservation(
							cannceledReservation,
							transaction
						);
					if (cannceledReservation != canceledReservationId) {
						throw Error('Failed to cancel');
					}
				}

				await transaction.commit();

				return VisitId;
			} catch (error) {
				await transaction.rollback();
				pool.close();
				console.log(error);
				throw Error('Transaction error');
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	};
}

export default VisitRepository;
