import React from "react";
import s from "./Ciudad.css";

export default function Ciudad({ city }) {
  if (city)
    return (
      <div className="ciudad">
        <div className={s.container}>
          <h2>{city.name}</h2>
          <div className={s.ciudad}>
            <div>Temperatura: {Math.round(city.temp - 273)} ºC</div>
            <div>Clima: {city.weather}</div>
            <div>Viento: {city.wind} km/h</div>
            <div>Cantidad de nubes: {city.clouds}</div>
            <div>Latitud: {city.latitud}º</div>
            <div>Longitud: {city.longitud}º</div>
          </div>
        </div>
      </div>
    );
  else return "Esta ciudad no se encuentra en la lista";
}
