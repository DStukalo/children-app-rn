export const formatPrice = (value?: number) => {
	if (typeof value !== "number" || Number.isNaN(value)) {
		return "0";
	}

	return Number.isInteger(value) ? `${value}` : value.toFixed(2);
};
