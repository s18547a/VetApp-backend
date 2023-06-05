import UserRepository from '../services/repositories/UserRepository';
import config from '../utils/auth/key';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

interface userInfo {
	userId: string;
	userType: UserType | null;
	userTypeId: string;
	isManager: boolean;
	token: string;
	Email: string;
	ProfileImage: string | null;
}
enum UserType {
	Owner,
	Vet,
}

class UserController {
	userRepository;
	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	login = async (req, res) => {
		try {
			const Email: string = req.body.Email;
			const Password: string = req.body.Password;

			const user = await this.userRepository.getUserByEmail(Email);

			if (user == null) {
				return res.status(404).json({ message: 'User not found' });
			} else if (user instanceof Error) {
				res.status(500).json({});
			} else {
				let userType: UserType | null = null;
				let userTypeId = '';

				if (user.OwnerId != null) {
					userType = UserType.Owner;
					userTypeId = user.OwnerId;
				} else if (user.VetId != null) {
					userType = UserType.Vet;
					userTypeId = user.VetId;
					if (user.Manager == null) {
						user.Manager = false;
					}
				}

				if (userType != null) {
					const isEqual: boolean = await bcrypt.compare(
						Password,
						user.Password
					);

					if (!isEqual) {
						return res.status(401).json({ message: 'password' });
					} else {
						const token = jwt.sign(
							{
								Email: user.Email,
								UserId: user.UserId,
							},
							config.secret,
							{ expiresIn: '10h' }
						);

						const data: userInfo = {
							userId: user.UserId,
							userType: userType,
							userTypeId: userTypeId,
							isManager: user.Manager,
							Email: user.Email,
							token: token,
							ProfileImage: user.ProfileImage,
						};
						return res.status(201).json(data);
					}
				}
			}
		} catch (error) {
			return res.status(500).json({});
		}
	};
}
export default UserController;
