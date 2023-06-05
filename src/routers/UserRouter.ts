import express, { Router } from 'express';
import UserController from '../controllers/UserController';

class UserRouter {
	router: Router;
	constructor(userController: UserController) {
		const router = express.Router();
		router.post('/', userController.login);
		this.router = router;
	}
}

export default UserRouter;
