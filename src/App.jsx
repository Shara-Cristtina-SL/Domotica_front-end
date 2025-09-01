import React, { useState } from "react";
import Comodos from "./components/Comodos";
import Dispositivos from "./components/Dispositivos";
import Cenas from "./components/Cenas";
import Grupos from "./components/Grupos";
import AcoesCena from "./components/AcoesCenas";
import "./index.css";

const componentes = [
  { id: "comodos", label: "Cômodos", component: <Comodos /> },
  { id: "dispositivos", label: "Dispositivos", component: <Dispositivos /> },
  { id: "cenas", label: "Cenas", component: <Cenas /> },
  { id: "grupos", label: "Grupos", component: <Grupos /> },
  { id: "acoes", label: "Ações Cena", component: <AcoesCena /> },
];

export default function App() {
  const [ativo, setAtivo] = useState(0);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden ">
      <h1 className="text-3xl font-bold text-center p-4">
        Gerenciador de Automação
      </h1>

      <div className="flex justify-center flex-wrap gap-2 border-b border-gray-700 px-4 pb-2">
        {componentes.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setAtivo(index)}
            className={`pb-2 px-3 font-semibold border-b-2 ${
              ativo === index
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-blue-400"
            } transition-colors duration-300`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 h-full"
          style={{
            width: `${componentes.length * 100}%`,
            transform: `translateX(-${ativo * (100 / componentes.length)}%)`,
          }}
        >
          {componentes.map((tab) => (
            <div
              key={tab.id}
              className="w-full flex-shrink-0 h-full overflow-auto px-4 py-4"
              style={{ width: `${100 / componentes.length}%` }}
            >
              {tab.component}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
