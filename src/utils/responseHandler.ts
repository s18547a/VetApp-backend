export const getResponseHandler = async (response, results) => {
	if (results instanceof Error) {
		return response.status(500).json({});
	} else if (results == null) {
		return response.status(404).json({});
	} else return response.status(200).json(results);
};

export const postResponseHandler = async (response, results) => {
	if (results instanceof Error) {
		return response.status(500).json({});
	} else if (results == null) {
		return response.status(409).json({});
	} else return response.status(201).json({ newId: results });
};

export const putResponseHandler = async (response, results) => {
	if (results instanceof Error) {
		return response.status(500).json({});
	} else if (results == null) {
		return response.status(409).json({});
	} else return response.status(201).json({ newId: results });
};

export const deleteResponseHandler = async (response, results) => {
	if (results instanceof Error) {
		return response.status(500).json({});
	} else if (results == null) {
		return response.status(404).json({});
	} else return response.status(201).json({ deletedId: results });
};
