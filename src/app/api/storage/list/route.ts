import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
	const session = await auth();
	if (!session || !session.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	const files = await prisma.file.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: "desc" },
	});

	return new Response(JSON.stringify(files), { status: 200 });
};
