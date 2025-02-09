import { cachedAuth } from "@/lib/auth";
import UploadFileForm from "./upload-file-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FileList } from "./file-list";
import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
	const session = await cachedAuth();

	if (!session || !session.user) {
		return <div>Please log in</div>;
	}

	const files = await prisma.file.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: "desc" },
	});

	return (
		<div className="flex flex-col gap-8 w-full">
			<div className="flex flex-col-reverse md:flex-row gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Total Storage</CardTitle>
					</CardHeader>
					<CardContent>
						<span className="text-2xl font-bold">250 MB / 1 GB</span>
						<p className="text-xs text-muted-foreground">
							25% of your storage used
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Files</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">25</div>
						<p className="text-xs text-muted-foreground">+2 from last week</p>
					</CardContent>
				</Card>
				<Card className="flex-1">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Upload</CardTitle>
					</CardHeader>
					<CardContent>
						<UploadFileForm />
					</CardContent>
				</Card>
			</div>

			<div>
				<Card>
					<CardHeader>
						<CardTitle>Your files</CardTitle>
						{/* <CardDescription>Your uploaded files</CardDescription> */}
					</CardHeader>
					<CardContent>
						<FileList files={files} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
