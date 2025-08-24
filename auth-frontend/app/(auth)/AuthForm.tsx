"use client";
import React, { useActionState } from "react";

type Props = {
  isSignup: boolean;
  action: (f: FormData) => Promise<void>;
};

const inputStyles = "px-2 py-1 bg-gray-100 rounded-lg";

const AuthForm = ({ isSignup, action }: Props) => {
  //@ts-ignore
  const [state, formAction] = useActionState(action, undefined);
  return (
    <section className="w-full h-screen flex flex-col">
      <form
        action={formAction}
        className="flex flex-col m-auto justify-center items-center border-4 rounded-lg p-2 "
      >
        State: {JSON.stringify(state)}
        <h4 className="text-2xl py-3">
          {isSignup ? "Register" : "Login"} from here!
        </h4>
        {isSignup && (
          <>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" className={inputStyles} />
          </>
        )}
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" className={inputStyles} />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className={inputStyles}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
        >
          {isSignup ? "Register" : "Login"}
        </button>
      </form>
    </section>
  );
};

export default AuthForm;
