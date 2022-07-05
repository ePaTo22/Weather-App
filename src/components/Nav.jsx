import React from "react";
import Logo from "../img/weather-icon-png-2.png";
import SearchBar from "./SearchBar.jsx";

import { Link } from "react-router-dom";
import s from "./Nav.module.css";

function Nav({ onSearch }) {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <Link to="/">
        <span className="navbar-brand">
          <img
            id="logoHenry"
            src={Logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          />
          Weather App - Patricio Turpin
        </span>
      </Link>
      <SearchBar onSearch={onSearch} />
      <Link to="/about">
        <span className={s.about}>About</span>
      </Link>
      <Link to="/Contacto">
        <span className={s.contacto}>Contact</span>
      </Link>
    </nav>
  );
}
export default Nav;
