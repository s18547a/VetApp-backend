import {createSurgeryAvailableHours} from '../../src/utils/receptionHoursHelper';

describe('reception hours heper',()=>{

   
    it('create reception hours for surgery for specific schedule',async()=>{

        const receptionHours=[
            '08:00','08:20','08:40',
            '09:00','09:20','09:40',
            '10:00','10:20','10:40',
            '11:00','11:20','11:40',
            '12:00','12:20','12:40',
        ];

        const expected=[ 
            '08:00','08:20','08:40',
            '09:00','09:20','09:40',
            '10:00','10:20','10:40',
            '11:00'
        ];

        

        const result= await createSurgeryAvailableHours(receptionHours);
        
        console.log(result);

        expect(result).toEqual(expected);
    });

    it('no time for surgery available',async()=>{

        const receptionHours=[
            '08:00','08:40',
            '09:00','09:20','09:40',
            '10:00','10:40',
            '11:00','11:40',
            '12:00','12:20','12:40',
        ];

       
        

        const result= await createSurgeryAvailableHours(receptionHours);
        
        console.log(result);

        expect(result).toEqual([]);
    });



});