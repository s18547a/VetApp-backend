
import { validateContact } from '../../src/utils/validator';


describe('test contact validator',()=>{

    it('Valid contact',()=>{
       
        const contact='123456789';

        const result=validateContact(contact);

        expect(result).toBe(contact);

    });

    
    it('Invalid contact',()=>{
       
        const contact='12345a679';
       
        let errorMessage;
      
        try {
            const result=validateContact(contact);     
            
        } catch (error) {
            errorMessage=error;
        }

        expect(errorMessage).toBeInstanceOf(Error);
        expect(errorMessage.message).toBe('validationError');
        

    });
});



