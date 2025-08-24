import React from "react";
import AuthForm from "../AuthForm";
import { loginAction } from "@/app/actions/form-actions";

type Props = {};

const Login = (props: Props) => {
  return (
    <div>
      <AuthForm action={loginAction} isSignup={false} />
    </div>
  );
};

export default Login;
