import makeApp from '../../src/app';
const testConfig=require('../../src/config/mssql/testConnection');
const supertest = require('supertest');
const app = makeApp(testConfig);
describe('POST',()=>{


    it('User have proper creditiental',async()=>{
        const userCreditientals={
            'Email':'testManager@gmail.com',
            'Password':'pass'
        };

        const response = 
        await supertest(app).post('/users').send(userCreditientals);

        expect(response.status).toBe(201);
        

    });

    it('User does not exists in database',async()=>{
        const userCreditientals={
            'Email':'jsmit',
            'Password':'pass'
        };

        const response = 
        await supertest(app).post('/users').send(userCreditientals);

        expect(response.status).toBe(404);
    });

    it('Wrong password',async()=>{
        const userCreditientals={
            'Email':'testManager@gmail.com',
            'Password':'wrongPass'
        };

        const response = 
        await supertest(app).post('/users').send(userCreditientals);

        expect(response.status).toBe(401);
    });

});