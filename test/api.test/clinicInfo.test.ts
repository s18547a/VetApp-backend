import makeApp from '../../src/app';
const testConfig=require('../../src/config/mssql/testConnection');
const supertest = require('supertest');
const app = makeApp(testConfig);


describe('Clinic info',()=>{

    let baseUrl='/clinicInfo/schedulde'

    it('Get clinic schedulde',async()=>{
        const expectedBody={
            Monday: '08:00-10:00',
            Tuesday: '10:00-20:00',
            Wednesday: null,
            Thursday: '13:00-16:00',
            Friday: '09:00-20:00',
            Saturday: null,
            Sunday: null
          }
        const response = await supertest(app).get(baseUrl);
        expect(response.status).toBe(200);
          expect(response.body).toStrictEqual(expectedBody);
        

    })
})