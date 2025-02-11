import { cachedAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileList } from "./file-list";
import { Suspense } from "react";
import UploadFileForm from "./upload-file-form";
import { DashboardStats } from "./dashboard-stats";

export default async function Dashboard() {
	const session = await cachedAuth();

	if (!session || !session.user) {
		return <div>Please log in</div>;
	}

	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="flex flex-col-reverse md:flex-row gap-4">
				<DashboardStats />
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
