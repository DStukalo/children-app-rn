export const formatPrice = (value?: number, currency: string = "BYN") => {
	if (typeof value !== "number" || Number.isNaN(value)) {
		return `0 ${currency}`;
	}

	const formatted = Number.isInteger(value) ? `${value}` : value.toFixed(2);
	return `${formatted} ${currency}`;
};

/**
 * Calculate the total price of all courses in a stage
 */
export const calculateStagePrice = (courses: { price: number }[]): number => {
	return courses.reduce((sum, course) => sum + (course.price || 0), 0);
};

/**
 * Calculate remaining price for a stage after subtracting already purchased courses
 */
export const calculateRemainingStagePrice = (
	courses: { id: number; price: number }[],
	purchasedCourseIds: number[]
): number => {
	return courses
		.filter(course => !purchasedCourseIds.includes(course.id))
		.reduce((sum, course) => sum + (course.price || 0), 0);
};

/**
 * Calculate full access price (sum of all courses)
 */
export const calculateFullAccessPrice = (
	allCourses: { id: number; price: number }[],
	purchasedCourseIds: number[] = []
): number => {
	return allCourses
		.filter(course => !purchasedCourseIds.includes(course.id))
		.reduce((sum, course) => sum + (course.price || 0), 0);
};
