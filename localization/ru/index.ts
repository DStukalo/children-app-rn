import { t } from "i18next";

export default {
	language: "Язык",
	home: {
		title1: "Школа",
		title2: "Ольги Филистович",
		proprietaryMethods: "Авторские методики запуска речи и коррекции поведения",
		author: "Ольги Филистович",
		chooseCourse: "Выбрать этап",
		methodicSectionTitle: "Методики помогут вам если",
		methodicSectionBlock1:
			"Вас беспокоит, что ребёнок мало коммуницирует со сверстниками, излишне плаксив и чувствителен",
		methodicSectionBlock2:
			"Неговорящий ребёнок 1,5 — 12 лет, при этом есть «куча диагнозов», но так и не понятно, когда ребёнок заговорит и что для этого делать;",
		methodicSectionBlock3:
			"Ребёнок в возрасте от 2 до 18 лет имеет нарушения поведения: истерики, мастурбация, агрессия и самоагрессия, нарушения навыков опрятности и самообслуживания, избирательность в еде;",
		methodicSectionBlock4:
			"Ребёнок 1 -4 лет, Вас что-то беспокоит, но все советуют «расслабиться», а Вам все равно неспокойно, ведь ребёнок не реагирует на Вас должным образом и практически не смотрит в глаза.",
		methodicSectionBlock5:
			"Ребенок с любым нарушением в развитии, Вас не интересует диагноз, но волнует, почему нет хорошей динамки в развитии. Вы замечаете, что Ваш ребёнок выборочно понимает бытовые инструкции, скорее догадывается чего Вы от него хотите.",
	},
	"choose-course": {
		title: "Выбрать курс",
	},
	"choose-stage": {
		title: "Выбрать этап",
		stageNumber: "Этап {{number}}",
		courseCount: "{{count}} курс(ов)",
	},
	stageScreen: {
		stageLabel: "Этап",
		coursesTitle: "Курсы этапа",
		viewCourse: "Перейти к курсу",
		noImage: "Нет изображения",
		notFound: "Этап не найден",
		stagePriceLabel: "Цена этапа: ${{price}}",
		stageProgress: "Приобретено {{purchased}} из {{total}}",
		buyStageButton: "Купить этап за ${{price}}",
		stagePurchasedLabel: "Этап уже куплен",
		coursePriceLabel: "Цена курса: ${{price}}",
		coursePurchasedLabel: "Куплено",
		courseLockedLabel: "Не куплено",
		courseBuyButton: "Купить курс (${{price}})",
	},
	course: {
		lessons: "Уроки",
		audioLessons: "Аудиоуроки",
		materials: "Материалы",
	},
	lesson: {
		video: "Смотреть видео",
		materials: "Материалы",
		toPayment: "Оплатить",
		downloadMaterials: "Скачать материалы",
		otherLessons: "Уроки курса",
	},
	payment: {
		title: "Приобрести доступ",
		categoryTitle: "Оплата категории:",
		categoryDescription:
			"Оплатите доступ только к выбранной категории. Подходит, если вас интересует конкретная тема.",
		categoryButton: "Оплатить категорию",
		categoryButtonWithPrice: "Купить курс за ${{price}}",
		fullTitle: "Полный доступ",
		fullDescription:
			"Купите полный доступ сразу ко всем курсам и видео. Это выгоднее, чем оплачивать категории по отдельности.",
		fullAccessButton: "Купить полный доступ",
		stageCardTitle: "Доступ к этапу",
		stageDescription: "Откройте все курсы этапа (всего {{count}}).",
		stagePriceLabel: "Цена этапа: ${{price}}",
		stageButton: "Купить этап за ${{price}}",
		coursePriceLabel: "Цена курса: ${{price}}",
		successTitle: "Успех",
		courseAlreadyPurchased: "Этот курс уже доступен.",
		stageAlreadyPurchased: "Этап уже открыт.",
		coursePurchaseSuccess: "Курс успешно открыт.",
		stagePurchaseSuccess: "Этап успешно открыт.",
		errorTitle: "Ошибка",
		errorGeneric: "Не удалось завершить покупку. Попробуйте еще раз.",
		prerequisiteTitle: "Сначала купите предыдущий курс",
		prerequisiteDescription:
			"Пожалуйста, сначала приобретите «{{course}}», чтобы открыть этот курс.",
	},

	profile: {
		title: "Профиль",
		logout: "Выход",
		chooseAvatar: "Выберите аватар",
		cancel: "Отменить",
		payment: "Оплата и подписка",
		login: "Перейти к входу",
	},

	login: {
		title: "Вход",
		email: "Email",
		password: "Пароль",
		button: "Вход",
		error: "Ошибка",
		incorrectEmailOrPassword: "Неверный адрес электронной почты или пароль",
		emptyFields: "Пожалуйста, заполните все поля",
		somethingWentWrong: "Что-то пошло не так",
		success: "Успех",
		successLogin: "Вы успешно вошли!",
		registration: "Еще нет учетной записи? Зарегистрироваться",
	},

	registration: {
		title: "Регистрация",
		email: "Email",
		password: "Пароль",
		button: "Регистрация",
		incorrectEmailOrPassword: "Неверный адрес электронной почты или пароль",
		emptyFields: "Пожалуйста, заполните все поля",
		somethingWentWrong: "Что-то пошло не так",
		success: "Успех",
		successLogin: "Вы успешно зарегистрировались!",
		login: "Уже есть учетная запись? Войти",
	},

	drawerNav: {
		courses: "Этапы",
		dontHaveCourses: "Нет доступных этапов",
		profile: "Профиль",
		main: "Главная",
		btnRedirect1: "ПОМОЩЬ КУРАТОРОВ В ОБУЧЕНИИ, подать заявку",
		btnRedirect2: "Официальный сайт автора методики",
		btnRedirect3: "Обучение специалистов и родителей",
		btnRedirect4: "Официальный сайт автора методики",
	},

	customVideoPlayer: {
		loading: "Загрузка...",
		notFound: "Видео не найдено",
	},

	checkLogin: {
		title: "Проверка входа",
		text: "Чтобы получить доступ к оплате, необходимо войти в систему или зарегистрироваться.",
		login: "Уже есть учетная запись? Войти",
		registration: "Ещё нет учетной записи? Зарегистрироваться",
	},
};
