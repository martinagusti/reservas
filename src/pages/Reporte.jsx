import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";

import "react-big-calendar/lib/css/react-big-calendar.css";

import "./reporte.css";
import { useNavigate } from "react-router-dom";

function Reporte({ reservas, setReservas, datos, setDatos }) {
  const navigateTo = useNavigate();

  const [dolarBlue, setDolarBlue] = useState();

  console.log(reservas);

  useEffect(() => {
    fetch("https://api.bluelytics.com.ar/v2/latest")
      .then((response) => {
        return response.json();
      })
      .then((dolar) => {
        console.log(dolar.blue.value_sell);
        setDolarBlue(dolar.blue.value_sell);
      });
  }, []);

  const goToClient = (idCliente) => {
    setDatos(
      reservas.filter((reserva) => {
        return reserva.id == idCliente;
      })[0]
    );

    navigateTo("/reservas");
  };

  return (
    <div className="reporte-container">
      <div onClick={() => navigateTo("/")} className="btn-crear">
        Volver
      </div>
      <div>
        Quinta: $
        {reservas.reduce((a, b) => {
          if (b.lugar == "quinta") {
            return a + parseInt(b.importe_total);
          } else {
            return a;
          }
        }, 0)}
      </div>
      <div>
        San Bernardo: $
        {reservas.reduce((a, b) => {
          if (b.lugar == "san bernardo") {
            return a + parseInt(b.importe_total);
          } else {
            return a;
          }
        }, 0)}
      </div>
      <div>
        Total alquileres: ${""}
        {reservas.reduce((a, b) => {
          return a + parseInt(b.importe_total);
        }, 0)}{" "}
        USS{" "}
        {reservas
          .reduce((a, b) => {
            return a + parseInt(b.importe_total) / dolarBlue;
          }, 0)
          .toFixed(2)}
      </div>
      <div>
        Total cobrado: ${""}
        {reservas.reduce((a, b) => {
          return a + parseInt(b.seña);
        }, 0)}
      </div>
      <div>
        Falta por cobrar: ${""}
        {reservas.reduce((a, b) => {
          return a + parseInt(b.importe_total) - parseInt(b.seña);
        }, 0)}
      </div>
      <h3>Listado deudores</h3>

      {reservas.map((element, index) => {
        const aCobrar =
          parseInt(element.importe_total) - parseInt(element.seña);
        const fechaDeuda = new Date(element.fecha_ingreso);
        if (aCobrar > 0) {
          return (
            <div
              className="deudores"
              key={index}
              onClick={() => goToClient(element.id)}
            >
              {element.nombre} {element.apellido} debe ${aCobrar}{" "}
            </div>
          );
        }
      })}
    </div>
  );
}

export default Reporte;
