import {getScheduldeEarliestHour,getScheduldeLatestHour} from '../../src/utils/clinicScheduldeUtils';

describe('test clinic schedulde utils',()=>{

    const schedulde=['08:00-12:00','11:00-14:00'];

    it('Get schedule earlies hour',()=>{
       
        const minHour=getScheduldeEarliestHour(schedulde);

        expect(minHour).toEqual('08:00');
    });
    
    it('Get schedule latest hour',()=>{
       
        const maxHour=getScheduldeLatestHour(schedulde);

        expect(maxHour).toEqual('14:00');
    });
    
    
});
