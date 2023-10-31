import axios from "axios";

export const getReservasService = async () => {
  const reservas = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/reservas`
  );

  return reservas.data;
};

export const deleteReservaService = async (id) => {
  const reservas = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/delete/${id}`
  );

  return reservas.data;
};

export const createReserva = async (
  nombre,
  apellido,
  telefono,
  lugar,
  fecha_ingreso,
  fecha_egreso,
  importe_total,
  seña,
  notas
) => {
  const reserva = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/create`,
    {
      nombre,
      apellido,
      telefono,
      lugar,
      fecha_ingreso,
      fecha_egreso,
      importe_total,
      seña,
      notas,
    }
  );

  return reserva.data;
};

export const updateReserva = async (
  nombre,
  apellido,
  telefono,
  lugar,
  fecha_ingreso,
  fecha_egreso,
  importe_total,
  seña,
  notas,
  id
) => {
  const reserva = await axios.patch(
    `${import.meta.env.VITE_BACKEND_URL}/update/${id}`,
    {
      nombre,
      apellido,
      telefono,
      lugar,
      fecha_ingreso,
      fecha_egreso,
      importe_total,
      seña,
      notas,
    }
  );

  return reserva.data;
};
