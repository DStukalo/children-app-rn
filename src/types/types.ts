export type Lesson = {
	lessonId: number;
	title: {
		en: string;
		ru: string;
	};
	subtitle: {
		en: string;
		ru: string;
	};
	description: {
		en: string;
		ru: string;
	};
	audio: {
		audioId: number;
		title: {
			en: string;
			ru: string;
		};
		audio: {
			en: string;
			ru: string;
		};
	}[];
	video: {
		videoId: number;
		title: {
			en: string;
			ru: string;
		};
		video: {
			en: string;
			ru: string;
		};
	}[];
	access: "free" | "paid";
};

export type UserData = {
	userName: string;
	email: string;
	role: string;
	userId: string;
	avatar: string;
	openCategories?: number[];
	purchasedStages?: number[];
};
