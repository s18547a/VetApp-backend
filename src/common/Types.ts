export interface GetAnimals {
	ownerId: string;

	email: string;
}

export interface GetOwnerParamters {
	animalId: string;
}

export interface GetReservationParameters {
	vetId: string;
	date: string;
	ownerId: string | null;
}

export interface GetScheduldeParamters {
	date: string;
	vetId: string;
	isSurgery: boolean;
}

export interface getSurgeryPrameters {
	ownerId: string;
	vetId: string;
	date: string;
}

export interface GetVetParameters {
	date: string;

	vetType: string;
}

export interface GetAnimalType {
	animalTypeId: string | undefined;
}

export interface GetVisitPrarameters {
	animalId: string;
	vetId: string;

	ownerId: string;
}

export interface IllnessCuredParameters {
	animalId: string;
	description: string;
	visitId: string;
	recoveryDate: string;
}

export interface GetVetTypesParameters {
	vetId: string;
}

export interface SearchVisitParameters {
	email: string | undefined;
	name: string | undefined;
	date: string | undefined;
	ownerId: string | undefined;
}

export interface GetTodaySchedulde {
	date: string;
	vetId: string;
}

export enum ResponseType {
	GET,
	POST,
	PUT,
	DELETE,
}
