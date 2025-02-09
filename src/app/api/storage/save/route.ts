import { auth } from "@/lib/auth";
import { encryptFile } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { uploadServerSideFile } from "@/lib/uploadthing";
import { formatZodError } from "@/lib/utils";
import { z } from "zod";
import { zfd } from "zod-form-data";

const MB_BYTES = 1000000;
const ACCEPTED_MIME_TYPES = ["image/gif", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 50 * MB_BYTES;

const bodySchema = zfd.formData({
	file: z.instanceof(File).superRefine((file, ctx) => {
		if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
					", ",
				)}] but was ${file.type}`,
			});
		}

		if (file.size > MAX_FILE_SIZE) {
			ctx.addIssue({
				code: z.ZodIssueCode.too_big,
				type: "array",
				message: `The file must not be larger than ${MAX_FILE_SIZE} bytes: ${
					file.size
				}`,
				maximum: MAX_FILE_SIZE,
				inclusive: true,
			});
		}
	}),
});

export const POST = async (request: Request) => {
	const fd = await request.formData();
	const parsedBody = await bodySchema.safeParseAsync(fd);

	if (parsedBody.error) {
		console.error(parsedBody.error);
		return new Response(
			JSON.stringify({
				success: false,
				message: formatZodError(parsedBody.error),
			}),
			{
				status: 400,
			},
		);
	}

	const session = await auth();
	if (!session || !session.user.id) {
		console.error("No session found!");
		return new Response(
			JSON.stringify({
				success: false,
				message: "Session not found!",
			}),
			{
				status: 400,
			},
		);
	}

	const userEncryptedKey = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { encryptedKey: true },
	});

	console.log(userEncryptedKey);

	if (!userEncryptedKey?.encryptedKey) {
		return new Response("User key not found!", {
			status: 400,
		});
	}

	const encryptedFile = await encryptFile(
		parsedBody.data.file,
		userEncryptedKey.encryptedKey,
	);

	const extension = parsedBody.data.file.name.split(".").pop() ?? "";

	const result = await uploadServerSideFile(encryptedFile);

	if (!result) {
		console.error("Error uploading file");
		return new Response("Error uploading file", {
			status: 500,
		});
	}

	await prisma.file.create({
		data: {
			extension,
			filename: parsedBody.data.file.name,
			key: result.key,
			size: result.size,
			mimetype: parsedBody.data.file.type,
			path: "",

			user: {
				connect: {
					id: session.user.id,
				},
			},
		},
	});

	return new Response(JSON.stringify({ success: true }), { status: 200 });
};
