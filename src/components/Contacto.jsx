import React from "react";
import s from "./Contacto.module.css";

function Contacto() {
  return (
    <div className={s.container}>
      <h2 className={s.contacto}>Contact</h2>
      <ul className={s.list}>
        Patricio Turpin
        <br />
        Software Developer
        <br />
        Mail: patricioturpin@gmail.com
      </ul>
    </div>
  );
}

export default Contacto;
