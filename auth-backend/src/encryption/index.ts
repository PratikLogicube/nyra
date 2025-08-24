import crypto from "crypto";
import { config } from "dotenv";
import e from "express";
// SYMETRIC ENCRYPTION
// This file contains functions for symmetric encryption and decryption using AES algorithm.
// Definition of AES:
// AES (Advanced Encryption Standard) is a symmetric encryption algorithm widely used across the globe to secure data. It operates on fixed-size blocks of data and uses a secret key for both encryption and decryption.

// KEY -> 32 bytes BASE64 encoded string -> convert to Buffer -> env
// IV -> 16 bytes BASE64 encoded string -> convert to Buffer -> dynamic
config();
const key = Buffer.from(process.env.ENCRYPTION_KEY!, "base64");
const iv = crypto.randomBytes(16); // Initialization vector, should be unique for each encryption

export const encryptData = (data: string) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  // Encrypt the data
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
};

export const decryptData = (encryptedData: string) => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  // Decrypt the data
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
