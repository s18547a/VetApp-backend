import AnimalController from './controllers/AnimalController';
import ClinicInfoController from './controllers/ClinicInfoController';
import OwnerController from './controllers/OwnerController';
import ReservationController from './controllers/ReservationContoller';
import SurgeryController from './controllers/SurgeryController';
import UserController from './controllers/UserController';
import VaccineController from './controllers/VaccineController';
import VetController from './controllers/VetController';
import VisitController from './controllers/VisitController';
import AnimalIllnessRepository from './services/repositories/AnimalIllnessRepository';
import AnimalMedicalInfoRepository from './services/repositories/AnimalMedicalInfoRepository';
import AnimalRepostiory from './services/repositories/AnimalRepository';
import AnimalTypeRepository from './services/repositories/AnimalTypeRepository';
import ClinicInfoRepository from './services/repositories/ClinicInfoRepository';
import MedicalActivityRepository from './services/repositories/MedicalActivityRepository';
import OwnerRepository from './services/repositories/OwnerRepository';
import ReservationRepository from './services/repositories/ReservationRepository';
import ScheduldeHelperRepository from './services/repositories/ScheduldeHelperRepository';
import SurgeryRepository from './services/repositories/SurgeryRepository';
import UserRepository from './services/repositories/UserRepository';
import VaccineRepository from './services/repositories/VaccineRepository';
import VetRepository from './services/repositories/VetRepository';
import VetScheduldeRepository from './services/repositories/VetScheduldeRepository';
import VetTypeRepository from './services/repositories/VetTypeRepository';
import VisitRepository from './services/repositories/VisitRepository';
import AnimalRouter from './routers/AnimalRouter';
import ClinicInfoRouter from './routers/ClinicInfoRouter';
import OwnerRouter from './routers/OwnerRouter';
import ReservationRouter from './routers/ReservationRouter';
import SurgeryRouter from './routers/SurgeryRouter';
import UserRouter from './routers/UserRouter';
import VaccineRouter from './routers/VaccineRouter';
import VetRouter from './routers/VetRouter';
import VisitRouter from './routers/VisitRouter';
import SharedRepository from './services/repositories/SharedRepository';

//const {createError} =require('http-errors');
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

const app = express();

// eslint-disable-next-line require-jsdoc
export default function (db) {
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	app.use(logger('dev'));
	app.use(express.json({ limit: '50mb' }));
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());

	app.use(express.static(path.join(__dirname, 'public')));
	app.use(
		cors({
			//	origin: 'http://localhost:3000',
		})
	);

	app.use(
		require('express-status-monitor')({
			title: 'Express Status', // Default title
			theme: 'default.css', // Default styles
			path: '/status',
			socketPath: '/socket.io', // In case you use a custom path

			spans: [
				{
					interval: 1, // Every second
					retention: 60, // Keep 60 datapoints in memory
				},
				{
					interval: 5, // Every 5 seconds
					retention: 60,
				},
				{
					interval: 15, // Every 15 seconds
					retention: 60,
				},
			],
			chartVisibility: {
				cpu: true,
				mem: true,
				load: true,
				eventLoop: true,
				heap: true,
				responseTime: true,
				rps: true,
				statusCodes: true,
			},
			healthChecks: [],
			ignoreStartsWith: '/admin',
		})
	);

	app.get('/', async (req, res) => {
		res.status(200).json({ message: 'REST API for Vet Clinic App' });
	});

	//repositories
	const sharedRepository = new SharedRepository(db);
	const animalTypeRepository = new AnimalTypeRepository(db);
	const ownerRepository = new OwnerRepository(db, sharedRepository);
	const animalRepository = new AnimalRepostiory(
		db,
		animalTypeRepository,
		ownerRepository
	);
	const animalMedicalInfoRepository = new AnimalMedicalInfoRepository(db);
	const animalIllnessRepository = new AnimalIllnessRepository(db);

	const clinicInfoRepository = new ClinicInfoRepository(db);

	const vetTypeRepository = new VetTypeRepository(db);
	const vetRepository = new VetRepository(
		db,
		vetTypeRepository,
		sharedRepository
	);
	const surgeryRepository = new SurgeryRepository(
		db,
		animalRepository,
		vetRepository
	);
	const reservationRepository = new ReservationRepository(
		db,
		ownerRepository,
		vetRepository
	);
	const scheduldeHelperRepository = new ScheduldeHelperRepository(
		db,
		reservationRepository,
		surgeryRepository
	);
	const vetScheduldeRepository = new VetScheduldeRepository(
		db,
		scheduldeHelperRepository
	);
	const medicalActivityRepository = new MedicalActivityRepository(db);
	const userRepository = new UserRepository(db);

	const visitRepository = new VisitRepository(
		db,
		animalRepository,
		vetRepository,
		medicalActivityRepository,
		reservationRepository
	);
	const vaccineRepository = new VaccineRepository(db);
	//controllers
	const animalController = new AnimalController(
		animalRepository,
		animalTypeRepository,
		animalMedicalInfoRepository,
		animalIllnessRepository
	);
	const clinicInfoController = new ClinicInfoController(clinicInfoRepository);
	const ownerController = new OwnerController(ownerRepository);
	const reservationController = new ReservationController(
		reservationRepository
	);
	const vetController = new VetController(
		vetRepository,
		vetTypeRepository,
		vetScheduldeRepository
	);
	const visitController = new VisitController(
		visitRepository,
		medicalActivityRepository
	);
	const userController = new UserController(userRepository);
	const surgeryController = new SurgeryController(surgeryRepository);
	const vaccineController = new VaccineController(vaccineRepository);
	//routers
	const animalRouter = new AnimalRouter(animalController);
	const clinicInfoRouter = new ClinicInfoRouter(clinicInfoController);
	const ownerRouter = new OwnerRouter(ownerController);
	const reservationRouter = new ReservationRouter(reservationController);
	const vetRouter = new VetRouter(vetController);
	const visitRouter = new VisitRouter(visitController);
	const userRouter = new UserRouter(userController);
	const surgeryRouter = new SurgeryRouter(surgeryController);
	const vaccineRouter = new VaccineRouter(vaccineController);

	app.use('/users', userRouter.router);

	app.use('/owners', ownerRouter.router);

	app.use('/animals', animalRouter.router);

	app.use('/reservations', reservationRouter.router);

	app.use('/visits', visitRouter.router);

	app.use('/vets', vetRouter.router);

	app.use('/surgeries', surgeryRouter.router);

	app.use('/vaccines', vaccineRouter.router);

	app.use('/clinicInfo', clinicInfoRouter.router);

	app.use(function (req, res, next) {
		//  next(createError(404));
		return res.status(404).json({ message: 'Invalid URL' });
	});

	return app;
}
