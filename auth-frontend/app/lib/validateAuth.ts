import axios from "axios";
import { cookies } from "next/headers";
import api from "../utils/axiosInstance";

export const validateAuth = async () => {
  console.log("Validating user authentication...");

  const cookieStore = await cookies();
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const res = await api.put(
      `${url}/auth/validate/tokens`,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `accessToken=${
            cookieStore.get("accessToken")?.value
          }, refreshToken=${cookieStore.get("refreshToken")?.value}`,
        },
      }
    );

    const data = await res.data;
    console.log("Validation response:", data);

    return data;
  } catch (error) {
    console.error("Error in validateAuth:", error);
    throw error;
  }
};
