import { decryptData } from "../encryption";
import { getCache } from "../redis/actions";
import { verifyAndDecode } from "../token/jwt-token-manager";

type TokenInfo = {
  id: string;
  email: string;
  exp: number;
  iat: number;
};

const generateTTL = (tokenExp: number) => {
  const currentTime = Math.floor(Date.now() / 1000);

  const secondsToExpire = tokenExp - currentTime;
  return secondsToExpire > 0 ? secondsToExpire : 0; // Ensure non-negative TTL
};

const generateRedisKey = (userId: string) => {
  return `user:${userId}`;
};

const validateAccessToken = async (token: string) => {
  try {
    const decodedToken = await verifyAndDecode(token);
    if (decodedToken) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error validating access token:", error);
    return false;
  }
};

const validateRefreshToken = async (encryptedToken: string) => {
  try {
    const jwtToken = decryptData(encryptedToken);
    const decodedToken = (await verifyAndDecode(jwtToken)) as TokenInfo;

    if (!decodedToken) {
      console.log("Invalid refresh token");
      return false;
    }

    const encryptedTokenFromCache = await getCache(
      generateRedisKey(decodedToken.id)
    );

    if (!encryptedTokenFromCache) {
      console.log("Refresh token not found in cache");
      return false;
    }

    const decryptedTokenFromCache = decryptData(encryptedTokenFromCache);
    const decryptedJwtDataFromCache = (await verifyAndDecode(
      decryptedTokenFromCache
    )) as TokenInfo;

    // token
    if (
      encryptedTokenFromCache !== encryptedToken ||
      decryptedTokenFromCache !== jwtToken
    ) {
      console.log("Refresh token mismatch or malformed");
      return false;
    }

    const ttl = generateTTL(decryptedJwtDataFromCache!.exp);

    if (ttl <= 0) {
      console.log("Refresh token has expired");
      return false;
    }

    return { ...decryptedJwtDataFromCache };
  } catch (error) {
    console.error("unexpedted Error during refresh token validation:", error);
    return false;
  }
};

export {
  generateTTL,
  generateRedisKey,
  validateAccessToken,
  validateRefreshToken,
};
