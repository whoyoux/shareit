import { Button } from "@/components/ui/button";
import { cachedAuth, signIn, signOut } from "@/lib/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "next-auth";

export default async function Header() {
	const session = await cachedAuth();

	return (
		<header className="py-4 p-4 border mb-4 flex items-center justify-between bg-background rounded-lg">
			<h1 className="font-medium">shareit</h1>
			{session ? <LoggedInUser user={session.user} /> : <SignInButton />}
		</header>
	);
}

function LoggedInUser({ user }: { user: User }) {
	return (
		<div className="flex items-center gap-2">
			<Avatar>
				<AvatarImage src={user.image ?? ""} />
				<AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
			</Avatar>
			<SignOutButton />
		</div>
	);
}

function SignInButton() {
	return (
		<form
			action={async () => {
				"use server";
				await signIn("discord");
			}}
		>
			<Button type="submit">Sign In</Button>
		</form>
	);
}

function SignOutButton() {
	return (
		<form
			action={async () => {
				"use server";
				await signOut();
			}}
		>
			<Button type="submit" variant="destructive">
				Sign Out
			</Button>
		</form>
	);
}
