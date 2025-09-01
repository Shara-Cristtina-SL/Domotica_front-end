import { useState } from "react";
import ComodosList from "./components/ComodosList";
import DispositivosList from "./components/DispositivosList";
import GruposList from "./components/GruposList";
import CenasList from "./components/CenasList";
import AcoesList from "./components/AcoesList";
import HistoricoList from "./components/HistoricoList";
import Button from "./UI/Button";

export default function App() {
  const [aba, setAba] = useState("comodos");

  const abas = [
    { id: "comodos", label: "Cômodos", component: <ComodosList /> },
    { id: "dispositivos", label: "Dispositivos", component: <DispositivosList /> },
    { id: "grupos", label: "Grupos", component: <GruposList /> },
    { id: "cenas", label: "Cenas", component: <CenasList /> },
    { id: "acoes", label: "Ações", component: <AcoesList /> },
    { id: "historico", label: "Histórico", component: <HistoricoList /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">🏠 Painel Smart Home</h1>

      {/* Navegação */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {abas.map((a) => (
          <Button
            key={a.id}
            onClick={() => setAba(a.id)}
            color={aba === a.id ? "blue" : "gray"}
          >
            {a.label}
          </Button>
        ))}
      </div>

      {/* Conteúdo da aba ativa */}
      <div>
        {abas.find((a) => a.id === aba)?.component}
      </div>
    </div>
  );
}
