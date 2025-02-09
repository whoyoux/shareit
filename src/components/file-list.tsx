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

// type File = {
// 	id: string;
// 	name: string;
// 	size: string;
// 	type: string;
// 	uploadedAt: string;
// };

// const mockFiles: File[] = [
// 	{
// 		id: "1",
// 		name: "document.pdf",
// 		size: "2.5 MB",
// 		type: "PDF",
// 		uploadedAt: "2023-06-01",
// 	},
// 	{
// 		id: "2",
// 		name: "image.jpg",
// 		size: "1.8 MB",
// 		type: "Image",
// 		uploadedAt: "2023-06-02",
// 	},
// 	{
// 		id: "3",
// 		name: "spreadsheet.xlsx",
// 		size: "500 KB",
// 		type: "Spreadsheet",
// 		uploadedAt: "2023-06-03",
// 	},
// ];

export function FileList({ files }: { files: File[] }) {
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
							<FileIcon className="inline-block mr-2" size={16} />
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
									<DropdownMenuItem>
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
