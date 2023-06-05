import { response } from 'express';
import makeApp from '../../src/app';

const testConfig=require('../../src/config/mssql/testConnection');
const supertest = require('supertest');
const app = makeApp(testConfig);
const testToken=require('../testToken');

describe('Visit',()=>{

    let baseUrl='/visits'

    it('Get visit list',async()=>{
    
        const response = await supertest(app).get(baseUrl).set('Authorization', `Bearer ${testToken}`,);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        console.log(response.body);

    })


    it('Get visit ',async()=>{
        const url=`${baseUrl}/88312e47-8472-4d32-8022-77d1c67a489f`;
        const expectedBody=   {
            VisitId: '88312e47-8472-4d32-8022-77d1c67a489f',
            VetId: '7f1cd19c-b6be-4d04-a6ee-038a4c8edefa',
            AnimalId: '0b52c3e3-1ffb-4b1d-80c4-404ffcf2dadf',
            Date: '2022-12-22',
            Hour: '10:00',
            Note: 'Lorem ipsum',
            MedicalActivities: [
              {
                MedicalActivityId: '4',
                ActivityName: 'Odkleszczanie',
                Price: 50
              }
            ],
            Bill: 50,
            Vet: {
              VetId: '7f1cd19c-b6be-4d04-a6ee-038a4c8edefa',
              Name: 'ManagerName',
              LastName: 'ManagerLastName',
              Contact: '123456789',
              Types: [ {VetType:'Internista'} ],
              HireDate: '2000-01-01',
              Email: 'testManager@gmail.com',
              ProfileImage: null
            },
            Animal: {
              AnimalId: '0b52c3e3-1ffb-4b1d-80c4-404ffcf2dadf',
              Name: 'NewAnimal',
              BirthDate: '2020-02-01',
              OwnerId: '172d126f-7173-42c8-910b-8e4a3fb96780',
              ProfileImage: null,
              Sex: 1,
              AnimalTypeId: 'PZ',
              AnimalType: { AnimalTypeId: 'PZ', Family: 'Pies', Race: 'Kundel' },
              Owner: { Email: 'testOwner@gmail.com' }
            }
          }
        const response = await supertest(app).get(url).set('Authorization', `Bearer ${testToken}`,);
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(expectedBody);
        console.log(response.body);

    })
})