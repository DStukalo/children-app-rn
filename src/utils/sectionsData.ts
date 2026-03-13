import rawData from "../../data/data.json";
import type { SectionId } from "../navigation/types";
import type { Course, LocalizedString } from "./courseData";
import type { LessonMaterials } from "./courseData";

export type AppSubsection = {
	id: string;
	title: LocalizedString;
	image?: string;
	price?: number;
	subsections?: AppSubsection[];
	items?: Array<{
		id: string;
		title: LocalizedString;
		video?: LocalizedString;
		description?: LocalizedString;
		sectionTags?: number[];
		access?: "free" | "locked";
	}>;
};

export type AppSection = {
	id: SectionId;
	title: LocalizedString;
	image?: string;
	video?: LocalizedString;
	materials?: LessonMaterials;
	description?: LocalizedString;
	courses: Course[];
	subsections?: AppSubsection[];
};

type SectionsData = {
	sections: AppSection[];
};

const data = rawData as Partial<SectionsData>;
const flattenSubsectionItems = (
	subsections: AppSubsection[]
): Array<{
	id: string;
	title: LocalizedString;
	video?: LocalizedString;
	description?: LocalizedString;
}> =>
	subsections.flatMap((subsection) => [
		...(subsection.items ?? []),
		...(subsection.subsections
			? flattenSubsectionItems(subsection.subsections)
			: []),
	]);

const createDrumComplexCourse = (
	section: AppSection,
	sectionIndex: number
): Course | null => {
	if (section.id !== "drumComplex" || !section.subsections?.length) {
		return null;
	}

	const lessonBaseId = (sectionIndex + 1) * 1000;
	const lessons = flattenSubsectionItems(section.subsections).map((item, index) => ({
		lessonId: lessonBaseId + index + 1,
		title: item.title,
		description: item.description,
		video: item.video ?? { en: "", ru: "" },
		access: "free" as const,
	}));

	if (!lessons.length) {
		return null;
	}

	const firstLessonVideo = lessons[0].video;
	const firstLessonDescription =
		lessons.find((lesson) => lesson.description?.ru || lesson.description?.en)
			?.description ?? { en: "", ru: "" };

	return {
		id: (sectionIndex + 1) * 100,
		title: section.title,
		subtitle: { en: "", ru: "" },
		image: section.image ?? "",
		isCompleted: false,
		price: 0,
		details: {
			description: section.description ?? firstLessonDescription,
			lessons,
			materials: section.materials,
			video: Array.isArray(firstLessonVideo)
				? section.video ?? { en: "", ru: "" }
				: section.video ?? firstLessonVideo,
		},
	};
};

const sections: AppSection[] = (data.sections ?? []).map((section, index) => {
	if (section.id !== "drumComplex") {
		return section;
	}

	if (section.courses?.length) {
		return section;
	}

	const synthesizedCourse = createDrumComplexCourse(section, index);
	if (!synthesizedCourse) {
		return section;
	}

	return {
		...section,
		courses: [synthesizedCourse],
		subsections: [],
	};
});

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
