import rawData from "../../data/data.json";
import type { SectionId } from "../navigation/types";
import type { Course, LocalizedString } from "./courseData";

export type AppSubsection = {
	id: string;
	title: LocalizedString;
	subsections?: AppSubsection[];
	items?: Array<{
		id: string;
		title: LocalizedString;
	}>;
};

export type AppSection = {
	id: SectionId;
	title: LocalizedString;
	courses: Course[];
	subsections?: AppSubsection[];
};

type SectionsData = {
	sections: AppSection[];
};

const data = rawData as Partial<SectionsData>;
const sections: AppSection[] = data.sections ?? [];

export const getSections = (): AppSection[] => sections;

export const findSectionById = (sectionId: SectionId): AppSection | undefined =>
	sections.find((section) => section.id === sectionId);

export const findSubsectionByPath = (
	sectionId: SectionId,
	subsectionPath: string[]
): AppSubsection | undefined => {
	const section = findSectionById(sectionId);
	let current: AppSubsection | undefined;
	let list = section?.subsections ?? [];

	for (const id of subsectionPath) {
		current = list.find((sub) => sub.id === id);
		if (!current) {
			return undefined;
		}
		list = current.subsections ?? [];
	}

	return current;
};
