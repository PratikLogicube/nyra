import React from "react";
import AuthForm from "../AuthForm";
import { signUpAction } from "@/app/actions/form-actions";

type Props = {};

const Register = (props: Props) => {
  return (
    <div>
      <AuthForm action={signUpAction} isSignup />
    </div>
  );
};

export default Register;
