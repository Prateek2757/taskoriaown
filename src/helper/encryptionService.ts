import crypto from "crypto";

const algorithm = "aes-256-cbc" as const;

// Get encryption key and IV from environment variables
const getEncryptionKey = (): Buffer => {
	const envKey = process.env.ENCRYPTION_KEY;
	// console.log('Environment check:', {
	//   isServer: typeof window === 'undefined',
	//   hasKey: !!envKey,
	//   keyLength: envKey?.length
	// });

	if (!envKey) {
		throw new Error(
			"ENCRYPTION_KEY environment variable is not set. Please check your .env.local file and restart the server.",
		);
	}
	return Buffer.from(envKey, "hex");
};

const getEncryptionIV = (): Buffer => {
	const envIV = process.env.ENCRYPTION_IV;
	if (!envIV) {
		throw new Error(
			"ENCRYPTION_IV environment variable is not set. Please check your .env.local file and restart the server.",
		);
	}
	return Buffer.from(envIV, "hex");
};

// Function to encrypt data
export const encryptData = (text: string): string => {
	try {
		const key = getEncryptionKey();
		const iv = getEncryptionIV();
		const cipher = crypto.createCipheriv(algorithm, key, iv);
		let encrypted = cipher.update(text, "utf8", "hex");
		encrypted += cipher.final("hex");
		return encrypted;
	} catch (error) {
		console.error("Encryption error:", error);
		throw error;
	}
};

// Function to decrypt data
export const decryptData = (encryptedText: string): string => {
	try {
		const key = getEncryptionKey();
		const iv = getEncryptionIV();

		const decipher = crypto.createDecipheriv(algorithm, key, iv);
		let decrypted = decipher.update(encryptedText, "hex", "utf8");
		decrypted += decipher.final("utf8");
		return decrypted;
	} catch (error) {
		console.error("Decryption error:", error);
		throw error;
	}
};
