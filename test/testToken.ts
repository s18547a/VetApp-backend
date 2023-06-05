import config from '../src/utils/auth/key';
const jwt = require('jsonwebtoken');
const token=jwt.sign({
    Email:'managerTest@gmail.com',
    UserId:'a-3-adawd'
},config.secret,{expiresIn:'10h'});


module.exports=token;
