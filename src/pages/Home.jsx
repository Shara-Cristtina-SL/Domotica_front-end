//página principal

import { useEffect, useState } from "react";
import {
  listarComodos,
  listarDispositivos,
  listarHistorico,
  ligarDispositivo,
  desligarDispositivo,
} from "../api";

import ComodosList from "../components/ComodosList";
import DispositivosList from "../components/DispositivosList";
import HistoricoList from "../components/HistoricoList";

function Home() {
  const [comodos, setComodos] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setComodos(await listarComodos());
        setDispositivos(await listarDispositivos());
        setHistorico(await listarHistorico());
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // polling a cada 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🏠 Casa Inteligente</h1>
      <ComodosList comodos={comodos} />
      <DispositivosList
        dispositivos={dispositivos}
        onLigar={ligarDispositivo}
        onDesligar={desligarDispositivo}
      />
      <HistoricoList historico={historico} />
    </div>
  );
}

export default Home;
