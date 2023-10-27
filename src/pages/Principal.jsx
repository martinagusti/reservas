import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar, momentLocalizer } from "react-big-calendar";

import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import "./principal.css";
import { useNavigate } from "react-router-dom";

import {
  createReserva,
  deleteReservaService,
  getReservasService,
  updateReserva,
} from "../services/reservasService";

const localizer = momentLocalizer(moment);

function Principal({ reservas, setReservas, datos, setDatos }) {
  const [errorText, setErrorText] = useState();
  const [viewCreateModal, setViewCreateModal] = useState(false);

  const [selected, setSelected] = useState();

  const navigateTo = useNavigate();

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: event.color,
      color: "white",
    };
    return {
      style,
    };
  };

  let events = [];
  for (let reserva of reservas) {
    events.push({
      title: `${reserva.nombre} ${reserva.apellido}`,
      allDay: true,
      start: new Date(reserva.fecha_ingreso),
      end: new Date(reserva.fecha_egreso),
      color: reserva.lugar == "quinta" ? "red" : "blue",
      lugar: reserva.lugar,
      importe_total: reserva.importe_total,
      seña: reserva.seña,
      nombre: reserva.nombre,
      apellido: reserva.apellido,
      telefono: reserva.telefono,
      fecha_ingreso: reserva.fecha_ingreso,
      fecha_egreso: reserva.fecha_egreso,
      id: reserva.id,
    });
  }

  const {
    register,
    handleSubmit,
    onChange,
    formState: { errors },
    reset,
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();

    if (data.seña == "") {
      data.seña = 0;
    }

    const {
      nombre,
      apellido,
      telefono,
      lugar,
      fecha_ingreso,
      fecha_egreso,
      importe_total,
      seña,
    } = data;

    const todas = await getReservasService();

    let disponible = true;

    for (let i = 0; i < todas.length; i++) {
      if (todas[i]) {
        const rango1 = new Date(todas[i].fecha_ingreso);
        const rango2 = new Date(todas[i].fecha_egreso);

        const entrada = new Date(fecha_ingreso);
        const salida = new Date(fecha_egreso);

        if (
          (entrada.getTime() >= rango1.getTime() &&
            entrada.getTime() <= rango2.getTime() &&
            todas[i].lugar == lugar) ||
          (salida.getTime() >= rango1.getTime() &&
            salida.getTime() <= rango2.getTime() &&
            todas[i].lugar == lugar)
        ) {
          disponible = false;
          setErrorText(`Fechas no disponibles`);

          break;
        }
      }
    }
    if (disponible) {
      try {
        const created = await createReserva(
          nombre,
          apellido,
          telefono,
          lugar,
          fecha_ingreso,
          fecha_egreso,
          importe_total,
          seña
        );
        if (created[0].id) {
          setReservas([created[0], ...todas]);
        }
        reset();
        setViewCreateModal(false);
        setErrorText(null);
      } catch (error) {
        console.log(error);
        setErrorText(error.response.data.error);
      }
    }
  };

  const handleOnChangeLugar = async (e) => {
    const todos = await getReservasService();
    if (e.target.value != "") {
      const filtered = todos.filter((element) => {
        return element.lugar == e.target.value;
      });
      setReservas(filtered);
    } else {
      setReservas(todos);
    }
  };

  const handleSelected = (event) => {
    const dateStart = new Date(event.start);
    const dateEnd = new Date(event.end);
    setSelected(event);
    const data = {
      nombre: event.nombre,
      apellido: event.apellido,
      lugar: event.lugar,
      fecha_ingreso: dateStart,
      fecha_egreso: dateEnd,
      start: dateStart,
      end: dateEnd,
      importe_total: event.importe_total,
      seña: event.seña,
      telefono: event.telefono,
      id: event.id,
    };
    setDatos(data);
    navigateTo("/reservas");
  };

  return (
    <div className="app-container">
      <div className="filter-container">
        <select className="filter" onChange={handleOnChangeLugar}>
          <option value="">INMUEBLE (TODOS)</option>
          <option value="quinta">QUINTA</option>
          <option value="san bernardo">SAN BERNARDO</option>
        </select>
        <button
          className="btn-crear"
          onClick={() => {
            setViewCreateModal(true);
          }}
        >
          CREAR
        </button>
      </div>

      <Calendar
        className="calndar"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        style={{ height: 500, width: 300 }}
        selected={selected}
        onSelectEvent={handleSelected}
      />

      {viewCreateModal && (
        <div className="create-modal-container">
          <div className="create-modal">
            <form
              className="form-container"
              method="post"
              onSubmit={handleSubmit(onSubmit)}
            >
              <select
                {...register("lugar", {
                  required: true,
                })}
              >
                <option value="">LUGAR</option>
                <option value="quinta">QUINTA</option>
                <option value="san bernardo">SAN BERNARDO</option>
              </select>
              {errors.lugar?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="date"
                id="fecha_ingreso"
                {...register("fecha_ingreso", {
                  required: true,
                  onChange: () => setErrorText(null),
                })}
              />
              {errors.fecha_ingreso?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="date"
                id="fecha_egreso"
                {...register("fecha_egreso", {
                  required: true,
                  onChange: () => setErrorText(null),
                })}
              />
              {errors.fecha_egreso?.type === "required" && (
                <span>Campo requerido</span>
              )}
              <input
                type="text"
                id="nombre"
                placeholder="nombre"
                {...register("nombre", {
                  required: true,
                })}
              />
              {errors.nombre?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="text"
                id="apellido"
                placeholder="apellido"
                {...register("apellido", {
                  required: true,
                })}
              />
              {errors.apellido?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="number"
                id="telefono"
                placeholder="telefono"
                {...register("telefono", {
                  required: true,
                })}
              />
              {errors.telefono?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="number"
                id="importe_total"
                placeholder="importe"
                {...register("importe_total", {
                  required: true,
                })}
              />
              {errors.importe_total?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="number"
                id="seña"
                placeholder="seña"
                {...register("seña", {})}
              />
              {errors.seña?.type === "required" && <span>Campo requerido</span>}

              {errorText && <span>{errorText}</span>}

              <div className="modal-actions">
                <button type="submit">CREAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setViewCreateModal(false);
                    setErrorText(null);
                    reset();
                  }}
                >
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Principal;
