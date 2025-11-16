import React from "react";
import css from "@/styles/SocialButtons.module.css";
import Button from "../ui/Button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const SocialButtons = () => {
  return (
    <div className={`${css["social-auth-buttons"]}`}>
      <Button
        variant="auth-social-dark"
        className="rounded-lg flex justify-center items-center gap-2"
      >
        <FcGoogle size={20} suppressHydrationWarning />
        Google
      </Button>
      <Button
        variant="auth-social-dark"
        className="rounded-lg flex justify-center items-center gap-2"
      >
        <FaGithub size={20} suppressHydrationWarning />
        Github
      </Button>
    </div>
  );
};

export default SocialButtons;
