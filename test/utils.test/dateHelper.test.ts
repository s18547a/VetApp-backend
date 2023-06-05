import { getDayOfAWeekName} from '../../src/utils/dateHelper';

describe('Date helper',()=>{

    it('Get name of day',()=>{  

        const date='2022-12-10';
        const day = getDayOfAWeekName(date);

        expect(day).toEqual('Saturday');
       
      

    });


    
});
