
import { createIDwithUUIDV4 } from '../../src/utils/idHelpers';




describe('test contact validator',()=>{

    it('Generate id',()=>{
       
        const id=createIDwithUUIDV4();

        
        expect(id).toHaveLength(36);

    });

    
    
});

