import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Datos from "./pages/Datos";
import Principal from "./pages/Principal";
import useReservas from "./hooks/useReservas";
import Reporte from "./pages/Reporte";

function App() {
  const { reservas, setReservas, loading, error } = useReservas();
  const [errorText, setErrorText] = useState();
  const [datos, setDatos] = useState();

  const navigateTo = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="app-container">
      <Routes>
        <Route
          path="/"
          element={
            <Principal
              reservas={reservas}
              setReservas={setReservas}
              datos={datos}
              setDatos={setDatos}
            />
          }
        />
        <Route
          path="/reservas"
          element={
            <Datos
              reservas={reservas}
              setReservas={setReservas}
              datos={datos}
              setDatos={setDatos}
            />
          }
        />
        <Route
          path="/reportes"
          element={
            <Reporte
              reservas={reservas}
              setReservas={setReservas}
              datos={datos}
              setDatos={setDatos}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
