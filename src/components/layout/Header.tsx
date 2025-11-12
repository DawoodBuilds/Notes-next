"use client";
import React, { useState } from "react";
import css from "@/styles/Header.module.css";
import Navbar from "./Navbar";
import Button from "../ui/Button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`${css.header}`}>
      <div className={`${css.header_content}`}>
        <div className={`${css.logo}`}>FlashNotes</div>

        {/* Hamburger Icon */}
        <button className={`${css.hamburger}`} onClick={toggleMenu}>
          <span
            className={`${css.bar} ${isMenuOpen ? css.bar_open : ""}`}
          ></span>
          <span
            className={`${css.bar} ${isMenuOpen ? css.bar_open : ""}`}
          ></span>
          <span
            className={`${css.bar} ${isMenuOpen ? css.bar_open : ""}`}
          ></span>
        </button>

        {/* Desktop Navigation */}
        <div className={`${css.desktop_nav}`}>
          <Navbar />
          <div className={`${css.last_header_item}`}>
            <div className={`${css.demo}`}>Watch demo</div>
            <Button>Sign Up</Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`${css.sidebar} ${isMenuOpen ? css.sidebar_open : ""}`}>
        <Navbar />
        <div className={`${css.sidebar_actions}`}>
          <div className={`${css.demo}`}>Watch demo</div>
          <Button>Sign Up</Button>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div className={`${css.overlay}`} onClick={toggleMenu}></div>
      )}
    </header>
  );
};

export default Header;
