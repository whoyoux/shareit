"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileIcon, MoreVertical, Download, Trash } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { File } from "@prisma/client";
import { formatFileSize } from "@/lib/utils";

export function FileList({ files }: { files: File[] }) {
	const downloadFile = async (fileKey: string, fileName: string) => {
		try {
			const response = await fetch(`/api/storage/download?fileKey=${fileKey}`);
			if (!response.ok) {
				console.error("Failed to download file:", response.statusText);
				return;
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Size</TableHead>
					<TableHead>Type</TableHead>
					<TableHead>Uploaded At</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{files.map((file) => (
					<TableRow key={file.id}>
						<TableCell className="font-medium">
							<FileIcon
								className="inline-block mr-2 truncate max-w-[200px]"
								size={16}
							/>
							{file.filename}
						</TableCell>
						<TableCell>{formatFileSize(file.size)}</TableCell>
						<TableCell>{file.mimetype}</TableCell>
						<TableCell>{file.createdAt.toDateString()}</TableCell>
						<TableCell>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="h-8 w-8 p-0">
										<span className="sr-only">Open menu</span>
										<MoreVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<DropdownMenuItem
										onClick={() => downloadFile(file.key, file.filename)}
									>
										<Download className="mr-2 h-4 w-4" />
										<span>Download</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<Trash className="mr-2 h-4 w-4" />
										<span>Delete</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
