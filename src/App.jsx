import React, { useState } from "react";
import Comodos from "./components/Comodos";
import Dispositivos from "./components/Dispositivos";
import Cenas from "./components/Cenas";
import Grupos from "./components/Grupos";
import AcoesCena from "./components/AcoesCenas";
import "./App.css";

const componentes = [
  { id: "comodos", label: "Cômodos", component: <Comodos /> },
  { id: "dispositivos", label: "Dispositivos", component: <Dispositivos /> },
  { id: "cenas", label: "Cenas", component: <Cenas /> },
  { id: "grupos", label: "Grupos", component: <Grupos /> },
  { id: "acoes", label: "Ações Cena", component: <AcoesCena /> },
];

export default function App() {
  const [ativo, setAtivo] = useState(componentes[0].id);

  return (
    <div className="app-container">
      <div className="tabs-container p-4">
        {componentes.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${ativo === tab.id ? "active" : ""}`}
            onClick={() => setAtivo(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="app-content p-4">
        {componentes.map(
          (tab) => ativo === tab.id && <div key={tab.id}>{tab.component}</div>
        )}
      </div>
    </div>
  );
}
