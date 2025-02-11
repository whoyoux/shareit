"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFileSize } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { File } from "@prisma/client";

const fetchFiles = async (): Promise<File[]> => {
	const response = await fetch("/api/storage/list");
	if (!response.ok) {
		throw new Error("Failed to fetch files");
	}
	return response.json();
};

export function DashboardStats() {
	const { data: files } = useQuery({
		queryKey: ["files"],
		queryFn: fetchFiles,
	});

	// Calculate total size
	const totalSize = files?.reduce((acc, file) => acc + file.size, 0) ?? 0;
	const fileCount = files?.length ?? 0;

	// 1 GB in bytes
	const storageLimit = 1024 * 1024 * 1024;
	const usedStoragePercentage = Math.round((totalSize / storageLimit) * 100);

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">Total Storage</CardTitle>
				</CardHeader>
				<CardContent>
					<span className="text-2xl font-bold">
						{formatFileSize(totalSize)} / {formatFileSize(storageLimit)}
					</span>
					<p className="text-xs text-muted-foreground">
						{usedStoragePercentage}% of your storage used
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Files</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{fileCount}</div>
					<p className="text-xs text-muted-foreground">
						Total files in your storage
					</p>
				</CardContent>
			</Card>
		</>
	);
}
