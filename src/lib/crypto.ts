import "server-only";

import crypto from "node:crypto";

const STORAGE_MASTER_KEY = process.env.STORAGE_MASTER_KEY || "";
if (!STORAGE_MASTER_KEY) {
	throw new Error("Brak STORAGE_MASTER_KEY w .env!");
}

export function generateRandomUserKey(): Buffer {
	return crypto.randomBytes(32);
}

export function encryptUserKey(userKey: Buffer): string {
	// Najpierw z STORAGE_MASTER_KEY robimy 32-bajtowy klucz do AES-256
	const masterKey = crypto
		.createHash("sha256")
		.update(STORAGE_MASTER_KEY)
		.digest();
	const iv = crypto.randomBytes(16);

	const cipher = crypto.createCipheriv("aes-256-cbc", masterKey, iv);
	const encrypted = Buffer.concat([cipher.update(userKey), cipher.final()]);

	// Zwracamy (IV + zaszyfrowane dane) jako base64
	return Buffer.concat([iv, encrypted]).toString("base64");
}

export function decryptUserKey(encryptedUserKey: string): Buffer {
	const data = Buffer.from(encryptedUserKey, "base64");
	const iv = Buffer.from(data.subarray(0, 16));
	const ciphertext = Buffer.from(data.subarray(16));

	const masterKey = crypto
		.createHash("sha256")
		.update(STORAGE_MASTER_KEY)
		.digest();
	const decipher = crypto.createDecipheriv("aes-256-cbc", masterKey, iv);
	const userKey = Buffer.concat([
		decipher.update(ciphertext),
		decipher.final(),
	]);

	return userKey;
}

export async function encryptFile(file: File, userEncryptedKey: string) {
	// Odszyfrowujemy userKey
	const userKey = decryptUserKey(userEncryptedKey);

	// Wczytujemy plik do Buffer
	const fileArrayBuffer = await file.arrayBuffer();
	const fileBuffer = Buffer.from(fileArrayBuffer);

	// Szyfrujemy AES-256-CBC
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv("aes-256-cbc", userKey, iv);
	const encryptedFile = Buffer.concat([
		cipher.update(fileBuffer),
		cipher.final(),
	]);

	// Sklejamy IV i zaszyfrowane dane w jeden plik
	const result = Buffer.concat([iv, encryptedFile]);

	return new File([result], file.name);
}

export async function decryptFile(file: File, userEncryptedKey: string) {
	const userKey = decryptUserKey(userEncryptedKey);

	// Odczytujemy zaszyfrowany plik
	const encryptedBuffer = Buffer.from(await file.arrayBuffer());

	// 1. Pierwsze 16 bajtów to IV
	const iv = encryptedBuffer.subarray(0, 16);
	// 2. Reszta to zaszyfrowana treść
	const content = encryptedBuffer.subarray(16);

	// Deszyfrujemy
	const decipher = crypto.createDecipheriv("aes-256-cbc", userKey, iv);
	const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);

	return new File([decrypted], file.name);
}
