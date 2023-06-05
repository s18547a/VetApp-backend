import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(8);

export function hashPassword  (passPlain) {
    const passHashed = bcrypt.hashSync(passPlain, salt);
    return passHashed;
}

export function comparePasswords (passPlain, passHash) {
    const res = bcrypt.compareSync(passPlain, passHash);
    return res;
}
