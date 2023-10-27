import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Datos from "./pages/Datos";
import Principal from "./pages/Principal";
import useReservas from "./hooks/useReservas";

function App() {
  const { reservas, setReservas, loading, error } = useReservas();
  const [errorText, setErrorText] = useState();
  const [datos, setDatos] = useState();

  const navigateTo = useNavigate();

  return (
    <div className="datos-container">
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
      </Routes>
    </div>
  );
}

export default App;
