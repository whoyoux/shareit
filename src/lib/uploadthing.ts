import "server-only";

import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({
	token: process.env.UTAPI_TOKEN,
	logLevel: "All",
	logFormat: "pretty",
});

export async function uploadServerSideFile(file: File) {
	try {
		const response = await utapi.uploadFiles(
			new File([file], `shareit-${file.name}`),
		);
		return response.data;
	} catch (error) {
		console.error("Upload failed:", error);
		throw error;
	}
}

export async function downloadServerSideFile(fileId: string) {
	try {
		const response = await fetch(`https://27kg90fflc.ufs.sh/f/${fileId}`);
		if (!response.ok) {
			throw new Error(`Failed to download file: ${response.statusText}`);
		}
		const blob = await response.blob();
		return new File([blob], fileId);
	} catch (error) {
		console.error("Download failed:", error);
		throw error;
	}
}
