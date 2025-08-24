import axios from "axios";
import { cookies } from "next/headers";

export const validateAuth = async () => {
  console.log("Validating user authentication...");

  const cookieStore = await cookies();
  try {
    const url = `${
      process.env.NODE_ENV === "development"
        ? process.env.LOCAL_BACKEND_URL
        : process.env.PROD_BACKEND_URL
    }`;
    const res = await axios.put(
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
