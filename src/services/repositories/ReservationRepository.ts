import sql from 'mssql';
import { GetReservationParameters } from '../../common/Types';
import Owner from '../../models/Owner';
import Reservation from '../../models/Reservation';
import Vet from '../../models/Vet';

import { createIDwithUUIDV4 } from '../../utils/idHelpers';
import OwnerRepository from './OwnerRepository';
import Repository from './Repository';

class ReservationRepository extends Repository {
	ownerRepository;
	vetRepository;

	constructor(db, ownerRepository: OwnerRepository, vetRepository) {
		super(db);
		this.ownerRepository = ownerRepository;
		this.vetRepository = vetRepository;
	}

	getReservations = async (parameters: GetReservationParameters) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			let reservationRecordset;
			if (!parameters.vetId && !parameters.date && !parameters.ownerId) {
				const reservationPool = await pool
					.request()
					.query(
						'Select ReservationId, Date, VetId, OwnerId, Hour From Reservation Order by Date,Hour'
					);
				reservationRecordset = reservationPool.recordset;
			} else if (parameters.vetId && parameters.date) {
				const reservationPool = await pool
					.request()
					.input('VetId', sql.VarChar, parameters.vetId)
					.input('Date', sql.Date, parameters.date)
					.query(
						'Select ReservationId, Date, VetId, OwnerId, Hour From Reservation Where VetId=@VetId and Date=@Date Order by Date,Hour'
					);
				reservationRecordset = reservationPool.recordset;
			} else if (parameters.vetId && !parameters.date && !parameters.ownerId) {
				const reservationPool = await pool
					.request()
					.input('VetId', sql.VarChar, parameters.vetId)
					.query(
						'Select ReservationId, Date, VetId, OwnerId, Hour From Reservation  Where VetId=@VetId Order by Date,Hour'
					);
				reservationRecordset = reservationPool.recordset;
			} else if (parameters.date && !parameters.vetId && !parameters.ownerId) {
				const reservationPool = await pool
					.request()
					.input('Date', sql.Int, parameters.date)
					.query(
						'Select ReservationId, Date, VetId, OwnerId, Hour From Reservation  Where Date=@Date Order by Date,Hour'
					);
				reservationRecordset = reservationPool.recordset;
			} else if (parameters.ownerId && !parameters.vetId && !parameters.date) {
				const reservationPool = await pool
					.request()
					.input('OwnerId', sql.VarChar, parameters.ownerId)
					.query(
						'Select ReservationId, Date, VetId, OwnerId, Hour From Reservation Where OwnerId=@OwnerId Order by Date,Hour'
					);
				reservationRecordset = reservationPool.recordset;
			}

			let isEmpty;
			reservationRecordset[0] == undefined
				? (isEmpty = true)
				: (isEmpty = false);
			if (isEmpty) {
				return null;
			} else {
				const reservations: Reservation[] = await Promise.all(
					reservationRecordset.map(async (reservation) => {
						const vetObject: Vet = await this.vetRepository.getVet(
							reservation.VetId
						);

						const ownerObject: Owner = await this.ownerRepository.getOwner(
							reservation.OwnerId
						);
						return new Reservation(
							reservation.ReservationId,
							reservation.Date.toISOString().split('T')[0],
							reservation.VetId,
							reservation.OwnerId,
							reservation.Hour,
							{
								VetId: vetObject.VetId,
								Name: vetObject.Name,
								LastName: vetObject.LastName,
								Email: vetObject.Email,
								Contact: vetObject.Contact,
							},
							{
								OwnerId: ownerObject.OwnerId,
								Name: ownerObject.Name,
								LastName: ownerObject.LastName,
								Email: ownerObject.Email,
								Contact: ownerObject.Contact,
							}
						);
					})
				);

				if (reservations.length == 0) {
					return null;
				} else {
					return reservations;
				}
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	createReservation = async (Reservation: Reservation) => {
		try {
			const ReservationId = createIDwithUUIDV4();
			const ReservationDate: string = Reservation.ReservationDate.trim();
			const VetId: string = Reservation.VetId.trim();
			const OwnerId: string = Reservation.OwnerId.trim();
			const Hour: string = Reservation.Hour.trim();

			const pool = await sql.connect(this.databaseConfiguration);

			const reservationPool = await pool
				.request()
				.input('ReservationId', sql.VarChar, ReservationId)
				.input('Date', sql.Date, ReservationDate)
				.input('VetId', sql.VarChar, VetId)
				.input('OwnerId', sql.VarChar, OwnerId)
				.input('Hour', sql.VarChar, Hour)
				.query(
					'INSERT INTO RESERVATION(ReservationId,Date,VetId,OwnerId,Hour) values(@ReservationId, @Date, @VetId, @OwnerId, @Hour)'
				);

			if (reservationPool.rowsAffected[0] == 1) {
				return ReservationId;
			} else throw Error('Transaction error');
		} catch (error) {
			console.log(error);

			return error;
		}
	};

	cancelReservation = async (ReservationId: string, transaction) => {
		try {
			const pool = await sql.connect(this.databaseConfiguration);
			let rowsAffected: number;
			if (transaction == null) {
				const reservationPool = await pool
					.request()
					.input('ReservationId', sql.VarChar, ReservationId)
					.query('Delete From Reservation Where ReservationId=@ReservationId');
				rowsAffected = reservationPool.rowsAffected[0];
			} else {
				const result = await new sql.Request(transaction)
					.input('ReservationId', sql.VarChar, ReservationId)
					.query('Delete From Reservation Where ReservationId=@ReservationId');
				rowsAffected = result.rowsAffected[0];
			}
			if (rowsAffected != 1) {
				throw Error('Transaction error');
			} else return ReservationId;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
}
export default ReservationRepository;
