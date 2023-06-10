const config = {
	server: 'vet-database.database.windows.net', //update me
	database: 'vet-db',
	authentication: {
		type: 'default',
		options: {
			userName: 's18547', //update me
			password: '1018Datazycia', //update me
		},
	},
	options: { encrypt: true },
};
module.exports = config;
