import React from "react";
import axios from "axios";
import { cookies } from "next/headers";
import api from "../utils/axiosInstance";

type Response = {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

const getUser = async () => {
  const cookieStore = await cookies();

  const response = await api.get("/auth/user/profile/me", {
    withCredentials: true,
    headers: {
      Authorization: `accessToken=${
        cookieStore.get("accessToken")?.value
      }, refreshToken=${cookieStore.get("refreshToken")?.value}`,
    },
  });

  const data = (await response.data) as Response;
  console.log("User data fetched:", data);

  return data;
};

const ProfilePage = async () => {
  const user = await getUser();

  return <div>{JSON.stringify(user)}</div>;
};

export default ProfilePage;
