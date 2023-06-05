import { response } from 'express';
import makeApp from '../../src/app';

const testConfig=require('../../src/config/mssql/testConnection');
const supertest = require('supertest');
const app = makeApp(testConfig);
const testToken=require('../testToken');
describe('Reservation',()=>{

    let baseUrl='/reservations'

    it('Get reservation list',async()=>{
    
        const response = await supertest(app).get(baseUrl).set('Authorization', `Bearer ${testToken}`,);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);

    })
})