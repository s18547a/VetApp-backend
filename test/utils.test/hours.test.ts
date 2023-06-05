import { createVetVisitHours} from '../../src/utils/hours';

describe('Transform schedulde into reception hours',()=>{


    it('Proper string',()=>{  
        const scheduldeHour='10:00-14:00';


        const receptionHours=createVetVisitHours(scheduldeHour);

        const expectedHours=['10:00','10:20','10:40','11:00','11:20','11:40','12:00','12:20','12:40','13:00','13:20','13:40'];
     
       
        expect(receptionHours).toEqual(expectedHours);
      

    });


    
});