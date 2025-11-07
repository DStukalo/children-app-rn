import { UserData } from "../types/types";

const AVATAR_OPTIONS = [
	"https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
	"https://cdn-icons-png.flaticon.com/512/706/706830.png",
	"https://cdn-icons-png.flaticon.com/512/147/147144.png",
	"https://cdn-icons-png.flaticon.com/512/1999/1999625.png",
];

const DEFAULT_USER: Omit<UserData, "email"> = {
	name: "John Doe",
	role: "Default User",
	userId: "ID-193829",
	avatar: AVATAR_OPTIONS[0],
};

const USERS = [
	{
		email: "test@example.com",
		password: "123456",
		role: "User with party premium access",
		avatar: AVATAR_OPTIONS[0],
		userId: "ID-327756",
		name: "John Doe",
		openCategories: [1, 2],
	},
	{
		email: "roman@gmail.com",
		password: "qwerty",
		name: "Roman",
		role: "Premium User",
		avatar: AVATAR_OPTIONS[0],
		userId: "ID-459198",
	},
	{
		email: "dima@gmail.com",
		password: "123456",
		role: "Premium User",
		avatar: AVATAR_OPTIONS[0],
		name: "Dima",
		userId: "ID-143221",
	},
	{
		email: "default@example.com",
		password: "123456",
		role: "Default user",
		avatar: AVATAR_OPTIONS[0],
		userId: "ID-327756",
		name: "John Doe",
	},
];

export { USERS, AVATAR_OPTIONS, DEFAULT_USER };
