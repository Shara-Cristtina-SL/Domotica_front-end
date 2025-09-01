import { useState } from "react";
import {
  listarComodos,
  cadastrarComodo,
  editarComodo,
  excluirComodo,
} from "../api";

import { usePolling } from "../hooks/usePolling";
import DispositivosList from "./DispositivosList";
import GruposList from "./GruposList";
import CenasList from "./CenasList";
import AcoesList from "./AcoesList";

// UI
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import Alert from "../UI/Alert";
import Card from "../UI/Card";

export default function ComodosList() {
  const { data: comodos, loading, error } = usePolling(listarComodos, 3000);
  const [expandedId, setExpandedId] = useState(null);
  const [nome, setNome] = useState("");

  const toggleExpand = (idComodo) => {
    setExpandedId((prev) => (prev === idComodo ? null : idComodo));
  };

  async function handleAdd() {
    if (!nome) return;
    try {
      await cadastrarComodo({ nome });
      setNome("");
    } catch (err) {
      alert(err.message);
    }
  }

  const handleEditar = async (idComodo) => {
    const novoNome = prompt("Digite o novo nome do cômodo:");
    if (novoNome) {
      try {
        await editarComodo(idComodo, { nome: novoNome });
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleExcluir = async (idComodo) => {
    if (confirm("Deseja realmente excluir este cômodo?")) {
      try {
        await excluirComodo(idComodo);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading && !comodos) return <Loader />;
  if (error) return <Alert message={error.message} type="error" />;

  return (
    <Card className="p-4">
      <h2>
        Cômodos{" "}
        {loading && <span style={{ fontSize: "0.8em" }}>⏳ Atualizando...</span>}
      </h2>

      {/* Formulário para adicionar cômodo */}
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Novo cômodo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Button onClick={handleAdd} color="green">
          Adicionar
        </Button>
      </div>

      <ul>
        {comodos?.map((c) => (
          <li key={c.idComodo} style={{ marginBottom: "20px" }}>
            <strong>{c.nome}</strong>
            <div style={{ marginTop: "5px", display: "flex", gap: "5px" }}>
              <Button onClick={() => toggleExpand(c.idComodo)}>
                {expandedId === c.idComodo ? "Ocultar detalhes" : "Detalhes"}
              </Button>
              <Button onClick={() => handleEditar(c.idComodo)} color="green">
                Editar
              </Button>
              <Button onClick={() => handleExcluir(c.idComodo)} color="red">
                Excluir
              </Button>
            </div>

            {expandedId === c.idComodo && (
              <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                <DispositivosList comodoID={c.idComodo} />
                <GruposList idComodo={c.idComodo} />
                <CenasList idComodo={c.idComodo} />
                <AcoesList idComodo={c.idComodo} />
              </div>
            )}
          </li>
        ))}
      </ul>

      {comodos?.length === 0 && !loading && (
        <p>Nenhum cômodo encontrado.</p>
      )}
    </Card>
  );
}
