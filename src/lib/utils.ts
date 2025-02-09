import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZodError, ZodIssue } from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const formatZodIssue = (issue: ZodIssue): string => {
	const { path, message } = issue;
	const pathString = path.join(".");

	return `${pathString}: ${message}`;
};

// Format the Zod error message with only the current error
export const formatZodError = (error: ZodError) => {
	const { issues } = error;

	if (issues.length) {
		const currentIssue = issues[0];

		return formatZodIssue(currentIssue);
	}
};

export function formatFileSize(bytes: number): string {
	if (bytes >= 1024 * 1024 * 1024)
		return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
	if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
	return `${bytes} B`;
}
