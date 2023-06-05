import {createVisitSearchQueryString} from '../../src/utils/queryStringHelpers';



describe('query string',()=>{

    const date='2022-01-01';
    const name='Reksio';
    const email='testManager@gmail.com';
    const ownerId='32331';
    
    it('All parameters all filled',()=>{
       
        const queryString= createVisitSearchQueryString({OwnerId:ownerId,Date:date,Name:name,Email:email});

        // eslint-disable-next-line quotes
        const expectedString="Where animal.OwnerId='32331' and Date='2022-01-01' and us.Email='testManager@gmail.com' and animal.Name='Reksio'";

        expect(queryString).toEqual(expectedString);

    });

    it('No OwnerId',()=>{
       
        const queryString= createVisitSearchQueryString({Date:date,Name:name,Email:email});

        // eslint-disable-next-line quotes
        const expectedString="Where Date='2022-01-01' and us.Email='testManager@gmail.com' and animal.Name='Reksio'";

        expect(queryString).toEqual(expectedString);

    });

    it('OwnerId and animal',()=>{
       
        const queryString= createVisitSearchQueryString({OwnerId:ownerId,Name:name});

        // eslint-disable-next-line quotes
        const expectedString="Where animal.OwnerId='32331' and animal.Name='Reksio'";

        expect(queryString).toEqual(expectedString);

    });

    
});


