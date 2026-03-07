import type { SectionId } from "../navigation/types";
import { API_BASE_URL, DEFAULT_DEALER_ID } from "../consts/consts";

type ApiNavigationLink = {
	id?: string;
	url?: string;
	title?: string;
	titleKey?: string;
	label?: string;
	labelKey?: string;
};

type ApiNavigationResponse = {
	sectionIds?: string[];
	sections?: Array<{ id?: string }>;
	redirectLinks?: ApiNavigationLink[];
	links?: ApiNavigationLink[];
};

export type DealerNavigationLink = {
	id: string;
	url: string;
	title?: string;
	titleKey?: string;
};

export type DealerNavigationData = {
	sectionIds: SectionId[];
	redirectLinks: DealerNavigationLink[];
};

const DEFAULT_SECTION_IDS: SectionId[] = [
	"rhythmSchemes",
	"echoSchemes",
	"drumComplex",
	"makatop",
	"interactiveVerbs",
	"articulationGymnastics",
	"readingTutor",
	"noteTutor",
];

const DEFAULT_REDIRECT_LINKS: DealerNavigationLink[] = [
	{
		id: "parent-training",
		url: "https://aba-centr.by",
		titleKey: "drawerNav.btnRedirect1",
	},
	{
		id: "pro-training",
		url: "https://aba-minks.by",
		titleKey: "drawerNav.btnRedirect2",
	},
	{
		id: "consultation",
		url: "https://filistovich.com",
		titleKey: "drawerNav.btnRedirect3",
	},
];

const isSectionId = (value: string): value is SectionId => {
	return DEFAULT_SECTION_IDS.includes(value as SectionId);
};

const sanitizeSectionIds = (response?: ApiNavigationResponse): SectionId[] => {
	const sectionIds =
		response?.sectionIds ?? response?.sections?.map((section) => section.id || "") ?? [];
	const normalized = sectionIds.filter(isSectionId);
	return normalized.length ? normalized : DEFAULT_SECTION_IDS;
};

const sanitizeRedirectLinks = (
	response?: ApiNavigationResponse
): DealerNavigationLink[] => {
	const links = response?.redirectLinks ?? response?.links ?? [];
	const normalized = links
		.filter((link) => !!link.url)
		.map((link, index) => ({
			id: link.id || `dealer-link-${index}`,
			url: String(link.url),
			title: link.title || link.label,
			titleKey: link.titleKey || link.labelKey,
		}));

	return normalized.length ? normalized : DEFAULT_REDIRECT_LINKS;
};

const buildEndpoints = (dealerId: string) => {
	return [
		`${API_BASE_URL}/api/dealers/${dealerId}/navigation`,
		`${API_BASE_URL}/api/navigation/${dealerId}`,
		`${API_BASE_URL}/api/navigation?dealerId=${dealerId}`,
	];
};

const fetchFromEndpoint = async (url: string): Promise<ApiNavigationResponse | null> => {
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			return null;
		}

		return (await response.json()) as ApiNavigationResponse;
	} catch {
		return null;
	}
};

export const getDealerNavigationData = async (
	dealerId: string = DEFAULT_DEALER_ID
): Promise<DealerNavigationData> => {
	for (const endpoint of buildEndpoints(dealerId)) {
		const response = await fetchFromEndpoint(endpoint);
		if (!response) {
			continue;
		}

		return {
			sectionIds: sanitizeSectionIds(response),
			redirectLinks: sanitizeRedirectLinks(response),
		};
	}

	return {
		sectionIds: DEFAULT_SECTION_IDS,
		redirectLinks: DEFAULT_REDIRECT_LINKS,
	};
};
