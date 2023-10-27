import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import "./datos.css";
import {
  deleteReservaService,
  getReservasService,
  updateReserva,
} from "../services/reservasService";

function Datos({ reservas, setReservas, datos, setDatos }) {
  const [errorText, setErrorText] = useState();
  const [viewDeleteModal, setViewDeleteModal] = useState(false);
  const [viewUpdateModal, setViewUpdateModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [errorModal, setErrorModal] = useState(null);

  const ingreso = new Date(datos.fecha_ingreso);
  const egreso = new Date(datos.fecha_egreso);

  const [nombre, setNombre] = useState(datos.nombre);
  const [apellido, setApellido] = useState(datos.apellido);
  const [telefono, setTelefono] = useState(datos.telefono);
  const [lugar, setLugar] = useState(datos.lugar);
  const [fecha_ingreso, setFecha_ingreso] = useState(
    `${ingreso.getFullYear()}-${(ingreso.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${ingreso.getDate().toString().padStart(2, "0")}`
  );
  const [fecha_egreso, setFecha_egreso] = useState(
    `${egreso.getFullYear()}-${(egreso.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${egreso.getDate().toString().padStart(2, "0")}`
  );
  const [importe_total, setImporte_total] = useState(datos.importe_total);
  const [seña, setSeña] = useState(datos.seña);
  const [updateId, setUpdateId] = useState(datos.id);

  const navigateTo = useNavigate();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
  } = useForm();

  const onSubmit2 = async (data, e) => {
    e.preventDefault();

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

    let todas = await getReservasService();

    todas = todas.filter((element) => {
      return element.id != updateId;
    });

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
        const updated = await updateReserva(
          nombre,
          apellido,
          telefono,
          lugar,
          fecha_ingreso,
          fecha_egreso,
          importe_total,
          seña,
          updateId
        );

        updated[0].id = updateId;

        setDatos(updated[0]);

        setReservas(
          reservas.map((element) => {
            if (element.id == updateId) {
              element = updated[0];
            }
            return element;
          })
        );

        reset2();
        setViewUpdateModal(false);
        setErrorText(null);
      } catch (error) {
        console.log(error);
        setErrorText(error.response.data.error);
      }
    }
  };

  const deleteReserva = async () => {
    try {
      const deleted = await deleteReservaService(datos.id);
      if (deleted) {
        setReservas(
          reservas.filter((reserva) => {
            return reserva.id != datos.id;
          })
        );
      }
      setViewDeleteModal(false);
      navigateTo("/");
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const ingresoDate = new Date(datos.fecha_ingreso);
  const egresoDate = new Date(datos.fecha_egreso);

  return (
    <div className="datos-container">
      <h3>Nombre: {datos.nombre}</h3>
      <h3>Apellido: {datos.apellido}</h3>
      <h3>Lugar: {datos.lugar}</h3>
      <h3>Telefono: {datos.telefono}</h3>
      <h3>
        Fecha Ingreso:
        {ingresoDate.getDate()}-{ingresoDate.getMonth() + 1}-
        {ingresoDate.getFullYear()}
      </h3>
      <h3>
        Fecha Salida:
        {egresoDate.getDate()}-{egresoDate.getMonth() + 1}-
        {egresoDate.getFullYear()}
      </h3>
      <h3>Precio: $ {datos.importe_total}</h3>
      <h3>Seña: $ {datos.seña}</h3>
      <h3>A Cobrar: $ {datos.importe_total - datos.seña}</h3>
      <div className="datos-actions">
        <button onClick={() => setViewUpdateModal(true)}>EDITAR</button>
        <button onClick={() => setViewDeleteModal(true)}>ELIMINAR</button>
      </div>

      <button className="btn-volver" onClick={() => navigateTo("/")}>
        VOLVER
      </button>

      {viewUpdateModal && (
        <div className="create-modal-container">
          <div className="create-modal">
            <form
              className="form-container"
              method="post"
              onSubmit={handleSubmit2(onSubmit2)}
            >
              <input
                type="text"
                id="nombre"
                defaultValue={nombre}
                placeholder="nombre"
                {...register2("nombre", {
                  required: true,
                })}
              />
              {errors2.nombre?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="text"
                id="apellido"
                defaultValue={apellido}
                placeholder="apellido"
                {...register2("apellido", {
                  required: true,
                })}
              />
              {errors2.apellido?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="number"
                id="telefono"
                defaultValue={telefono}
                placeholder="telefono"
                {...register2("telefono", {
                  required: true,
                })}
              />
              {errors2.telefono?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <select
                defaultValue={lugar}
                {...register2("lugar", {
                  required: true,
                })}
              >
                <option value="">LUGAR</option>
                <option value="quinta">QUINTA</option>
                <option value="san bernardo">SAN BERNARDO</option>
              </select>
              {errors2.lugar?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="date"
                id="fecha_ingreso"
                defaultValue={fecha_ingreso}
                {...register2("fecha_ingreso", {
                  required: true,
                  onChange: () => setErrorText(null),
                })}
              />
              {errors2.fecha_ingreso?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="date"
                id="fecha_egreso"
                defaultValue={fecha_egreso}
                {...register2("fecha_egreso", {
                  required: true,
                  onChange: () => setErrorText(null),
                })}
              />
              {errors2.fecha_egreso?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="number"
                id="importe_total"
                defaultValue={importe_total}
                placeholder="importe"
                {...register2("importe_total", {
                  required: true,
                })}
              />
              {errors2.importe_total?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="number"
                id="seña"
                defaultValue={seña}
                placeholder="seña"
                {...register2("seña", {
                  required: true,
                })}
              />
              {errors2.seña?.type === "required" && (
                <span>Campo requerido</span>
              )}

              {errorText && <span>{errorText}</span>}

              <div className="modal-actions">
                <button type="submit">GUARDAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setViewUpdateModal(false);
                    setErrorText(null);
                    reset2();
                  }}
                >
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewDeleteModal && (
        <div className="delete-modal-container">
          <div className="delete-modal">
            <h2>¿Seguro desea eliminar esta reserva ? </h2>
            <div className="modal-actions">
              <button onClick={() => deleteReserva(deleteId)}>ACEPTAR</button>
              <button
                onClick={() => {
                  setViewDeleteModal(false);
                }}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
      {errorModal && (
        <div className="delete-modal-container">
          <div className="delete-modal">
            <h2>{errorModal}</h2>
            <div className="modal-actions">
              <button
                onClick={() => {
                  setErrorModal(null);
                }}
              >
                ACEPTAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Datos;
