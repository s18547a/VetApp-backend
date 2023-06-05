const jwt = require('jsonwebtoken');
const configAuthKey = require('../utils/auth/key');
export const isAuthorizated = async (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	const key = configAuthKey.default.secret;
	if (token == null) {
		return res.status(401).json({});
	} else {
		await jwt.verify(token, key, (err, user) => {
			if (err) {
				return res.status(403).json({});
			} else {
				return next();
			}
		});
	}
};
