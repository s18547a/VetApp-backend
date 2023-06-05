import makeApp from '../../src/app';

const testConfig=require('../../src/config/mssql/testConnection');
const supertest = require('supertest');
const app = makeApp(testConfig);
const testToken=require('../testToken');
describe('Vet',()=>{

    let baseUrl='/vets'
    const vetId= '733cfb48-aef9-4456-b703-5020e52ad6ae';
    it('Get vets list',async()=>{
    
        const response = await supertest(app).get(baseUrl).set('Authorization', `Bearer ${testToken}`,);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(1);

    })

    it('Get vet by id',async()=>{

        const url=`${baseUrl}/${vetId}`
        const response =await supertest(app).get(url).set('Authorization', `Bearer ${testToken}`,);
        expect(response.status).toBe(200);
    })

    it('Get vet schedulde',async()=>{
        const url=`${baseUrl}/${vetId}/schedulde`
        const expectedBody={  Monday: null,
            Tuesday: '13:00-20:00',
            Wednesday: null,
            Thursday: null,
            Friday: '16:00-20:00',
            Saturday: null,
            Sunday: null}
        const response =await supertest(app).get(url).set('Authorization', `Bearer ${testToken}`,);
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(expectedBody);

    })

    it('Get vet types',async()=>{
        const url=`${baseUrl}/types`
        const expectedBody=[{VetType:"Internista"}]
        const response =await supertest(app).get(url).set('Authorization', `Bearer ${testToken}`,);
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(expectedBody);
        console.log(response.body);
    })

})