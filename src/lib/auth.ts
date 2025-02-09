import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Discord from "next-auth/providers/discord";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
		} & DefaultSession["user"];
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [Discord],
	callbacks: {
		session({ session, user }) {
			return {
				...session,
				user: {
					...session.user,
					id: user.id,
				},
			};
		},
	},
	events: {
		async createUser({ user }) {
			const masterKey = process.env.STORAGE_MASTER_KEY;
			if (!masterKey) throw new Error("STORAGE_MASTER_KEY is not defined");

			if (!user.id) throw new Error("User ID is not defined");

			const userKey = generateRandomUserKey();
			const encryptedKey = encryptUserKey(userKey);

			await prisma.user.update({
				where: { id: user.id },
				data: {
					encryptedKey,
				},
			});
		},
	},
});

import { cache } from "react";
import { encryptUserKey, generateRandomUserKey } from "./crypto";
export const cachedAuth = cache(async () => {
	return await auth();
});
