import { Request, Response } from "express";
import { pool } from "../mysql/connection";
import { GET_USER_BY_EMAIL, GET_USER_BY_ID } from "../mysql/queris";
import { INSERT_USER_STATEMENT } from "../mysql/mutations";

import bcrypt from "bcrypt";
import { generateToken, saveRefreshToken } from "../token/jwt-token-manager";
import { encryptData } from "../encryption";
import { PoolConnection } from "mysql2/promise";

const setCookies = (
  accessToken: string,
  refreshToken: string,
  res: Response
) => {
  // This function can be used to set cookies in the response
  res.clearCookie("accessToken", {
    domain: "localhost",
    path: "/",
    httpOnly: true,
  });

  res.clearCookie("refreshToken", {
    domain: "localhost",
    path: "/",
    httpOnly: true,
  });

  const accessTokenExp = new Date(new Date().getTime() + 60 * 60 * 1000); // 60 minutes
  const refreshTokenExp = new Date(
    new Date().getTime() + 7 * 24 * (60 * 60 * 1000)
  ); // 7 days

  res.cookie("accessToken", accessToken, {
    domain: "localhost",
    httpOnly: true,
    path: "/",
    expires: accessTokenExp,
    sameSite: "lax",
  });

  res.cookie("refreshToken", refreshToken, {
    domain: "localhost",
    httpOnly: true,
    path: "/",
    expires: refreshTokenExp,
    sameSite: "lax",
  });

  console.log(
    `Cookies set successfully: accessToken: ${accessToken}, refreshToken: ${refreshToken}`
  );
};

const setAuthToken = async (id: string, email: string, res: Response) => {
  // This function can be used to set an authentication token

  try {
    const accessToken = generateToken(id, email, "access");
    const refreshToken = generateToken(id, email, "refresh");
    const encryptedRefreshToken = encryptData(refreshToken);
    await saveRefreshToken(refreshToken, encryptedRefreshToken);
    setCookies(accessToken, encryptedRefreshToken, res);
  } catch (error) {
    console.error("Error generating tokens:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserBy = async (by: "email" | "id", value: string) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      by === "id" ? GET_USER_BY_ID : GET_USER_BY_EMAIL,
      [value]
    );
    //@ts-ignore
    const user = result[0]?.[0];
    return user;
  } catch (error) {
    console.error(`Error fetching user by ${by}:`, error);
    return null;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params?.id;
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await getUserBy("id", userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User retrieved", user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUser = async (req: Request, res: Response) => {
  console.log("Fetching user data for authenticated user...");

  try {
    const userId = res.locals.jwtData.id;
    console.log(`Fetching user with ID: ${userId}`);

    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await getUserBy("id", userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User retrieved", user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const registerUser = async (req: Request, res: Response) => {
  let conn: PoolConnection | null = null;
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(422)
        .json({ message: "Unprocessable entity. All the fields are required" });
    }

    // Check if user already exists
    const existingUser = await getUserBy("email", email);

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with id:" + existingUser.id });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    conn = await pool.getConnection();

    const result = await conn.query(INSERT_USER_STATEMENT, [
      name,
      email,
      hashedPassword,
    ]);

    // await setAuthToken(String(result[0].insertId), email, res);

    return res
      .status(200)
      .json({ message: "User created successfully", user: result[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(422)
        .json({ message: "Unprocessable entity. All the fields are required" });
    }

    //@ts-ignore
    const user = await getUserBy("email", email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    //@ts-nocheck
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await setAuthToken(String(user.id), user.email, res);
    return res
      .status(200)
      .json({ message: "User logged In successfully", user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getUser, registerUser, loginUser, setCookies, getUserById };
