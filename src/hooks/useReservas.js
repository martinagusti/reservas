import { useContext, useEffect, useState } from "react";
import { getReservasService } from "../services/reservasService";

const useReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReservas = async () => {
      try {
        setLoading(true);
        const data = await getReservasService();
        setReservas(data);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadReservas();
  }, []);

  return {
    reservas,
    setReservas,
    loading,
    error,
  };
};

export default useReservas;
