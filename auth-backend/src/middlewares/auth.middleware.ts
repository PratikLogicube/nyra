import { Request, Response } from "express";
import { validateAccessToken, validateRefreshToken } from "../utils/helpers";
import { generateToken, saveRefreshToken } from "../token/jwt-token-manager";
import { encryptData } from "../encryption";
import { setCookies } from "../handlers/user-handler";

const validateAuthMiddleware = async (req: Request, res: Response) => {
  const [accessToken, refreshToken] = req.headers.authorization?.split(",")!;
  const accessTokenValue = accessToken && accessToken?.split("=")[1];
  const refreshTokenValue = refreshToken && refreshToken?.split("=")[1];
  const isValidAccessToken = await validateAccessToken(accessTokenValue);
  const decodedRefreshToken = await validateRefreshToken(refreshTokenValue);
  if (isValidAccessToken && decodedRefreshToken) {
    console.log("Access token and refresh token are valid");
    return res.status(200).json({
      success: true,
      message: "Authorization successful",
    });
  } else if (!isValidAccessToken && decodedRefreshToken) {
    // regenerate new tokens
    console.log("Both tokens are invalid, regenerating new tokens");
    const newAccessToken = generateToken(
      decodedRefreshToken.id!,
      decodedRefreshToken.email!,
      "access"
    );
    const newRefreshToken = generateToken(
      decodedRefreshToken.id!,
      decodedRefreshToken.email!,
      "refresh"
    );

    const newEncryptedRefreshToken = encryptData(newRefreshToken);
    await saveRefreshToken(newRefreshToken, newEncryptedRefreshToken);
    setCookies(newAccessToken, newEncryptedRefreshToken, res);

    return res.status(200).json({
      success: true,
      message: "Authorization successful",
    });
  } else {
    res.status(401).json({
      message: "Unauthorized access. Invalid tokens.",
      success: false,
    });
  }
};

export default validateAuthMiddleware;
