import { auth } from "@/lib/auth";
import { decryptFile, decryptUserKey } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { getFileFromURL } from "@/lib/utils";

export const GET = async (req: Request) => {
	const url = new URL(req.url);

	const fileKey = url.searchParams.get("fileKey");

	if (!fileKey) {
		return new Response("No file key provided", { status: 400 });
	}

	const session = await auth();
	if (!session || !session.user.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	const isFileOwner = await prisma.file.findFirst({
		where: {
			key: fileKey,
			userId: session.user.id,
		},
		select: {
			filename: true,
			user: {
				select: {
					encryptedKey: true,
				},
			},
		},
	});

	if (!isFileOwner) {
		return new Response("Unauthorized", { status: 401 });
	}

	// We can now decrypt the file
	const encryptedFile = await getFileFromURL(fileKey, isFileOwner.filename);
	if (!encryptedFile.success || !encryptedFile.file) {
		return new Response("Error downloading file", { status: 500 });
	}

	if (!isFileOwner.user?.encryptedKey) {
		return new Response("No encrypted key found", { status: 500 });
	}

	console.log(isFileOwner.user.encryptedKey);
	const decryptedFile = await decryptFile(
		encryptedFile.file,
		isFileOwner.user.encryptedKey,
	);

	return new Response(decryptedFile, {
		headers: {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `attachment; filename="${decryptedFile.name}"`,
		},
	});
};
