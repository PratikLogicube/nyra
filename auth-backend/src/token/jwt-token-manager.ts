import jwt from "jsonwebtoken";
import { setCache } from "../redis/actions";
import { generateRedisKey, generateTTL } from "../utils/helpers";

const generateToken = (
  id: string,
  email: string,
  tokenType: "access" | "refresh"
) => {
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET_KEY!, {
    expiresIn: tokenType === "access" ? "15m" : "7d",
  });

  return token;
};

const saveRefreshToken = async (token: string, encryptedToken: string) => {
  console.log("Saving refresh token to Redis");

  try {
    const decodedToken = jwt.decode(token);

    if (!decodedToken || typeof decodedToken === "string") {
      throw new Error("Unable to decode token");
    }

    const key = generateRedisKey(decodedToken.id);
    const expiration = generateTTL(decodedToken.exp!);
    // Save the encrypted refresh token in Redis with an expiration time
    await setCache(key, encryptedToken, expiration);
    // console.log(`Refresh token saved for user ID: ${decodedToken.id}`);
  } catch (error) {
    console.error("Error saving refresh token:", error);
    throw new Error("Failed to save refresh token");
  }
};

const verifyAndDecode = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, payload) => {
      if (err) {
        return reject(new Error("Invalid token"));
      }
      console.log("Token verified successfully:");

      resolve(payload);
    });
  });
};

export { generateToken, saveRefreshToken, verifyAndDecode };
