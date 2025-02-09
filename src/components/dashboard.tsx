import { cachedAuth } from "@/lib/auth";
import UploadFileForm from "./upload-file-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileList } from "./file-list";
import { Suspense } from "react";

// const getCachedFiles = unstable_cache(
// 	async (userId: string) => {
// 		return prisma.file.findMany({
// 			where: { userId },
// 			orderBy: { createdAt: "desc" },
// 		});
// 	},
// 	["files", "user-files"],
// 	{ tags: ["files"] },
// );

// const getCachedFiles = async (userId: string) => {
// 	"use cache";
// 	cacheTag(`files-${userId}`);
// 	const files = await prisma.file.findMany({
// 		where: { userId },
// 		orderBy: { createdAt: "desc" },
// 	});
// 	return files;
// };

export default async function Dashboard() {
	const session = await cachedAuth();

	if (!session || !session.user) {
		return <div>Please log in</div>;
	}

	// const files = await getCachedFiles(session.user.id);

	return (
		<div className="flex flex-col gap-4 w-full">
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
				<Suspense fallback={<div>Loading...</div>}>
					<Card>
						<CardHeader>
							<CardTitle>Your files</CardTitle>
							{/* <CardDescription>Your uploaded files</CardDescription> */}
						</CardHeader>
						<CardContent>
							<FileList />
						</CardContent>
					</Card>
				</Suspense>
			</div>
		</div>
	);
}
