"use client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UploadFileForm() {
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (file: File) => {
			const fd = new FormData();
			fd.append("file", file);

			const response = await fetch("/api/storage/save", {
				body: fd,
				method: "POST",
			});

			const result = await response.json();
			if (!result.success) {
				throw new Error(result.message ?? "An error occurred");
			}
			return result;
		},
		onSuccess: () => {
			toast.success("File uploaded successfully!");
			if (fileInputRef.current) fileInputRef.current.value = "";
			setFile(null);
			queryClient.invalidateQueries({ queryKey: ["files"] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				if (!file) return console.error("No file provided. Returning.");
				mutation.mutate(file);
			}}
			className="flex items-center gap-2"
		>
			<Input
				type="file"
				name="file"
				onChange={(e) => setFile(e.target.files?.[0] ?? null)}
				ref={fileInputRef}
			/>
			<Button type="submit" loading={mutation.isPending}>
				Upload
			</Button>
		</form>
	);
}
