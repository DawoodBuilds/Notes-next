"use client";
import React, { useState } from "react";
import css from "@/styles/Header.module.css";
import Navbar from "./Navbar";
import Linker from "../ui/Linker";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className={`${css.header_content}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Recap<span className="text-purple-600">.ai</span>
          </span>
        </div>

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
            <Linker href="/sign-in">Sign In</Linker>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`${css.sidebar} ${isMenuOpen ? css.sidebar_open : ""}`}>
        <Navbar />
        <div className={`${css.sidebar_actions}`}>
          <div className={`${css.demo}`}>Watch demo</div>
          <Linker href="/login">Sign In</Linker>
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
