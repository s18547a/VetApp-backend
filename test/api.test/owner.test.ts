import { response } from 'express';
import makeApp from '../../src/app';

const testConfig = require('../../src/config/mssql/testConnection');
const supertest = require('supertest');
const app = makeApp(testConfig);
const testToken = require('../testToken');

describe('Owner', () => {
	let baseUrl = '/owners';

	it('Get owers list', async () => {
		const expecedBody = [
			{
				OwnerId: '172d126f-7173-42c8-910b-8e4a3fb96780',
				Name: 'OwnerName',
				LastName: 'OwnerLastName',
				Contact: '515240599',
				Email: 'testOwner@gmail.com',
			},
		];
		const response = await supertest(app)
			.get(baseUrl)
			.set('Authorization', `Bearer ${testToken}`);
		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual(expecedBody);
	});

	it('Get ower', async () => {
		const expecedBody = {
			OwnerId: '172d126f-7173-42c8-910b-8e4a3fb96780',
			Name: 'OwnerName',
			LastName: 'OwnerLastName',
			Contact: '515240599',
			Email: 'testOwner@gmail.com',
		};

		const url = `${baseUrl}/172d126f-7173-42c8-910b-8e4a3fb96780`;
		const response = await supertest(app)
			.get(url)
			.set('Authorization', `Bearer ${testToken}`);
		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual(expecedBody);
	});
});
