
import makeApp from '../../src/app';

const testConfig=require('../../src/config/mssql/testConnection');
const supertest = require('supertest');
const app = makeApp(testConfig);
const testToken=require('../testToken');


describe('Animal', ()=>{

    
    

    it('Animal exists in database',async()=>{

        const animalId='0b52c3e3-1ffb-4b1d-80c4-404ffcf2dadf';

        const url='/animals/'+animalId;

        const response=await supertest(app).get(url).set('Authorization', `Bearer ${testToken}`,);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();

    }); 

    it('Animal does not exists in database',async()=>{

        const animalId='0b52c3e3-1ffb-4b1d-8easa0c4-404ffcf2dadf';

        const url='/animals/'+animalId;

        const response=await supertest(app).get(url).set('Authorization', `Bearer ${testToken}`,);

        expect(response.status).toBe(404);


    }); 

    it('Get animal list',async()=>{

       

        const url='/animals';

        const response=await supertest(app).get(url).set('Authorization', `Bearer ${testToken}`,);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        

    }); 



    it('Register animal',async()=>{
        const url='/animals';
        const animal={
            OwnerId:'172d126f-7173-42c8-910b-8e4a3fb96780',
            AnimalTypeId:'PZ',
            Name:'NewAnimal',
            BirthDate:'2020-02-01',
            Sex:1,
            ProfileImage:null,

        };
        const response=await supertest(app).post(url).send(animal).set('Authorization', `Bearer ${testToken}`,);

        expect(response.status).toBe(201);
        expect(response.body.newId).toHaveLength(36);

    });

    it('Update animal',async()=>{
        const url='/animals';
        const animal={
            OwnerId:'172d126f-7173-42c8-910b-8e4a3fb96780',
            AnimalTypeId:'PZ',
            Name:'NewAnimal',
            BirthDate:'2020-02-01',
            Sex:1,
            ProfileImage:null,

        };
        const response=await supertest(app).post(url).send(animal).set('Authorization', `Bearer ${testToken}`,);

        expect(response.status).toBe(201);
        expect(response.body.newId).toHaveLength(36);

    });

    it('Get Animal medical info',async()=>{

        const results = await supertest(app).get('/animals/0b52c3e3-1ffb-4b1d-80c4-404ffcf2dadf/medicalInfo').set('Authorization', `Bearer ${testToken}`,);
        
        expect(results.status).toBe(200);
        
    });


    it('Update Animal medical info',async()=>{
        const url='/animals/medicalInfo';
        const animal={
            AnimalId: '0b52c3e3-1ffb-4b1d-80c4-404ffcf2dadf',
            Weight:3.2,
            Chipped: 1,
            Sterilized: 0,
            Skeletal: '',
            Muscular: '',
            Nervous: '',
            Endocrine: '',
            Cardiovascular: '',
            Lymphatic: '',
            Respiratory: '',
            Digestive: '',
            Urinary: '',
            Reproductive: '',
            Optical: '',
            Dental: '',
            Dermatological: '',
            Others: '',

        };
        const response=await supertest(app).put(url).send(animal).set('Authorization', `Bearer ${testToken}`,);

        expect(response.status).toBe(201);
        

    });


});