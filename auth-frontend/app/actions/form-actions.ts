"use server";

import z from "zod";
import { loginSchema } from "../lib/definitions";
import axios from "axios";
import setCookieParser from "set-cookie-parser";
import { cookies } from "next/headers";
import api from "../utils/axiosInstance";

// This file contains server-side actions for form handling in the auth frontend

const loginAction = async (previousState: unknown, formData: FormData) => {
  console.log("Previous State:", previousState);

  const validateFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  console.log("Fields Validation Result:", validateFields);
  if (!validateFields.success) {
    const treeifiedErrors = z.treeifyError(validateFields.error);
    return {
      error:
        treeifiedErrors.properties?.email?.errors[0] ||
        treeifiedErrors.properties?.password?.errors[0] ||
        "Invalid input",
    };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post("/auth/user/login", { email, password });
    const data = await response.data;
    const cookieStore = await cookies();
    const cookieData = setCookieParser(response.headers["set-cookie"]!);

    cookieData.forEach((cookie) => {
      //@ts-ignore
      cookieStore.set(cookie.name, cookie.value, { ...cookie });
    });
    return data;
  } catch (error) {
    console.error("Login request failed:", error);
    if (axios.isAxiosError(error) && error.response) {
      // Handle specific error response from the backend
      return { error: error.response.data.message || "Login failed" };
    }
    // Handle other errors (network issues, etc.)
    return { error: "An unexpected error occurred during login" };
  }
};

const signUpAction = async (previousState: unknown, formData: FormData) => {
  console.log("Previous State:", previousState);

  const validateFields = loginSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  console.log("Fields Validation Result:", validateFields);
  if (!validateFields.success) {
    const treeifiedErrors = z.treeifyError(validateFields.error);
    return {
      error:
        treeifiedErrors.properties?.email?.errors[0] ||
        treeifiedErrors.properties?.password?.errors[0] ||
        "Invalid input",
    };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post("/auth/user/signup", {
      name,
      email,
      password,
    });
    const data = await response.data;
    const cookieStore = await cookies();
    const cookieData = setCookieParser(response.headers["set-cookie"]!);

    cookieData.forEach((cookie) => {
      //@ts-ignore
      cookieStore.set(cookie.name, cookie.value, { ...cookie });
    });
    return data;
  } catch (error) {
    console.error("Login request failed:", error);
    if (axios.isAxiosError(error) && error.response) {
      // Handle specific error response from the backend
      return { error: error.response.data.message || "Login failed" };
    }
    // Handle other errors (network issues, etc.)
    return { error: "An unexpected error occurred during login" };
  }
};

export { loginAction, signUpAction };
