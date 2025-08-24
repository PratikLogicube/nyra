import { NextFunction, Request, Response } from "express";
import { validateRefreshToken } from "../utils/helpers";

export const validateAuthTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Validating authentication tokens...");

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing.",
    });
  }

  try {
    // Expected format: "accessToken=xxx, refreshToken=yyy"
    const parts = authHeader.split(",");
    const accessToken = parts[0]?.split("=")[1]?.trim();
    const refreshToken = parts[1]?.split("=")[1]?.trim();

    if (!accessToken || !refreshToken) {
      return res.status(400).json({
        success: false,
        message:
          "Both accessToken and refreshToken are required in Authorization header.",
      });
    }

    // Validate refresh token (you can also validate accessToken if needed)
    const decryptedRefreshToken = await validateRefreshToken(refreshToken);

    if (!decryptedRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token.",
      });
    }

    console.log("Tokens validated successfully:", decryptedRefreshToken);

    // Attach decoded data for handlers to use
    res.locals.jwtData = decryptedRefreshToken;

    return next();
  } catch (error) {
    console.error("Error validating tokens:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while validating tokens.",
    });
  }
};

// import { NextFunction, Request, Response } from "express";
// import { validateRefreshToken } from "../utils/helpers";

// export const validateAuthTokens = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log("Validating authentication tokens...");

//   const [_, refreshToken] = req.headers.authorization?.split(",")!;
//   const refreshTokenValue = refreshToken && refreshToken?.split("=")[1];

//   const decryptedRefreshToken = await validateRefreshToken(refreshTokenValue);

//   if (!decryptedRefreshToken) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid refresh token.",
//     });
//   }

//   console.log("Refresh token validated successfully:", decryptedRefreshToken);

//   res.locals.jwtData = decryptedRefreshToken;

//   return next();
// };
