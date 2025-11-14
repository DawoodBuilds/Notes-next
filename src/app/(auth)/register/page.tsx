import React from "react";
import { Metadata } from "next";
import SocialButtons from "@/components/auth/register/SocialButtons";
import Heading from "@/components/auth/register/Heading";
import Input from "@/components/ui/InputWrapper";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Register",
};

const Register = () => {
  return (
    <div className="homedark">
      <Heading />
      <SocialButtons />
      <div className="splitter-container">
        <div className="splitter-line" />
        <span className="splitter-text">Or</span>
        <div className="splitter-line" />
      </div>
      <div className="fields">
        <Input title="First Name" placeholder="eg. John" htmlfor="first_name" />
        <Input
          title="Last Name"
          placeholder="eg. Francisco"
          htmlfor="last_name"
        />
      </div>
      <div className="w-[30%] flex flex-col gap-4 ml-auto mr-auto mt-4">
        <Input
          title="Email"
          placeholder="eg. johnfrans@gmail.com"
          htmlfor="email"
        />
        <Input
          title="Password"
          placeholder="Enter your password"
          htmlfor="password"
        />
      </div>
      <div className="w-[30%] ml-auto mr-auto mt-6">
        <Button variant="fullwhite" className="w-full rounded-lg">
          Sign Up
        </Button>
      </div>
      <div className="login">
        Already have an account?{" "}
        <a className="loginbtn" href="/login">
          Log in
        </a>
      </div>
    </div>
  );
};

export default Register;
