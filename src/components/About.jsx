import React from "react";
import s from "./About.module.css";

export default function About() {
  return (
    <div>
      <text className={s.about}>
        This is my first application! It is created with javascript and react,{" "}
        <br />
        it is quite simple but I am very proud of the result since it is the{" "}
        <br />
        first time that I make a web application! I hope you like it!
      </text>
    </div>
  );
}
