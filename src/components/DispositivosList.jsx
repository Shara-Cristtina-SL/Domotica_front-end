import { useState } from "react";
import {
  listarDispositivos,
  cadastrarDispositivo,
  ligarDispositivo,
  desligarDispositivo,
  editarDispositivo,
  excluirDispositivo,
} from "../api";
import { usePolling } from "../hooks/usePolling";

// UI
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import Alert from "../UI/Alert";
import Card from "../UI/Card";

export default function DispositivosList({ idComodo }) {
  const { data: dispositivos, loading, error } = usePolling(listarDispositivos, 3000);
  const [nome, setNome] = useState("");

  async function handleAdd() {
    if (!nome) return;
    try {
      await cadastrarDispositivo({
        nome,
        estado: false,
        idComodo, 
      });
      setNome("");
    } catch (err) {
      alert(err.message);
    }
  }

  const handleEditar = async (id, atual) => {
    const novoNome = prompt("Novo nome:", atual.nome);
    if (novoNome) {
      try {
        await editarDispositivo(id, { ...atual, nome: novoNome, idComodo });
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleExcluir = async (id) => {
    if (confirm("Excluir este dispositivo?")) {
      try {
        await excluirDispositivo(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading && !dispositivos) return <Loader />;
  if (error) return <Alert message={error.message} type="error" />;

  const filtrados = dispositivos?.filter((d) => d.idComodo === idComodo) || [];

  return (
    <Card className="p-3">
      <h4>
        Dispositivos{" "}
        {loading && <span style={{ fontSize: "0.8em" }}>⏳ Atualizando...</span>}
      </h4>

      {/* Formulário para adicionar */}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Novo dispositivo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Button onClick={handleAdd} color="green">
          Adicionar
        </Button>
      </div>

      {/* Lista */}
      <ul>
        {filtrados.map((d) => (
          <li key={d.id} className="flex items-center justify-between mb-2">
            <span>{d.nome}</span>

            {/* Toggle Switch */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={d.estado}
                onChange={() =>
                  d.estado
                    ? desligarDispositivo(d.id)
                    : ligarDispositivo(d.id)
                }
              />
              {d.estado ? "Ligado" : "Desligado"}
            </label>

            <div className="flex gap-2">
              <Button onClick={() => handleEditar(d.id, d)} color="blue">
                Editar
              </Button>
              <Button onClick={() => handleExcluir(d.id)} color="red">
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {filtrados.length === 0 && !loading && (
        <p>Nenhum dispositivo encontrado.</p>
      )}
    </Card>
  );
}
