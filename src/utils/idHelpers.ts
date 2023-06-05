import { v4 as uuidv4 } from 'uuid';

export function createIDwithUUIDV4(): string {
	return uuidv4();
}
