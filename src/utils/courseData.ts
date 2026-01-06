import rawData from "../../data/data.json";
import type { SectionId } from "../navigation/types";

export type LocalizedString = {
	en: string;
	ru: string;
};

export type LessonMaterials = {
	en: string[];
	ru: string[];
};

export type LessonVideoItem = {
	videoId: number;
	title: LocalizedString;
	video: LocalizedString;
};

export type LessonAudioItem = {
	audioId: number;
	title: LocalizedString;
	audio: LocalizedString;
};

export type Lesson = {
	lessonId: number;
	title: LocalizedString;
	subtitle?: LocalizedString;
	description?: LocalizedString;
	video: LocalizedString | LessonVideoItem[];
	audio?: LessonAudioItem[];
	materials?: LessonMaterials;
	access: "free" | "locked";
};

export type CourseDetails = {
	description: LocalizedString;
	materials?: LessonMaterials;
	lessons: Lesson[];
	video?: LocalizedString;
	audio?: LessonAudioItem[];
};

export type Course = {
	id: number;
	title: LocalizedString;
	subtitle: LocalizedString;
	image: string;
	isCompleted: boolean;
	price: number;
	details: CourseDetails;
};

export type StageSubsection = {
	id: string;
	title: LocalizedString;
	subsections?: StageSubsection[];
	items?: Array<{
		id: string;
		title: LocalizedString;
	}>;
};

export type Stage = {
	id: number;
	price?: number;
	title: LocalizedString;
	subtitle: LocalizedString;
	courses: Course[];
	sectionId?: SectionId;
	subsections?: StageSubsection[];
};

type StageData = {
	stages: Stage[];
};

type Section = {
	id: SectionId;
	title: LocalizedString;
	courses?: Course[];
	subsections?: StageSubsection[];
};

type SectionsData = {
	sections: Section[];
};

export type CourseWithStage = Course & {
	stageId: number;
	stageTitle: LocalizedString;
	stageSubtitle: LocalizedString;
};

const data = rawData as Partial<StageData & SectionsData>;
const stagesFromStages: Stage[] = data.stages ?? [];
const sections: Section[] = data.sections ?? [];

const stages: Stage[] =
	stagesFromStages.length > 0
		? stagesFromStages
		: sections.map((section, index) => ({
				id: index + 1,
				title: section.title,
				subtitle: { en: "", ru: "" },
				courses: section.courses ?? [],
				sectionId: section.id,
				subsections: section.subsections ?? [],
		  }));

const coursesCache: CourseWithStage[] = stages.flatMap((stage) =>
	stage.courses.map((course) => ({
		...course,
		stageId: stage.id,
		stageTitle: stage.title,
		stageSubtitle: stage.subtitle,
	}))
);

export const getStages = (): Stage[] => stages;

export const getAllCourses = (): CourseWithStage[] => coursesCache;

export const findCourseById = (
	courseId: number
): CourseWithStage | undefined => {
	return coursesCache.find((course) => course.id === courseId);
};

export const findCourseAndStageByCourseId = (
	courseId: number
): { course: CourseWithStage; stage: Stage } | undefined => {
	const course = findCourseById(courseId);
	if (!course) {
		return undefined;
	}
	const stage = stages.find((stageItem) => stageItem.id === course.stageId);
	if (!stage) {
		return undefined;
	}
	return { course, stage };
};

export const findLesson = (
	courseId: number,
	lessonId: number
): Lesson | undefined => {
	const course = findCourseById(courseId);
	return course?.details.lessons.find((lesson) => lesson.lessonId === lessonId);
};
