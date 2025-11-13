"use client";
import React from "react";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import css from "@/styles/Main.module.css";

const Main = () => {
  return (
    <motion.main
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className={`${css.hero}`}>
        Manage Your Notes, Tasks and Projects{" "}
        <span className="fancy">Efficiently</span>
      </div>
      <div className={`${css["hero-description"]}`}>
        Effortlessly organize your tasks, streamline your workflows, and enhance
        collaboration with our all-in-one solution. Whether you&apos;re managing
        personal projects, working solo, or teaming up with colleagues, our
        platform helps you stay focused, productive, and on top of your game.
      </div>
      <div className={`${css.buttons}`}>
        <Button variant="white">Learn More</Button>
        <Button variant="black">Get Started</Button>
      </div>
    </motion.main>
  );
};

export default Main;
