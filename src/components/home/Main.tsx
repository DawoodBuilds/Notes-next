"use client";
import React from "react";
import Button from "@/components/layout/Button";
import css from "@/styles/Main.module.css";
import Linker from "../ui/Linker";

const Main = () => {
  const CancelDrag = (e: React.DragEvent) => e.preventDefault();
  return (
    <main onDragStart={CancelDrag} className="main">
      <h1 className="hero">
        Study Less. <br />
        <span className="remember">Remember Everything.</span>
      </h1>
      <p className="hero-description">
        Your personal AI tutor. Upload any PDF and master the material in
        minutes, not hours.
      </p>
      <div className={`${css.buttons}`}>
        <Button variant="white">Learn More</Button>
        <Linker variant="black" href="sign-in">
          Get Started
        </Linker>
      </div>
    </main>
  );
};

export default Main;
