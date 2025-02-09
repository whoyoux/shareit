"use client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function UploadFileForm() {
	const [isUploading, setIsUploading] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				if (!file) return console.error("No file provided. Returning.");

				const fd = new FormData();
				fd.append("file", file);

				setIsUploading(true);
				const resultObj = await fetch("/api/storage/encrypt", {
					body: fd,
					method: "POST",
				});
				setIsUploading(false);

				const result = await resultObj.json();
				if (result.success) {
					toast.success("File uploaded successfully!");
					if (fileInputRef.current) fileInputRef.current.value = "";
					setFile(null);
				} else {
					toast.error(result.message ?? "An error occurred.");
				}
			}}
			className="flex items-center gap-2"
		>
			<Input
				type="file"
				name="file"
				onChange={(e) => setFile(e.target.files?.[0] ?? null)}
				ref={fileInputRef}
			/>
			<Button type="submit" loading={isUploading}>
				Upload
			</Button>
		</form>
	);
}
