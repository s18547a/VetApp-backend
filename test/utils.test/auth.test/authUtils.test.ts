import { hashPassword } from '../../../src/utils/auth/authUtils';
const bcrypt = require('bcryptjs');
describe('testing auth utils',()=>{

 

    it('Compare password',async ()=>{
        const password='pass';
        const hashedPassword='$2a$08$PNnovMIoeu9UuMpAAUnAZen1MGGI8r9Obj.TMzRqmXmJUQ8WcYPhO';
        let isEqual=false;
        await bcrypt.compare(password,hashedPassword).then(equal=>{

            isEqual=equal;
        });

        expect(isEqual).toBe(true);

    });



});